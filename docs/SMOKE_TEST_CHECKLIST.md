# Morning Board - Smoke Test Checklist

Quick reference checklist for running smoke tests on the Morning Board application.

## Pre-Test Setup

- [ ] Backend dependencies installed (`npm install` in `backend/`)
- [ ] iOS project can be opened in Xcode
- [ ] Environment variables configured (`.env` file in backend)

## Backend API Smoke Tests

### TC-BACKEND-001: Server Startup
- [ ] Navigate to `backend/` directory
- [ ] Run `npm run dev`
- [ ] Verify server starts without errors
- [ ] Check console for "Server is running" message
- [ ] Verify database initialization message appears
- **Status**: ✅ Pass / ❌ Fail

### TC-BACKEND-002: GET /status Endpoint
- [ ] Server is running
- [ ] Execute: `curl http://localhost:3000/status`
- [ ] Verify response: `{ "status": "OK" }`
- [ ] Verify HTTP status code: 200
- [ ] Check response time < 100ms
- **Status**: ✅ Pass / ❌ Fail

### TC-BACKEND-003: Database Connection
- [ ] Server has started successfully
- [ ] Check that `backend/data/morning_board.db` exists
- [ ] Verify database tables were created
- [ ] Check console logs for database connection success
- **Status**: ✅ Pass / ❌ Fail

### TC-BACKEND-004: GET /health Endpoint
- [ ] Server is running
- [ ] Execute: `curl http://localhost:3000/health`
- [ ] Verify response includes database status
- [ ] Verify response includes timestamp
- [ ] Verify HTTP status code: 200
- **Status**: ✅ Pass / ❌ Fail

### TC-BACKEND-005: Type Checking
- [ ] Run `npm run type-check` in `backend/`
- [ ] Verify no TypeScript errors
- **Status**: ✅ Pass / ❌ Fail

### TC-BACKEND-006: Linting
- [ ] Run `npm run lint` in `backend/`
- [ ] Verify no linting errors (warnings acceptable)
- **Status**: ✅ Pass / ❌ Fail

### TC-BACKEND-007: Unit Tests
- [ ] Run `npm test` in `backend/`
- [ ] Verify all tests pass
- **Status**: ✅ Pass / ❌ Fail

## iOS App Smoke Tests

### TC-IOS-001: App Launch
- [ ] Open project in Xcode
- [ ] Select simulator or device
- [ ] Build project (⌘B)
- [ ] Run app (⌘R)
- [ ] Verify app launches without crashing
- [ ] Verify initial screen displays (currently "Hello World")
- **Status**: ✅ Pass / ❌ Fail

### TC-IOS-002: Build Success
- [ ] Open project in Xcode
- [ ] Clean build folder (⌘⇧K)
- [ ] Build project (⌘B)
- [ ] Verify build succeeds with no errors
- **Status**: ✅ Pass / ❌ Fail

## CI/CD Smoke Tests

### TC-CI-001: CI Pipeline Execution
- [ ] Create a test branch
- [ ] Make a small change (e.g., add comment)
- [ ] Commit and push
- [ ] Create PR to dev branch
- [ ] Verify GitHub Actions workflow triggers
- [ ] Monitor workflow execution
- [ ] Verify all jobs pass (lint, type-check, build, test)
- **Status**: ✅ Pass / ❌ Fail

### TC-CI-002: PR Merge Ability
- [ ] All CI checks pass
- [ ] Verify PR can be merged
- [ ] Check for merge conflicts
- **Status**: ✅ Pass / ❌ Fail

## Quick Test Script

### Backend Quick Test
```bash
cd backend
npm install
npm run type-check && npm run lint && npm test && echo "✅ All backend tests passed"
npm run dev &
sleep 3
curl http://localhost:3000/status
```

### Expected Output
```json
{"status":"OK"}
```

## Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-BACKEND-001 | | |
| TC-BACKEND-002 | | |
| TC-BACKEND-003 | | |
| TC-BACKEND-004 | | |
| TC-BACKEND-005 | | |
| TC-BACKEND-006 | | |
| TC-BACKEND-007 | | |
| TC-IOS-001 | | |
| TC-IOS-002 | | |
| TC-CI-001 | | |
| TC-CI-002 | | |

**Overall Status**: ✅ All Pass / ⚠️ Some Fail / ❌ Critical Fail

**Tester**: _________________  
**Date**: _________________  
**Build Version**: _________________  
**Environment**: _________________

---

**Note**: This checklist should be executed before every release and on major code changes.

