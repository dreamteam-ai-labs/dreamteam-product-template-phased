# DreamTeam Phased Product Template

## Purpose

This template provides a **progressive learning approach** for DreamTeam projects, where agents must prove competency at each level before advancing.

## Key Features

- **7 Progressive Phases** - From basic connectivity to working implementation
- **Skill Validation** - Each phase tests specific capabilities
- **Encrypted Progression** - Future phases locked until current phase complete
- **Human Verification** - Business Owner validates completion before providing keys

## Phase Structure

| Phase | Agents Involved | Key Skills Tested |
|-------|----------------|-------------------|
| 0 | Claude Code only | Linear API, GitHub sync, basic operations |
| 1 | Product Manager | Agent activation, story creation, assignment |
| 2 | Multiple agents | Agent handoffs, issue relationships |
| 3 | 4+ agents parallel | Parallel coordination |
| 4 | All 16 agents | Full orchestration |
| 5 | All agents | Autonomous MVP development |
| 6 | All agents | Working implementation with tests |

## How It Works

1. **Start with Phase 0** - Always unlocked, tests connectivity
2. **Complete all tasks** - Each phase has specific requirements
3. **Request unlock key** - Provide evidence to Business Owner
4. **Unlock next phase** - Use provided key with unlock script
5. **Progress through all phases** - Building skills progressively

## Quick Start

After cloning this repository:

```bash
# 1. Run setup script
bash scripts/setup.sh

# 2. Add your Linear API key to .env
# Get it from: https://linear.app/settings/api

# 3. Verify connectivity
npm run verify

# 4. Start Phase 0
# Follow instructions in phase-0-foundation.md
```

## Files

- `START-HERE.md` - Entry point and progress tracker
- `phase-0-foundation.md` - Always available, tests basics
- `phase-1-encrypted.md.enc` - Encrypted until Phase 0 complete
- `phase-2-encrypted.md.enc` - Encrypted until Phase 1 complete
- `phase-3-encrypted.md.enc` - Encrypted until Phase 2 complete
- `phase-4-encrypted.md.enc` - Encrypted until Phase 3 complete
- `phase-5-encrypted.md.enc` - Encrypted until Phase 4 complete
- `phase-6-encrypted.md.enc` - Encrypted until Phase 5 complete
- `scripts/unlock-phase.sh` - Decryption script

## Testing Mode

For development/testing, phases can be unlocked with test keys:
- Phase 1: `TEST-PHASE-1`
- Phase 2: `TEST-PHASE-2`
- Phase 3: `TEST-PHASE-3`
- Phase 4: `TEST-PHASE-4`
- Phase 5: `TEST-PHASE-5`
- Phase 6: `TEST-PHASE-6`

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