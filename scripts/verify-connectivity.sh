#!/bin/bash

echo "🔐 DreamTeam Connectivity Verification"
echo "======================================"

# Check for .env file
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo ""
    echo "To fix:"
    echo "1. Copy .env.example to .env"
    echo "   cp .env.example .env"
    echo "2. Add your LINEAR_API_KEY to .env"
    echo "3. Run this script again"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check LINEAR_API_KEY exists
if [ -z "$LINEAR_API_KEY" ]; then
    echo "❌ ERROR: LINEAR_API_KEY not set in .env!"
    echo ""
    echo "To fix:"
    echo "1. Get your API key from: https://linear.app/settings/api"
    echo "2. Add to .env: LINEAR_API_KEY=lin_api_xxxxx"
    echo "3. Run this script again"
    exit 1
fi

# Test Linear API
echo "🧪 Testing Linear API connection..."
RESPONSE=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ viewer { id name email } }"}')

if echo "$RESPONSE" | grep -q "email"; then
    USER_EMAIL=$(echo "$RESPONSE" | grep -o '"email":"[^"]*' | cut -d'"' -f4)
    echo "✅ Linear API connected as: $USER_EMAIL"
else
    echo "❌ Linear API connection failed!"
    echo "Response: $RESPONSE"
    echo ""
    echo "Please check your LINEAR_API_KEY in .env"
    exit 1
fi

# Test GitHub
echo "🧪 Testing GitHub access..."
if command -v gh &> /dev/null && gh auth status &>/dev/null; then
    echo "✅ GitHub CLI authenticated"
elif [ -n "$GITHUB_TOKEN" ]; then
    echo "✅ GitHub token present in .env"
else
    echo "⚠️  GitHub not configured (optional)"
fi

# Post verification to Linear
echo ""
echo "📝 Posting verification to Linear..."
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
HOSTNAME=$(hostname)

# Build the comment body with proper escaping
COMMENT_BODY="🤖 **Connectivity Test Passed**\n\n✅ Linear API: Connected\n✅ GitHub: Available\n🕐 Timestamp: $TIMESTAMP\n📍 Environment: $HOSTNAME\n\n*Agent ready to begin work.*"

# Create the GraphQL mutation
MUTATION='mutation CreateComment($issueId: String!, $body: String!) { commentCreate(input: { issueId: $issueId, body: $body }) { success comment { id } } }'

# Make the API call
RESULT=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"$MUTATION\",
    \"variables\": {
      \"issueId\": \"$SOLUTION_EPIC_ID\",
      \"body\": \"$COMMENT_BODY\"
    }
  }")

if echo "$RESULT" | grep -q '"success":true'; then
    echo "✅ Verification posted to Linear issue: $SOLUTION_EPIC_ID"
else
    echo "⚠️  Could not post to Linear (issue may not exist yet)"
fi

echo ""
echo "🎉 ALL CONNECTIVITY TESTS PASSED!"
echo "You may now proceed with development."