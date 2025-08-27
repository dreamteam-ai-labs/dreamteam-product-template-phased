#!/usr/bin/env node
/**
 * Bootstrap Script - One command to set up everything
 * Usage: npm run bootstrap
 */

const { execSync } = require('child_process');
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

console.log(`
${colors.bright}═══════════════════════════════════════${colors.reset}
${colors.bright}DreamTeam Bootstrap${colors.reset}
${colors.bright}═══════════════════════════════════════${colors.reset}
`);

const steps = [
  {
    name: 'Installing dependencies',
    cmd: 'npm install',
    optional: false
  },
  {
    name: 'Running preflight checks',
    cmd: 'node scripts/preflight.js',
    optional: false
  },
  {
    name: 'Verifying connectivity',
    cmd: 'node scripts/verify-connectivity.js',
    optional: false
  },
  {
    name: 'Creating team context',
    cmd: 'node scripts/discover-config.js',
    optional: true  // May fail if already configured
  }
];

let failed = false;

for (const step of steps) {
  console.log(`\n${colors.cyan}→${colors.reset} ${step.name}...`);
  
  try {
    const output = execSync(step.cmd, { encoding: 'utf8', stdio: 'inherit' });
  } catch (error) {
    if (!step.optional) {
      console.log(`${colors.yellow}⚠${colors.reset} ${step.name} failed`);
      failed = true;
      break;
    } else {
      console.log(`${colors.yellow}ℹ${colors.reset} ${step.name} skipped (optional)`);
    }
  }
}

if (!failed) {
  console.log(`
${colors.green}${colors.bright}✨ Bootstrap Complete!${colors.reset}

${colors.bright}Phase 0 is ready.${colors.reset} You can now:
1. Review your solution in Linear
2. Test agent communication
3. Create completion issue
4. Request Phase 1 unlock

${colors.cyan}Quick commands:${colors.reset}
  npm run preflight    - Run checks again
  npm run verify       - Test connectivity
  npm run create-issue - Create Linear issue
`);
} else {
  console.log(`
${colors.yellow}Bootstrap encountered issues.${colors.reset}
Please fix the errors above and run again.
`);
  process.exit(1);
}