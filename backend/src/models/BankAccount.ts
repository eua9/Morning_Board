/**
 * BankAccount Model
 * Represents a bank account associated with a user in the Morning Board application
 * 
 * Properties:
 * - accountId: Unique identifier for the account
 * - userId: Foreign key referencing the user who owns this account
 * - name: Display name of the bank account (e.g., "Checking Account", "Savings Account")
 * - balance: Current account balance (stored as integer representing cents, or decimal)
 * - createdAt: Account creation timestamp
 * - updatedAt: Last update timestamp
 * 
 * Relationships:
 * - One User can have many BankAccounts (one-to-many)
 */

import { getDatabase } from '../config/database';

export interface IBankAccount {
  accountId: string;
  userId: string;
  name: string;
  balance: number; // Decimal number representing currency (e.g., 1234.56 for $1,234.56)
  createdAt: Date;
  updatedAt: Date;
}

export class BankAccount implements IBankAccount {
  accountId: string;
  userId: string;
  name: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IBankAccount>) {
    this.accountId = data.accountId || '';
    this.userId = data.userId || '';
    this.name = data.name || '';
    this.balance = data.balance ?? 0; // Default to 0 for new accounts
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Create a new bank account instance
   * @param accountData - Bank account data to create account from
   * @returns New BankAccount instance
   */
  static create(accountData: Partial<IBankAccount>): BankAccount {
    return new BankAccount({
      ...accountData,
      balance: accountData.balance ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Update account properties
   * @param updates - Partial account data to update
   */
  update(updates: Partial<Omit<IBankAccount, 'accountId' | 'userId' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date();
  }

  /**
   * Convert account to plain object for API responses
   * @returns BankAccount object
   */
  toJSON(): IBankAccount {
    return {
      accountId: this.accountId,
      userId: this.userId,
      name: this.name,
      balance: this.balance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validate account data
   * @returns true if account data is valid, false otherwise
   */
  validate(): boolean {
    return !!(
      this.accountId &&
      this.userId &&
      this.name &&
      this.name.trim().length > 0 &&
      typeof this.balance === 'number' &&
      !isNaN(this.balance)
    );
  }

  /**
   * Format balance as currency string
   * @param locale - Locale for currency formatting (default: 'en-US')
   * @param currency - Currency code (default: 'USD')
   * @returns Formatted currency string
   */
  formatBalance(locale: string = 'en-US', currency: string = 'USD'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(this.balance);
  }

  /**
   * Find bank account by ID
   * @param accountId - Account ID
   * @returns BankAccount instance or null if not found
   */
  static findById(accountId: string): BankAccount | null {
    try {
      const db = getDatabase();
      const row = db
        .prepare('SELECT * FROM bank_accounts WHERE account_id = ?')
        .get(accountId) as any;

      if (!row) {
        return null;
      }

      return BankAccount.fromDatabaseRow(row);
    } catch (error) {
      console.error('Error finding bank account by ID:', error);
      return null;
    }
  }

  /**
   * Find all bank accounts for a user
   * @param userId - User ID
   * @returns Array of BankAccount instances
   */
  static findByUserId(userId: string): BankAccount[] {
    try {
      const db = getDatabase();
      const rows = db
        .prepare('SELECT * FROM bank_accounts WHERE user_id = ? ORDER BY created_at ASC')
        .all(userId) as Array<any>;

      return rows.map((row) => BankAccount.fromDatabaseRow(row));
    } catch (error) {
      console.error('Error finding bank accounts by user ID:', error);
      return [];
    }
  }

  /**
   * Create a BankAccount instance from a database row
   * @param row - Database row
   * @returns BankAccount instance
   */
  static fromDatabaseRow(row: any): BankAccount {
    return new BankAccount({
      accountId: row.account_id,
      userId: row.user_id,
      name: row.name,
      balance: row.balance,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  /**
   * Convert BankAccount instance to database row format
   * @returns Database row object
   */
  toDatabaseRow(): {
    account_id: string;
    user_id: string;
    name: string;
    balance: number;
    created_at: string;
    updated_at: string;
  } {
    return {
      account_id: this.accountId,
      user_id: this.userId,
      name: this.name,
      balance: this.balance,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }

  /**
   * Save bank account to database
   * @returns Saved bank account instance
   */
  save(): BankAccount {
    try {
      if (!this.validate()) {
        throw new Error('Invalid bank account data');
      }

      const db = getDatabase();
      const row = this.toDatabaseRow();

      // Check if account exists
      const existing = BankAccount.findById(this.accountId);

      if (existing) {
        // Update existing account
        db.prepare(
          `
          UPDATE bank_accounts 
          SET name = ?, balance = ?, updated_at = ? 
          WHERE account_id = ?
        `
        ).run(row.name, row.balance, row.updated_at, row.account_id);
      } else {
        // Insert new account
        db.prepare(
          `
          INSERT INTO bank_accounts (account_id, user_id, name, balance, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `
        ).run(
          row.account_id,
          row.user_id,
          row.name,
          row.balance,
          row.created_at,
          row.updated_at
        );
      }

      this.updatedAt = new Date();
      return this;
    } catch (error) {
      console.error('Error saving bank account:', error);
      throw error;
    }
  }

  /**
   * Delete bank account from database
   * @returns true if deleted successfully, false otherwise
   */
  delete(): boolean {
    try {
      const db = getDatabase();
      const result = db.prepare('DELETE FROM bank_accounts WHERE account_id = ?').run(this.accountId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting bank account:', error);
      return false;
    }
  }

  /**
   * Update account balance
   * @param newBalance - New balance value
   */
  updateBalance(newBalance: number): void {
    if (typeof newBalance !== 'number' || isNaN(newBalance)) {
      throw new Error('Invalid balance value');
    }
    this.balance = newBalance;
    this.updatedAt = new Date();
  }

  /**
   * Add amount to balance (deposit)
   * @param amount - Amount to add
   */
  deposit(amount: number): void {
    if (amount < 0) {
      throw new Error('Deposit amount cannot be negative');
    }
    this.balance += amount;
    this.updatedAt = new Date();
  }

  /**
   * Subtract amount from balance (withdrawal)
   * @param amount - Amount to subtract
   * @throws Error if insufficient funds
   */
  withdraw(amount: number): void {
    if (amount < 0) {
      throw new Error('Withdrawal amount cannot be negative');
    }
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }
    this.balance -= amount;
    this.updatedAt = new Date();
  }
}

