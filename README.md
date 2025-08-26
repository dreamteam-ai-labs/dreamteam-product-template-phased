# DreamTeam Phased Product Template

## Purpose

This template provides a **progressive learning approach** for DreamTeam projects, where agents must prove competency at each level before advancing.

## Key Features

- **5 Progressive Phases** - From basic connectivity to full team orchestration
- **Skill Validation** - Each phase tests specific capabilities
- **Encrypted Progression** - Future phases locked until current phase complete
- **Human Verification** - Business Owner validates completion before providing keys

## Phase Structure

| Phase | Agents Involved | Key Skills Tested |
|-------|----------------|-------------------|
| 0 | Claude Code only | Linear API, GitHub sync, basic operations |
| 1 | Product Manager | Agent activation, story creation, assignment |
| 2 | +Solution Architect | Agent handoffs, issue relationships |
| 3 | +UX, +Test Engineer | Parallel coordination |
| 4 | All 16 agents | Full orchestration |

## How It Works

1. **Start with Phase 0** - Always unlocked, tests connectivity
2. **Complete all tasks** - Each phase has specific requirements
3. **Request unlock key** - Provide evidence to Business Owner
4. **Unlock next phase** - Use provided key with unlock script
5. **Progress through all phases** - Building skills progressively

## Files

- `START-HERE.md` - Entry point and progress tracker
- `phase-0-foundation.md` - Always available, tests basics
- `phase-1-stories.md` - Encrypted until Phase 0 complete
- `phase-2-architecture.md` - Encrypted until Phase 1 complete
- `phase-3-parallel.md` - Encrypted until Phase 2 complete
- `phase-4-orchestration.md` - Encrypted until Phase 3 complete
- `scripts/unlock-phase.sh` - Decryption script

## Testing Mode

For development/testing, phases can be unlocked with test keys:
- Phase 1: `TEST-PHASE-1`
- Phase 2: `TEST-PHASE-2`
- etc.

## Production Mode

In production, phases are encrypted with strong keys that only the Business Owner provides after validation.

## Placeholders

The following placeholders are replaced by n8n during project creation:
- `{{PRODUCT_TITLE}}` - The product name
- `{{SOLUTION_ID}}` - Linear solution epic ID
- `{{TEAM_KEY}}` - Linear team identifier
- `{{GITHUB_URL}}` - Repository URL
- `{{PROBLEM_COUNT}}` - Number of problems being solved

## Why This Approach?

Traditional templates overwhelm agents with 500+ lines of instructions. This phased approach:
- **Reduces cognitive load** - Only see current phase
- **Ensures foundations** - Can't build on broken basics
- **Isolates problems** - Know exactly where failures occur
- **Builds confidence** - Success at each level before advancing

## Usage in n8n

In your n8n workflow, select:
- `dreamteam-product-template` for standard projects
- `dreamteam-product-template-phased` for progressive validation

---

This template is part of the DreamTeam Virtual Software House system.