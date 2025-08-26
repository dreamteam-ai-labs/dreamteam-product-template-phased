#!/bin/bash

# Script to generate and manage phase unlock keys
# These keys are used to decrypt phase files progressively

echo "🔐 DreamTeam Phase Key Generator"
echo "================================"
echo ""

# Check if we're in test mode
if [ "$1" == "--test" ]; then
    echo "📝 Test Mode - Using simple test keys"
    echo ""
    echo "Phase 1: TEST-PHASE-1"
    echo "Phase 2: TEST-PHASE-2"
    echo "Phase 3: TEST-PHASE-3"
    echo "Phase 4: TEST-PHASE-4"
    echo ""
    echo "These test keys only work with unencrypted phase files."
    exit 0
fi

# Generate production keys
echo "🎲 Generating secure random keys..."
echo ""

KEY1=$(openssl rand -base64 32)
KEY2=$(openssl rand -base64 32)
KEY3=$(openssl rand -base64 32)
KEY4=$(openssl rand -base64 32)

# Create a keys file (but don't commit it!)
KEYS_FILE="phase-unlock-keys-$(date +%Y%m%d-%H%M%S).txt"

cat > "$KEYS_FILE" << EOF
# DreamTeam Phase Unlock Keys
# Generated: $(date)
# ⚠️  KEEP THESE SECURE - DO NOT COMMIT TO GIT

Phase 1 Key (User Story Creation):
$KEY1

Phase 2 Key (Architecture & Handoffs):
$KEY2

Phase 3 Key (Parallel Coordination):
$KEY3

Phase 4 Key (Full Orchestration):
$KEY4

## How to use these keys:

When Claude/agent completes a phase, provide the next key:
bash scripts/unlock-phase.sh [phase-number] "[key]"

Example:
bash scripts/unlock-phase.sh 1 "$KEY1"

## Storage recommendations:
1. Save in password manager
2. Store in private Linear document
3. Keep local backup (not in repo)
EOF

echo "✅ Keys generated and saved to: $KEYS_FILE"
echo ""
echo "📋 Your unlock keys:"
echo "===================="
echo ""
echo "Phase 1: $KEY1"
echo ""
echo "Phase 2: $KEY2"
echo ""
echo "Phase 3: $KEY3"
echo ""
echo "Phase 4: $KEY4"
echo ""
echo "⚠️  IMPORTANT:"
echo "  1. Save these keys immediately - they cannot be recovered!"
echo "  2. Keys are saved to: $KEYS_FILE"
echo "  3. DO NOT commit this file to git"
echo "  4. Consider storing in Linear or password manager"
echo ""
echo "Next step: Run encrypt-phases.sh with these keys to encrypt the phase files."
echo ""
echo "Export keys for encryption:"
echo "export PHASE_1_KEY=\"$KEY1\""
echo "export PHASE_2_KEY=\"$KEY2\""
echo "export PHASE_3_KEY=\"$KEY3\""
echo "export PHASE_4_KEY=\"$KEY4\""