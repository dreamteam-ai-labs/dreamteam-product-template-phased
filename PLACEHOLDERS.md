# Template Placeholders

This file documents all placeholders that must be replaced when creating a new project from this template.

## Required Placeholders

These placeholders MUST be replaced by the n8n workflow or setup script:

| Placeholder | Description | Example Value |
|------------|-------------|---------------|
| `{{PRODUCT_TITLE}}` | The product name/title | `UnidataHub` |
| `{{SOLUTION_ID}}` | Linear solution epic ID | `PR858O-1/SOL-1001-unidatahub` |
| `{{TEAM_KEY}}` | Linear team identifier | `PR858O` |
| `{{TEAM_UUID}}` | Linear team UUID | `e1e738ea-6ea4-4e73-acc9-f56739ed4dae` |
| `{{GITHUB_URL}}` | Full GitHub repository URL | `https://github.com/dreamteam-ai-labs/DreamTeam-UnidataHub-943` |
| `{{PROBLEM_COUNT}}` | Number of problems being solved | `4` |
| `{{SOLUTION_DESCRIPTION}}` | Brief solution description | `UnidataHub is a scalable B2B SaaS platform...` |

## Files Containing Placeholders

The following files contain placeholders that need replacement:

1. **CLAUDE.md**
   - `{{PRODUCT_TITLE}}` (line 1, 5)
   - `{{SOLUTION_ID}}` (line 18)
   - `{{TEAM_KEY}}` (line 19)
   - `{{GITHUB_URL}}` (line 20)
   - `{{PROBLEM_COUNT}}` (line 21)

2. **START-HERE.md**
   - `{{PRODUCT_TITLE}}` (line 3, 58)
   - `{{SOLUTION_ID}}` (line 51)
   - `{{TEAM_KEY}}` (line 52)
   - `{{GITHUB_URL}}` (line 53)
   - `{{PROBLEM_COUNT}}` (line 54)
   - `{{SOLUTION_DESCRIPTION}}` (line 58)

3. **phase-0-foundation.md**
   - `{{PRODUCT_TITLE}}` (line 20)
   - `{{TEAM_KEY}}` (lines 22, 96)
   - `{{SOLUTION_ID}}` (lines 43, 47, 65, 81)

4. **.env.example**
   - `{{TEAM_KEY}}` (line 13)
   - `{{TEAM_UUID}}` (line 14)
   - `{{SOLUTION_ID}}` (line 15)

## Replacement Script

For manual replacement, use:
```bash
sed -i "s/{{PRODUCT_TITLE}}/YourProduct/g" CLAUDE.md START-HERE.md phase-0-foundation.md
sed -i "s/{{SOLUTION_ID}}/TEAM-1\/SOL-1000/g" CLAUDE.md START-HERE.md phase-0-foundation.md .env.example
sed -i "s/{{TEAM_KEY}}/TEAM/g" CLAUDE.md START-HERE.md phase-0-foundation.md .env.example
sed -i "s|{{GITHUB_URL}}|https://github.com/org/repo|g" CLAUDE.md START-HERE.md
sed -i "s/{{PROBLEM_COUNT}}/5/g" CLAUDE.md START-HERE.md
sed -i "s/{{SOLUTION_DESCRIPTION}}/Your solution description/g" START-HERE.md
```

## n8n Integration

The n8n workflow should:
1. Clone this template repository
2. Replace all placeholders with actual values
3. Commit the changes
4. Push to the new product repository

## Important Notes

- All placeholders use double curly braces: `{{PLACEHOLDER}}`
- Placeholders are case-sensitive
- GitHub URLs may contain special characters that need escaping in sed
- The encrypted phase files (phase-1-encrypted.md.enc, phase-2-encrypted.md.enc) do NOT need placeholder replacement