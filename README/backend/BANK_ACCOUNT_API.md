# Bank Account API Documentation

## Overview

The Bank Account API provides REST endpoints for managing user bank accounts. All endpoints require authentication via Bearer token in the Authorization header.

**Base URL:** `/api/accounts`

**Authentication:** All endpoints require a valid JWT access token.

---

## Endpoints

### GET /api/accounts

Retrieve all bank accounts for the authenticated user.

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
- **Status:** `200 OK`
- **Body:**
```json
{
  "message": "Accounts retrieved successfully",
  "accounts": [
    {
      "accountId": "mock-account-1234567890-abc123",
      "name": "Checking Account",
      "balance": 1234.56,
      "createdAt": "2025-11-03T12:00:00.000Z",
      "updatedAt": "2025-11-03T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Empty Response:**
```json
{
  "message": "Accounts retrieved successfully",
  "accounts": [],
  "count": 0
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token
- `500 Internal Server Error` - Server error

**Example (curl):**
```bash
curl -X GET http://localhost:3000/api/accounts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### POST /api/accounts

Add a new bank account for the authenticated user.

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Checking Account",
  "accountNumber": "1234567890",      // Optional, for mock service
  "initialBalance": 0.00,              // Optional, defaults to 0.00
  "accountType": "Checking"            // Optional
}
```

**Required Fields:**
- `name` (string) - Account display name (1-100 characters)

**Optional Fields:**
- `accountNumber` (string) - Account number (not validated in mock service)
- `initialBalance` (number) - Initial balance (defaults to 0.00)
- `accountType` (string) - Account type (e.g., "Checking", "Savings")

**Response:**
- **Status:** `201 Created`
- **Body:**
```json
{
  "message": "Account added successfully",
  "account": {
    "accountId": "mock-account-1234567890-abc123",
    "name": "Checking Account",
    "balance": 0.00,
    "createdAt": "2025-11-03T12:00:00.000Z",
    "updatedAt": "2025-11-03T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error (missing/invalid fields)
- `401 Unauthorized` - No token or invalid token
- `500 Internal Server Error` - Server error

**Validation Errors:**
```json
{
  "message": "Validation failed",
  "error": "Account name is required and must be a non-empty string"
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Checking Account",
    "initialBalance": 100.00
  }'
```

---

### GET /api/accounts/:accountId

Get a specific account by ID.

**Authentication:** Required

**URL Parameters:**
- `accountId` (string) - Account ID

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
- **Status:** `200 OK`
- **Body:**
```json
{
  "message": "Account retrieved successfully",
  "account": {
    "accountId": "mock-account-1234567890-abc123",
    "name": "Checking Account",
    "balance": 1234.56,
    "createdAt": "2025-11-03T12:00:00.000Z",
    "updatedAt": "2025-11-03T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing accountId
- `401 Unauthorized` - No token or invalid token
- `403 Forbidden` - Account belongs to different user
- `404 Not Found` - Account not found
- `500 Internal Server Error` - Server error

**Example (curl):**
```bash
curl -X GET http://localhost:3000/api/accounts/mock-account-1234567890-abc123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### DELETE /api/accounts/:accountId

Delete a specific account.

**Authentication:** Required

**URL Parameters:**
- `accountId` (string) - Account ID

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
- **Status:** `200 OK`
- **Body:**
```json
{
  "message": "Account deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Missing accountId
- `401 Unauthorized` - No token or invalid token
- `403 Forbidden` - Account belongs to different user
- `404 Not Found` - Account not found
- `500 Internal Server Error` - Server error

**Example (curl):**
```bash
curl -X DELETE http://localhost:3000/api/accounts/mock-account-1234567890-abc123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Authentication

All endpoints require authentication via JWT Bearer token.

### Getting an Access Token

1. **Login** to get an access token:
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-id-123",
    "email": "user@example.com",
    "username": "username"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 604800
}
```

2. **Use the access token** in subsequent requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Complete Workflow Example

### 1. Login to get token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser",
    "password": "TestPassword123!"
  }'
```

### 2. Get all accounts
```bash
curl -X GET http://localhost:3000/api/accounts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Add a new account
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Savings Account",
    "initialBalance": 5000.00
  }'
```

### 4. Get specific account
```bash
curl -X GET http://localhost:3000/api/accounts/mock-account-1234567890-abc123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Delete account
```bash
curl -X DELETE http://localhost:3000/api/accounts/mock-account-1234567890-abc123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "message": "Authentication required",
  "error": "No token provided. Please include a Bearer token in the Authorization header."
}
```

**400 Bad Request:**
```json
{
  "message": "Validation failed",
  "error": "Account name is required and must be a non-empty string"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied",
  "error": "You do not have permission to access this account"
}
```

**404 Not Found:**
```json
{
  "message": "Account not found",
  "error": "The specified account does not exist"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Failed to retrieve accounts",
  "error": "Error message"
}
```

---

## Testing with Postman

### Setup

1. **Create a new request** for each endpoint
2. **Set Authorization:**
   - Type: Bearer Token
   - Token: `<your_access_token>`

### Collection

**GET All Accounts:**
- Method: GET
- URL: `http://localhost:3000/api/accounts`
- Headers: `Authorization: Bearer <token>`

**POST Add Account:**
- Method: POST
- URL: `http://localhost:3000/api/accounts`
- Headers: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Body (JSON):
```json
{
  "name": "Checking Account",
  "initialBalance": 100.00
}
```

**GET Account by ID:**
- Method: GET
- URL: `http://localhost:3000/api/accounts/:accountId`
- Replace `:accountId` with actual account ID

**DELETE Account:**
- Method: DELETE
- URL: `http://localhost:3000/api/accounts/:accountId`

---

## Data Models

### Account Response Object

```typescript
{
  accountId: string;      // Unique account identifier
  name: string;           // Display name (e.g., "Checking Account")
  balance: number;        // Current balance (decimal)
  createdAt: string;      // ISO 8601 timestamp
  updatedAt: string;      // ISO 8601 timestamp
}
```

### Add Account Request

```typescript
{
  name: string;                    // Required: Account name (1-100 chars)
  accountNumber?: string;          // Optional: Account number
  initialBalance?: number;         // Optional: Initial balance (default: 0.00)
  accountType?: string;            // Optional: Account type
}
```

---

## Notes

### Mock Service

⚠️ **This API uses a mock BankService implementation.**

- Accounts are stored in the database (persistent)
- No real banking API integration
- Account numbers are not validated
- Account IDs are generated (format: `mock-account-{timestamp}-{random}`)

See [BANK_SERVICE_MOCK_IMPLEMENTATION.md](./BANK_SERVICE_MOCK_IMPLEMENTATION.md) for details.

### Rate Limiting

Currently no rate limiting is implemented. This should be added for production.

### Security

- All endpoints require authentication
- User can only access their own accounts
- Account ownership is verified on all operations

---

**Last Updated:** 2025-11-03  
**API Version:** 1.0.0

