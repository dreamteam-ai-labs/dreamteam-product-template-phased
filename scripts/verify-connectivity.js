#!/usr/bin/env node

/**
 * Connectivity verification script for DreamTeam projects
 * Tests Linear API connection and validates configuration
 */

require('dotenv').config();
const fetch = require('node-fetch');

const LINEAR_API_URL = 'https://api.linear.app/graphql';

// Color codes for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function queryLinear(query, variables = {}) {
  const response = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.LINEAR_API_KEY
    },
    body: JSON.stringify({ query, variables })
  });
  
  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data;
}

async function verifyConfiguration() {
  log('🔍 Checking environment configuration...', 'yellow');
  
  // Check for required environment variables
  const issues = [];
  
  if (!process.env.LINEAR_API_KEY) {
    issues.push('❌ LINEAR_API_KEY is missing from .env');
  }
  
  if (!process.env.LINEAR_TEAM_KEY) {
    issues.push('❌ LINEAR_TEAM_KEY is missing from .env');
  }
  
  if (!process.env.SOLUTION_EPIC_ID) {
    issues.push('❌ SOLUTION_EPIC_ID is missing from .env');
  }
  
  // Check for placeholder values that weren't replaced
  if (process.env.LINEAR_TEAM_KEY?.includes('{{')) {
    issues.push('❌ LINEAR_TEAM_KEY still contains placeholder: ' + process.env.LINEAR_TEAM_KEY);
  }
  
  if (process.env.SOLUTION_EPIC_ID?.includes('{{')) {
    issues.push('❌ SOLUTION_EPIC_ID still contains placeholder: ' + process.env.SOLUTION_EPIC_ID);
  }
  
  if (issues.length > 0) {
    log('\n⚠️  Configuration Issues Found:', 'red');
    issues.forEach(issue => log(issue, 'red'));
    log('\nPlease fix these issues in your .env file', 'yellow');
    process.exit(1);
  }
  
  log('✅ Environment variables configured', 'green');
}

async function getTeamUUID() {
  log('\n🔍 Looking up team UUID...', 'yellow');
  
  const query = `
    query GetTeam($key: String!) {
      teams(filter: { key: { eq: $key } }) {
        nodes {
          id
          key
          name
        }
      }
    }
  `;
  
  try {
    const result = await queryLinear(query, { key: process.env.LINEAR_TEAM_KEY });
    
    if (!result.teams.nodes || result.teams.nodes.length === 0) {
      throw new Error(`Team not found with key: ${process.env.LINEAR_TEAM_KEY}`);
    }
    
    const team = result.teams.nodes[0];
    log(`✅ Found team: ${team.name} (${team.key})`, 'green');
    log(`   UUID: ${team.id}`, 'green');
    
    // Update the .env file with the UUID if not present
    if (!process.env.LINEAR_TEAM_UUID) {
      log('\n💡 Add this to your .env file:', 'yellow');
      log(`LINEAR_TEAM_UUID=${team.id}`, 'yellow');
    }
    
    return team.id;
  } catch (error) {
    log(`❌ Failed to get team UUID: ${error.message}`, 'red');
    throw error;
  }
}

async function verifySolutionEpic(teamId) {
  log('\n🔍 Verifying solution epic...', 'yellow');
  
  const query = `
    query GetIssue($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        team {
          id
          key
        }
      }
    }
  `;
  
  try {
    const result = await queryLinear(query, { id: process.env.SOLUTION_EPIC_ID });
    
    if (!result.issue) {
      throw new Error(`Solution epic not found: ${process.env.SOLUTION_EPIC_ID}`);
    }
    
    const issue = result.issue;
    log(`✅ Found solution epic: ${issue.title}`, 'green');
    log(`   Identifier: ${issue.identifier}`, 'green');
    
    // Verify it's in the correct team
    if (issue.team.id !== teamId) {
      log(`⚠️  Warning: Epic is in team ${issue.team.key}, not the configured team`, 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`❌ Failed to verify solution epic: ${error.message}`, 'red');
    throw error;
  }
}

async function createTestIssue(teamId) {
  log('\n🚀 Creating test issue...', 'yellow');
  
  const mutation = `
    mutation CreateIssue($teamId: String!, $title: String!, $description: String) {
      issueCreate(input: {
        teamId: $teamId,
        title: $title,
        description: $description
      }) {
        success
        issue {
          id
          identifier
          url
        }
      }
    }
  `;
  
  try {
    const result = await queryLinear(mutation, {
      teamId: teamId,
      title: 'Connectivity Test - Can be deleted',
      description: 'This issue was created by the connectivity verification script'
    });
    
    if (!result.issueCreate.success) {
      throw new Error('Failed to create test issue');
    }
    
    const issue = result.issueCreate.issue;
    log(`✅ Test issue created: ${issue.identifier}`, 'green');
    log(`   URL: ${issue.url}`, 'green');
    
    return issue;
  } catch (error) {
    log(`❌ Failed to create test issue: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  log('=================================', 'yellow');
  log('DreamTeam Connectivity Verifier', 'yellow');
  log('=================================\n', 'yellow');
  
  try {
    // Step 1: Verify configuration
    await verifyConfiguration();
    
    // Step 2: Get team UUID
    const teamUUID = await getTeamUUID();
    
    // Step 3: Verify solution epic exists
    await verifySolutionEpic(teamUUID);
    
    // Step 4: Create a test issue
    const testIssue = await createTestIssue(teamUUID);
    
    // Success!
    log('\n=================================', 'green');
    log('✅ All connectivity tests passed!', 'green');
    log('=================================\n', 'green');
    
    log('Summary:', 'green');
    log(`- Team UUID: ${teamUUID}`, 'green');
    log(`- Solution Epic: ${process.env.SOLUTION_EPIC_ID}`, 'green');
    log(`- Test Issue: ${testIssue.identifier}`, 'green');
    
    log('\n💡 Next Steps:', 'yellow');
    log('1. If LINEAR_TEAM_UUID was missing, add it to your .env file', 'yellow');
    log('2. Continue with Phase 0 tasks in phase-0-foundation.md', 'yellow');
    log('3. Delete the test issue when no longer needed', 'yellow');
    
  } catch (error) {
    log('\n=================================', 'red');
    log('❌ Connectivity verification failed', 'red');
    log('=================================\n', 'red');
    
    log('Please fix the issues above and try again.', 'yellow');
    log('For help, check the README or post in Linear.', 'yellow');
    
    process.exit(1);
  }
}

// Run the verification
main().catch(console.error);