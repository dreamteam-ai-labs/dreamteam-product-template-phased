#!/bin/bash

# Setup script for new DreamTeam projects
# Run this after cloning the repository

echo "🚀 DreamTeam Project Setup"
echo "=========================="
echo ""

# Step 1: Check if .env exists
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "📝 Creating .env from .env.example..."
        cp .env.example .env
        echo "✅ Created .env file"
        echo ""
        echo "⚠️  IMPORTANT: Edit .env and add your LINEAR_API_KEY"
        echo "   Get it from: https://linear.app/settings/api"
        echo ""
    else
        echo "❌ No .env.example found!"
        exit 1
    fi
else
    echo "✅ .env file already exists"
fi

# Step 2: Install npm dependencies
echo ""
echo "📦 Installing dependencies..."
if [ -f package.json ]; then
    npm install
    echo "✅ Dependencies installed"
else
    echo "❌ No package.json found!"
    exit 1
fi

# Step 3: Provide instructions
echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Edit .env and add your LINEAR_API_KEY"
echo "2. Run: npm run verify"
echo "3. Follow instructions in phase-0-foundation.md"
echo ""
echo "For issues, check README.md or post in Linear."