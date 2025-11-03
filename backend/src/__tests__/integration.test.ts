/**
 * Integration Tests
 * Full end-to-end tests simulating user login flow from mobile app to backend
 * Tests: success, error handling, and session setup
 */

import request from 'supertest';
import app from '../index';
import { seedDatabase } from '../database/seed';
import { initializeDatabase } from '../database/init';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_DATABASE = 'data/test_morning_board.db';
process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';

// Mock storage implementation for integration testing
// This simulates the mobile app's storage service (AsyncStorage/SecureStore)
// In the real app, these functions would use AsyncStorage or expo-secure-store
interface StoredUserData {
  id: string;
  email: string;
  username?: string;
}

const mockStorage: Record<string, string> = {};

// Storage functions that simulate the mobile app's storage service
const storageService = {
  async storeAuthToken(token: string): Promise<void> {
    mockStorage['@morning_board:auth_token'] = token;
  },
  
  async getAuthToken(): Promise<string | null> {
    return mockStorage['@morning_board:auth_token'] || null;
  },
  
  async storeUserData(userData: StoredUserData): Promise<void> {
    mockStorage['@morning_board:user_data'] = JSON.stringify(userData);
  },
  
  async getUserData(): Promise<StoredUserData | null> {
    const data = mockStorage['@morning_board:user_data'];
    return data ? JSON.parse(data) : null;
  },
  
  async storeRefreshToken(refreshToken: string): Promise<void> {
    mockStorage['@morning_board:refresh_token'] = refreshToken;
  },
  
  async getRefreshToken(): Promise<string | null> {
    return mockStorage['@morning_board:refresh_token'] || null;
  },
  
  async storeTokenExpiration(expiresIn: number): Promise<void> {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
    mockStorage['@morning_board:token_expires'] = expiresAt.toString();
  },
  
  async getTokenExpiration(): Promise<number | null> {
    const expires = mockStorage['@morning_board:token_expires'];
    return expires ? parseInt(expires, 10) : null;
  },
  
  async storeAuthData(
    token: string,
    userData: StoredUserData,
    refreshToken?: string,
    expiresIn?: number
  ): Promise<void> {
    mockStorage['@morning_board:auth_token'] = token;
    mockStorage['@morning_board:user_data'] = JSON.stringify(userData);
    if (refreshToken) {
      mockStorage['@morning_board:refresh_token'] = refreshToken;
    }
    if (expiresIn) {
      const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
      mockStorage['@morning_board:token_expires'] = expiresAt.toString();
    }
  },
  
  async clearAuthData(): Promise<void> {
    delete mockStorage['@morning_board:auth_token'];
    delete mockStorage['@morning_board:refresh_token'];
    delete mockStorage['@morning_board:user_data'];
    delete mockStorage['@morning_board:token_expires'];
  },
};

describe('Full Integration Test: User Login Flow', () => {
  const testCredentials = {
    email: 'test@morningboard.com',
    username: 'testuser',
    password: 'TestPassword123!',
  };

  beforeAll(async () => {
    // Initialize test database
    await initializeDatabase();
    
    // Ensure test user exists
    try {
      await seedDatabase();
    } catch (error) {
      console.log('Test user setup note:', error);
    }
  });

  beforeEach(() => {
    // Clear mock storage before each test
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  });

  describe('Successful Login Flow', () => {
    test('should complete full login flow: credentials → API → token storage → session setup', async () => {
      // Step 1: User enters credentials (simulated)
      const loginCredentials = {
        email: testCredentials.email,
        password: testCredentials.password,
      };

      // Step 2: App sends request to backend (simulating mobile app request)
      const response = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006') // Simulating Expo dev server
        .set('Content-Type', 'application/json')
        .send(loginCredentials)
        .expect(200);

      // Step 3: Verify API response structure
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('expiresIn');
      expect(response.body).toHaveProperty('user');

      // Step 4: Verify user data in response
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testCredentials.email);
      expect(response.body.user.username).toBe(testCredentials.username);
      expect(response.body.user).not.toHaveProperty('password'); // Security check

      // Step 5: Simulate app storing authentication data (as LoginScreen does)
      await storageService.storeAuthData(
        response.body.token,
        {
          id: response.body.user.id,
          email: response.body.user.email,
          username: response.body.user.username,
        },
        response.body.refreshToken,
        response.body.expiresIn
      );

      // Step 6: Verify session storage
      const storedToken = await storageService.getAuthToken();
      const storedUser = await storageService.getUserData();
      const storedRefreshToken = await storageService.getRefreshToken();
      const storedExpiration = await storageService.getTokenExpiration();

      expect(storedToken).toBe(response.body.token);
      expect(storedUser).toEqual({
        id: response.body.user.id,
        email: response.body.user.email,
        username: response.body.user.username,
      });
      expect(storedRefreshToken).toBe(response.body.refreshToken);
      expect(storedExpiration).toBeGreaterThan(Math.floor(Date.now() / 1000));

      // Step 7: Verify token format (JWT)
      const tokenParts = storedToken!.split('.');
      expect(tokenParts.length).toBe(3); // header.payload.signature

      // Step 8: Verify session persistence (simulate app restart)
      const tokenAfterRestart = await storageService.getAuthToken();
      const userAfterRestart = await storageService.getUserData();
      expect(tokenAfterRestart).toBe(storedToken);
      expect(userAfterRestart).toEqual(storedUser);

      console.log('✅ Full login flow completed successfully');
      console.log(`   - Token received: ${storedToken?.substring(0, 20)}...`);
      console.log(`   - User ID: ${storedUser?.id}`);
      console.log(`   - Token expires in: ${response.body.expiresIn} seconds`);
    });

    test('should handle login with username instead of email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Content-Type', 'application/json')
        .send({
          email: testCredentials.username, // Using username
          password: testCredentials.password,
        })
        .expect(200);

      expect(response.body.token).toBeTruthy();
      expect(response.body.user.email).toBe(testCredentials.email);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid password with proper error message', async () => {
      // Step 1: User enters wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Content-Type', 'application/json')
        .send({
          email: testCredentials.email,
          password: 'wrongpassword',
        })
        .expect(401);

      // Step 2: Verify error response structure
      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body).toHaveProperty('error', 'Invalid password');
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).not.toHaveProperty('user');

      // Step 3: Verify no session data was stored
      const storedToken = await storageService.getAuthToken();
      expect(storedToken).toBeNull();
    });

    test('should handle non-existent user with proper error message', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Content-Type', 'application/json')
        .send({
          email: 'nonexistent@example.com',
          password: 'anypassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'User not found');
      
      // Verify no session stored
      const storedToken = await storageService.getAuthToken();
      expect(storedToken).toBeNull();
    });

    test('should handle missing credentials with validation error', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Content-Type', 'application/json')
        .send({
          email: testCredentials.email,
          // Missing password
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body.error).toContain('required');
      
      // Verify no session stored
      const storedToken = await storageService.getAuthToken();
      expect(storedToken).toBeNull();
    });

    test('should handle network-like errors gracefully', async () => {
      // Simulate invalid JSON
      const response = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      // Should return error without crashing
      expect(response.status).toBe(400);
    });
  });

  describe('Session Setup and Management', () => {
    test('should properly set up session with all required data', async () => {
      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Content-Type', 'application/json')
        .send({
          email: testCredentials.email,
          password: testCredentials.password,
        })
        .expect(200);

      // Store session
      await storageService.storeAuthData(
        loginResponse.body.token,
        {
          id: loginResponse.body.user.id,
          email: loginResponse.body.user.email,
          username: loginResponse.body.user.username,
        },
        loginResponse.body.refreshToken,
        loginResponse.body.expiresIn
      );

      // Verify complete session data
      const sessionData = {
        token: await storageService.getAuthToken(),
        user: await storageService.getUserData(),
        refreshToken: await storageService.getRefreshToken(),
        expiration: await storageService.getTokenExpiration(),
      };

      expect(sessionData.token).toBeTruthy();
      expect(sessionData.user).toBeTruthy();
      expect(sessionData.refreshToken).toBeTruthy();
      expect(sessionData.expiration).toBeTruthy();

      // Verify expiration is in the future
      const now = Math.floor(Date.now() / 1000);
      expect(sessionData.expiration!).toBeGreaterThan(now);
      expect(sessionData.expiration! - now).toBeLessThanOrEqual(loginResponse.body.expiresIn);

      console.log('✅ Session setup verified:');
      console.log(`   - Token stored: ${sessionData.token ? 'Yes' : 'No'}`);
      console.log(`   - User data stored: ${sessionData.user ? 'Yes' : 'No'}`);
      console.log(`   - Refresh token stored: ${sessionData.refreshToken ? 'Yes' : 'No'}`);
      console.log(`   - Expiration stored: ${sessionData.expiration ? new Date(sessionData.expiration! * 1000).toISOString() : 'No'}`);
    });

    test('should clear session on logout', async () => {
      // Login and store session
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Content-Type', 'application/json')
        .send({
          email: testCredentials.email,
          password: testCredentials.password,
        })
        .expect(200);

      await storageService.storeAuthData(
        loginResponse.body.token,
        {
          id: loginResponse.body.user.id,
          email: loginResponse.body.user.email,
          username: loginResponse.body.user.username,
        },
        loginResponse.body.refreshToken,
        loginResponse.body.expiresIn
      );

      // Verify session exists
      let token = await storageService.getAuthToken();
      expect(token).toBeTruthy();

      // Logout (clear session)
      await storageService.clearAuthData();

      // Verify session cleared
      token = await storageService.getAuthToken();
      const user = await storageService.getUserData();
      const refreshToken = await storageService.getRefreshToken();

      expect(token).toBeNull();
      expect(user).toBeNull();
      expect(refreshToken).toBeNull();
    });
  });

  describe('CORS and Request Headers', () => {
    test('should include CORS headers in successful login response', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Content-Type', 'application/json')
        .send({
          email: testCredentials.email,
          password: testCredentials.password,
        })
        .expect(200);

      // Verify CORS headers present
      expect(response.headers['access-control-allow-origin']).toBeTruthy();
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    test('should handle preflight OPTIONS request', async () => {
      const response = await request(app)
        .options('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Access-Control-Request-Method', 'POST')
        .expect(204);

      expect(response.headers['access-control-allow-methods']).toContain('POST');
      expect(response.headers['access-control-allow-origin']).toBeTruthy();
    });
  });

  describe('End-to-End User Journey', () => {
    test('should simulate complete user journey: login → verify session → use token', async () => {
      // Journey Step 1: User opens app
      console.log('📱 Step 1: User opens app');
      let isAuthenticated = false;
      let token = await storageService.getAuthToken();
      expect(token).toBeNull();
      expect(isAuthenticated).toBe(false);

      // Journey Step 2: User enters credentials and submits
      console.log('📝 Step 2: User enters credentials');
      const credentials = {
        email: testCredentials.email,
        password: testCredentials.password,
      };

      // Journey Step 3: App sends login request
      console.log('🌐 Step 3: App sends login request to backend');
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:19006')
        .set('Content-Type', 'application/json')
        .send(credentials)
        .expect(200);

      // Journey Step 4: App receives response and stores session
      console.log('💾 Step 4: App stores authentication data');
      await storageService.storeAuthData(
        loginResponse.body.token,
        {
          id: loginResponse.body.user.id,
          email: loginResponse.body.user.email,
          username: loginResponse.body.user.username,
        },
        loginResponse.body.refreshToken,
        loginResponse.body.expiresIn
      );

      // Journey Step 5: Verify user is authenticated
      console.log('✅ Step 5: Verify user session');
      token = await storageService.getAuthToken();
      const user = await storageService.getUserData();
      expect(token).toBeTruthy();
      expect(user).toBeTruthy();
      isAuthenticated = true;

      // Journey Step 6: User navigates to dashboard (token would be used for API calls)
      console.log('🏠 Step 6: User navigates to dashboard');
      expect(isAuthenticated).toBe(true);
      expect(token).toBeTruthy();

      // Journey Step 7: Simulate making authenticated API call (verify token endpoint)
      console.log('🔐 Step 7: Make authenticated API call');
      const verifyResponse = await request(app)
        .get('/api/auth/verify')
        .set('Origin', 'http://localhost:19006')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(verifyResponse.body).toHaveProperty('user');
      expect(verifyResponse.body.user.email).toBe(testCredentials.email);

      console.log('✅ Complete user journey verified successfully!');
    });
  });
});

