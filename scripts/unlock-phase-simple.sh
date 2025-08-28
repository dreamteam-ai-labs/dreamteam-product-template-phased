#!/bin/bash

# Simple Phase Unlock Script
# Usage: ./unlock-phase-simple.sh <phase-number>

if [ -z "$1" ]; then
    echo "Usage: $0 <phase-number>"
    echo "Example: $0 1"
    exit 1
fi

PHASE=$1
ENCRYPTED_FILE="phase-${PHASE}-encrypted.md.enc"
OUTPUT_FILE="phase-${PHASE}-unlocked.md"

if [ ! -f "$ENCRYPTED_FILE" ]; then
    echo "❌ Error: $ENCRYPTED_FILE not found"
    exit 1
fi

echo "🔓 Unlocking Phase $PHASE..."

# Decode the base64 encrypted file
cat "$ENCRYPTED_FILE" | base64 -d > "$OUTPUT_FILE" 2>/dev/null

if [ $? -eq 0 ] && [ -f "$OUTPUT_FILE" ]; then
    echo "✅ Phase $PHASE unlocked successfully!"
    echo "📄 Created: $OUTPUT_FILE"
    echo ""
    echo "You can now read the phase instructions with:"
    echo "   cat $OUTPUT_FILE"
    echo ""
    echo "Or open it in your editor."
else
    echo "❌ Failed to unlock Phase $PHASE"
    echo "The file might not be properly encrypted or base64 is not available."
    exit 1
fi