# Phase 0: Foundation & Connectivity

## 🎯 Objective
Establish connectivity with Linear and GitHub, verify all agents are accessible, and understand your project scope.

## 🚀 Quick Start (NEW!)
```bash
# Auto-configure your environment (saves 10+ minutes!)
node scripts/discover-config.js

# Then verify everything works
node scripts/verify-connectivity.js
```

## 📋 Your Tasks

### 1. Auto-Configure Environment
- [ ] Run `node scripts/discover-config.js` to automatically find configuration values
- [ ] Review generated TEAM-CONTEXT.md for your project details
- [ ] If any values are missing, the script will tell you where to find them

### 2. Verify Linear Connection
- [ ] Run `node scripts/verify-connectivity.js`
- [ ] Confirm you can read the solution epic in Linear: {{SOLUTION_ID}}
- [ ] Verify team access in Linear: {{TEAM_KEY}}

### 3. Review Your Project
- [ ] Read the solution details in Linear
- [ ] Understand the core problem you're solving
- [ ] Identify the primary feature for MVP: {{PRIMARY_FEATURE}}

### 3. Check Agent Access
- [ ] Verify all 16 agents exist in Linear team
- [ ] Confirm GitHub repository access: {{GITHUB_URL}}
- [ ] Test Linear API with a simple query

### 4. Environment Setup
- [ ] Verify `.env` has all required variables
- [ ] Confirm development environment is ready
- [ ] Test database connection (if applicable)

### 5. Create Foundation Issue
Use the helper script to create your completion issue:
```bash
node scripts/create-issue.js "Phase 0 Complete: {{PRODUCT_NAME}}" "All connections verified. Solution understood. Ready for Phase 1."
```
Or create manually with:
- Confirmation that all connections work
- Summary of the solution you're building
- List of any issues encountered

### 6. Test Agent Communication
Using the Task tool, ask product-manager to:
- Summarize the solution epic
- Identify the core MVP feature
- Confirm understanding of {{PRODUCT_NAME}}

## ✅ Success Criteria
- All connectivity verified
- Solution epic understood
- Agents are accessible
- Environment is ready
- Linear issue created

## 📝 Required Retrospective
Before requesting Phase 1, create a Linear issue titled "Phase 0 Retrospective" with:
1. What worked well
2. What challenges you faced
3. Suggestions for improving this phase
4. Time taken to complete

## 🔐 Completion
When all tasks are complete and retrospective posted, request the Phase 1 key from the Business Owner.