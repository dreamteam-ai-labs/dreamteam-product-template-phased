# Phase 2: Solution Architect Agent & Handoffs

## 🎯 Objective

Learn agent-to-agent handoffs with the solution-architect.

## 📋 Prerequisites

- Completed Phase 1
- Story IDs from Phase 1: ________________
- Architecture issue assigned to solution-architect

## ✅ Required Tasks

### Task 1: Architect Finds Assignment
Activate solution-architect agent to:
- Query for issues assigned to them
- Identify the architecture issue from Phase 1
- Confirm they can read the issue details

### Task 2: Architect Creates ADR
Solution-architect must:
- Create Architecture Decision Record (ADR)
- Save as `docs/adr/ADR-001-database-selection.md`
- Update the Linear issue with decision summary

### Task 3: Handoff to Developer
Solution-architect creates new issue:
- Title: "Implement database models per ADR-001"
- Assign to: developer-implementer
- Link to: Original architecture issue
- Add acceptance criteria based on ADR

Developer issue ID: ________________

### Task 4: Complete Handoff Cycle
1. Architect marks their issue as "Done"
2. Activate developer-implementer agent
3. Developer finds their new assignment
4. Developer acknowledges with comment

### Task 5: Parallel Architecture Work
Architect creates 3 issues simultaneously:
- API structure → developer-implementer
- Security review → security-compliance-lead  
- Performance requirements → test-engineer

All three issue IDs:
1. ________________
2. ________________
3. ________________

## 📝 Validation Checklist

- [ ] Architect successfully queried assignments
- [ ] ADR created and committed
- [ ] Handoff to developer completed
- [ ] Original issue marked done
- [ ] 3 parallel issues created
- [ ] All visible in GitHub

## 🔓 Ready for Phase 3?

Post evidence of successful handoffs and parallel assignments.