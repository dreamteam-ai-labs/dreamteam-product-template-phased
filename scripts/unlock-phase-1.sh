#!/bin/bash
# Unlock Phase 1: Single Agent Development
# Usage: ./scripts/unlock-phase-1.sh

echo "🔓 Unlocking Phase 1: Single Agent Development..."

if [ ! -f "phase-1-encrypted.md.enc" ]; then
    echo "❌ Error: phase-1-encrypted.md.enc not found"
    exit 1
fi

cat phase-1-encrypted.md.enc | base64 -d > phase-1-unlocked.md 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Phase 1 unlocked successfully!"
    echo "📄 You can now read: phase-1-unlocked.md"
    echo ""
    echo "Next steps:"
    echo "1. Read the instructions: cat phase-1-unlocked.md"
    echo "2. Work with the product-manager agent"
    echo "3. Create 5-7 user stories in Linear"
    echo "4. Complete retrospective"
else
    echo "❌ Failed to unlock Phase 1"
    exit 1
fi