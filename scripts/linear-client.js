/**
 * Linear API Client - Addressing Phase 4 Infrastructure Feedback
 * A robust wrapper that handles all Linear API quirks
 */

require('dotenv').config();
const https = require('https');

class LinearClient {
  constructor(apiKey = process.env.LINEAR_API_KEY) {
    this.apiKey = apiKey;
    this.teamId = process.env.LINEAR_TEAM_UUID;
    this.issueTracker = new Map(); // Track identifier <-> UUID mappings
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

  /**
   * Rate limiting - Linear allows 1500 requests per hour
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    // Ensure minimum 100ms between requests (600 req/min max)
    if (timeSinceLastRequest < 100) {
      await new Promise(resolve => setTimeout(resolve, 100 - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  /**
   * Sanitize text for Linear - the ultimate sanitizer
   */
  sanitize(text) {
    if (!text) return '';
    
    // Convert to string if not already
    text = String(text);
    
    // Replace ALL problematic characters
    return text
      .replace(/\r\n/g, ' ')        // Windows line endings
      .replace(/\n/g, ' ')          // Unix line endings  
      .replace(/\r/g, ' ')          // Mac line endings
      .replace(/\t/g, ' ')          // Tabs
      .replace(/"/g, "'")           // Double quotes
      .replace(/\\/g, '/')          // Backslashes
      .replace(/`/g, "'")           // Backticks
      .replace(/\${/g, '(')         // Template literal syntax
      .replace(/}/g, ')')           // Closing braces
      .replace(/#/g, '')            // Hash symbols
      .replace(/\*/g, '')           // Asterisks
      .replace(/\[/g, '(')          // Square brackets
      .replace(/\]/g, ')')          
      .replace(/\u0000/g, '')       // Null characters
      .replace(/[\x00-\x1F\x7F]/g, '') // Control characters
      .replace(/\s+/g, ' ')         // Multiple spaces
      .substring(0, 3000)           // Linear description limit
      .trim();
  }

  /**
   * Make GraphQL request with retry logic
   */
  async query(query, variables = {}, retries = 3) {
    await this.rateLimit();
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.makeRequest(query, variables);
        
        if (response.errors) {
          const errorMsg = response.errors[0]?.message || 'Unknown error';
          
          // If it's a string formatting error and we have retries left
          if (errorMsg.includes('Unterminated string') && attempt < retries) {
            // Try even more aggressive sanitization
            variables = this.deepSanitize(variables);
            continue;
          }
          
          throw new Error(`Linear API Error: ${errorMsg}`);
        }
        
        return response.data;
      } catch (error) {
        if (attempt === retries) throw error;
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  /**
   * Deep sanitize all string values in an object
   */
  deepSanitize(obj) {
    if (typeof obj === 'string') {
      return this.sanitize(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitize(item));
    }
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.deepSanitize(value);
      }
      return sanitized;
    }
    return obj;
  }

  /**
   * Low-level HTTP request
   */
  makeRequest(query, variables) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ query, variables: this.deepSanitize(variables) });
      
      const options = {
        hostname: 'api.linear.app',
        path: '/graphql',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey,
          'Content-Length': Buffer.byteLength(data)
        }
      };
      
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            reject(new Error(`Failed to parse Linear response: ${e.message}`));
          }
        });
      });
      
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  /**
   * Create a single issue with automatic sanitization
   */
  async createIssue(data) {
    const mutation = `
      mutation CreateIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            identifier
            title
            url
          }
        }
      }
    `;
    
    // Build input with aggressive sanitization
    const input = {
      teamId: data.teamId || this.teamId,
      title: this.sanitize(data.title || 'Untitled Issue'),
    };
    
    // Optional fields
    if (data.description) {
      input.description = this.sanitize(data.description);
    }
    
    if (data.assigneeId || data.assignee) {
      input.assigneeId = data.assigneeId || 
                        AGENT_EMAILS[data.assignee] || 
                        data.assignee;
    }
    
    if (data.parentId) {
      input.parentId = data.parentId;
    }
    
    if (data.labelIds && data.labelIds.length > 0) {
      input.labelIds = data.labelIds;
    }
    
    if (data.estimate) {
      input.estimate = Number(data.estimate);
    }
    
    if (data.priority !== undefined) {
      input.priority = Number(data.priority);
    }
    
    const result = await this.query(mutation, { input });
    
    if (!result.issueCreate.success) {
      throw new Error('Failed to create issue');
    }
    
    const issue = result.issueCreate.issue;
    
    // Track the mapping
    this.issueTracker.set(issue.identifier, issue.id);
    this.issueTracker.set(issue.id, issue.identifier);
    
    return {
      success: true,
      uuid: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      url: issue.url
    };
  }

  /**
   * Batch create multiple issues efficiently
   */
  async createIssues(issuesData) {
    const results = [];
    const errors = [];
    
    console.log(`Creating ${issuesData.length} issues...`);
    
    for (const [index, data] of issuesData.entries()) {
      try {
        const result = await this.createIssue(data);
        results.push(result);
        console.log(`  ✓ Created ${index + 1}/${issuesData.length}: ${result.identifier}`);
      } catch (error) {
        const errorInfo = {
          index,
          title: data.title,
          error: error.message
        };
        errors.push(errorInfo);
        console.log(`  ✗ Failed ${index + 1}/${issuesData.length}: ${error.message}`);
      }
      
      // Small delay between issues to avoid rate limits
      if (index < issuesData.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    return {
      success: errors.length === 0,
      created: results,
      failed: errors,
      summary: `Created ${results.length}/${issuesData.length} issues successfully`
    };
  }

  /**
   * Create a sprint with multiple stories
   */
  async createSprint(config) {
    const { title, stories, startDate, endDate } = config;
    
    // Create milestone first
    const milestone = await this.createMilestone({
      name: title,
      startsAt: startDate,
      endsAt: endDate
    });
    
    // Prepare stories with milestone
    const storiesWithMilestone = stories.map(story => ({
      ...story,
      milestoneId: milestone.id
    }));
    
    // Batch create all stories
    const result = await this.createIssues(storiesWithMilestone);
    
    return {
      milestone,
      ...result
    };
  }

  /**
   * Create a milestone
   */
  async createMilestone(data) {
    const mutation = `
      mutation CreateMilestone($name: String!, $teamId: String!) {
        milestoneCreate(input: { 
          name: $name, 
          teamIds: [$teamId]
        }) {
          success
          milestone {
            id
            name
          }
        }
      }
    `;
    
    const result = await this.query(mutation, {
      name: this.sanitize(data.name),
      teamId: this.teamId
    });
    
    return result.milestoneCreate.milestone;
  }

  /**
   * Add comment to issue
   */
  async addComment(issueId, body) {
    const mutation = `
      mutation CreateComment($issueId: String!, $body: String!) {
        commentCreate(input: {
          issueId: $issueId,
          body: $body
        }) {
          success
          comment {
            id
            body
          }
        }
      }
    `;
    
    // Convert identifier to UUID if needed
    const uuid = this.issueTracker.get(issueId) || issueId;
    
    const result = await this.query(mutation, {
      issueId: uuid,
      body: this.sanitize(body)
    });
    
    return result.commentCreate.comment;
  }

  /**
   * Get issue by ID (identifier or UUID)
   */
  async getIssue(id) {
    const query = `
      query GetIssue($id: String!) {
        issue(id: $id) {
          id
          identifier
          title
          description
          state {
            name
          }
          assignee {
            email
            displayName
          }
          labels {
            nodes {
              name
            }
          }
        }
      }
    `;
    
    const result = await this.query(query, { id });
    
    if (result.issue) {
      // Track the mapping
      this.issueTracker.set(result.issue.identifier, result.issue.id);
    }
    
    return result.issue;
  }

  /**
   * Update issue state
   */
  async updateIssueState(issueId, stateName) {
    // First get available states
    const states = await this.getTeamStates();
    const targetState = states.find(s => s.name === stateName);
    
    if (!targetState) {
      throw new Error(`State '${stateName}' not found`);
    }
    
    const mutation = `
      mutation UpdateIssue($id: String!, $stateId: String!) {
        issueUpdate(
          id: $id,
          input: { stateId: $stateId }
        ) {
          success
          issue {
            id
            state {
              name
            }
          }
        }
      }
    `;
    
    const uuid = this.issueTracker.get(issueId) || issueId;
    
    const result = await this.query(mutation, {
      id: uuid,
      stateId: targetState.id
    });
    
    return result.issueUpdate.issue;
  }

  /**
   * Get team workflow states
   */
  async getTeamStates() {
    const query = `
      query GetTeamStates($teamId: String!) {
        team(id: $teamId) {
          states {
            nodes {
              id
              name
              type
            }
          }
        }
      }
    `;
    
    const result = await this.query(query, { teamId: this.teamId });
    return result.team.states.nodes;
  }

  /**
   * Get all tracked issue mappings
   */
  getTrackedIssues() {
    const issues = [];
    const processed = new Set();
    
    for (const [key, value] of this.issueTracker.entries()) {
      // Only process each pair once
      if (!processed.has(key) && !processed.has(value)) {
        if (key.includes('-')) { // identifier format
          issues.push({ identifier: key, uuid: value });
          processed.add(key);
          processed.add(value);
        }
      }
    }
    
    return issues;
  }
}

// Agent email directory (from Phase 1)
const AGENT_EMAILS = {
  'product-manager': 'dreamteam.ai.labs+product-manager@gmail.com',
  'solution-architect': 'dreamteam.ai.labs+solution-architect@gmail.com',
  'ux-ui-designer': 'dreamteam.ai.labs+ux-ui-designer@gmail.com',
  'developer-implementer': 'dreamteam.ai.labs+developer-implementer@gmail.com',
  'test-engineer': 'dreamteam.ai.labs+test-engineer@gmail.com',
  'senior-code-reviewer': 'dreamteam.ai.labs+senior-code-reviewer@gmail.com',
  'devops-platform-engineer': 'dreamteam.ai.labs+devops-platform-engineer@gmail.com',
  'security-compliance-lead': 'dreamteam.ai.labs+security-compliance-lead@gmail.com',
  'customer-success-advisor': 'dreamteam.ai.labs+customer-success-advisor@gmail.com',
  'data-analytics-lead': 'dreamteam.ai.labs+data-analytics-lead@gmail.com',
  'commercial-strategist': 'dreamteam.ai.labs+commercial-strategist@gmail.com',
  'strategic-visionary': 'dreamteam.ai.labs+strategic-visionary@gmail.com',
  'voice-of-customer': 'dreamteam.ai.labs+voice-of-customer@gmail.com',
  'ideation-specialist': 'dreamteam.ai.labs+ideation-specialist@gmail.com',
  'strategic-portfolio-manager': 'dreamteam.ai.labs+strategic-portfolio-manager@gmail.com',
  'project-manager': 'dreamteam.ai.labs+project-manager@gmail.com'
};

module.exports = LinearClient;

// CLI test
if (require.main === module) {
  async function test() {
    const client = new LinearClient();
    
    console.log('Testing Linear Client...\n');
    
    // Test sanitization
    const messyText = `This is a
    multi-line string with "quotes"
    and \`backticks\` and ${interpolation}
    and #hashtags and **markdown**`;
    
    console.log('Original:', messyText);
    console.log('Sanitized:', client.sanitize(messyText));
    console.log('');
    
    // Test batch creation
    const testIssues = [
      {
        title: 'Test Issue 1\nWith newline',
        description: 'Description with\nmultiple\nlines',
        assignee: 'product-manager'
      },
      {
        title: 'Test Issue 2 with "quotes"',
        description: 'Has `backticks` and **markdown**',
        assignee: 'developer-implementer'
      }
    ];
    
    console.log('Testing batch creation...');
    // Uncomment to actually test:
    // const result = await client.createIssues(testIssues);
    // console.log(result.summary);
  }
  
  test().catch(console.error);
}