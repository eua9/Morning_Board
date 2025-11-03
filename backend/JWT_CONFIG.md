# JWT Token Configuration

This document describes JWT token configuration and environment variables for the Morning Board backend API.

## Environment Variables

Add these variables to your `.env` file:

```env
# JWT Secret Key (REQUIRED in production)
# Generate a strong secret: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Access Token Expiration (optional, default: 7d)
# Format: number + unit (s, m, h, d)
# Examples: "1h", "24h", "7d", "30d"
JWT_EXPIRES_IN=7d

# Refresh Token Expiration (optional, default: 30d)
# Format: number + unit (s, m, h, d)
JWT_REFRESH_EXPIRES_IN=30d
```

## Default Values

If environment variables are not set, the following defaults are used:

- `JWT_SECRET`: `'default-secret-change-in-production'` ⚠️ **Change this in production!**
- `JWT_EXPIRES_IN`: `'7d'` (7 days)
- `JWT_REFRESH_EXPIRES_IN`: `'30d'` (30 days)

## Token Types

### Access Token
- **Purpose**: Short-lived token for API authentication
- **Default Expiration**: 7 days
- **Usage**: Included in `Authorization: Bearer <token>` header
- **Contains**: userId, email, username

### Refresh Token
- **Purpose**: Long-lived token to obtain new access tokens
- **Default Expiration**: 30 days
- **Usage**: Sent in request body to `/api/auth/refresh`
- **Contains**: userId, email, username

## Security Best Practices

1. **Generate a Strong Secret**:
   ```bash
   openssl rand -base64 32
   ```

2. **Never Commit Secrets**: Always use `.env` file (already in `.gitignore`)

3. **Rotate Secrets Periodically**: Especially if compromised

4. **Use HTTPS in Production**: Always use HTTPS to protect tokens in transit

5. **Token Storage**: 
   - Frontend: Store in secure storage (not localStorage for sensitive apps)
   - Never log tokens
   - Never expose tokens in URLs

## Token Payload

```typescript
{
  userId: string;    // User's unique ID
  email: string;      // User's email address
  username: string;   // User's username
  iat: number;        // Issued at (timestamp)
  exp: number;        // Expiration (timestamp)
  iss: string;        // Issuer: "morning-board-api"
  aud: string;        // Audience: "morning-board-app"
}
```

## API Endpoints

- `POST /api/auth/login` - Returns `token` (access token) and `refreshToken`
- `POST /api/auth/refresh` - Returns new `token` (access token) using refresh token
- `GET /api/auth/verify` - Verifies access token and returns user data

## Example Usage

### Login Response
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800
}
```

### Using Access Token
```bash
curl -H "Authorization: Bearer <access-token>" \
     http://localhost:3000/api/auth/verify
```

### Refreshing Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{"refreshToken": "<refresh-token>"}'
```

