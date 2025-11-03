/**
 * Bank Account Controller Tests
 * Tests the REST API endpoints for bank accounts
 */

import request from 'supertest';
import app from '../../index';
import { getDatabase } from '../../config/database';
import { createTables } from '../../database/schema';
import { User } from '../../models/User';
import { generateTokenPair } from '../../utils/jwt';
import { BankAccount } from '../../models/BankAccount';

describe('BankAccountController', () => {
  let testUserId: string;
  let authToken: string;

  beforeAll(async () => {
    // Initialize test database
    const db = getDatabase();
    db.pragma('foreign_keys = ON');
    createTables(db);

    // Create test user
    testUserId = 'test-user-controller-123';
    db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
    db.prepare('DELETE FROM bank_accounts WHERE user_id = ?').run(testUserId);

    const uniqueId = Date.now().toString();
    const hashedPassword = await User.hashPassword('testpassword123');

    db.prepare(`
      INSERT INTO users (id, username, email, password, first_name, last_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      testUserId,
      `testuser-${uniqueId}`,
      `test-${uniqueId}@example.com`,
      hashedPassword,
      'Test',
      'User',
      new Date().toISOString(),
      new Date().toISOString()
    );

    // Generate auth token
    const tokenPair = generateTokenPair({
      userId: testUserId,
      email: `test-${uniqueId}@example.com`,
      username: `testuser-${uniqueId}`,
    });
    authToken = tokenPair.accessToken;
  });

  beforeEach(() => {
    // Clean up test accounts
    const db = getDatabase();
    db.prepare('DELETE FROM bank_accounts WHERE user_id = ?').run(testUserId);
  });

  describe('GET /api/accounts', () => {
    test('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/api/accounts')
        .expect(401);

      expect(response.body.message).toBe('Authentication required');
      expect(response.body.error).toContain('No token provided');
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/accounts')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toBe('Authentication failed');
      expect(response.body.error).toContain('Invalid or expired token');
    });

    test('should return empty array when user has no accounts', async () => {
      const response = await request(app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Accounts retrieved successfully');
      expect(response.body.accounts).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return all accounts for authenticated user', async () => {
      // Create test accounts
      const account1 = BankAccount.create({
        accountId: 'test-account-1',
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.0,
      });
      account1.save();

      const account2 = BankAccount.create({
        accountId: 'test-account-2',
        userId: testUserId,
        name: 'Savings Account',
        balance: 5000.0,
      });
      account2.save();

      const response = await request(app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Accounts retrieved successfully');
      expect(response.body.accounts).toHaveLength(2);
      expect(response.body.count).toBe(2);
      expect(response.body.accounts[0]).toHaveProperty('accountId');
      expect(response.body.accounts[0]).toHaveProperty('name');
      expect(response.body.accounts[0]).toHaveProperty('balance');
      expect(response.body.accounts[0]).toHaveProperty('createdAt');
      expect(response.body.accounts[0]).toHaveProperty('updatedAt');
    });
  });

  describe('POST /api/accounts', () => {
    test('should return 401 without authentication token', async () => {
      const response = await request(app)
        .post('/api/accounts')
        .send({ name: 'Test Account' })
        .expect(401);

      expect(response.body.message).toBe('Authentication required');
    });

    test('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
      expect(response.body.error).toContain('Account name is required');
    });

    test('should return 400 when name is empty', async () => {
      const response = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: '' })
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
      expect(response.body.error).toContain('Account name is required');
    });

    test('should return 400 when initialBalance is invalid', async () => {
      const response = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Account',
          initialBalance: 'not-a-number',
        })
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
      expect(response.body.error).toContain('Initial balance must be a valid number');
    });

    test('should create account successfully with minimal data', async () => {
      const response = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Checking Account',
        })
        .expect(201);

      expect(response.body.message).toBe('Account added successfully');
      expect(response.body.account).toBeDefined();
      expect(response.body.account.name).toBe('New Checking Account');
      expect(response.body.account.balance).toBe(0.0);
      expect(response.body.account.accountId).toContain('mock-account-');
    });

    test('should create account with initial balance', async () => {
      const response = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Savings Account',
          initialBalance: 5000.00,
        })
        .expect(201);

      expect(response.body.account.name).toBe('Savings Account');
      expect(response.body.account.balance).toBe(5000.00);
    });

    test('should trim account name whitespace', async () => {
      const response = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '  Test Account  ',
        })
        .expect(201);

      expect(response.body.account.name).toBe('Test Account');
    });

    test('should accept optional accountNumber and accountType', async () => {
      const response = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Checking Account',
          accountNumber: '1234567890',
          accountType: 'Checking',
          initialBalance: 100.00,
        })
        .expect(201);

      expect(response.body.account.name).toBe('Checking Account');
      expect(response.body.account.balance).toBe(100.00);
    });
  });

  describe('GET /api/accounts/:accountId', () => {
    test('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/accounts/test-id')
        .expect(401);
    });

    test('should return 404 when account not found', async () => {
      const response = await request(app)
        .get('/api/accounts/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Account not found');
    });

    test('should return account details when found', async () => {
      const account = BankAccount.create({
        accountId: 'test-account-get',
        userId: testUserId,
        name: 'Test Account',
        balance: 1000.0,
      });
      account.save();

      const response = await request(app)
        .get('/api/accounts/test-account-get')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Account retrieved successfully');
      expect(response.body.account.accountId).toBe('test-account-get');
      expect(response.body.account.name).toBe('Test Account');
      expect(response.body.account.balance).toBe(1000.0);
    });

    test('should return 403 when account belongs to different user', async () => {
      // Create account for different user
      const otherUserId = 'other-user-123';
      const db = getDatabase();
      
      // Create other user first
      db.prepare('DELETE FROM users WHERE id = ?').run(otherUserId);
      db.prepare('DELETE FROM bank_accounts WHERE user_id = ?').run(otherUserId);
      
      const uniqueId = Date.now().toString() + '-other';
      db.prepare(`
        INSERT INTO users (id, username, email, password, first_name, last_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        otherUserId,
        `otheruser-${uniqueId}`,
        `other-${uniqueId}@example.com`,
        'hashedpassword',
        'Other',
        'User',
        new Date().toISOString(),
        new Date().toISOString()
      );

      const account = BankAccount.create({
        accountId: 'other-user-account',
        userId: otherUserId,
        name: 'Other Account',
        balance: 0.0,
      });
      account.save();

      const response = await request(app)
        .get('/api/accounts/other-user-account')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.message).toBe('Access denied');
      expect(response.body.error).toContain('permission');
    });
  });

  describe('DELETE /api/accounts/:accountId', () => {
    test('should return 401 without authentication', async () => {
      await request(app)
        .delete('/api/accounts/test-id')
        .expect(401);
    });

    test('should return 404 when account not found', async () => {
      const response = await request(app)
        .delete('/api/accounts/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Failed to delete account');
      expect(response.body.error).toContain('not found');
    });

    test('should delete account successfully', async () => {
      const account = BankAccount.create({
        accountId: 'test-account-delete',
        userId: testUserId,
        name: 'Account to Delete',
        balance: 0.0,
      });
      account.save();

      const response = await request(app)
        .delete('/api/accounts/test-account-delete')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Account deleted successfully');

      // Verify account is deleted
      const deletedAccount = BankAccount.findById('test-account-delete');
      expect(deletedAccount).toBeNull();
    });

    test('should return 403 when account belongs to different user', async () => {
      const otherUserId = 'other-user-456';
      const db = getDatabase();
      
      // Create other user first
      db.prepare('DELETE FROM users WHERE id = ?').run(otherUserId);
      db.prepare('DELETE FROM bank_accounts WHERE user_id = ?').run(otherUserId);
      
      const uniqueId = Date.now().toString() + '-delete';
      db.prepare(`
        INSERT INTO users (id, username, email, password, first_name, last_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        otherUserId,
        `otheruser-${uniqueId}`,
        `other-${uniqueId}@example.com`,
        'hashedpassword',
        'Other',
        'User',
        new Date().toISOString(),
        new Date().toISOString()
      );

      const account = BankAccount.create({
        accountId: 'other-account-delete',
        userId: otherUserId,
        name: 'Other Account',
        balance: 0.0,
      });
      account.save();

      const response = await request(app)
        .delete('/api/accounts/other-account-delete')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.message).toBe('Failed to delete account');
      expect(response.body.error).toContain('does not belong');
    });
  });

  describe('Integration Flow', () => {
    test('should create account and retrieve it', async () => {
      // Create account
      const createResponse = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Integration Test Account',
          initialBalance: 250.00,
        })
        .expect(201);

      const accountId = createResponse.body.account.accountId;

      // Retrieve all accounts
      const getResponse = await request(app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.accounts.length).toBeGreaterThan(0);
      const createdAccount = getResponse.body.accounts.find(
        (a: any) => a.accountId === accountId
      );
      expect(createdAccount).toBeDefined();
      expect(createdAccount.name).toBe('Integration Test Account');
      expect(createdAccount.balance).toBe(250.00);

      // Retrieve specific account
      const getByIdResponse = await request(app)
        .get(`/api/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getByIdResponse.body.account.accountId).toBe(accountId);
    });
  });
});

