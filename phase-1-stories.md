# Phase 1: Product Manager Agent

## 🎯 Objective

Learn to work with your first agent: the product-manager.

## 📋 Prerequisites

- Phase 0 test issue ID: ________________
- Confirmed Linear connectivity
- GitHub sync verified

## 🤖 Agent Introduction

The product-manager agent specializes in:
- Breaking down epics into user stories
- Creating INVEST-compliant stories
- Setting acceptance criteria
- Prioritizing work

## ✅ Required Tasks

### Task 1: Fetch Context
Retrieve the full solution epic {{SOLUTION_ID}} including:
- Description
- Linked problems ({{PROBLEM_COUNT}} total)
- Current state

### Task 2: Activate Product Manager Agent

```
You must use the Task tool to activate the product-manager agent:

Task: "Create user stories for {{SOLUTION_ID}}"
Instructions: 
  - Review the solution epic and {{PROBLEM_COUNT}} linked problems
  - Create 5 INVEST user stories as Linear issues
  - Each story must have:
    * Parent: {{SOLUTION_ID}}
    * Clear acceptance criteria
    * Label: "user-story"
    * Estimate (1-5 points)
    * Assignment to relevant agent for next phase
  - Return the Linear issue IDs created
```

### Task 3: Verify Story Creation
Confirm the agent created:
- [ ] Minimum 5 user stories
- [ ] All have parent = {{SOLUTION_ID}}
- [ ] Each has acceptance criteria
- [ ] At least one assigned to "solution-architect"
- [ ] At least one assigned to "ux-ui-designer"

Story IDs created:
1. ________________
2. ________________
3. ________________
4. ________________
5. ________________

### Task 4: Test Agent Updates
Ask product-manager agent to:
- Update story #1 with additional acceptance criteria
- Change estimate on story #2
- Add label "mvp" to story #3

### Task 5: Cross-Agent Assignment
Have product-manager create a new issue:
- Title: "Architecture Decision Needed: Database Selection"
- Assign to: solution-architect
- Label: "architecture", "blocking"
- Parent: One of the stories from Task 3

Architecture issue ID: ________________

### Task 6: Verify GitHub Sync
Confirm all stories appear in GitHub:
- [ ] All 5 stories visible
- [ ] Assignments show correctly
- [ ] Labels synchronized

## 📝 Validation Checklist

- [ ] Product-manager agent successfully activated
- [ ] 5+ user stories created in Linear
- [ ] Stories properly linked to epic
- [ ] Cross-agent assignment working
- [ ] Updates applied successfully
- [ ] GitHub sync confirmed

## 🎓 What You've Learned

By completing Phase 1, you've proven:
- ✅ Agent activation using Task tool
- ✅ Agent can create Linear issues
- ✅ Agent can assign to other agents
- ✅ Agent can update existing issues
- ✅ Proper epic/story hierarchy

## 🔓 Ready for Phase 2?

Post to Linear {{SOLUTION_ID}}:
```
PHASE 1 COMPLETE
Stories created:
- [LIST YOUR 5 STORY IDS]
Architecture issue: [ARCH-ISSUE-ID]
Product-manager agent fully functional
Ready for Phase 2 key
```

## 💡 Tips

- The product-manager agent should create stories that reflect the actual problems
- Each story should trace back to specific problems from the {{PROBLEM_COUNT}} linked
- Acceptance criteria should be testable and specific

---

Next: Phase 2 will introduce the solution-architect agent and test handoffs!