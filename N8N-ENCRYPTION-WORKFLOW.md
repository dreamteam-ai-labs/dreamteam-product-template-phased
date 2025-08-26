# Phase Encryption Specification for F4 n8n Flow

## Overview
This document specifies how the existing F4 n8n workflow should be extended to handle phase templates when creating new product repositories.

## Integration Point
The F4 workflow should process phase templates **after** creating the GitHub repository but **before** the final commit.

## Required Processing Steps

### 1. Template Files to Process
The F4 flow needs to process these template files from `dreamteam-product-template-phased`:
- `phase-0-foundation-template.md` → `phase-0-foundation.md` (unencrypted)
- `phase-1-template.md` → `phase-1-encrypted.md.enc`
- `phase-2-template.md` → `phase-2-encrypted.md.enc`
- `phase-3-template.md` → `phase-3-encrypted.md.enc`
- `phase-4-template.md` → `phase-4-encrypted.md.enc`
- `phase-5-template.md` → `phase-5-encrypted.md.enc`
- `phase-6-template.md` → `phase-6-encrypted.md.enc`

### 2. Placeholder Replacement
All templates use the same placeholders already available in F4 (see PLACEHOLDER-GUIDE.md for complete list).

### 3. Encryption Requirements

**Phase 0**: 
- Replace placeholders only
- Save as `phase-0-foundation.md`
- Do NOT encrypt

**Phases 1-6**:
- Replace placeholders first
- Generate unique 32-byte key per phase
- Encrypt using: `openssl enc -aes-256-cbc -salt -pbkdf2 -in [input] -out [output].enc -k [key]`
- Save with `.enc` extension

### 4. Key Storage

Generate a Linear document in the new product team:
```markdown
# Phase Unlock Keys for [PRODUCT_NAME]

**⚠️ CONFIDENTIAL - Store Securely**

## Phase Keys
- **Phase 1**: `[generated_key_1]`
- **Phase 2**: `[generated_key_2]`
- **Phase 3**: `[generated_key_3]`
- **Phase 4**: `[generated_key_4]`
- **Phase 5**: `[generated_key_5]`
- **Phase 6**: `[generated_key_6]`

## Usage
Provide these keys one at a time as Claude completes each phase.
```

### 5. Repository Files

The F4 flow should create these files in the new product repository:

**Encrypted phases**:
- `phase-1-encrypted.md.enc`
- `phase-2-encrypted.md.enc`
- `phase-3-encrypted.md.enc`
- `phase-4-encrypted.md.enc`
- `phase-5-encrypted.md.enc`
- `phase-6-encrypted.md.enc`

**Unencrypted files**:
- `phase-0-foundation.md` (with placeholders replaced)
- `KEY-MANAGEMENT.md` (status tracking file)

**Do NOT include**:
- Template files (phase-*-template.md)
- PLACEHOLDER-GUIDE.md
- This specification document

### 6. KEY-MANAGEMENT.md Content

Create this file in the repository with static content:
```markdown
# Key Management

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
```bash
npm run unlock
```

Then enter the key when prompted.
```

## Key Generation Specification

Each phase key should be:
- 32 bytes of random data
- Base64 encoded for storage
- Unique per phase per project
- Generated using cryptographically secure random source

Example command: `openssl rand -base64 32`

## Validation Checklist

After processing phase templates, verify:

1. **Files exist in new repository**:
   - [ ] phase-0-foundation.md (readable, placeholders replaced)
   - [ ] phase-1-encrypted.md.enc through phase-6-encrypted.md.enc
   - [ ] KEY-MANAGEMENT.md
   - [ ] unlock-phase.sh script

2. **Placeholders replaced**:
   - [ ] No `{{` or `}}` patterns in phase-0-foundation.md
   - [ ] Product-specific values correctly inserted

3. **Encryption valid**:
   - [ ] Each .enc file is actually encrypted (not readable)
   - [ ] Test decryption with stored keys works

4. **Linear document created**:
   - [ ] Document exists in new product team
   - [ ] Contains all 6 phase keys
   - [ ] Marked as confidential

## Error Handling

- If placeholder data missing: Use sensible defaults or abort with clear error
- If encryption fails: Abort and log error, do not commit partial work
- If Linear document fails: Save keys locally as backup, warn user
- If any validation fails: Roll back changes, report specific failure