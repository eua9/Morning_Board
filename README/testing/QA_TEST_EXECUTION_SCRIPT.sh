#!/bin/bash

# QA Test Execution Helper Script
# This script helps verify backend API endpoints for bank account testing

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     QA Bank Account Feature - API Verification Script         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:3000"
API_ENDPOINT="/api/accounts"

# Check if ACCESS_TOKEN is provided
if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ ERROR: ACCESS_TOKEN environment variable is required"
    echo ""
    echo "Usage:"
    echo "  export ACCESS_TOKEN='your-token-here'"
    echo "  ./QA_TEST_EXECUTION_SCRIPT.sh"
    echo ""
    echo "To get a token, login via the app or use:"
    echo "  curl -X POST $BASE_URL/api/auth/login \\"
    echo "    -H 'Content-Type: application/json' \\"
    echo "    -d '{\"email\":\"testuser\",\"password\":\"TestPassword123!\"}'"
    exit 1
fi

echo "📋 Testing Bank Account API Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: GET Accounts (should return list or empty array)
echo "Test 1: GET /api/accounts - Retrieve all accounts"
echo "─────────────────────────────────────────────────────────────────"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$API_ENDPOINT" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "HTTP Status: $http_code"
echo "Response:"
echo "$body" | jq '.' 2>/dev/null || echo "$body"
echo ""

if [ "$http_code" == "200" ]; then
    echo "✅ GET /api/accounts - PASSED"
    account_count=$(echo "$body" | jq '.count // 0' 2>/dev/null || echo "0")
    echo "   Accounts found: $account_count"
else
    echo "❌ GET /api/accounts - FAILED"
fi
echo ""

# Test 2: POST Account (add a test account)
echo "Test 2: POST /api/accounts - Add new account"
echo "─────────────────────────────────────────────────────────────────"
test_account_name="QA Test Account $(date +%s)"
test_account_number="QA-TEST-$(date +%s)"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$API_ENDPOINT" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$test_account_name\",
    \"accountNumber\": \"$test_account_number\"
  }")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "HTTP Status: $http_code"
echo "Response:"
echo "$body" | jq '.' 2>/dev/null || echo "$body"
echo ""

if [ "$http_code" == "201" ]; then
    echo "✅ POST /api/accounts - PASSED"
    account_id=$(echo "$body" | jq -r '.account.accountId' 2>/dev/null || echo "")
    echo "   Account ID: $account_id"
    echo "   Account Name: $test_account_name"
    
    # Verify account appears in GET request
    echo ""
    echo "Verifying account appears in GET request..."
    verify_response=$(curl -s -X GET "$BASE_URL$API_ENDPOINT" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    found=$(echo "$verify_response" | jq ".accounts[] | select(.name == \"$test_account_name\")" 2>/dev/null)
    
    if [ -n "$found" ]; then
        echo "✅ Account verification - PASSED (account found in list)"
    else
        echo "⚠️  Account verification - WARNING (account not immediately found)"
    fi
else
    echo "❌ POST /api/accounts - FAILED"
fi
echo ""

# Test 3: GET Accounts again (should include new account)
echo "Test 3: GET /api/accounts - Verify account list updated"
echo "─────────────────────────────────────────────────────────────────"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$API_ENDPOINT" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "HTTP Status: $http_code"
account_count=$(echo "$body" | jq '.count // 0' 2>/dev/null || echo "0")
echo "Total accounts: $account_count"

if [ "$account_count" -gt 0 ]; then
    echo "Accounts:"
    echo "$body" | jq '.accounts[] | {name: .name, balance: .balance, accountId: .accountId}' 2>/dev/null || echo "$body"
    echo "✅ Account list retrieved successfully"
else
    echo "⚠️  No accounts found (this is OK if starting fresh)"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Use these results to verify app functionality matches API"
echo "✅ Test account created: $test_account_name"
echo "✅ Verify this account appears in the iOS app dashboard"
echo ""
echo "To clean up test account, use DELETE endpoint:"
echo "  curl -X DELETE \"$BASE_URL$API_ENDPOINT/<account-id>\" \\"
echo "    -H \"Authorization: Bearer $ACCESS_TOKEN\""
echo ""
