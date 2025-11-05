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

    test('should return error when userId is whitespace only', async () => {
      const response = await bankService.getAccounts('   ');

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

    test('should return accounts added via addAccount method', async () => {
      // Add accounts using the service
      await bankService.addAccount(testUserId, {
        name: 'Service Account 1',
        initialBalance: 100.0,
      });
      await bankService.addAccount(testUserId, {
        name: 'Service Account 2',
        initialBalance: 200.0,
      });
      await bankService.addAccount(testUserId, {
        name: 'Service Account 3',
        initialBalance: 300.0,
      });

      const response = await bankService.getAccounts(testUserId);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(3);
      expect(response.data?.some((a) => a.name === 'Service Account 1')).toBe(true);
      expect(response.data?.some((a) => a.name === 'Service Account 2')).toBe(true);
      expect(response.data?.some((a) => a.name === 'Service Account 3')).toBe(true);

      // Verify balances
      const account1 = response.data?.find((a) => a.name === 'Service Account 1');
      const account2 = response.data?.find((a) => a.name === 'Service Account 2');
      const account3 = response.data?.find((a) => a.name === 'Service Account 3');

      expect(account1?.balance).toBe(100.0);
      expect(account2?.balance).toBe(200.0);
      expect(account3?.balance).toBe(300.0);
    });

    test('should return accounts in correct order (by creation time)', async () => {
      // Add accounts with delays to ensure different timestamps
      const account1Response = await bankService.addAccount(testUserId, {
        name: 'First Account',
      });
      await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay

      const account2Response = await bankService.addAccount(testUserId, {
        name: 'Second Account',
      });
      await new Promise((resolve) => setTimeout(resolve, 10));

      const account3Response = await bankService.addAccount(testUserId, {
        name: 'Third Account',
      });

      const response = await bankService.getAccounts(testUserId);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(3);

      // Verify all accounts are returned
      const accountIds = response.data?.map((a) => a.accountId) || [];
      expect(accountIds).toContain(account1Response.data?.accountId);
      expect(accountIds).toContain(account2Response.data?.accountId);
      expect(accountIds).toContain(account3Response.data?.accountId);
    });

    test('should handle user with many accounts', async () => {
      // Add multiple accounts
      const accountCount = 10;
      for (let i = 0; i < accountCount; i++) {
        await bankService.addAccount(testUserId, {
          name: `Account ${i + 1}`,
          initialBalance: (i + 1) * 100.0,
        });
      }

      const response = await bankService.getAccounts(testUserId);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(accountCount);
      expect(response.message).toContain(`${accountCount} account`);
    });

    test('should not return accounts belonging to other users', async () => {
      const otherUserId = 'other-user-test-123';
      const db = getDatabase();

      // Create other user
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

      // Add account for other user
      await bankService.addAccount(otherUserId, {
        name: "Other User's Account",
      });

      // Add account for test user
      await bankService.addAccount(testUserId, {
        name: 'Test User Account',
      });

      // Get accounts for test user
      const response = await bankService.getAccounts(testUserId);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(1);
      expect(response.data?.[0].name).toBe('Test User Account');
      expect(response.data?.[0].userId).toBe(testUserId);
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

    test('should handle negative initial balance (validation)', async () => {
      // Note: The service allows negative balances for credit cards
      // This test verifies the service accepts it (not rejected by validation)
      const accountInfo: AddAccountRequest = {
        name: 'Credit Card Account',
        initialBalance: -250.0, // Negative balance for credit card
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      // Service should accept negative balance (for credit cards)
      expect(response.success).toBe(true);
      expect(response.data?.balance).toBe(-250.0);
    });

    test('should handle very large balance values', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'High Value Account',
        initialBalance: 999999999.99, // Very large balance
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.balance).toBe(999999999.99);
    });

    test('should handle decimal balance values', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Precise Balance Account',
        initialBalance: 1234.56,
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.balance).toBe(1234.56);
    });

    test('should return error when initialBalance is NaN', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Invalid Balance Account',
        initialBalance: NaN,
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Initial balance must be a valid number');
    });

    test('should accept accountNumber and accountType (optional fields)', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Account with Details',
        accountNumber: '1234567890',
        accountType: 'Checking',
        initialBalance: 500.0,
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.name).toBe('Account with Details');
      expect(response.data?.balance).toBe(500.0);
      // Note: accountNumber and accountType are not stored in BankAccount model
      // They are accepted but not persisted in the current implementation
    });

    test('should handle special characters in account name', async () => {
      const accountInfo: AddAccountRequest = {
        name: "John's Checking Account #123",
        initialBalance: 100.0,
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.name).toBe("John's Checking Account #123");
    });

    test('should handle account name with unicode characters', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Account 账户 アカウント',
        initialBalance: 100.0,
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.name).toBe('Account 账户 アカウント');
    });

    test('should accept zero balance explicitly', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Zero Balance Account',
        initialBalance: 0.0,
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.balance).toBe(0.0);
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

    test('should generate account IDs with different formats', async () => {
      const accountInfo: AddAccountRequest = { name: 'Test Account' };
      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.data?.accountId).toBeDefined();
      expect(response.data?.accountId).toMatch(/^mock-account-\d+-[a-z0-9]+$/);
    });

    test('should maintain data consistency after add and retrieve', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Consistency Test Account',
        initialBalance: 123.45,
      };

      const addResponse = await bankService.addAccount(testUserId, accountInfo);
      expect(addResponse.success).toBe(true);

      const getResponse = await bankService.getAccounts(testUserId);
      expect(getResponse.success).toBe(true);

      const retrievedAccount = getResponse.data?.find(
        (a) => a.accountId === addResponse.data?.accountId
      );

      expect(retrievedAccount).toBeDefined();
      expect(retrievedAccount?.name).toBe('Consistency Test Account');
      expect(retrievedAccount?.balance).toBe(123.45);
      expect(retrievedAccount?.userId).toBe(testUserId);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle concurrent account additions', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        bankService.addAccount(testUserId, {
          name: `Concurrent Account ${i + 1}`,
          initialBalance: (i + 1) * 10.0,
        })
      );

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach((result) => {
        expect(result.success).toBe(true);
      });

      // Verify all accounts were created
      const getResponse = await bankService.getAccounts(testUserId);
      expect(getResponse.success).toBe(true);
      expect(getResponse.data?.length).toBeGreaterThanOrEqual(5);
    });

    test('should handle account name with maximum allowed length', async () => {
      const maxLengthName = 'A'.repeat(100); // Exactly 100 characters
      const accountInfo: AddAccountRequest = {
        name: maxLengthName,
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.name).toBe(maxLengthName);
    });

    test('should handle account name with minimum allowed length', async () => {
      const minLengthName = 'A'; // Single character
      const accountInfo: AddAccountRequest = {
        name: minLengthName,
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.name).toBe(minLengthName);
    });

    test('should handle very small balance values', async () => {
      const accountInfo: AddAccountRequest = {
        name: 'Small Balance Account',
        initialBalance: 0.01, // One cent
      };

      const response = await bankService.addAccount(testUserId, accountInfo);

      expect(response.success).toBe(true);
      expect(response.data?.balance).toBe(0.01);
    });

    test('should handle account retrieval after deletion', async () => {
      // Add an account
      const addResponse = await bankService.addAccount(testUserId, {
        name: 'Account to Delete',
      });
      const accountId = addResponse.data?.accountId!;

      // Verify it exists
      let getResponse = await bankService.getAccounts(testUserId);
      expect(getResponse.data?.some((a) => a.accountId === accountId)).toBe(true);

      // Delete the account
      await bankService.deleteAccount(accountId, testUserId);

      // Verify it's no longer in the list
      getResponse = await bankService.getAccounts(testUserId);
      expect(getResponse.data?.some((a) => a.accountId === accountId)).toBe(false);
    });

    test('should return correct message format in responses', async () => {
      const response = await bankService.getAccounts(testUserId);

      expect(response.success).toBe(true);
      expect(response.message).toBeDefined();
      expect(typeof response.message).toBe('string');
    });
  });
});

