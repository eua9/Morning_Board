# QA Quick Reference: Bank Account Features

## Quick Start Testing Guide

This guide provides quick reference for QA testers to efficiently test the Bank Account features.

---

## 🎯 What to Test

### 1. Add Account Screen (`AddAccountView`)
- **Location:** Accessible from Dashboard → "Add Account" button
- **Fields:**
  - Account Name (text field, required)
  - Account Number/API Key (text field, required)
- **Validation:** Real-time validation after first submit attempt
- **Success:** Shows alert → Returns to Dashboard → Account appears

### 2. Dashboard Widget (`BankAccountWidget`)
- **Location:** Dashboard (main screen)
- **Displays:** Account name and balance
- **Interaction:** Tap to show "Coming soon" alert
- **Empty State:** Shows "No accounts linked" message

---

## ✅ Key Test Scenarios

### Critical Path (Must Pass)
1. ✅ Add account with valid inputs → Verify appears on dashboard
2. ✅ Submit form with empty fields → Verify validation prevents submission
3. ✅ Add multiple accounts → Verify all display correctly
4. ✅ Dashboard empty state → Verify message displays correctly
5. ✅ Auto-refresh after adding account → Verify appears immediately

---

## 📋 Quick Test Checklist

### Form Validation
- [ ] Empty form → Submit disabled
- [ ] Name only → Shows "Account number is required"
- [ ] Number only → Shows "Account name is required"
- [ ] Name > 100 chars → Shows "Account name must be 100 characters or less"
- [ ] Valid inputs → Submit enabled

### Add Account Flow
- [ ] Fill valid form → Submit
- [ ] Success alert appears
- [ ] Returns to dashboard
- [ ] Account widget visible with correct name
- [ ] Balance shows "$0.00 (Test Balance)"

### Multiple Accounts
- [ ] Add first account → Appears on dashboard
- [ ] Tap "Add Another Account"
- [ ] Add second account → Both appear
- [ ] Widgets stacked correctly
- [ ] Each shows correct name and balance

### Error Handling
- [ ] Network offline → Error alert appears
- [ ] Server error → Error alert appears
- [ ] No token → Authentication error

### UI/UX
- [ ] Widget tap → Shows "Account Details" alert
- [ ] Empty state → Shows "No accounts linked" message
- [ ] Loading state → Shows "Loading accounts..." progress
- [ ] Form scrolls when keyboard appears

---

## 🔍 Implementation Details to Verify

### AddAccountView Implementation
- **Validation Logic:**
  - Account name: 1-100 characters
  - Account number: Required (any length)
  - Real-time validation after first submit attempt
- **Visual Feedback:**
  - Red border on invalid fields
  - Inline error messages
  - Submit button disabled when invalid
- **API Integration:**
  - POST /api/accounts endpoint
  - Includes Bearer token in Authorization header
  - JSON body: `{name, accountNumber}`

### BankAccountWidget Implementation
- **Display:**
  - Account name (from `BankAccount.name`)
  - Balance formatted as currency (from `BankAccount.balance`)
  - "(Test Balance)" indicator for $0.00 balances
- **Styling:**
  - Uses `AppStyle` for consistent design
  - Credit card icon (creditcard.fill)
  - Widget card styling with shadow
- **Interaction:**
  - Entire widget is tappable
  - Shows alert: "Account Details" → "Detailed account view coming soon..."

### DashboardView Implementation
- **Account Fetching:**
  - Calls GET /api/accounts on appear
  - Calls GET /api/accounts when AddAccountView dismissed
- **States:**
  - Loading: ProgressView with "Loading accounts..."
  - Empty: Message with "Add Account" button
  - With Accounts: Shows BankAccountWidget for each account

---

## 🛠️ Testing Tools

### API Verification Script
```bash
cd README/testing
export ACCESS_TOKEN="your-token-here"
./QA_TEST_EXECUTION_SCRIPT.sh
```

### Manual API Testing
```bash
# Get accounts
curl -X GET http://localhost:3000/api/accounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Add account
curl -X POST http://localhost:3000/api/accounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Account","accountNumber":"123456"}'
```

---

## 🐛 Common Issues to Watch For

### Form Issues
- Submit button doesn't disable when fields empty
- Validation errors don't clear when fields corrected
- Form allows submission with invalid data

### API Issues
- Account added but doesn't appear on dashboard
- Dashboard doesn't refresh after adding account
- Error messages not user-friendly

### UI Issues
- Widget layout broken on small screens
- Text overflow in account name
- Balance formatting incorrect
- Empty state not displaying correctly

---

## 📱 Device Testing

### Recommended Devices
- iPhone 14 Pro (Large screen)
- iPhone SE (Small screen)
- iPad (If supported)

### Screen Orientations
- Portrait (Primary)
- Landscape (If supported)

---

## 🔐 Authentication

**Important:** All API calls require authentication token.

**Token Storage:** UserDefaults (for testing)
- Key: `accessToken`
- Format: JWT Bearer token

**If Testing Without Login:**
- You may need to manually set token in app
- Or use the API verification script with a valid token

---

## 📊 Expected API Responses

### POST /api/accounts (Success)
```json
{
  "message": "Account added successfully",
  "account": {
    "accountId": "uuid",
    "name": "Account Name",
    "balance": 0.0,
    "createdAt": "2025-01-XX...",
    "updatedAt": "2025-01-XX..."
  }
}
```
**Status Code:** 201

### GET /api/accounts (Success)
```json
{
  "message": "Accounts retrieved successfully",
  "accounts": [
    {
      "accountId": "uuid",
      "name": "Account Name",
      "balance": 0.0,
      "createdAt": "2025-01-XX...",
      "updatedAt": "2025-01-XX..."
    }
  ],
  "count": 1
}
```
**Status Code:** 200

### Error Response
```json
{
  "message": "Error message",
  "error": "Detailed error description"
}
```
**Status Codes:** 400, 401, 403, 500-599

---

## ✅ Sign-off Checklist

Before signing off, verify:
- [ ] All critical path tests pass
- [ ] Form validation works correctly
- [ ] Accounts display correctly on dashboard
- [ ] Error handling is user-friendly
- [ ] No crashes or freezes
- [ ] UI is responsive and looks good
- [ ] Auto-refresh works after adding account
- [ ] Multiple accounts display correctly
- [ ] Empty state displays correctly
- [ ] Widget tap interaction works

---

## 📝 Test Data Examples

### Valid Test Data
- **Account Names:**
  - "Checking Account"
  - "Savings Account"
  - "Test Account 1"
  - "My Personal Account"
  
- **Account Numbers:**
  - "1234567890"
  - "ABC123XYZ"
  - "test-key-123"
  - "QA-TEST-001"

### Invalid Test Data (for validation testing)
- **Empty strings:** "" (both fields)
- **Very long name:** 101+ character string
- **Special characters:** "Account & Co. #1" (should work but test it)

---

## 🆘 Troubleshooting

### Issue: Account doesn't appear after adding
**Check:**
1. Verify API call succeeded (check network logs)
2. Verify GET /api/accounts returns the account
3. Verify dashboard refresh was triggered
4. Try manually refreshing (restart app)

### Issue: Form validation not working
**Check:**
1. Ensure fields are actually empty (no whitespace)
2. Try typing after initial submit attempt
3. Check console for validation errors

### Issue: Network errors not handled
**Check:**
1. Turn off network completely
2. Stop backend server
3. Verify error alerts appear

---

## 📞 Support

**For questions or issues:**
1. Check test plan: `QA_BANK_ACCOUNT_TEST_PLAN.md`
2. Review implementation in codebase
3. Use API verification script for backend checks
4. Document bugs in test results template

---

*Last Updated: 2025-01-XX*
