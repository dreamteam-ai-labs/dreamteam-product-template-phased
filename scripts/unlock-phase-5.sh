#!/bin/bash
# Unlock Phase 5: Autonomous MVP Development
# Usage: ./scripts/unlock-phase-5.sh

echo "🔓 Unlocking Phase 5: Autonomous MVP Development..."

if [ ! -f "phase-5-encrypted.md.enc" ]; then
    echo "❌ Error: phase-5-encrypted.md.enc not found"
    exit 1
fi

cat phase-5-encrypted.md.enc | base64 -d > phase-5-unlocked.md 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Phase 5 unlocked successfully!"
    echo "📄 You can now read: phase-5-unlocked.md"
    echo ""
    echo "Next steps:"
    echo "1. Read the instructions: cat phase-5-unlocked.md"
    echo "2. Build complete MVP autonomously"
    echo "3. Create all necessary documentation"
    echo "4. Deliver working solution"
else
    echo "❌ Failed to unlock Phase 5"
    exit 1
fi