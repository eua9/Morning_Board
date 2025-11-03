/**
 * BankAccount Model Tests
 */

import { BankAccount } from '../BankAccount';
import { getDatabase } from '../../config/database';
import { createTables } from '../../database/schema';

describe('BankAccount', () => {
  let testUserId: string;
  let testAccountId: string;

  beforeAll(() => {
    // Initialize test database
    const db = getDatabase();
    
    // Ensure foreign keys are enabled
    db.pragma('foreign_keys = ON');
    
    createTables(db);

    // Create a test user ID
    testUserId = 'test-user-123';
    testAccountId = 'test-account-123';

    // Create a test user in the database (required for foreign key constraint)
    // Delete existing test user first to avoid conflicts
    db.prepare('DELETE FROM bank_accounts WHERE user_id = ?').run(testUserId);
    db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
    
    // Insert test user with unique username/email for this test
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
  });

  beforeEach(() => {
    // Clean up test data before each test
    const db = getDatabase();
    db.prepare('DELETE FROM bank_accounts WHERE account_id LIKE ?').run('test-%');
  });

  describe('Constructor', () => {
    test('should create BankAccount with required fields', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.50,
      });

      expect(account.accountId).toBe(testAccountId);
      expect(account.userId).toBe(testUserId);
      expect(account.name).toBe('Checking Account');
      expect(account.balance).toBe(1000.50);
      expect(account.createdAt).toBeInstanceOf(Date);
      expect(account.updatedAt).toBeInstanceOf(Date);
    });

    test('should default balance to 0 if not provided', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Savings Account',
      });

      expect(account.balance).toBe(0);
    });

    test('should create BankAccount with default timestamps', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Test Account',
      });

      expect(account.createdAt).toBeInstanceOf(Date);
      expect(account.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Static create method', () => {
    test('should create BankAccount using static create method', () => {
      const account = BankAccount.create({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 500.00,
      });

      expect(account).toBeInstanceOf(BankAccount);
      expect(account.accountId).toBe(testAccountId);
      expect(account.balance).toBe(500.00);
      expect(account.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Validation', () => {
    test('should validate account with all required fields', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      expect(account.validate()).toBe(true);
    });

    test('should invalidate account with missing accountId', () => {
      const account = new BankAccount({
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      expect(account.validate()).toBe(false);
    });

    test('should invalidate account with missing userId', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      expect(account.validate()).toBe(false);
    });

    test('should invalidate account with empty name', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: '',
        balance: 1000.00,
      });

      expect(account.validate()).toBe(false);
    });

    test('should invalidate account with invalid balance', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: NaN,
      });

      expect(account.validate()).toBe(false);
    });
  });

  describe('Data manipulation', () => {
    test('should update account properties', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      account.update({ name: 'Savings Account', balance: 2000.00 });

      expect(account.name).toBe('Savings Account');
      expect(account.balance).toBe(2000.00);
      expect(account.updatedAt).toBeInstanceOf(Date);
    });

    test('should format balance as currency', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1234.56,
      });

      const formatted = account.formatBalance();
      expect(formatted).toContain('$1,234.56');
    });
  });

  describe('Balance operations', () => {
    test('should deposit money', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      account.deposit(500.00);
      expect(account.balance).toBe(1500.00);
    });

    test('should throw error on negative deposit', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      expect(() => account.deposit(-100.00)).toThrow('Deposit amount cannot be negative');
    });

    test('should withdraw money', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      account.withdraw(300.00);
      expect(account.balance).toBe(700.00);
    });

    test('should throw error on insufficient funds', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 100.00,
      });

      expect(() => account.withdraw(200.00)).toThrow('Insufficient funds');
    });

    test('should throw error on negative withdrawal', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      expect(() => account.withdraw(-100.00)).toThrow('Withdrawal amount cannot be negative');
    });

    test('should update balance directly', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      account.updateBalance(2500.00);
      expect(account.balance).toBe(2500.00);
    });

    test('should throw error on invalid balance update', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      expect(() => account.updateBalance(NaN)).toThrow('Invalid balance value');
    });
  });

  describe('Database operations', () => {
    test('should save account to database', () => {
      const account = BankAccount.create({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });

      account.save();

      const found = BankAccount.findById(testAccountId);
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Checking Account');
      expect(found?.balance).toBe(1000.00);
    });

    test('should find account by ID', () => {
      const account = BankAccount.create({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Savings Account',
        balance: 5000.00,
      });
      account.save();

      const found = BankAccount.findById(testAccountId);
      expect(found).not.toBeNull();
      expect(found?.accountId).toBe(testAccountId);
      expect(found?.name).toBe('Savings Account');
    });

    test('should return null for non-existent account', () => {
      const found = BankAccount.findById('non-existent-id');
      expect(found).toBeNull();
    });

    test('should find all accounts for a user', () => {
      const account1 = BankAccount.create({
        accountId: 'test-account-1',
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });
      account1.save();

      const account2 = BankAccount.create({
        accountId: 'test-account-2',
        userId: testUserId,
        name: 'Savings Account',
        balance: 5000.00,
      });
      account2.save();

      const accounts = BankAccount.findByUserId(testUserId);
      expect(accounts.length).toBeGreaterThanOrEqual(2);
      expect(accounts.some((a) => a.accountId === 'test-account-1')).toBe(true);
      expect(accounts.some((a) => a.accountId === 'test-account-2')).toBe(true);
    });

    test('should update existing account in database', () => {
      const account = BankAccount.create({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });
      account.save();

      account.update({ name: 'Updated Account', balance: 2000.00 });
      account.save();

      const found = BankAccount.findById(testAccountId);
      expect(found?.name).toBe('Updated Account');
      expect(found?.balance).toBe(2000.00);
    });

    test('should delete account from database', () => {
      const account = BankAccount.create({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
      });
      account.save();

      const deleted = account.delete();
      expect(deleted).toBe(true);

      const found = BankAccount.findById(testAccountId);
      expect(found).toBeNull();
    });

    test('should return false when deleting non-existent account', () => {
      const account = new BankAccount({
        accountId: 'non-existent-id',
        userId: testUserId,
        name: 'Test Account',
        balance: 0,
      });

      const deleted = account.delete();
      expect(deleted).toBe(false);
    });
  });

  describe('Serialization', () => {
    test('should convert to JSON', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-01-02T00:00:00Z'),
      });

      const json = account.toJSON();
      expect(json).toEqual({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-01-02T00:00:00Z'),
      });
    });

    test('should convert to database row format', () => {
      const account = new BankAccount({
        accountId: testAccountId,
        userId: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-01-02T00:00:00Z'),
      });

      const row = account.toDatabaseRow();
      expect(row).toEqual({
        account_id: testAccountId,
        user_id: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-02T00:00:00.000Z',
      });
    });

    test('should create from database row', () => {
      const row = {
        account_id: testAccountId,
        user_id: testUserId,
        name: 'Checking Account',
        balance: 1000.00,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      };

      const account = BankAccount.fromDatabaseRow(row);
      expect(account.accountId).toBe(testAccountId);
      expect(account.userId).toBe(testUserId);
      expect(account.name).toBe('Checking Account');
      expect(account.balance).toBe(1000.00);
    });
  });
});

