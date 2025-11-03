/**
 * BankService - Mock Implementation
 * 
 * ⚠️ MOCK SERVICE WARNING ⚠️
 * 
 * This is a MOCK implementation of the BankService. It simulates bank account
 * operations without calling any real external banking API.
 * 
 * PURPOSE:
 * - Allows frontend and backend development to proceed in parallel
 * - Provides a stable interface for UI development
 * - Enables testing without external dependencies
 * 
 * REPLACEMENT STRATEGY:
 * When the real banking API is ready, this service should be replaced with
 * a real implementation that:
 * 1. Maintains the same interface (getAccounts, addAccount)
 * 2. Calls the actual external banking API
 * 3. Handles real authentication and verification
 * 4. Processes real account data
 * 
 * The interface is designed to be easily swappable - the real service will
 * implement the same IBankService interface.
 * 
 * @see BankAccount model for data structure
 */

import { BankAccount } from '../models/BankAccount';

/**
 * Account information for creating a new account
 */
export interface AddAccountRequest {
  name: string;
  accountNumber?: string; // Optional: for mock, this is just a display value
  initialBalance?: number; // Optional: defaults to 0.00
  accountType?: string; // Optional: e.g., "Checking", "Savings"
}

/**
 * Service response wrapper
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * BankService Interface
 * This interface defines the contract that both mock and real implementations must follow.
 * When replacing the mock with a real service, ensure the real implementation
 * maintains this same interface for seamless integration.
 */
export interface IBankService {
  /**
   * Retrieve all bank accounts for a user
   * @param userId - User ID
   * @returns Promise resolving to array of BankAccount objects
   */
  getAccounts(userId: string): Promise<ServiceResponse<BankAccount[]>>;

  /**
   * Add a new bank account for a user
   * @param userId - User ID
   * @param accountInfo - Account information
   * @returns Promise resolving to the created BankAccount
   */
  addAccount(
    userId: string,
    accountInfo: AddAccountRequest
  ): Promise<ServiceResponse<BankAccount>>;

  /**
   * Get a specific account by ID
   * @param accountId - Account ID
   * @returns Promise resolving to BankAccount or null if not found
   */
  getAccountById(accountId: string): Promise<ServiceResponse<BankAccount | null>>;

  /**
   * Delete an account
   * @param accountId - Account ID
   * @param userId - User ID (for verification)
   * @returns Promise resolving to success status
   */
  deleteAccount(
    accountId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>>;
}

/**
 * Mock BankService Implementation
 * 
 * This service uses the database (via BankAccount model) to store accounts,
 * but does NOT verify with any real banking API. It's a mock for development.
 * 
 * MOCK BEHAVIOR:
 * - Accounts are stored in the database (persistent)
 * - No real account verification is performed
 * - Account numbers are accepted as-is (no validation against real banks)
 * - Initial balances default to 0.00 unless specified
 * - Duplicate account numbers are allowed (since we're not verifying)
 */
export class BankService implements IBankService {
  /**
   * Generate a mock account ID
   * In a real implementation, this would come from the banking API
   */
  private generateAccountId(): string {
    return `mock-account-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate account information
   * Basic validation for mock service - real service would have stricter rules
   */
  private validateAccountInfo(accountInfo: AddAccountRequest): {
    valid: boolean;
    error?: string;
  } {
    if (!accountInfo.name || accountInfo.name.trim().length === 0) {
      return { valid: false, error: 'Account name is required' };
    }

    if (accountInfo.name.length > 100) {
      return { valid: false, error: 'Account name must be 100 characters or less' };
    }

    if (accountInfo.initialBalance !== undefined) {
      if (typeof accountInfo.initialBalance !== 'number' || isNaN(accountInfo.initialBalance)) {
        return { valid: false, error: 'Initial balance must be a valid number' };
      }
      // In a real service, there might be minimum balance requirements
    }

    return { valid: true };
  }

  /**
   * Retrieve all bank accounts for a user
   * 
   * MOCK BEHAVIOR:
   * - Fetches accounts from the database using BankAccount model
   * - Returns empty array if user has no accounts
   * - No external API calls are made
   * 
   * @param userId - User ID
   * @returns Promise with array of BankAccount objects
   */
  async getAccounts(userId: string): Promise<ServiceResponse<BankAccount[]>> {
    try {
      if (!userId || userId.trim().length === 0) {
        return {
          success: false,
          error: 'User ID is required',
        };
      }

      console.log(`[BankService] Fetching accounts for user: ${userId}`);

      // Fetch accounts from database using the BankAccount model
      const accounts = BankAccount.findByUserId(userId);

      console.log(`[BankService] Found ${accounts.length} account(s) for user ${userId}`);

      return {
        success: true,
        data: accounts,
        message: `Retrieved ${accounts.length} account(s)`,
      };
    } catch (error) {
      console.error('[BankService] Error fetching accounts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch accounts',
      };
    }
  }

  /**
   * Add a new bank account for a user
   * 
   * MOCK BEHAVIOR:
   * - Creates a new BankAccount in the database
   * - Generates a mock account ID (not from real bank)
   * - No verification against real banking API
   * - Accepts account number as-is (no validation)
   * - Sets initial balance to 0.00 unless specified
   * 
   * @param userId - User ID
   * @param accountInfo - Account information
   * @returns Promise with created BankAccount
   */
  async addAccount(
    userId: string,
    accountInfo: AddAccountRequest
  ): Promise<ServiceResponse<BankAccount>> {
    try {
      // Validate inputs
      if (!userId || userId.trim().length === 0) {
        return {
          success: false,
          error: 'User ID is required',
        };
      }

      const validation = this.validateAccountInfo(accountInfo);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error || 'Invalid account information',
        };
      }

      console.log(`[BankService] Adding account for user ${userId}:`, {
        name: accountInfo.name,
        accountType: accountInfo.accountType,
        initialBalance: accountInfo.initialBalance,
      });

      // Generate mock account ID
      // In a real service, this would come from the banking API response
      const accountId = this.generateAccountId();

      // Create new BankAccount instance
      const newAccount = BankAccount.create({
        accountId,
        userId,
        name: accountInfo.name.trim(),
        balance: accountInfo.initialBalance ?? 0.0, // Default to 0.00
      });

      // Save to database
      newAccount.save();

      console.log(`[BankService] Account created successfully: ${accountId} (${newAccount.name})`);

      return {
        success: true,
        data: newAccount,
        message: 'Account added successfully',
      };
    } catch (error) {
      console.error('[BankService] Error adding account:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add account',
      };
    }
  }

  /**
   * Get a specific account by ID
   * 
   * @param accountId - Account ID
   * @returns Promise with BankAccount or null if not found
   */
  async getAccountById(
    accountId: string
  ): Promise<ServiceResponse<BankAccount | null>> {
    try {
      if (!accountId || accountId.trim().length === 0) {
        return {
          success: false,
          error: 'Account ID is required',
        };
      }

      console.log(`[BankService] Fetching account: ${accountId}`);

      const account = BankAccount.findById(accountId);

      if (!account) {
        console.log(`[BankService] Account not found: ${accountId}`);
        return {
          success: true,
          data: null,
          message: 'Account not found',
        };
      }

      return {
        success: true,
        data: account,
      };
    } catch (error) {
      console.error('[BankService] Error fetching account:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch account',
      };
    }
  }

  /**
   * Delete an account
   * 
   * @param accountId - Account ID
   * @param userId - User ID (for verification)
   * @returns Promise with success status
   */
  async deleteAccount(
    accountId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      if (!accountId || accountId.trim().length === 0) {
        return {
          success: false,
          error: 'Account ID is required',
        };
      }

      if (!userId || userId.trim().length === 0) {
        return {
          success: false,
          error: 'User ID is required',
        };
      }

      console.log(`[BankService] Deleting account ${accountId} for user ${userId}`);

      // Verify account belongs to user
      const account = BankAccount.findById(accountId);
      if (!account) {
        return {
          success: false,
          error: 'Account not found',
        };
      }

      if (account.userId !== userId) {
        return {
          success: false,
          error: 'Account does not belong to user',
        };
      }

      // Delete account
      const deleted = account.delete();

      if (deleted) {
        console.log(`[BankService] Account deleted successfully: ${accountId}`);
        return {
          success: true,
          data: true,
          message: 'Account deleted successfully',
        };
      } else {
        return {
          success: false,
          error: 'Failed to delete account',
        };
      }
    } catch (error) {
      console.error('[BankService] Error deleting account:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete account',
      };
    }
  }
}

// Export singleton instance
export const bankService = new BankService();

