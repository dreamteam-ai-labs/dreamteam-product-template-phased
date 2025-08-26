# Key Management Guide for Phased Templates

## Current Status

### Encrypted Phases
- ✅ Phase 1: `phase-1-encrypted.md.enc`
- ✅ Phase 2: `phase-2-encrypted.md.enc`
- ✅ Phase 3: `phase-3-encrypted.md.enc`
- ✅ Phase 4: `phase-4-encrypted.md.enc`

### Current Keys (Store these securely!)

**Phase 1 - User Story Creation:**
```
CyAETteXaKBGfKPKL/QJ/6RSVaPT52fbu7GyLlZehj0=
```

**Phase 2 - Architecture & Handoffs:**
```
VW3RJD7E3D6KS3B1AemTuy7bs85z/W+FeDIN0vtOhQM=
```

**Phase 3 - Parallel Coordination:**
```
oqRcq9t7J11KTgPLhebblpLJWZ4cZXVxDr+KVDoqFJU=
```

**Phase 4 - Full Orchestration:**
```
1ObWlhddGfSbhSTZmx40DN4utgxHR+Tmyh/UiXr6Zl4=
```

## For Next Time: Complete Workflow

### 1. Prepare Phase Files
Before encrypting, ensure you have all phase content:
```bash
phase-0-foundation.md       # Always unencrypted
phase-1-stories.md          # To be encrypted
phase-2-architecture.md     # To be encrypted  
phase-3-parallel.md         # To be encrypted
phase-4-orchestration.md    # To be encrypted
```

### 2. Generate Keys
```bash
# Generate new random keys
bash scripts/generate-keys.sh

# This creates a timestamped file with all keys
# Example: phase-unlock-keys-20240826-143022.txt
```

### 3. Encrypt Phases
```bash
# Set the keys as environment variables
export PHASE_1_KEY="[key-from-step-2]"
export PHASE_2_KEY="[key-from-step-2]"
export PHASE_3_KEY="[key-from-step-2]"
export PHASE_4_KEY="[key-from-step-2]"

# Run encryption
bash scripts/encrypt-phases.sh
```

### 4. Store Keys Securely

**Option A: Linear Document (Recommended)**
1. Create document: "DreamTeam Phase Unlock Keys"
2. Mark as private/internal
3. Copy keys from generated file
4. Share link with Business Owner only

**Option B: Secure Note**
1. Use password manager (1Password, Bitwarden, etc.)
2. Create secure note: "DreamTeam Phase Keys"
3. Copy all keys
4. Share via secure channel when needed

**Option C: Local Secure Storage**
1. Keep generated .txt file locally
2. Store in encrypted volume
3. Never commit to git
4. Backup to secure cloud storage

### 5. Provide Keys During Development

When Claude/agents complete a phase:
```bash
# Business Owner provides next key
"Great work! Here's your Phase X key:"
"Run: bash scripts/unlock-phase.sh X 'key-here'"
```

## Emergency Recovery

If keys are lost:

### Option 1: Restore from Backup
- Check password manager
- Check Linear documents
- Check local key files

### Option 2: Re-create Template
1. Get original phase content from earlier commits
2. Generate new keys
3. Re-encrypt all phases
4. Update template repository

## Security Best Practices

1. **Never commit keys** - Always use .gitignore
2. **Rotate periodically** - Generate new keys quarterly
3. **Limited distribution** - Only Business Owner has all keys
4. **Track usage** - Log when keys are provided
5. **Test before production** - Verify decryption works

## Quick Reference for Business Owner

When Claude completes a phase, provide the appropriate key:

| Phase | What Claude Learned | Key to Provide |
|-------|-------------------|----------------|
| 0 | Connectivity & Linear API | (Phase 1 key) |
| 1 | User story creation | (Phase 2 key) |
| 2 | Architecture & handoffs | (Phase 3 key) |
| 3 | Parallel coordination | (Phase 4 key) |
| 4 | Full orchestration | Complete! |

## Testing Without Security

For development/testing, use test keys:
```bash
bash scripts/unlock-phase.sh 1 "TEST-PHASE-1"
bash scripts/unlock-phase.sh 2 "TEST-PHASE-2"
# etc.
```

Note: Test keys only work if phases aren't actually encrypted.