#!/usr/bin/env node
/**
 * Phase Unlock Script
 * Usage: node scripts/unlock-phase.js <phase-number>
 * 
 * This decodes the base64 encrypted phase files for progression
 */

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

function log(type, msg) {
  const icons = {
    success: `${colors.green}✅${colors.reset}`,
    error: `${colors.red}❌${colors.reset}`,
    info: `${colors.cyan}🔓${colors.reset}`,
    warn: `${colors.yellow}⚠️${colors.reset}`
  };
  console.log(`${icons[type] || ''} ${msg}`);
}

function unlockPhase(phaseNumber) {
  const encryptedFile = path.join(process.cwd(), `phase-${phaseNumber}-encrypted.md.enc`);
  const outputFile = path.join(process.cwd(), `phase-${phaseNumber}-unlocked.md`);
  
  // Check if encrypted file exists
  if (!fs.existsSync(encryptedFile)) {
    log('error', `Phase ${phaseNumber} encrypted file not found: ${encryptedFile}`);
    console.log('\nAvailable phases:');
    
    // List available encrypted phases
    const files = fs.readdirSync(process.cwd());
    const phases = files.filter(f => f.match(/phase-\d+-encrypted\.md\.enc/));
    phases.forEach(f => {
      const num = f.match(/phase-(\d+)/)[1];
      console.log(`  Phase ${num}: ${f}`);
    });
    
    return false;
  }
  
  try {
    // Read encrypted content
    const encryptedContent = fs.readFileSync(encryptedFile, 'utf8');
    
    // Decode base64
    const decodedContent = Buffer.from(encryptedContent, 'base64').toString('utf8');
    
    // Write decoded content
    fs.writeFileSync(outputFile, decodedContent);
    
    log('success', `Phase ${phaseNumber} unlocked successfully!`);
    console.log(`📄 Created: ${colors.bright}${outputFile}${colors.reset}`);
    
    // Show preview of content
    console.log('\n📖 Preview:');
    console.log(colors.cyan + '─'.repeat(50) + colors.reset);
    const preview = decodedContent.split('\n').slice(0, 10).join('\n');
    console.log(preview);
    console.log(colors.cyan + '─'.repeat(50) + colors.reset);
    
    console.log('\n💡 Next steps:');
    console.log(`  1. Read the full instructions: ${colors.cyan}cat ${outputFile}${colors.reset}`);
    console.log(`  2. Complete all tasks in Phase ${phaseNumber}`);
    console.log(`  3. Create retrospective issue in Linear`);
    console.log(`  4. Request Phase ${parseInt(phaseNumber) + 1} unlock key`);
    
    return true;
  } catch (error) {
    log('error', `Failed to unlock Phase ${phaseNumber}: ${error.message}`);
    
    if (error.message.includes('Invalid character')) {
      console.log('\n⚠️  The file might not be properly base64 encoded.');
      console.log('   This could happen if the file was modified or corrupted.');
    }
    
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
${colors.bright}Phase Unlock Tool${colors.reset}
─────────────────

Usage: node scripts/unlock-phase.js <phase-number>

Examples:
  node scripts/unlock-phase.js 1    # Unlock Phase 1
  node scripts/unlock-phase.js 2    # Unlock Phase 2
  
Or use npm:
  npm run unlock 1
  npm run unlock 2

Note: Phase 0 is not encrypted (already available).
`);
    process.exit(1);
  }
  
  const phaseNumber = args[0];
  
  // Validate phase number
  if (!/^\d+$/.test(phaseNumber)) {
    log('error', `Invalid phase number: ${phaseNumber}`);
    console.log('Phase number must be a positive integer (1, 2, 3, etc.)');
    process.exit(1);
  }
  
  if (phaseNumber === '0') {
    log('warn', 'Phase 0 is not encrypted - it\'s already available as phase-0-foundation.md');
    process.exit(0);
  }
  
  console.log(`\n${colors.bright}Unlocking Phase ${phaseNumber}${colors.reset}\n`);
  
  const success = unlockPhase(phaseNumber);
  process.exit(success ? 0 : 1);
}

main();