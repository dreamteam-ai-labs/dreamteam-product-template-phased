# n8n Phase Encryption Workflow

## Overview
This document describes how n8n should process the phase templates: replacing placeholders, encrypting phases, and managing keys.

## Workflow Steps

### 1. Template Processing
Process all phase template files and replace placeholders:

```javascript
// Templates to process
const phaseTemplates = [
  'phase-0-foundation-template.md',
  'phase-1-template.md', 
  'phase-2-template.md',
  'phase-3-template.md',
  'phase-4-template.md',
  'phase-5-template.md',
  'phase-6-template.md'
];

// For each template
phaseTemplates.forEach(template => {
  let content = readFile(template);
  
  // Replace all placeholders
  Object.entries(placeholders).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  });
  
  // Save with new name (remove -template suffix)
  const outputName = template.replace('-template', '');
  writeFile(outputName, content);
});
```

### 2. Generate Encryption Keys
Create unique keys for phases 1-6:

```javascript
// Generate keys for each phase (except 0)
const phaseKeys = {};
for (let i = 1; i <= 6; i++) {
  // Generate random 32-byte key and encode as base64
  const key = crypto.randomBytes(32).toString('base64');
  phaseKeys[`phase_${i}`] = key;
}
```

### 3. Encrypt Phase Files
Encrypt phases 1-6 using AES-256-CBC:

```javascript
// Encrypt each phase file (except phase-0)
for (let i = 1; i <= 6; i++) {
  const inputFile = `phase-${i}-${getPhaseFileName(i)}.md`;
  const outputFile = `phase-${i}-encrypted.md.enc`;
  const key = phaseKeys[`phase_${i}`];
  
  // Use OpenSSL command
  const encryptCmd = `openssl enc -aes-256-cbc -salt -pbkdf2 \
    -in "${inputFile}" \
    -out "${outputFile}" \
    -k "${key}"`;
    
  executeCommand(encryptCmd);
  
  // Delete unencrypted file
  deleteFile(inputFile);
}

// Helper function for phase file names
function getPhaseFileName(phaseNum) {
  const names = {
    1: 'stories',
    2: 'handoffs', 
    3: 'parallel',
    4: 'orchestration',
    5: 'mvp',
    6: 'working'
  };
  return names[phaseNum];
}
```

### 4. Store Keys in Linear
Create a secure document with all keys:

```javascript
// Create Linear document with keys
const documentBody = `
# Phase Unlock Keys for {{PRODUCT_NAME}}

**⚠️ CONFIDENTIAL - Store Securely**

## Phase Keys

- **Phase 1**: \`${phaseKeys.phase_1}\`
- **Phase 2**: \`${phaseKeys.phase_2}\`
- **Phase 3**: \`${phaseKeys.phase_3}\`
- **Phase 4**: \`${phaseKeys.phase_4}\`
- **Phase 5**: \`${phaseKeys.phase_5}\`
- **Phase 6**: \`${phaseKeys.phase_6}\`

## Usage
Provide these keys one at a time as Claude completes each phase.
`;

// Create document via Linear API
await linearClient.createDocument({
  title: `Phase Keys: ${productName}`,
  content: documentBody,
  teamId: teamUUID
});
```

### 5. Create Key Management File
Generate KEY-MANAGEMENT.md for the repository:

```javascript
const keyManagementContent = `# Key Management

## Phase Unlock System

This project uses encrypted phases for progressive skill validation.

### Current Status
- Phase 0: ✅ Unlocked (no encryption)
- Phase 1: 🔒 Encrypted
- Phase 2: 🔒 Encrypted  
- Phase 3: 🔒 Encrypted
- Phase 4: 🔒 Encrypted
- Phase 5: 🔒 Encrypted
- Phase 6: 🔒 Encrypted

### Requesting Keys
Keys are provided by the Business Owner upon successful completion of each phase.

### Unlock Command
\`\`\`bash
npm run unlock
\`\`\`

Then enter the key when prompted.
`;

writeFile('KEY-MANAGEMENT.md', keyManagementContent);
```

### 6. Clean Up Templates
Remove template files after processing:

```javascript
// Delete all template files
phaseTemplates.forEach(template => {
  deleteFile(template);
});

// Delete PLACEHOLDER-GUIDE.md (not needed in final repo)
deleteFile('PLACEHOLDER-GUIDE.md');
```

## Required Placeholders

The following placeholders MUST be provided by n8n from Linear data:

### Core Placeholders
- `{{PRODUCT_NAME}}` - Product name from solution
- `{{PRODUCT_TITLE}}` - Full product title
- `{{PRIMARY_FEATURE}}` - Core MVP feature
- `{{SOLUTION_ID}}` - Linear solution UUID
- `{{SOLUTION_IDENTIFIER}}` - Linear identifier (e.g., SOL-1001)
- `{{TEAM_KEY}}` - Linear team key
- `{{TEAM_UUID}}` - Linear team UUID
- `{{GITHUB_URL}}` - GitHub repository URL
- `{{GITHUB_REPO}}` - Repository name

### Technical Placeholders  
- `{{TECH_STACK}}` - Technology stack
- `{{ARCHITECTURE_PATTERN}}` - Architecture type
- `{{PORT}}` - Application port (default: 3000)
- `{{DATABASE_TYPE}}` - Database choice

### Business Placeholders
- `{{TARGET_AUDIENCE}}` - Target users
- `{{PROBLEM_STATEMENT}}` - Core problem
- `{{VALUE_PROPOSITION}}` - Key value prop
- `{{PROBLEM_COUNT}}` - Number of problems

## Integration Points

### Input
- Solution data from Linear (via GraphQL)
- Phase template files from repository

### Output  
- Processed phase-0-foundation.md (unencrypted)
- Encrypted phase-1-encrypted.md.enc through phase-6-encrypted.md.enc
- KEY-MANAGEMENT.md in repository
- Phase keys document in Linear

### Verification
After processing:
1. Verify no `{{` patterns remain in phase-0
2. Verify phases 1-6 are encrypted (.enc files)
3. Verify Linear document created with keys
4. Verify all template files removed

## Error Handling

- If placeholder not found in Linear data, use sensible defaults
- If encryption fails, abort and report error
- If Linear document creation fails, output keys to console as backup
- Always validate that phase-0 remains unencrypted and readable