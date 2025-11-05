#!/bin/bash
# get-test-token.sh
# Helper script to get a fresh authentication token for QA testing

echo "🔑 Getting test token for QA..."
echo ""
echo "📋 Test User Credentials:"
echo "   Email: test@morningboard.com"
echo "   Password: TestPassword123!"
echo ""

# Check if server is running
if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "❌ Error: Backend server is not running!"
    echo "   Please start the server first:"
    echo "   cd backend && npm run dev"
    echo ""
    exit 1
fi

echo "✅ Server is running"
echo ""

# Get token
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@morningboard.com","password":"TestPassword123!"}')

# Check if request succeeded
if echo "$RESPONSE" | grep -q '"token"'; then
    # Extract token using Python (more reliable than grep/sed for JSON)
    TOKEN=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Error: Could not extract token from response"
        echo ""
        echo "Response:"
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
        exit 1
    fi
    
    echo "✅ Token retrieved successfully!"
    echo ""
    echo "📝 Access Token (copy this value):"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$TOKEN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 To update DashboardView.swift:"
    echo "   1. Open: ios/MorningBoard/Views/DashboardView.swift"
    echo "   2. Find: TokenStorage.saveAccessToken(\"...\")"
    echo "   3. Replace the token string with the token above"
    echo ""
    
    # Decode token to show expiration
    PAYLOAD=$(echo "$TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null)
    if [ ! -z "$PAYLOAD" ]; then
        EXP=$(echo "$PAYLOAD" | python3 -c "import sys, json; print(json.load(sys.stdin).get('exp', 'N/A'))" 2>/dev/null)
        if [ "$EXP" != "N/A" ] && [ ! -z "$EXP" ]; then
            EXP_DATE=$(date -r "$EXP" 2>/dev/null || date -d "@$EXP" 2>/dev/null || echo "Unknown")
            echo "⏰ Token expires: $EXP_DATE (Unix timestamp: $EXP)"
            echo ""
        fi
    fi
else
    echo "❌ Error: Login failed"
    echo ""
    echo "Response:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    echo ""
    exit 1
fi
