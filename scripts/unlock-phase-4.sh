#!/bin/bash
# Unlock Phase 4: Full Agent Orchestration
# Usage: ./scripts/unlock-phase-4.sh

echo "🔓 Unlocking Phase 4: Full Agent Orchestration..."

if [ ! -f "phase-4-encrypted.md.enc" ]; then
    echo "❌ Error: phase-4-encrypted.md.enc not found"
    exit 1
fi

cat phase-4-encrypted.md.enc | base64 -d > phase-4-unlocked.md 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Phase 4 unlocked successfully!"
    echo "📄 You can now read: phase-4-unlocked.md"
    echo ""
    echo "Next steps:"
    echo "1. Read the instructions: cat phase-4-unlocked.md"
    echo "2. Orchestrate complete development cycle"
    echo "3. Manage all 16 agents"
    echo "4. Deliver integrated solution"
else
    echo "❌ Failed to unlock Phase 4"
    exit 1
fi