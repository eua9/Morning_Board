#!/bin/bash
# get-test-token.sh - Quick script to get test authentication token

echo "🔑 Getting test token for QA..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@morningboard.com","password":"TestPassword123!"}')

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

echo ""
echo "✅ Copy the 'token' value (access token) above"
echo "📝 Use this token in the iOS app for testing"
