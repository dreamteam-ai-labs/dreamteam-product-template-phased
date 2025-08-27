#!/usr/bin/env node
/**
 * Comprehensive Preflight Check for Phase 0
 * Run this to validate everything is configured correctly
 */

require('dotenv').config();
const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}`)
};

let totalChecks = 0;
let passedChecks = 0;

async function checkEnvFile() {
  log.header('Environment Configuration');
  
  const required = ['LINEAR_API_KEY', 'LINEAR_TEAM_KEY', 'LINEAR_TEAM_UUID', 'SOLUTION_EPIC_ID'];
  const optional = ['GITHUB_TOKEN', 'PROBLEM_COUNT'];
  
  for (const key of required) {
    totalChecks++;
    if (process.env[key] && !process.env[key].includes('{{')) {
      log.success(`${key} is configured`);
      passedChecks++;
    } else {
      log.error(`${key} is missing or contains placeholder`);
    }
  }
  
  for (const key of optional) {
    if (process.env[key] && !process.env[key].includes('{{')) {
      log.info(`${key} is configured (optional)`);
    } else {
      log.warn(`${key} is not configured (optional)`);
    }
  }
}

async function checkLinearAPI() {
  log.header('Linear API Connection');
  totalChecks++;
  
  if (!process.env.LINEAR_API_KEY) {
    log.error('LINEAR_API_KEY not found');
    return false;
  }
  
  const query = `
    query {
      viewer {
        id
        email
        name
      }
    }
  `;
  
  try {
    const result = await graphqlRequest(query);
    if (result.viewer) {
      log.success(`Linear API accessible as: ${result.viewer.email || result.viewer.name}`);
      passedChecks++;
      return true;
    }
  } catch (error) {
    log.error(`Linear API error: ${error.message}`);
    log.info('Get your API key from: https://linear.app/settings/api');
  }
  return false;
}

async function checkTeamAccess() {
  log.header('Team Access Verification');
  totalChecks++;
  
  const teamId = process.env.LINEAR_TEAM_UUID;
  const teamKey = process.env.LINEAR_TEAM_KEY;
  
  if (!teamId) {
    log.error('LINEAR_TEAM_UUID not configured');
    return false;
  }
  
  const query = `
    query GetTeam($id: String!) {
      team(id: $id) {
        id
        key
        name
        members {
          nodes {
            email
          }
        }
      }
    }
  `;
  
  try {
    const result = await graphqlRequest(query, { id: teamId });
    if (result.team) {
      log.success(`Team found: ${result.team.name} (${result.team.key})`);
      log.info(`Team has ${result.team.members.nodes.length} members`);
      
      // Verify team key matches
      if (result.team.key !== teamKey) {
        log.warn(`Team key mismatch: expected ${teamKey}, got ${result.team.key}`);
      }
      
      passedChecks++;
      return true;
    }
  } catch (error) {
    log.error(`Cannot access team: ${error.message}`);
  }
  return false;
}

async function checkSolutionEpic() {
  log.header('Solution Epic Verification');
  totalChecks++;
  
  const solutionId = process.env.SOLUTION_EPIC_ID;
  
  if (!solutionId) {
    log.error('SOLUTION_EPIC_ID not configured');
    return false;
  }
  
  const query = `
    query GetIssue($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        url
      }
    }
  `;
  
  try {
    const result = await graphqlRequest(query, { id: solutionId });
    if (result.issue) {
      log.success(`Solution epic found: ${result.issue.identifier} - ${result.issue.title}`);
      log.info(`URL: ${result.issue.url}`);
      passedChecks++;
      return true;
    }
  } catch (error) {
    log.error(`Cannot access solution epic: ${error.message}`);
  }
  return false;
}

async function checkGitHub() {
  log.header('GitHub Access');
  totalChecks++;
  
  try {
    // Try using gh CLI first
    const ghUser = execSync('gh api user --jq .login', { encoding: 'utf8' }).trim();
    log.success(`GitHub CLI authenticated as: ${ghUser}`);
    passedChecks++;
    return true;
  } catch {
    // Fall back to token check
    if (process.env.GITHUB_TOKEN) {
      log.info('GITHUB_TOKEN configured (not validated)');
      passedChecks++;
      return true;
    } else {
      log.warn('GitHub access not configured (optional for Phase 0)');
      return false;
    }
  }
}

async function checkAgentFiles() {
  log.header('Agent Configuration Files');
  totalChecks++;
  
  const agentDir = path.join(process.cwd(), '.claude', 'agents');
  
  try {
    const files = fs.readdirSync(agentDir);
    const agentCount = files.filter(f => f.endsWith('.md')).length;
    
    if (agentCount >= 16) {
      log.success(`All ${agentCount} agent configuration files present`);
      passedChecks++;
      return true;
    } else {
      log.warn(`Only ${agentCount} agent files found (expected 16+)`);
      return false;
    }
  } catch (error) {
    log.error('Cannot read agent configuration directory');
    return false;
  }
}

async function checkWritePermissions() {
  log.header('Write Permissions Test');
  totalChecks++;
  
  const testFile = path.join(process.cwd(), '.phase0-test.tmp');
  
  try {
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    log.success('File system write permissions confirmed');
    passedChecks++;
    return true;
  } catch (error) {
    log.error('Cannot write to project directory');
    return false;
  }
}

async function checkNodeModules() {
  log.header('Dependencies Check');
  totalChecks++;
  
  const required = ['dotenv', 'node-fetch'];
  let allPresent = true;
  
  for (const pkg of required) {
    try {
      require.resolve(pkg);
      log.success(`${pkg} installed`);
    } catch {
      log.error(`${pkg} not found - run: npm install`);
      allPresent = false;
    }
  }
  
  if (allPresent) {
    passedChecks++;
  }
  return allPresent;
}

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

async function generateReport() {
  console.log(`
${colors.bright}═══════════════════════════════════════${colors.reset}
${colors.bright}PREFLIGHT CHECK SUMMARY${colors.reset}
${colors.bright}═══════════════════════════════════════${colors.reset}

${colors.bright}Results:${colors.reset} ${passedChecks}/${totalChecks} checks passed

`);

  if (passedChecks === totalChecks) {
    console.log(`${colors.green}${colors.bright}✨ ALL CHECKS PASSED!${colors.reset}`);
    console.log(`${colors.green}You're ready to complete Phase 0.${colors.reset}`);
    console.log(`
${colors.bright}Next steps:${colors.reset}
1. Review your project in Linear
2. Test agent communication with Task tool
3. Create completion issue: ${colors.cyan}node scripts/create-issue.js "Phase 0 Complete" "Description"${colors.reset}
4. Request Phase 1 unlock key
`);
  } else if (passedChecks >= totalChecks - 2) {
    console.log(`${colors.yellow}${colors.bright}⚠️  MOSTLY READY${colors.reset}`);
    console.log(`${colors.yellow}Some optional checks failed, but you can proceed.${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bright}❌ NOT READY${colors.reset}`);
    console.log(`${colors.red}Please fix the errors above before continuing.${colors.reset}`);
    console.log(`
${colors.bright}Troubleshooting:${colors.reset}
- Missing API keys: Check your .env file
- Team not found: Verify LINEAR_TEAM_KEY is correct
- Permission errors: Check API key scopes
- Dependencies missing: Run ${colors.cyan}npm install${colors.reset}
`);
    process.exit(1);
  }
}

async function main() {
  console.log(`
${colors.bright}═══════════════════════════════════════${colors.reset}
${colors.bright}DreamTeam Preflight Check${colors.reset}
${colors.bright}═══════════════════════════════════════${colors.reset}
`);

  // Run all checks
  await checkEnvFile();
  await checkNodeModules();
  
  const apiWorks = await checkLinearAPI();
  if (apiWorks) {
    await checkTeamAccess();
    await checkSolutionEpic();
  }
  
  await checkGitHub();
  await checkAgentFiles();
  await checkWritePermissions();
  
  // Generate report
  await generateReport();
}

main().catch(console.error);