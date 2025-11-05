# Manual Test Guide for Login Endpoint

This guide provides step-by-step instructions for manually testing the login endpoint using curl or Postman.

## Prerequisites

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   Server should be running on `http://localhost:3000`

2. **Ensure test user exists:**
   ```bash
   cd backend
   npm run seed
   ```
   Test credentials:
   - Username: `testuser`
   - Email: `test@morningboard.com`
   - Password: `TestPassword123!`

## Test Cases

### Test 1: Valid Login (Email)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@morningboard.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
- Status: `200 OK`
- Body: Contains `token`, `refreshToken`, `expiresIn`, and `user` object
- Token format: JWT (3 parts separated by dots)

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "email": "test@morningboard.com",
    "password": "TestPassword123!"
  }
  ```

---

### Test 2: Valid Login (Username)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
- Status: `200 OK`
- Body: Same as Test 1 (works with username instead of email)

---

### Test 3: Invalid Password

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@morningboard.com",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
- Status: `401 Unauthorized`
- Body:
  ```json
  {
    "message": "Login failed",
    "error": "Invalid password"
  }
  ```

---

### Test 4: Non-existent User

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
- Status: `401 Unauthorized`
- Body:
  ```json
  {
    "message": "Login failed",
    "error": "User not found"
  }
  ```

---

### Test 5: Missing Email Field

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
- Status: `400 Bad Request`
- Body:
  ```json
  {
    "message": "Login failed",
    "error": "Username/email and password are required"
  }
  ```

---

### Test 6: Missing Password Field

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@morningboard.com"
  }'
```

**Expected Response:**
- Status: `400 Bad Request`
- Body: Same error as Test 5

---

### Test 7: Empty Request Body

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
- Status: `400 Bad Request`
- Body: Same error as Test 5

---

### Test 8: Invalid Input Types

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": 12345,
    "password": true
  }'
```

**Expected Response:**
- Status: `400 Bad Request`
- Body:
  ```json
  {
    "message": "Login failed",
    "error": "Invalid input format"
  }
  ```

---

### Test 9: Network Failure Simulation (Server Offline)

**Scenario:** Stop the backend server, then try to make a request.

**Request:**
```bash
# Stop server first, then:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@morningboard.com",
    "password": "TestPassword123!"
  }' \
  --max-time 5
```

**Expected Response:**
- Connection refused or timeout
- No response from server

**Frontend Handling:**
The frontend should detect network errors and show appropriate error messages.

---

### Test 10: Malformed JSON

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@morningboard.com", "password": "test123"'
```

**Expected Response:**
- Status: `400 Bad Request`
- JSON parse error

---

## Verification Checklist

### Token Verification
- [ ] Token is received in response
- [ ] Token is in JWT format (3 parts: header.payload.signature)
- [ ] Token can be decoded to verify payload structure
- [ ] Token contains userId, email, username
- [ ] Token has expiration timestamp

### Password Hashing
- [ ] Check database: password is hashed (starts with `$2b$10$`)
- [ ] Password hash is ~60 characters long
- [ ] Login works with plain password (hashing comparison works)
- [ ] Wrong password is rejected

### Error Handling
- [ ] Invalid credentials return 401
- [ ] Missing fields return 400
- [ ] Error messages are user-friendly
- [ ] No sensitive data exposed in errors

### Response Format
- [ ] Success response includes: message, user, token, refreshToken, expiresIn
- [ ] Error response includes: message, error
- [ ] Password never returned in response

## Automated Test Results

Run automated tests:
```bash
cd backend
npm test -- src/__tests__/auth.test.ts
```

**Expected:** All 17 tests pass:
- 2 valid credential tests
- 4 invalid credential tests
- 4 missing input tests
- 2 password hashing verification tests
- 2 response format tests
- 3 edge case tests

---

## Test Environment

- **Backend URL:** `http://localhost:3000`
- **Test Database:** `data/test_morning_board.db` (for automated tests)
- **Development Database:** `data/morning_board.db` (for manual tests)

## Notes

- Tests use a separate test database to avoid affecting development data
- JWT tokens are valid for 7 days by default
- Password hashing uses bcrypt with 10 salt rounds
- All sensitive data is excluded from API responses

