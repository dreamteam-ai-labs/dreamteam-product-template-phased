#!/bin/bash

# Script to encrypt phase files for production
# Run this before committing to GitHub

echo "🔐 Encrypting phase files..."

# Function to encrypt a file
encrypt_file() {
    local phase=$1
    local key=$2
    local input_file="phase-${phase}-*.md"
    local output_file="phase-${phase}-encrypted.md.enc"
    
    if ls $input_file 1> /dev/null 2>&1; then
        # Get the actual filename
        actual_file=$(ls $input_file | head -1)
        
        echo "Encrypting Phase ${phase}..."
        openssl enc -aes-256-cbc -pbkdf2 -in "$actual_file" -out "$output_file" -k "$key"
        
        if [ $? -eq 0 ]; then
            echo "✅ Phase ${phase} encrypted successfully"
            # Optionally remove the unencrypted file
            # rm "$actual_file"
        else
            echo "❌ Failed to encrypt Phase ${phase}"
        fi
    else
        echo "⚠️  Phase ${phase} file not found"
    fi
}

# Generate random keys or use provided ones
KEY1=${PHASE_1_KEY:-$(openssl rand -base64 32)}
KEY2=${PHASE_2_KEY:-$(openssl rand -base64 32)}
KEY3=${PHASE_3_KEY:-$(openssl rand -base64 32)}
KEY4=${PHASE_4_KEY:-$(openssl rand -base64 32)}

# Encrypt each phase (except Phase 0 which stays unencrypted)
encrypt_file 1 "$KEY1"
encrypt_file 2 "$KEY2"
encrypt_file 3 "$KEY3"
encrypt_file 4 "$KEY4"

echo ""
echo "📝 Keys for phases (SAVE THESE SECURELY):"
echo "Phase 1: $KEY1"
echo "Phase 2: $KEY2"
echo "Phase 3: $KEY3"
echo "Phase 4: $KEY4"
echo ""
echo "⚠️  Store these keys securely - they cannot be recovered!"