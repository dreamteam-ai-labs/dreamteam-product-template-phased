#!/usr/bin/env node
/**
 * Auto-Discovery Script for Phase 0
 * Automatically finds and configures all required values for .env
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset}  ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset}  ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset}  ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset}  ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}`),
  dim: (msg) => console.log(`${colors.dim}   ${msg}${colors.reset}`)
};

async function graphqlRequest(query, variables = {}) {
  const options = {
    hostname: 'api.linear.app',
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.LINEAR_API_KEY
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.errors) {
            reject(new Error(result.errors[0].message));
          } else {
            resolve(result.data);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ query, variables }));
    req.end();
  });
}

async function findTeamInfo(teamKey) {
  log.header(`🔍 Finding team information for key: ${teamKey}`);
  
  const query = `
    query GetTeam($key: String!) {
      team(key: $key) {
        id
        key
        name
        description
      }
    }
  `;
  
  try {
    const data = await graphqlRequest(query, { key: teamKey });
    if (data.team) {
      log.success(`Found team: ${data.team.name}`);
      log.dim(`UUID: ${data.team.id}`);
      return data.team;
    }
  } catch (error) {
    log.error(`Could not find team with key ${teamKey}: ${error.message}`);
  }
  return null;
}

async function findSolutionIssue(teamId) {
  log.header(`🔍 Finding solution issue in team`);
  
  const query = `
    query GetSolutionIssue($teamId: String!) {
      team(id: $teamId) {
        issues(first: 50, filter: { 
          or: [
            { title: { containsIgnoreCase: "SOL-" } },
            { identifier: { endsWith: "-1" } }
          ]
        }) {
          nodes {
            id
            identifier
            title
            url
            createdAt
          }
        }
      }
    }
  `;
  
  try {
    const data = await graphqlRequest(query, { teamId });
    const issues = data.team?.issues?.nodes || [];
    
    // Look for the solution issue (usually ends with -1 or has SOL in title)
    const solutionIssue = issues.find(i => 
      i.identifier.endsWith('-1') || 
      i.title.toLowerCase().includes('sol-')
    );
    
    if (solutionIssue) {
      log.success(`Found solution issue: ${solutionIssue.identifier} - ${solutionIssue.title}`);
      log.dim(`URL: ${solutionIssue.url}`);
      return solutionIssue;
    } else if (issues.length > 0) {
      log.warn('Could not identify solution issue. Found these issues:');
      issues.forEach(i => log.dim(`  - ${i.identifier}: ${i.title}`));
      return issues[0]; // Use first issue as fallback
    }
  } catch (error) {
    log.error(`Could not find solution issue: ${error.message}`);
  }
  return null;
}

async function countProblems(teamId, solutionId) {
  log.header(`🔍 Counting problem issues`);
  
  const query = `
    query GetProblems($teamId: String!) {
      team(id: $teamId) {
        issues(filter: { 
          title: { containsIgnoreCase: "PRO-" }
        }) {
          nodes {
            id
            identifier
            title
          }
        }
      }
    }
  `;
  
  try {
    const data = await graphqlRequest(query, { teamId });
    const issues = data.team?.issues?.nodes || [];
    
    // Filter out the solution issue
    const problemIssues = issues.filter(i => i.id !== solutionId);
    
    log.success(`Found ${problemIssues.length} problem issues`);
    return problemIssues.length;
  } catch (error) {
    log.warn(`Could not count problems: ${error.message}`);
    return 14; // Default fallback
  }
}

async function updateEnvFile(updates) {
  log.header(`📝 Updating .env file`);
  
  const envPath = path.join(process.cwd(), '.env');
  let content = '';
  
  // Read existing .env if it exists
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add each key
  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'gm');
    const line = `${key}=${value}`;
    
    if (regex.test(content)) {
      content = content.replace(regex, line);
      log.success(`Updated ${key}`);
    } else {
      content += `\n${line}`;
      log.success(`Added ${key}`);
    }
  });
  
  fs.writeFileSync(envPath, content.trim() + '\n');
  log.success('Configuration saved to .env');
}

async function createTeamContext(config) {
  log.header(`📄 Creating TEAM-CONTEXT.md`);
  
  const content = `# Team Context - ${config.teamName || config.teamKey}

## 🔗 Quick Links
- **Team Board**: https://linear.app/dreamteam-ai-labs/team/${config.teamKey}/board
- **Solution Issue**: ${config.solutionUrl || 'Not found'}
- **GitHub Repo**: ${config.githubUrl || process.env.GITHUB_URL || 'Not configured'}

## 🔑 Configuration Values
\`\`\`bash
# Team Configuration
LINEAR_TEAM_KEY=${config.teamKey}
LINEAR_TEAM_UUID=${config.teamUUID}

# Solution Configuration  
SOLUTION_EPIC_ID=${config.solutionId}
PROBLEM_COUNT=${config.problemCount}
\`\`\`

## 📋 Where to Find These Values

### Team UUID
1. Go to Linear > Settings > Teams
2. Find team "${config.teamName || config.teamKey}"
3. The UUID is in the team details
   - Or run: \`node scripts/get-team-info.js\`

### Solution Issue ID
1. Go to Linear > Team ${config.teamKey}
2. Look for issue ${config.solutionIdentifier || 'ending with -1'}
3. Click the issue and copy the ID from the URL
   - Or run: \`node scripts/discover-config.js\`

### Problem Count
- Automatically calculated from issues with "PRO-" in title
- Current count: ${config.problemCount}

## 🚀 Next Steps
1. Verify configuration: \`node scripts/verify-connectivity.js\`
2. Test agent communication with Task tool
3. Create Phase 0 completion issue
4. Request Phase 1 unlock key

---
*Generated on ${new Date().toISOString()}*
`;

  fs.writeFileSync('TEAM-CONTEXT.md', content);
  log.success('Created TEAM-CONTEXT.md with all configuration details');
}

async function main() {
  console.log(`
${colors.bright}=================================${colors.reset}
${colors.bright}DreamTeam Auto-Discovery Script${colors.reset}
${colors.bright}=================================${colors.reset}
`);

  // Check for API key
  if (!process.env.LINEAR_API_KEY) {
    log.error('LINEAR_API_KEY not found in .env');
    log.info('Get your key from: https://linear.app/settings/api');
    process.exit(1);
  }

  // Get team key from .env or use placeholder detection
  let teamKey = process.env.LINEAR_TEAM_KEY;
  if (!teamKey || teamKey.includes('{{')) {
    log.warn('Team key not configured, attempting to detect from repository name...');
    
    // Try to extract from current directory name (e.g., DreamTeam-WorkForge-662)
    const dirName = path.basename(process.cwd());
    const match = dirName.match(/DreamTeam-.*-(\d+)$/);
    
    if (match) {
      // Could potentially search for team by pattern, but would need to list all teams
      log.error('Cannot auto-detect team key. Please check Linear for your team key.');
      process.exit(1);
    }
  }

  try {
    // Find team info
    const team = await findTeamInfo(teamKey);
    if (!team) {
      log.error('Team not found. Please check your LINEAR_TEAM_KEY');
      process.exit(1);
    }

    // Find solution issue
    const solutionIssue = await findSolutionIssue(team.id);
    if (!solutionIssue) {
      log.warn('Could not find solution issue automatically');
    }

    // Count problems
    const problemCount = await countProblems(team.id, solutionIssue?.id);

    // Prepare configuration
    const config = {
      teamKey: team.key,
      teamUUID: team.id,
      teamName: team.name,
      solutionId: solutionIssue?.id || '{{SOLUTION_ID}}',
      solutionIdentifier: solutionIssue?.identifier,
      solutionUrl: solutionIssue?.url,
      problemCount: problemCount
    };

    // Update .env file
    await updateEnvFile({
      LINEAR_TEAM_KEY: config.teamKey,
      LINEAR_TEAM_UUID: config.teamUUID,
      SOLUTION_EPIC_ID: config.solutionId,
      PROBLEM_COUNT: config.problemCount
    });

    // Create context document
    await createTeamContext(config);

    console.log(`
${colors.green}${colors.bright}✨ Discovery Complete!${colors.reset}

${colors.bright}Configuration Summary:${colors.reset}
  Team: ${config.teamName} (${config.teamKey})
  Solution: ${config.solutionIdentifier || 'Not found'}
  Problems: ${config.problemCount}

${colors.bright}Next Steps:${colors.reset}
  1. Review TEAM-CONTEXT.md for details
  2. Run: ${colors.cyan}node scripts/verify-connectivity.js${colors.reset}
  3. Complete Phase 0 tasks
`);

  } catch (error) {
    log.error(`Discovery failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);