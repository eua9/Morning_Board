# CORS Configuration Guide

This document explains how CORS (Cross-Origin Resource Sharing) is configured for the Morning Board backend API to allow requests from the mobile app during development.

## Overview

The backend server is configured to handle CORS requests from various development environments:
- **Expo development server** (ports 19000, 19001, 19006)
- **React Native Metro bundler** (port 8081)
- **Custom origins** (via environment variable)

## Configuration

### Development Mode (Default)

In development mode (`NODE_ENV=development`), the server:

1. **Automatically allows** these origins:
   - `http://localhost:19006` - Expo default port
   - `http://localhost:19000` - Expo alternative
   - `http://localhost:19001` - Expo alternative
   - `http://localhost:8081` - React Native Metro bundler
   - `http://localhost:3000` - Backend itself (for testing)
   - `http://127.0.0.1:*` - Same as localhost (IPv4)

2. **Allows additional origins** if `CORS_ORIGIN` is set in `.env`
3. **Allows all origins** if `CORS_ORIGIN` is not set (for easier local testing)

### Production Mode

In production mode (`NODE_ENV=production`):

1. **Requires** `CORS_ORIGIN` to be set in environment variables
2. **Only allows** origins specified in `CORS_ORIGIN` (comma-separated)
3. **Denies all** if `CORS_ORIGIN` is not set (security)

## Setting Up CORS for Mobile App

### Option 1: Default Development (No Configuration Needed)

By default, the server allows all origins in development mode. This works out of the box for:
- Expo Go app on simulator/device
- React Native development
- Local testing

**No configuration needed!** Just start the server:
```bash
cd backend
npm run dev
```

### Option 2: Custom Origins (Recommended for Physical Devices)

If testing on a physical device, you'll need to use your machine's IP address. Update `.env`:

```bash
# Get your machine's IP address
# macOS/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows:
ipconfig
```

Then add to `.env`:
```env
CORS_ORIGIN=http://192.168.1.100:19006,http://localhost:19006
```
Replace `192.168.1.100` with your actual IP address.

### Option 3: Production Setup

For production, set specific allowed origins:

```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

## Verifying CORS Configuration

### Check Server Startup Logs

When the server starts, it will display the CORS configuration:

```
🚀 Server is running on http://localhost:3000
📝 Environment: development
💾 Database: sqlite initialized successfully
🌐 CORS: All origins (development mode)
```

Or with specific origins:
```
🌐 CORS: http://localhost:19006, http://localhost:19000, http://localhost:8081
```

### Test CORS with curl

Test CORS headers:
```bash
curl -i -X OPTIONS http://localhost:3000/api/auth/login \
  -H "Origin: http://localhost:19006" \
  -H "Access-Control-Request-Method: POST"
```

Expected headers:
```
Access-Control-Allow-Origin: http://localhost:19006
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

### Test from Mobile App

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your mobile app (Expo/React Native):
   ```bash
   npm start
   # or
   expo start
   ```

3. Make an API request from the app. If CORS is configured correctly:
   - ✅ Request succeeds
   - ✅ Response includes user data
   - ✅ No CORS errors in console

4. If you see CORS errors:
   - Check that the origin matches allowed origins
   - Verify `CORS_ORIGIN` in `.env` includes your app's origin
   - Check server logs for CORS configuration

## Common Issues

### Issue: "CORS policy blocked the request"

**Solution:** 
1. Check your app's origin (usually shown in Expo/RN dev tools)
2. Verify it's in the allowed origins list
3. Add it to `CORS_ORIGIN` in `.env` if needed

### Issue: Physical device can't connect

**Solution:**
1. Find your machine's IP address
2. Add it to `CORS_ORIGIN`: `http://192.168.1.100:19006`
3. Update your app's API base URL to use the IP instead of localhost
4. Ensure both your computer and device are on the same network

### Issue: Production server denies all requests

**Solution:**
1. Set `CORS_ORIGIN` in your production environment variables
2. Include all allowed origins (comma-separated)
3. Restart the server after updating environment variables

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CORS_ORIGIN` | Comma-separated list of allowed origins | `http://localhost:19006,http://192.168.1.100:19006` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |

## Security Notes

⚠️ **Development Mode**: Allows all origins by default for easier testing.  
✅ **Production Mode**: Only allows explicitly configured origins.

**Best Practice**: Always set `CORS_ORIGIN` in production with specific allowed domains.

## Additional Resources

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://github.com/expressjs/cors)
- [Expo Networking](https://docs.expo.dev/guides/network-requests/)

