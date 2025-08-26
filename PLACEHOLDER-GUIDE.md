# Placeholder Documentation for n8n Processing

## Required Placeholders for Phase Templates

All phase template files use these placeholders that must be replaced by n8n during project creation:

### Core Project Placeholders
- `{{PRODUCT_NAME}}` - The product name (e.g., "UnidataHub")
- `{{PRODUCT_TITLE}}` - Full product title (e.g., "UnidataHub - B2B SaaS Data Integration Platform")
- `{{PRIMARY_FEATURE}}` - The core MVP feature (e.g., "Multi-source Data Integration")
- `{{SOLUTION_ID}}` - Linear solution epic UUID
- `{{SOLUTION_IDENTIFIER}}` - Linear solution identifier (e.g., "SOL-1001")
- `{{TEAM_KEY}}` - Linear team key (e.g., "UNIDATA")
- `{{TEAM_UUID}}` - Linear team UUID for API calls
- `{{GITHUB_URL}}` - Full GitHub repository URL
- `{{GITHUB_REPO}}` - Repository name (e.g., "dreamteam-unidatahub")

### Technical Placeholders
- `{{TECH_STACK}}` - Technology stack (e.g., "Node.js, PostgreSQL, Redis")
- `{{ARCHITECTURE_PATTERN}}` - Architecture pattern (e.g., "Microservices" or "Monolithic")
- `{{PORT}}` - Application port (default: 3000)
- `{{DATABASE_TYPE}}` - Database type (e.g., "PostgreSQL", "MongoDB", "SQLite")

### Business Context Placeholders
- `{{TARGET_AUDIENCE}}` - Target user description (e.g., "B2B SaaS companies")
- `{{PROBLEM_STATEMENT}}` - Core problem being solved
- `{{VALUE_PROPOSITION}}` - Key value proposition
- `{{PROBLEM_COUNT}}` - Number of problems this solution addresses

### Phase-Specific Placeholders
- `{{ACCEPTANCE_CRITERIA}}` - List of acceptance criteria (can be multi-line)
- `{{TECH_REQUIREMENTS}}` - Technical requirements list
- `{{SECURITY_REQUIREMENTS}}` - Security considerations

## Files Requiring Placeholder Replacement

### Phase Files (before encryption)
1. `phase-0-foundation-template.md` → `phase-0-foundation.md`
2. `phase-1-template.md` → `phase-1-stories.md`
3. `phase-2-template.md` → `phase-2-handoffs.md`
4. `phase-3-template.md` → `phase-3-parallel.md`
5. `phase-4-template.md` → `phase-4-orchestration.md`
6. `phase-5-template.md` → `phase-5-mvp.md`
7. `phase-6-template.md` → `phase-6-working.md`

### Other Template Files
- `CLAUDE.md`
- `README.md`
- `START-HERE.md`
- `.env.example`
- `package.json` (name and description)

## n8n Workflow Process

1. **Fetch Solution Data from Linear**
   - Get solution details via GraphQL
   - Extract all required values

2. **Process Template Files**
   ```javascript
   // For each template file
   const templates = [
     'phase-0-foundation-template.md',
     'phase-1-template.md',
     // ... etc
   ];
   
   templates.forEach(template => {
     let content = readFile(template);
     
     // Replace all placeholders
     content = content.replace(/{{PRODUCT_NAME}}/g, productName);
     content = content.replace(/{{PRIMARY_FEATURE}}/g, primaryFeature);
     // ... etc
     
     // Save processed file (remove -template suffix)
     const outputName = template.replace('-template', '');
     writeFile(outputName, content);
   });
   ```

3. **Encrypt Phase Files (except Phase 0)**
   ```bash
   # Generate keys for phases 1-6
   PHASE_1_KEY=$(openssl rand -base64 32)
   PHASE_2_KEY=$(openssl rand -base64 32)
   # ... etc
   
   # Encrypt each phase
   openssl enc -aes-256-cbc -salt -pbkdf2 \
     -in phase-1-stories.md \
     -out phase-1-encrypted.md.enc \
     -k "$PHASE_1_KEY"
   ```

4. **Store Keys Securely**
   - Create Linear document with all phase keys
   - Store keys in secure location for Business Owner
   - Generate `KEY-MANAGEMENT.md` with key references

5. **Clean Up**
   - Delete unencrypted phase files (except phase-0)
   - Delete template files
   - Keep only encrypted versions and phase-0

## Example n8n Code Node

```javascript
// Fetch solution from Linear
const solution = await linearClient.issue(solutionId);

// Extract values
const placeholders = {
  PRODUCT_NAME: solution.title.split(':')[1].trim(),
  PRIMARY_FEATURE: solution.description.match(/Primary Feature: (.*)/)[1],
  SOLUTION_ID: solution.id,
  SOLUTION_IDENTIFIER: solution.identifier,
  TEAM_KEY: solution.team.key,
  TEAM_UUID: solution.team.id,
  TECH_STACK: solution.labels.find(l => l.name.includes('tech'))?.name || 'Node.js',
  TARGET_AUDIENCE: solution.customFields.targetAudience,
  PORT: '3000',
  // ... etc
};

// Process each template
const processTemplate = (templateContent, placeholders) => {
  let processed = templateContent;
  
  Object.entries(placeholders).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, value);
  });
  
  return processed;
};
```

## Validation

After processing, verify:
1. No `{{` or `}}` patterns remain (all placeholders replaced)
2. All URLs are valid
3. Technical values make sense for the project type
4. Phase files are properly encrypted (except phase-0)