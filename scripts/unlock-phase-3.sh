#!/bin/bash
# Unlock Phase 3: Parallel Agent Coordination
# Usage: ./scripts/unlock-phase-3.sh

echo "🔓 Unlocking Phase 3: Parallel Agent Coordination..."

if [ ! -f "phase-3-encrypted.md.enc" ]; then
    echo "❌ Error: phase-3-encrypted.md.enc not found"
    exit 1
fi

cat phase-3-encrypted.md.enc | base64 -d > phase-3-unlocked.md 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Phase 3 unlocked successfully!"
    echo "📄 You can now read: phase-3-unlocked.md"
    echo ""
    echo "Next steps:"
    echo "1. Read the instructions: cat phase-3-unlocked.md"
    echo "2. Coordinate multiple agents in parallel"
    echo "3. Manage concurrent workstreams"
    echo "4. Verify all deliverables"
else
    echo "❌ Failed to unlock Phase 3"
    exit 1
fi