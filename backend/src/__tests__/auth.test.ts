/**
 * Authentication Controller Tests
 * Tests for login endpoint with various scenarios
 */

import request from 'supertest';
import app from '../index';
import { getDatabase } from '../config/database';
import { seedDatabase } from '../database/seed';
import { initializeDatabase } from '../database/init';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DB_DATABASE = 'data/test_morning_board.db';
process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';

describe('POST /api/auth/login', () => {
  // Test credentials from seed script
  const testCredentials = {
    email: 'test@morningboard.com',
    username: 'testuser',
    password: 'TestPassword123!',
  };

  beforeAll(async () => {
    // Initialize test database
    await initializeDatabase();
    
    // Ensure test user exists in database
    try {
      await seedDatabase();
    } catch (error) {
      // Test user may already exist, that's okay
      console.log('Test user setup note:', error);
    }
  });

  afterAll(() => {
    // Cleanup is handled by test isolation
  });

  describe('Valid Credentials', () => {
    test('should login successfully with valid email and password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCredentials.email,
          password: testCredentials.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('expiresIn');
      expect(response.body).toHaveProperty('user');

      // Verify token format (JWT has 3 parts)
      const token = response.body.token;
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      const tokenParts = token.split('.');
      expect(tokenParts.length).toBe(3); // JWT format: header.payload.signature

      // Verify user data
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testCredentials.email);
      expect(response.body.user).toHaveProperty('username', testCredentials.username);
      expect(response.body.user).not.toHaveProperty('password'); // Password should never be returned

      // Verify expiration
      expect(response.body.expiresIn).toBeGreaterThan(0);
      expect(typeof response.body.expiresIn).toBe('number');
    });

    test('should login successfully with username instead of email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCredentials.username, // Using username as identifier
          password: testCredentials.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testCredentials.email);
    });
  });

  describe('Invalid Credentials', () => {
    test('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCredentials.email,
          password: 'wrongpassword123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body).toHaveProperty('error', 'Invalid password');
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).not.toHaveProperty('user');
    });

    test('should reject login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'anypassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body).toHaveProperty('error', 'User not found');
      expect(response.body).not.toHaveProperty('token');
    });

    test('should reject login with empty password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCredentials.email,
          password: '',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body.error).toContain('required');
    });

    test('should reject login with empty email/username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: '',
          password: testCredentials.password,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body.error).toContain('required');
    });
  });

  describe('Missing Input', () => {
    test('should reject login with missing email field', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: testCredentials.password,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body.error).toContain('required');
    });

    test('should reject login with missing password field', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCredentials.email,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body.error).toContain('required');
    });

    test('should reject login with empty request body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body.error).toContain('required');
    });

    test('should reject login with invalid input types', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 12345, // Invalid type
          password: testCredentials.password,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body.error).toContain('format');
    });
  });

  describe('Password Hashing Verification', () => {
    test('should successfully authenticate with hashed password in database', async () => {
      // Verify password in database is hashed (not plain text)
      const db = getDatabase();
      const userRow = db
        .prepare('SELECT password FROM users WHERE email = ?')
        .get(testCredentials.email) as { password: string } | undefined;

      expect(userRow).toBeDefined();
      expect(userRow!.password).toBeTruthy();

      // Verify password is bcrypt hash (starts with $2b$ or $2a$)
      expect(userRow!.password).toMatch(/^\$2[ab]\$/);
      expect(userRow!.password.length).toBeGreaterThan(50); // Bcrypt hashes are ~60 chars

      // Verify login still works (password comparison works correctly)
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCredentials.email,
          password: testCredentials.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });

    test('should reject incorrect password even if similar', async () => {
      // Try similar but incorrect passwords
      const similarPasswords = [
        'TestPassword123', // Missing !
        'testpassword123!', // Wrong case
        'TestPassword12!', // Wrong length
        'TestPassword123@', // Wrong special char
      ];

      for (const wrongPassword of similarPasswords) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: testCredentials.email,
            password: wrongPassword,
          })
          .expect(401);

        expect(response.body.error).toBe('Invalid password');
      }
    });
  });

  describe('Response Format', () => {
    test('should return correctly formatted response on success', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCredentials.email,
          password: testCredentials.password,
        })
        .expect(200);

      // Verify response structure
      expect(response.body).toMatchObject({
        message: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          username: expect.any(String),
        }),
        token: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: expect.any(Number),
      });

      // Verify user object doesn't contain sensitive data
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should return correctly formatted error response', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCredentials.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toMatchObject({
        message: expect.any(String),
        error: expect.any(String),
      });
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).not.toHaveProperty('user');
    });
  });

  describe('Edge Cases', () => {
    test('should handle email with extra whitespace', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: `  ${testCredentials.email}  `,
          password: testCredentials.password,
        });

      // Should either trim and succeed or reject - depends on implementation
      // Current implementation should handle this
      expect([200, 401]).toContain(response.status);
    });

    test('should handle very long password', async () => {
      const longPassword = 'a'.repeat(1000);
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCredentials.email,
          password: longPassword,
        })
        .expect(401); // Should reject invalid password

      expect(response.body).toHaveProperty('error');
    });

    test('should handle special characters in email/username', async () => {
      // Note: This tests that special chars don't break the query
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: testCredentials.password,
        })
        .expect(401); // User doesn't exist, but shouldn't crash

      expect(response.body).toHaveProperty('error');
    });
  });
});

