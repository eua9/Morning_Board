# Morning Board - QA Test Plan & Documentation

## Overview

This document outlines the Quality Assurance (QA) strategy, test coverage goals, smoke test cases, and tooling for the Morning Board application. It covers both the iOS mobile app and the backend API.

## Test Coverage Goals

### Overall Coverage Targets

- **Unit Tests**: 80% code coverage minimum
- **Integration Tests**: 60% coverage for critical paths
- **End-to-End Tests**: 40% coverage for user flows
- **Manual Testing**: 100% of new features before release

### Backend API Coverage

- **Controllers**: 90% coverage (AuthController, DashboardController)
- **Models**: 85% coverage (User model)
- **Database Operations**: 80% coverage
- **API Endpoints**: 100% endpoint coverage (all routes tested)

### iOS App Coverage

- **View Models**: 80% coverage
- **Business Logic**: 75% coverage
- **UI Components**: 70% coverage
- **Navigation Flow**: 100% coverage (all screens accessible)

## Testing Tooling

### Backend Tooling

1. **Jest** - Unit and integration testing

   - Current version: 29.7.0
   - Configuration: `jest.config.js`
   - TypeScript support via `ts-jest`

2. **ESLint** - Code quality and linting

   - Configuration: `.eslintrc.json`
   - TypeScript-specific rules enabled

3. **TypeScript Compiler** - Type checking

   - Command: `npm run type-check`
   - Catches type errors before runtime

4. **Supertest** (Recommended for future) - HTTP endpoint testing
   - For testing Express routes
   - API endpoint validation

### iOS App Tooling

1. **XCTest** - Native iOS testing framework

   - Unit tests for Swift code
   - UI tests for SwiftUI views

2. **SwiftLint** (Recommended) - Code quality

   - Swift-specific linting rules
   - Style enforcement

3. **Xcode Test Navigator** - Test execution and reporting

### CI/CD Tooling

1. **GitHub Actions** - Continuous Integration
   - Workflow file: `.github/workflows/ci.yml`
   - Runs on: Pull requests and pushes to dev branches
   - Tests: Node.js 18.x and 20.x

## Smoke Test Cases

### Purpose

Smoke tests are quick, high-level tests that verify the application's critical functionality works correctly. They should complete in under 5 minutes.

### Backend API Smoke Tests

#### Test Case 1: Server Startup

- **Priority**: Critical
- **Description**: Verify the backend server starts successfully
- **Steps**:
  1. Run `npm run dev` or `npm start`
  2. Verify server starts without errors
  3. Check console logs for "Server is running" message
  4. Verify database initializes successfully
- **Expected Result**: Server starts on port 3000 (or configured port)
- **Status**: ✅ Implemented

#### Test Case 2: GET /status Endpoint

- **Priority**: Critical
- **Description**: Verify the status endpoint returns correct response
- **Steps**:
  1. Start the server
  2. Make GET request to `http://localhost:3000/status`
  3. Verify response status code is 200
  4. Verify response body is `{ "status": "OK" }`
- **Expected Result**: Returns `{ "status": "OK" }` with 200 status
- **Automation**: Can be automated with curl or HTTP client
- **Status**: ✅ Implemented

#### Test Case 3: Database Connection

- **Priority**: Critical
- **Description**: Verify database connection and initialization
- **Steps**:
  1. Start the server
  2. Check console logs for database connection message
  3. Verify `backend/data/morning_board.db` file exists
  4. Verify tables are created (users, widgets, etc.)
- **Expected Result**: Database file exists and tables are created
- **Status**: ✅ Implemented

#### Test Case 4: GET /health Endpoint

- **Priority**: High
- **Description**: Verify health check endpoint includes database status
- **Steps**:
  1. Make GET request to `http://localhost:3000/health`
  2. Verify response includes database status
  3. Verify response includes timestamp
- **Expected Result**: Returns health status with database connectivity info
- **Status**: ✅ Implemented

### iOS App Smoke Tests

#### Test Case 5: App Launch

- **Priority**: Critical
- **Description**: Verify iOS app launches without crashing
- **Steps**:
  1. Build the app in Xcode
  2. Launch on simulator or device
  3. Verify app opens to expected screen
  4. Check for crash logs
- **Expected Result**: App launches and displays initial screen (currently "Hello World")
- **Status**: ✅ Implemented (Hello World smoke test)

#### Test Case 6: Dashboard View Display

- **Priority**: High
- **Description**: Verify DashboardView renders correctly
- **Steps**:
  1. Launch the app
  2. Navigate to DashboardView
  3. Verify UI elements render
  4. Check for layout issues
- **Expected Result**: Dashboard displays without UI errors
- **Status**: ⚠️ Partial (Hello World placeholder)

#### Test Case 7: Login View Display

- **Priority**: Medium
- **Description**: Verify LoginView renders correctly
- **Steps**:
  1. Launch the app
  2. Navigate to LoginView (if applicable)
  3. Verify form fields render
  4. Check button functionality
- **Expected Result**: Login screen displays correctly
- **Status**: ⚠️ Placeholder implementation

## Basic Test Plan

### Phase 1: Backend API Validation

#### 1.1 Server Launch Test

**Objective**: Validate backend server starts and initializes correctly

**Test Steps**:

1. Navigate to `backend/` directory
2. Install dependencies: `npm install`
3. Start server: `npm run dev`
4. Verify console output shows:
   - "🚀 Server is running on http://localhost:3000"
   - "💾 Database: sqlite initialized successfully"
   - "✅ Database initialized with X tables"

**Expected Results**:

- ✅ Server starts without errors
- ✅ Database initializes successfully
- ✅ No exceptions or crashes

**Acceptance Criteria**:

- Server responds to requests within 2 seconds of startup
- Database file is created in `backend/data/`
- All tables are created successfully

---

#### 1.2 Backend /status Endpoint Test

**Objective**: Validate the /status endpoint returns correct response

**Test Steps**:

1. Ensure server is running
2. Make HTTP GET request to `http://localhost:3000/status`
   - Using curl: `curl http://localhost:3000/status`
   - Using browser: Navigate to URL
   - Using Postman/Insomnia: Create GET request
3. Verify response

**Expected Results**:

- ✅ HTTP Status Code: 200
- ✅ Response Body: `{ "status": "OK" }`
- ✅ Content-Type: `application/json`
- ✅ Response time < 100ms

**Automated Test** (Recommended):

```javascript
// test/status.test.ts
describe("GET /status", () => {
  it('should return { status: "OK" }', async () => {
    const response = await request(app).get("/status");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "OK" });
  });
});
```

**Acceptance Criteria**:

- Endpoint responds within 100ms
- Returns exactly `{ "status": "OK" }`
- No errors in server logs

---

#### 1.3 CI Status Validation

**Objective**: Verify CI pipeline runs successfully on code changes

**Test Steps**:

1. Make a code change (e.g., add a comment)
2. Commit and push to a dev branch
3. Create a pull request to Frontend_Dev, Backend_Dev, or QA_Dev
4. Monitor GitHub Actions workflow

**Expected Results**:

- ✅ CI workflow triggers on PR
- ✅ All jobs complete successfully:
  - Lint check passes
  - Type check passes
  - Build succeeds
  - Tests pass
- ✅ PR can be merged

**Acceptance Criteria**:

- CI runs within 5 minutes
- All checks pass (green checkmarks)
- No failed jobs
- Build artifacts generated (if applicable)

---

### Phase 2: iOS App Validation

#### 2.1 App Launch Test

**Objective**: Validate iOS app launches successfully

**Test Steps**:

1. Open Xcode
2. Open the iOS project from `ios/` directory
3. Select a simulator (e.g., iPhone 15)
4. Build the project (⌘B)
5. Run the app (⌘R)
6. Observe app launch

**Expected Results**:

- ✅ App builds without errors
- ✅ App launches on simulator
- ✅ Initial screen displays (currently "Hello World")
- ✅ No crashes or exceptions

**Acceptance Criteria**:

- Build time < 2 minutes
- Launch time < 5 seconds
- No memory leaks on launch
- Console shows no critical errors

---

### Phase 3: Integration Tests

#### 3.1 Backend-Frontend Integration

**Objective**: Validate backend API can be accessed from frontend

**Test Steps**:

1. Start backend server
2. Configure iOS app to point to `http://localhost:3000`
3. Make API call to `/status` endpoint from iOS app
4. Verify response is received

**Expected Results**:

- ✅ iOS app successfully connects to backend
- ✅ API response is received
- ✅ Data is parsed correctly

**Acceptance Criteria**:

- Network request succeeds
- Response time < 500ms
- Error handling works for failed requests

---

## Test Execution Schedule

### Daily Smoke Tests

- Backend /status endpoint
- Database connection check
- CI pipeline status

### Pre-Release Testing

- Full smoke test suite
- All unit tests
- Integration tests
- Manual testing of new features

### Continuous Testing

- Automated tests on every PR
- Nightly regression tests
- Performance testing weekly

## Test Metrics & Reporting

### Coverage Metrics

- Track code coverage percentage per module
- Set coverage thresholds in CI/CD
- Generate coverage reports (Jest coverage, Xcode coverage)

### Test Execution Metrics

- Test execution time
- Pass/fail rates
- Flaky test identification

### Quality Gates

- Minimum 80% unit test coverage
- All smoke tests must pass
- Zero critical bugs before release
- CI pipeline must pass before merge

## Test Environment Setup

### Backend Environment

```bash
# Required
- Node.js 18.x or 20.x
- npm or yarn
- SQLite (included with better-sqlite3)

# Setup
cd backend
npm install
cp .env.example .env
npm run dev
```

### iOS Environment

```
# Required
- macOS
- Xcode 14.3+ (recommended 15.2+)
- iOS Simulator or physical device

# Setup
- Open ios/ directory in Xcode
- Select target device/simulator
- Build and run
```

## Known Issues & Limitations

### Current Status

- ✅ Backend /status endpoint implemented
- ✅ Database setup complete
- ✅ CI pipeline configured
- ⚠️ iOS app has Hello World placeholder
- ⚠️ Limited automated tests (1 placeholder test)
- ⚠️ No integration tests yet

### Planned Improvements

1. Add Supertest for API endpoint testing
2. Expand Jest test suite with real test cases
3. Add XCTest cases for iOS app
4. Implement end-to-end testing with Detox or similar
5. Add performance testing
6. Set up test coverage reporting

## Regression Testing

### Critical Paths (Always Test)

1. App launch (iOS)
2. Server startup (Backend)
3. /status endpoint (Backend)
4. Database initialization (Backend)
5. CI pipeline execution

### Feature-Specific Tests

- Test new features before release
- Update test cases when features change
- Maintain test documentation

## Bug Reporting Template

When reporting bugs, include:

- **Environment**: iOS version, Node.js version, etc.
- **Steps to Reproduce**: Detailed steps
- **Expected Result**: What should happen
- **Actual Result**: What actually happens
- **Screenshots/Logs**: If applicable
- **Priority**: Critical, High, Medium, Low

## References

- Backend README: `backend/README.md`
- iOS README: `ios/README.md`
- CI Workflow: `.github/workflows/ci.yml`
- Backend API Documentation: To be created

---

**Document Version**: 1.0  
**Last Updated**: 2024-11-02  
**Owner**: QA Team  
**Status**: Active

---

## Bank Account Features - QA Test Plan

### Overview

This section outlines comprehensive QA testing for the bank account features: the **Add Account workflow** and the **Dashboard widget display**. The goal is to ensure that a user can successfully add a test bank account through the app and see it reflected on their dashboard.

**Testing Context:**

- Features use a mock bank service (no external API dependencies)
- Enables early testing and faster feedback
- Tests cover input validation, backend integration, and UI display

---

### Test Scope

**Features Under Test:**

1. Add Bank Account Screen (`AddAccountView`)

   - Form fields (Account Name, Account Number)
   - Input validation
   - Submit functionality
   - API integration (`POST /api/accounts`)

2. Dashboard Bank Account Widget (`BankAccountWidget`)

   - Display of account information
   - Multiple accounts display
   - Widget interaction (tap gesture)
   - API integration (`GET /api/accounts`)

3. Integration Flow
   - Adding account → Dashboard update
   - Data persistence
   - State management

---

## Test Cases

### TC-1: Successful Account Creation (Happy Path)

**Objective:** Verify that a user can successfully add a bank account with valid data.

**Preconditions:**

- User is logged in (or authenticated state)
- Backend server is running on `http://localhost:3000`
- User has no existing accounts (fresh state)

**Test Steps:**

1. Launch the iOS app in simulator
2. Navigate to Dashboard
3. Tap "Add Account" button (or empty state prompt)
4. Enter valid account details:
   - Account Name: `"Test Checking Account"`
   - Account Number: `"1234567890"`
5. Tap "Add Account" submit button
6. Observe app behavior

**Expected Results:**

- ✅ Form accepts input without errors
- ✅ Submit button becomes enabled when fields are filled
- ✅ Loading indicator appears during submission
- ✅ Success alert/message appears: "Account added successfully"
- ✅ User is navigated back to Dashboard (or sheet dismisses)
- ✅ Dashboard displays new Bank Account widget with:
  - Account name: "Test Checking Account"
  - Balance: "$0.00 (Test Balance)" or similar placeholder
- ✅ Backend API receives `POST /api/accounts` request
- ✅ Backend returns HTTP 201 with account data
- ✅ Database contains the new account record

**Pass/Fail Criteria:** All expected results must pass.

---

### TC-2: Form Validation - Empty Fields

**Objective:** Verify that the form prevents submission when required fields are empty.

**Test Steps:**

1. Navigate to Add Account screen
2. Leave both Account Name and Account Number fields empty
3. Attempt to tap "Add Account" button

**Expected Results:**

- ✅ Submit button is disabled when fields are empty
- ✅ No API call is made
- ✅ User remains on Add Account screen

**Additional Test:** 4. Enter only Account Name, leave Account Number empty 5. Attempt to submit

**Expected Results:**

- ✅ Validation error appears: "Account number is required"
- ✅ Field is highlighted with error styling (red border)
- ✅ Submit button remains disabled
- ✅ No API call is made

**Additional Test:** 6. Clear Account Name, enter only Account Number 7. Attempt to submit

**Expected Results:**

- ✅ Validation error appears: "Account name is required"
- ✅ Field is highlighted with error styling
- ✅ Submit button remains disabled
- ✅ No API call is made

**Pass/Fail Criteria:** All validation checks must prevent submission.

---

### TC-3: Form Validation - Field Length Limits

**Objective:** Verify that the form handles extremely long input values correctly.

**Test Steps:**

1. Navigate to Add Account screen
2. Enter extremely long Account Name:
   - Type or paste a very long string (200+ characters)
   - Example: Type the letter "A" 200 times, or paste: `AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`
   - Or use any long text string from a text editor
3. Enter valid Account Number
4. Attempt to submit

**Expected Results:**

- ✅ Account Name field accepts input (or truncates at max length)
- ✅ If max length exists (e.g., 100 characters):
  - Validation error: "Account name must be 100 characters or less"
  - Error appears after attempting submit
- ✅ If no max length: Accepts and submits (verify backend handles it)
- ✅ UI remains responsive (no layout issues)

**Additional Test:** 5. Enter valid Account Name 6. Enter extremely long Account Number (200+ characters):

- Type or paste a very long string (200+ characters)
- Example: Type the letter "1" 200 times, or paste a long numeric string

7. Attempt to submit

**Expected Results:**

- ✅ Account Number field handles long input appropriately
- ✅ No UI layout breaking or scrolling issues
- ✅ Form validation works correctly

**Pass/Fail Criteria:** Form handles long inputs gracefully without UI breaking.

---

### TC-4: Form Validation - Whitespace Handling

**Objective:** Verify that leading/trailing whitespace is handled correctly.

**Test Steps:**

1. Navigate to Add Account screen
2. Enter Account Name with leading/trailing spaces: `"  Test Account  "`
3. Enter Account Number with spaces: `"  1234567890  "`
4. Submit the form

**Expected Results:**

- ✅ Form trims whitespace before validation and submission
- ✅ API receives trimmed values: `"Test Account"` and `"1234567890"`
- ✅ Dashboard displays trimmed account name

**Pass/Fail Criteria:** Whitespace is trimmed from inputs.

---

### TC-5: Multiple Accounts Display

**Objective:** Verify that the dashboard correctly displays multiple bank accounts.

**Preconditions:**

- User has no existing accounts

**Test Steps:**

1. Add first account:
   - Account Name: `"Checking Account"`
   - Account Number: `"1111111111"`
2. Verify first account appears on Dashboard
3. Tap "Add Another Account" button
4. Add second account:
   - Account Name: `"Savings Account"`
   - Account Number: `"2222222222"`
5. Observe Dashboard after second account is added

**Expected Results:**

- ✅ Dashboard displays both accounts as separate widgets
- ✅ Each widget shows correct account name:
  - Widget 1: "Checking Account"
  - Widget 2: "Savings Account"
- ✅ Each widget displays balance (likely $0.00 for both)
- ✅ Widgets are stacked vertically or laid out appropriately
- ✅ No UI overlap or layout issues
- ✅ `GET /api/accounts` returns both accounts in response

**Additional Test:** 6. Verify backend API returns both accounts:

- Use curl or API testing tool:
  ```bash
  curl -H "Authorization: Bearer <token>" http://localhost:3000/api/accounts
  ```
- Response should contain 2 accounts

**Expected Results:**

- ✅ Backend returns array with 2 accounts
- ✅ Each account has unique `accountId`
- ✅ Account names match what was entered

**Pass/Fail Criteria:** All accounts display correctly on dashboard and backend returns all accounts.

---

### TC-6: Duplicate Account Names

**Objective:** Verify behavior when adding accounts with duplicate names (if allowed).

**Test Steps:**

1. Add first account:
   - Account Name: `"My Account"`
   - Account Number: `"1111111111"`
2. Add second account:
   - Account Name: `"My Account"` (same name)
   - Account Number: `"2222222222"` (different number)
3. Observe behavior

**Expected Results:**

- ✅ If duplicate names are allowed:
  - Both accounts are created successfully
  - Both appear on dashboard (may need differentiation by account number or ID)
- ✅ If duplicate names are not allowed:
  - Backend returns error (e.g., HTTP 400)
  - Error message is displayed to user
  - Second account is not created

**Pass/Fail Criteria:** App handles duplicate names appropriately (based on backend logic).

---

### TC-7: Error Handling - Network Failure

**Objective:** Verify that the app handles network errors gracefully.

**Test Steps:**

1. Ensure backend server is running
2. Navigate to Add Account screen
3. Fill in valid account details
4. **Disconnect network** (turn off Wi-Fi, or use Network Link Conditioner)
5. Attempt to submit the form

**Expected Results:**

- ✅ App detects network failure
- ✅ Error message is displayed to user:
  - Message: "Network error. Please check your connection and try again."
  - Or: "Unable to connect to server."
- ✅ User remains on Add Account screen (not navigated away)
- ✅ Form data is preserved (user can retry after reconnecting)
- ✅ No app crash or unhandled exception

**Additional Test:** 6. Reconnect network 7. Submit the form again

**Expected Results:**

- ✅ Account is created successfully after network reconnects
- ✅ Success message appears
- ✅ Account appears on dashboard

**Pass/Fail Criteria:** App handles network errors gracefully with clear user feedback.

---

### TC-8: Error Handling - Backend Server Down

**Objective:** Verify behavior when backend server is unavailable.

**Test Steps:**

1. Stop the backend server (or kill the process)
2. Navigate to Add Account screen
3. Fill in valid account details
4. Attempt to submit

**Expected Results:**

- ✅ App detects server connection failure
- ✅ Error message displayed: "Server unavailable. Please try again later."
- ✅ Error message is user-friendly (not technical error details)
- ✅ User can dismiss error and retry
- ✅ No app crash

**Additional Test:** 5. Restart backend server 6. Retry submission

**Expected Results:**

- ✅ Account creation succeeds after server restart
- ✅ Account appears on dashboard

**Pass/Fail Criteria:** App handles server unavailability gracefully.

---

### TC-9: Error Handling - Invalid API Response

**Objective:** Verify behavior when backend returns unexpected error responses.

**Test Steps:**

1. (This may require backend modification or mocking)
2. Navigate to Add Account screen
3. Fill in account details that might trigger backend validation error
4. Submit form

**Test Scenarios:**

- Backend returns HTTP 400 (Bad Request)
- Backend returns HTTP 401 (Unauthorized)
- Backend returns HTTP 500 (Internal Server Error)

**Expected Results:**

- ✅ HTTP 400: Error message displayed (e.g., "Invalid account details")
- ✅ HTTP 401: Error message about authentication (may redirect to login)
- ✅ HTTP 500: Generic error message (e.g., "Server error. Please try again.")
- ✅ Error messages are user-friendly
- ✅ User can dismiss and retry

**Pass/Fail Criteria:** App handles various HTTP error codes appropriately.

---

### TC-10: Dashboard Widget Interaction

**Objective:** Verify that tapping on a bank account widget shows appropriate feedback.

**Test Steps:**

1. Ensure at least one account exists on Dashboard
2. Locate a Bank Account widget
3. Tap on the widget

**Expected Results:**

- ✅ Alert/modal appears with message:
  - Title: "Account Details"
  - Message: "Detailed account view coming soon. This will show transaction history and more details."
- ✅ User can dismiss the alert
- ✅ No navigation to a non-existent detail screen
- ✅ No app crash

**Pass/Fail Criteria:** Widget interaction works as designed (placeholder for future feature).

---

### TC-11: Dashboard Refresh After Adding Account

**Objective:** Verify that dashboard automatically refreshes when returning from Add Account screen.

**Test Steps:**

1. Start with empty dashboard (no accounts)
2. Add an account via Add Account screen
3. Dismiss/save the account (navigate back to Dashboard)
4. Observe Dashboard

**Expected Results:**

- ✅ Dashboard automatically calls `GET /api/accounts` on return
- ✅ New account appears immediately (no manual refresh needed)
- ✅ No need to restart app to see new account

**Pass/Fail Criteria:** Dashboard updates automatically after adding account.

---

### TC-12: Empty State Handling

**Objective:** Verify dashboard behavior when user has no accounts.

**Test Steps:**

1. Start with fresh user (no accounts in database)
2. Navigate to Dashboard
3. Observe empty state

**Expected Results:**

- ✅ Dashboard displays empty state message:
  - "No accounts linked" or similar
  - "Add an account to get started" or prompt to add account
- ✅ "Add Account" button or link is visible
- ✅ Tapping "Add Account" navigates to Add Account screen

**Pass/Fail Criteria:** Empty state is clear and actionable.

---

### TC-13: Data Persistence

**Objective:** Verify that accounts persist across app sessions.

**Test Steps:**

1. Add one or more accounts
2. Verify accounts appear on dashboard
3. **Force quit the app** (swipe up in app switcher, or stop in Xcode)
4. Reopen the app
5. Navigate to Dashboard

**Expected Results:**

- ✅ Previously added accounts still appear on dashboard
- ✅ Account names and balances are correct
- ✅ Data was persisted in backend database
- ✅ `GET /api/accounts` returns the persisted accounts

**Pass/Fail Criteria:** Accounts persist across app restarts.

---

### TC-14: API Request/Response Verification

**Objective:** Verify that API requests and responses are correctly formatted.

**Test Steps:**

1. Use network inspection tool (Charles Proxy, Xcode Network Inspector, or backend logs)
2. Add an account with:
   - Account Name: `"API Test Account"`
   - Account Number: `"9999999999"`
3. Inspect the `POST /api/accounts` request

**Expected Request:**

```json
POST /api/accounts
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "name": "API Test Account",
  "accountNumber": "9999999999"
}
```

**Expected Response:**

```json
HTTP 201 Created
{
  "message": "Account created successfully",
  "account": {
    "accountId": "<uuid>",
    "name": "API Test Account",
    "balance": 0.0,
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
  }
}
```

**Expected Results:**

- ✅ Request uses correct HTTP method (POST)
- ✅ Request includes Authorization header with Bearer token
- ✅ Request body uses camelCase (not snake_case)
- ✅ Response status code is 201
- ✅ Response body matches expected structure
- ✅ Account data in response matches what was submitted

**Pass/Fail Criteria:** API requests and responses match expected format.

---

### TC-15: Concurrent Account Additions

**Objective:** Verify behavior when multiple accounts are added in quick succession.

**Test Steps:**

1. Add first account
2. Immediately add second account (without waiting for first to complete)
3. Add third account immediately after

**Expected Results:**

- ✅ All accounts are created successfully
- ✅ All accounts appear on dashboard
- ✅ No race conditions or duplicate entries
- ✅ Backend handles concurrent requests correctly

**Pass/Fail Criteria:** App handles rapid sequential account additions correctly.

---

## Regression Testing

### RT-1: Dashboard Other Widgets

**Objective:** Ensure bank account feature doesn't break existing dashboard functionality.

**Test Steps:**

1. Verify other widgets (Weather, Slack, Canvas, CRM) still display correctly
2. Verify dashboard layout is not broken
3. Verify scrolling works properly with bank account widgets added

**Expected Results:**

- ✅ Other widgets continue to function
- ✅ Layout remains responsive
- ✅ No visual regressions

---

### RT-2: Different Device Sizes

**Objective:** Verify UI works on different iPhone screen sizes.

**Test Steps:**

1. Test on iPhone SE (small screen)
2. Test on iPhone 14 Pro (standard screen)
3. Test on iPhone 14 Pro Max (large screen)

**Expected Results:**

- ✅ Add Account form is fully visible and usable
- ✅ Bank Account widgets display correctly
- ✅ No layout issues or text truncation
- ✅ All buttons are tappable

---

### RT-3: Orientation (if applicable)

**Objective:** Verify app works in both portrait and landscape (if supported).

**Test Steps:**

1. Rotate device to landscape
2. Test Add Account flow
3. Test Dashboard display

**Expected Results:**

- ✅ UI adapts to orientation changes
- ✅ Forms remain usable
- ✅ No layout breaking

---

## Test Execution Checklist

Use this checklist to track test execution:

### Functional Tests

- [ ] TC-1: Successful Account Creation
- [ ] TC-2: Form Validation - Empty Fields
- [ ] TC-3: Form Validation - Field Length Limits
- [ ] TC-4: Form Validation - Whitespace Handling
- [ ] TC-5: Multiple Accounts Display
- [ ] TC-6: Duplicate Account Names
- [ ] TC-7: Error Handling - Network Failure
- [ ] TC-8: Error Handling - Backend Server Down
- [ ] TC-9: Error Handling - Invalid API Response
- [ ] TC-10: Dashboard Widget Interaction
- [ ] TC-11: Dashboard Refresh After Adding Account
- [ ] TC-12: Empty State Handling
- [ ] TC-13: Data Persistence
- [ ] TC-14: API Request/Response Verification
- [ ] TC-15: Concurrent Account Additions

### Regression Tests

- [ ] RT-1: Dashboard Other Widgets
- [ ] RT-2: Different Device Sizes
- [ ] RT-3: Orientation (if applicable)

---

## Bug Reporting Template

When logging bugs, use this template:

```markdown
**Bug ID:** [Auto-generated or manual ID]

**Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Component:** Add Account Screen / Dashboard Widget / API Integration

**Steps to Reproduce:**

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Screenshots/Videos:**
[Attach if applicable]

**Device/OS:**

- Device: [e.g., iPhone 14 Pro Simulator]
- iOS Version: [e.g., iOS 17.0]

**Backend Logs:**
[If relevant, paste backend error logs]

**Additional Notes:**
[Any other relevant information]
```

---

## Sign-off Criteria

**All of the following must pass for feature sign-off:**

1. ✅ **Critical Path:** User can successfully add an account and see it on dashboard (TC-1)
2. ✅ **Validation:** Form validation prevents invalid submissions (TC-2, TC-3, TC-4)
3. ✅ **Multiple Accounts:** Multiple accounts display correctly (TC-5)
4. ✅ **Error Handling:** App handles network/server errors gracefully (TC-7, TC-8, TC-9)
5. ✅ **Data Persistence:** Accounts persist across app restarts (TC-13)
6. ✅ **API Integration:** API requests/responses are correctly formatted (TC-14)
7. ✅ **No Regressions:** Existing dashboard functionality is unaffected (RT-1, RT-2)
8. ✅ **User Experience:** Empty states and interactions work as designed (TC-10, TC-11, TC-12)

**Sign-off Approval:**

- QA Tester: **\*\*\*\***\_**\*\*\*\*** Date: **\_\_\_\_**
- Developer Review: **\*\*\*\***\_**\*\*\*\*** Date: **\_\_\_\_**
- Product Owner: **\*\*\*\***\_**\*\*\*\*** Date: **\_\_\_\_**

---

## Test Environment Setup

### Prerequisites

1. **Backend Server:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   - Server should run on `http://localhost:3000`
   - Verify with: `curl http://localhost:3000/health`

2. **iOS App:**

   - Open Xcode project
   - Select iOS Simulator (iPhone 14 Pro recommended)
   - Build and run (`⌘ + R`)

3. **Authentication:**
   - Ensure user is logged in (or authentication is bypassed for testing)
   - Auth token should be stored in app

### Test Data

**Standard Test Accounts:**

- Account Name: `"Test Checking Account"`, Number: `"1234567890"`
- Account Name: `"Savings Account"`, Number: `"0987654321"`
- Account Name: `"Business Account"`, Number: `"5555555555"`

**Quick Reference:** See `QA_TEST_DATA.md` for ready-to-copy test data strings, including long strings for validation testing (200+ characters).

### Tools

- **Xcode Simulator:** For iOS app testing
- **Charles Proxy / Network Inspector:** For API monitoring (optional)
- **Postman / curl:** For backend API verification
- **Backend Logs:** Check terminal output for API requests

---

## Notes

- **Mock Service:** Since this uses a mock bank service, testing can proceed without external API dependencies.
- **Future Enhancements:** Some features (like detailed account view) are placeholders for future development.
- **Backend Verification:** For comprehensive testing, verify backend database and API responses directly.
- **Test Iterations:** Re-run critical tests after bug fixes to ensure regressions are not introduced.

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Test Plan Owner:** QA Team  
**Reviewed By:** [Name]
