# QA Test Plan: Bank Account Features

## Overview

This test plan covers the Add Account workflow and Dashboard widget display for bank account functionality. Testing focuses on form validation, backend integration, and UI display correctness.

**Feature:** Add Bank Account Screen + Dashboard Widget  
**Test Date:** 2025-01-XX  
**Tester:** QA Team  
**Status:** In Progress

---

## Test Environment

### Prerequisites

- Backend server running on `http://localhost:3000`
- User must be logged in with valid access token
- iOS app built and running on simulator/device
- Network connectivity (unless testing offline scenarios)

### Test Data

- Valid account names: "Checking Account", "Savings Account", "Test Account"
- Valid account numbers: "1234567890", "ABC123", "test-key-123"
- Invalid inputs: empty strings, extremely long strings (100+ characters)

---

## Test Cases

### TC-1: Form Validation - Required Fields

**Objective:** Verify form prevents submission with missing required fields

**Test Steps:**

1. Navigate to Add Account screen
2. Leave both Account Name and Account Number fields empty
3. Attempt to submit form

**Expected Result:**

- Submit button is disabled
- Cannot submit form
- No API call is made

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-2: Form Validation - Account Name Only

**Objective:** Verify form prevents submission with only Account Name

**Test Steps:**

1. Navigate to Add Account screen
2. Enter "Test Account" in Account Name field
3. Leave Account Number field empty
4. Attempt to submit form

**Expected Result:**

- Submit button is disabled
- Cannot submit form
- Error message appears: "Account number is required"

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-3: Form Validation - Account Number Only

**Objective:** Verify form prevents submission with only Account Number

**Test Steps:**

1. Navigate to Add Account screen
2. Leave Account Name field empty
3. Enter "1234567890" in Account Number field
4. Attempt to submit form

**Expected Result:**

- Submit button is disabled
- Cannot submit form
- Error message appears: "Account name is required"

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-4: Form Validation - Extremely Long Name

**Objective:** Verify form handles very long account names

**Test Steps:**

1. Navigate to Add Account screen
2. Enter account name with 101+ characters
3. Enter valid account number
4. Attempt to submit form

**Expected Result:**

- Validation error: "Account name must be 100 characters or less"
- Form cannot be submitted
- Red border appears on name field

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-5: Form Validation - Real-time Validation

**Objective:** Verify validation updates as user types

**Test Steps:**

1. Navigate to Add Account screen
2. Enter valid account name, leave number empty
3. Start typing in Account Number field
4. Clear Account Name field
5. Observe validation behavior

**Expected Result:**

- Validation errors appear after first submit attempt
- Errors update in real-time as fields change
- Submit button enables/disables based on field states

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-6: Successful Add Flow - Single Account

**Objective:** Verify successful account addition and dashboard display

**Test Steps:**

1. Navigate to Dashboard
2. Verify no accounts are displayed (or clear existing)
3. Tap "Add Account" button
4. Enter "Test Account 1" in Account Name
5. Enter "1234567890" in Account Number
6. Submit form
7. Observe success message/alert
8. Return to Dashboard
9. Verify account appears in Bank Account widget

**Expected Result:**

- Success alert: "Account added successfully!"
- Navigation back to Dashboard
- Account widget displays: "Test Account 1 - $0.00 (Test Balance)"
- Account name and balance are correct
- Widget has proper styling and layout

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-7: Successful Add Flow - API Verification

**Objective:** Verify account is created in backend

**Test Steps:**

1. Add account via app (TC-6)
2. Verify via GET /accounts API call (using curl or Postman)
3. Check response includes the new account

**Expected Result:**

- API returns 200 OK
- Response includes account with correct name and accountNumber
- Account ID is generated
- Timestamps are present

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-8: Multiple Accounts - Add Second Account

**Objective:** Verify app handles multiple accounts correctly

**Test Steps:**

1. Ensure one account exists (from TC-6)
2. Tap "Add Another Account" button
3. Enter "Savings Account" in Account Name
4. Enter "ABC123" in Account Number
5. Submit form
6. Return to Dashboard
7. Verify both accounts are displayed

**Expected Result:**

- Both accounts appear in separate widget cards
- Each widget shows correct account name
- Widgets are properly stacked/laid out
- Both show balance (likely $0.00)

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-9: Multiple Accounts - API Verification

**Objective:** Verify GET /accounts returns all accounts

**Test Steps:**

1. After adding multiple accounts (TC-8)
2. Call GET /accounts API
3. Verify response structure

**Expected Result:**

- API returns 200 OK
- Response includes both accounts in array
- Count field shows correct number (2)
- All account data is present

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-10: Dashboard - Empty State

**Objective:** Verify empty state displays correctly

**Test Steps:**

1. Ensure no accounts exist (clear all or use fresh user)
2. Navigate to Dashboard
3. Observe empty state UI

**Expected Result:**

- Displays: "No accounts linked"
- Shows: "Add an account to get started"
- "Add Account" button is visible and functional
- Layout is clean and centered

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-11: Error Handling - Network Offline

**Objective:** Verify app handles network errors gracefully

**Test Steps:**

1. Turn off network connection (or use airplane mode)
2. Navigate to Add Account screen
3. Fill form with valid data
4. Attempt to submit
5. Observe error handling

**Expected Result:**

- Error alert appears
- Message: "Network error: [details]. Please check your connection and try again."
- Form remains accessible (can retry)
- No crash or freeze

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-12: Widget - Tap Interaction

**Objective:** Verify widget tap shows coming soon alert

**Test Steps:**

1. Ensure at least one account is displayed
2. Tap on Bank Account widget
3. Observe alert

**Expected Result:**

- Alert appears: "Account Details"
- Message: "Detailed account view coming soon..."
- OK button dismisses alert
- Widget remains visible

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

### TC-13: Auto-refresh - After Adding Account

**Objective:** Verify dashboard refreshes after adding account

**Test Steps:**

1. Navigate to Dashboard (note current state)
2. Add new account
3. Return to Dashboard
4. Verify new account appears without manual refresh

**Expected Result:**

- Dashboard automatically refreshes
- New account appears immediately
- No need to restart app or manually refresh

**Status:** ⬜ Not Tested  
**Actual Result:**  
**Notes:**

---

## Test Execution Summary

### Statistics

- **Total Test Cases:** 13
- **Passed:** 0
- **Failed:** 0
- **Blocked:** 0
- **Not Tested:** 13

### Critical Path Tests

Must pass for feature sign-off:

- ✅ TC-1: Form Validation - Required Fields
- ✅ TC-6: Successful Add Flow - Single Account
- ✅ TC-8: Multiple Accounts - Add Second Account
- ✅ TC-10: Dashboard - Empty State
- ✅ TC-13: Auto-refresh - After Adding Account

---

## Bug Log

### Bugs Found

**Bug ID:** BUG-001  
**Severity:**  
**Description:**  
**Steps to Reproduce:**  
**Expected:**  
**Actual:**  
**Status:**

---

## Sign-off Criteria

- [ ] All critical path tests pass
- [ ] No P0/P1 bugs outstanding
- [ ] Form validation works correctly
- [ ] Accounts display correctly on dashboard
- [ ] Error handling is user-friendly
- [ ] No crashes or freezes
- [ ] UI is responsive and looks good

**QA Sign-off:** ⬜ Approved / ⬜ Needs Work  
**Sign-off Date:**  
**Tester Name:**

---

## Notes

- Mock service enables reliable testing without external dependencies
- All tests can be run in test environment
- Backend logs can be checked for API verification
- Network errors can be simulated via airplane mode or server shutdown
