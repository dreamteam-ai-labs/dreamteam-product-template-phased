#!/bin/bash

# Phase unlock script for DreamTeam phased development

PHASE=$1
KEY=$2

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$PHASE" ] || [ -z "$KEY" ]; then
    echo -e "${RED}❌ Error: Missing arguments${NC}"
    echo "Usage: bash scripts/unlock-phase.sh [phase_number] [key]"
    echo "Example: bash scripts/unlock-phase.sh 1 MySecretKey123"
    exit 1
fi

# Check if phase file exists
ENCRYPTED_FILE="phase-${PHASE}-*.md.enc"
DECRYPTED_FILE="phase-${PHASE}-UNLOCKED.md"

if ! ls $ENCRYPTED_FILE 1> /dev/null 2>&1; then
    # If no encrypted file, check if unencrypted version exists (for testing)
    UNENCRYPTED_FILE="phase-${PHASE}-*.md"
    if ls $UNENCRYPTED_FILE 1> /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Phase ${PHASE} is not encrypted (test mode)${NC}"
        # In test mode, just check if key matches a simple pattern
        if [ "$KEY" == "TEST-PHASE-${PHASE}" ]; then
            cp $UNENCRYPTED_FILE $DECRYPTED_FILE
            echo -e "${GREEN}✅ Phase ${PHASE} unlocked (test mode)!${NC}"
            echo -e "${GREEN}📖 Read ${DECRYPTED_FILE} for your objectives${NC}"
            
            # Update START-HERE.md to show current phase
            sed -i "s/Current Phase: .*/Current Phase: ${PHASE}/" START-HERE.md 2>/dev/null || \
            sed -i "" "s/Current Phase: .*/Current Phase: ${PHASE}/" START-HERE.md 2>/dev/null
            
            exit 0
        else
            echo -e "${RED}❌ Invalid test key for Phase ${PHASE}${NC}"
            echo "Hint: For test mode, use TEST-PHASE-${PHASE}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Phase ${PHASE} file not found${NC}"
        exit 1
    fi
fi

# Attempt to decrypt the phase file
echo -e "${YELLOW}🔐 Attempting to unlock Phase ${PHASE}...${NC}"

if openssl enc -aes-256-cbc -d -pbkdf2 \
    -in $ENCRYPTED_FILE \
    -out $DECRYPTED_FILE \
    -k "$KEY" 2>/dev/null; then
    
    echo -e "${GREEN}✅ Phase ${PHASE} successfully unlocked!${NC}"
    echo -e "${GREEN}📖 Read ${DECRYPTED_FILE} for your objectives${NC}"
    
    # Update START-HERE.md to show current phase
    sed -i "s/Current Phase: .*/Current Phase: ${PHASE}/" START-HERE.md 2>/dev/null || \
    sed -i "" "s/Current Phase: .*/Current Phase: ${PHASE}/" START-HERE.md 2>/dev/null
    
    # Update phase status in START-HERE.md
    sed -i "s/| ${PHASE} | 🔒 LOCKED |/| ${PHASE} | ✅ UNLOCKED |/" START-HERE.md 2>/dev/null || \
    sed -i "" "s/| ${PHASE} | 🔒 LOCKED |/| ${PHASE} | ✅ UNLOCKED |/" START-HERE.md 2>/dev/null
    
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Complete all tasks in ${DECRYPTED_FILE}"
    echo "2. Post completion evidence to Linear"
    echo "3. Request next phase key from Business Owner"
    
else
    echo -e "${RED}❌ Failed to unlock Phase ${PHASE}${NC}"
    echo "Possible reasons:"
    echo "- Incorrect key provided"
    echo "- Phase ${PHASE} doesn't exist"
    echo "- File corruption"
    echo ""
    echo "Please verify the key with Business Owner"
    exit 1
fi