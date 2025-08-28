#!/bin/bash
# Unlock Phase 2: Architecture & Agent Handoffs
# Usage: ./scripts/unlock-phase-2.sh

echo "🔓 Unlocking Phase 2: Architecture & Agent Handoffs..."

if [ ! -f "phase-2-encrypted.md.enc" ]; then
    echo "❌ Error: phase-2-encrypted.md.enc not found"
    exit 1
fi

cat phase-2-encrypted.md.enc | base64 -d > phase-2-unlocked.md 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Phase 2 unlocked successfully!"
    echo "📄 You can now read: phase-2-unlocked.md"
    echo ""
    echo "Next steps:"
    echo "1. Read the instructions: cat phase-2-unlocked.md"
    echo "2. Work with solution-architect agent"
    echo "3. Create technical architecture decisions"
    echo "4. Practice agent handoffs"
else
    echo "❌ Failed to unlock Phase 2"
    exit 1
fi