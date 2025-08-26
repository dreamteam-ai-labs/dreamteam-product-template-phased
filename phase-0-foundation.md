# Phase 0: Foundation & Connectivity

## 🎯 Objective

Prove you can connect to all required services and perform basic operations.

## 📋 Prerequisites

1. Copy `.env.example` to `.env`
2. Add your LINEAR_API_KEY
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run connectivity test:
   ```bash
   npm run verify
   ```
   This will find your team UUID and validate your configuration.

## ✅ Required Tasks

### Task 1: Create Your First Linear Issue
Create a test issue in Linear with these exact specifications:
- Title: "Phase 0 Test: {{PRODUCT_TITLE}}"
- Description: "Testing Linear API connectivity for phased development"
- Team: {{TEAM_KEY}}
- Labels: ["test", "phase-0"]

Record the issue ID: ________________

### Task 2: Verify GitHub Sync
1. Wait 30 seconds for sync
2. Check GitHub Issues for your test issue
3. Confirm it appears with same title

GitHub Issue #: ________________

### Task 3: Update Via API
Update your test issue:
- Add comment: "Successfully connected from Claude Code"
- Change label: Add "connectivity-verified"

### Task 4: Query Operations
Using Linear API, retrieve:
1. Your test issue by ID
2. All issues assigned to "product-manager" 
3. The solution epic {{SOLUTION_ID}}

### Task 5: Create Relationship
Create a relationship:
- Make your test issue a child of {{SOLUTION_ID}}
- Verify the parent relationship in Linear

### Task 6: Assignment Test
- Change assignee of your test issue to "solution-architect"
- Verify the assignment shows correctly

### Task 7: State Transition
- Move your test issue to "In Progress"
- Add comment with timestamp
- Move to "Done"

## 📝 Validation Checklist

Before requesting Phase 1 key, ensure:
- [ ] Test issue created with ID: ___________
- [ ] Issue visible in GitHub as #___________
- [ ] Comment added successfully
- [ ] Parent relationship to {{SOLUTION_ID}} confirmed
- [ ] Assignment to solution-architect worked
- [ ] Issue transitioned to Done state
- [ ] All API queries returned correct data

## 🎓 What You've Learned

By completing Phase 0, you've proven you can:
- ✅ Authenticate with Linear API
- ✅ Create issues with proper fields
- ✅ Verify GitHub-Linear sync
- ✅ Update and transition issues
- ✅ Manage relationships and assignments

## 🔓 Ready for Phase 1?

Post to Linear {{SOLUTION_ID}}:
```
PHASE 0 COMPLETE
- Test Issue: [YOUR-ISSUE-ID]
- GitHub Issue: #[NUMBER]
- All 7 tasks verified
Ready for Phase 1 key
```

Then wait for Business Owner to provide unlock key.

## ⚠️ Troubleshooting

If any task fails:
1. Check your LINEAR_API_KEY is correct
2. Verify team ID is {{TEAM_KEY}}
3. Ensure GitHub sync is enabled
4. Review API query syntax

---

Remember: This foundation must be solid before building on it!