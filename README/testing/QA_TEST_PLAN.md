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
describe('GET /status', () => {
  it('should return { status: "OK" }', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
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

