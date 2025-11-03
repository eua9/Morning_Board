/**
 * BankService Tests
 * Tests the mock BankService implementation
 */

import { BankService, AddAccountRequest } from '../BankService';
import { BankAccount } from '../../models/BankAccount';
import { getDatabase } from '../../config/database';
import { createTables } from '../../database/schema';

describe('BankService', () => {
  let bankService: BankService;
  let testUserId: string;

  beforeAll(() => {
    // Initialize test database
    const db = getDatabase();
    db.pragma('foreign_keys = ON');
    createTables(db);

    // Create test user
    testUserId = 'test-user-service-123';
    db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
    db.prepare('DELETE FROM bank_accounts WHERE user_id = ?').run(testUserId);

    const uniqueId = Date.now().toString();
    db.prepare(`
      INSERT INTO users (id, username, email, password, first_name, last_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      testUserId,
      `testuser-${uniqueId}`,
      `test-${uniqueId}@example.com`,
      'hashedpassword',
      'Test',
      'User',
      new Date().toISOString(),
      new Date().toISOString()
    );

    bankService = new BankService();
  });

  beforeEach(() => {
    // Clean up test accounts
    const db = getDatabase();
    db.prepare('DELETE FROM bank_accounts WHERE user_id = ?').run(testUserId);
  });

  describe('getAccounts', () => {
    test('should return empty array when user has no accounts', async () => {
      const response = await bankService.getAccounts(testUserId);

      expect(response.success).toBe(true);
      expect(response.data).toEqual([]);
      expect(response.message).toContain('0 account');
    });

    test('should return error when userId is empty', async () => {
      const response = await bankService.getAccounts('');

      expect(response.success).toBe(false);
      expect(response.error).toBe('User ID is required');
    });

    test('should return all accounts for a user', async () => {
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

      const response = await bankService.getAccounts(testUserId);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(2);
      expect(response.data?.some((a) => a.name === 'Checking Account')).toBe(true);
      expect(response.data?.some((a) => a.name === 'Savings Account')).toBe(true);
    });
  });

  describe('addAccount', () => {
    test('should create a new account successfully', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Test Checking Account',
        initialBalance: 100.0,
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.userId).toBe(testUserId);
      expect(response.data?.name).toBe('Test Checking Account');
      expect(response.data?.balance).toBe(100.0);
      expect(response.data?.accountId).toContain('mock-account-');
      expect(response.message).toBe('Account added successfully');
    });

    test('should default balance to 0.0 when not provided', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'New Account',
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.balance).toBe(0.0);
    });

    test('should return error when name is empty', async () => {
      const accountInfo: AddAccountRequest = {
        name: '',
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Account name is required');
    });

    test('should return error when name is too long', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'A'.repeat(101), // 101 characters
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Account name must be 100 characters or less');
    });

    test('should return error when userId is empty', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Test Account',
      };

      const response = await bankService.addAccount('', accountInfo);

      expect(response.success).toBe(false);
      expect(response.error).toBe('User ID is required');
    });

    test('should trim account name whitespace', async () => {
      const accountInfo: AddAccountRequest = {
        name: '  Test Account  ',
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.name).toBe('Test Account');
    });
  });

  describe('getAccountById', () => {
    test('should return account when found', async () => {
      const account = BankAccount.create({
        accountId: 'test-account-get',
        userId: testUserId,
        name: 'Test Account',
        balance: 500.0,
      });
      account.save();

      const response = await bankService.getAccountById('test-account-get');

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.accountId).toBe('test-account-get');
      expect(response.data?.name).toBe('Test Account');
    });

    test('should return null when account not found', async () => {
      const response = await bankService.getAccountById('non-existent-id');

      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
      expect(response.message).toBe('Account not found');
    });

    test('should return error when accountId is empty', async () => {
      const response = await bankService.getAccountById('');

      expect(response.success).toBe(false);
      expect(response.error).toBe('Account ID is required');
    });
  });

  describe('deleteAccount', () => {
    test('should delete account successfully', async () => {
      const account = BankAccount.create({
        accountId: 'test-account-delete',
        userId: testUserId,
        name: 'Test Account',
        balance: 0.0,
      });
      account.save();

      const response = await bankService.deleteAccount('test-account-delete', testUserId);

      expect(response.success).toBe(true);
      expect(response.data).toBe(true);
      expect(response.message).toBe('Account deleted successfully');

      // Verify account is deleted
      const deletedAccount = BankAccount.findById('test-account-delete');
      expect(deletedAccount).toBeNull();
    });

    test('should return error when account does not belong to user', async () => {
      const otherUserId = 'other-user-123';
      const account = BankAccount.create({
        accountId: 'test-account-other',
        userId: testUserId,
        name: 'Test Account',
        balance: 0.0,
      });
      account.save();

      const response = await bankService.deleteAccount('test-account-other', otherUserId);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Account does not belong to user');
    });

    test('should return error when account not found', async () => {
      const response = await bankService.deleteAccount('non-existent-id', testUserId);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Account not found');
    });

    test('should return error when accountId is empty', async () => {
      const response = await bankService.deleteAccount('', testUserId);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Account ID is required');
    });

    test('should return error when userId is empty', async () => {
      const response = await bankService.deleteAccount('test-account', '');

      expect(response.success).toBe(false);
      expect(response.error).toBe('User ID is required');
    });
  });

  describe('Mock Service Behavior', () => {
    test('should generate unique account IDs', async () => {
      const accountInfo1: AddAccountRequest = { name: 'Account 1' };
      const accountInfo2: AddAccountRequest = { name: 'Account 2' };

      const response1 = await bankService.addAccount(testUserId, accountInfo1);
      const response2 = await bankService.addAccount(testUserId, accountInfo2);

      expect(response1.data?.accountId).toBeDefined();
      expect(response2.data?.accountId).toBeDefined();
      expect(response1.data?.accountId).not.toBe(response2.data?.accountId);
      expect(response1.data?.accountId).toContain('mock-account-');
      expect(response2.data?.accountId).toContain('mock-account-');
    });

    test('should persist accounts in database', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Persistent Account',
        initialBalance: 250.0,
      };

      await bankService.addAccount(testUserId, accountInfo);

      // Verify by fetching directly
      const accounts = BankAccount.findByUserId(testUserId);
      expect(accounts.length).toBeGreaterThan(0);
      expect(accounts.some((a) => a.name === 'Persistent Account')).toBe(true);
    });
  });
});

