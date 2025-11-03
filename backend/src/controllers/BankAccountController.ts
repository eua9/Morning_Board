/**
 * Bank Account Controller
 * Handles HTTP requests for bank account operations
 * 
 * Responsibilities:
 * - GET /api/accounts - Retrieve all accounts for authenticated user
 * - POST /api/accounts - Add a new account for authenticated user
 * 
 * Authentication:
 * All endpoints require authentication via Bearer token in Authorization header
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { bankService, AddAccountRequest } from '../services/BankService';

export class BankAccountController {
  /**
   * GET /api/accounts
   * Retrieve all bank accounts for the authenticated user
   * 
   * @param req - Authenticated request (userId attached by middleware)
   * @param res - Express response object
   * @returns JSON response with array of accounts
   */
  static async getAccounts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      // userId is guaranteed to be present by authenticate middleware
      const userId = req.userId!;

      // Call service to get accounts
      const response = await bankService.getAccounts(userId);

      if (!response.success) {
        res.status(500).json({
          message: 'Failed to retrieve accounts',
          error: response.error,
        });
        return;
      }

      // Transform BankAccount objects to API response format
      const accounts = (response.data || []).map((account) => ({
        accountId: account.accountId,
        name: account.name,
        balance: account.balance,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      }));

      res.status(200).json({
        message: 'Accounts retrieved successfully',
        accounts,
        count: accounts.length,
      });
    } catch (error) {
      console.error('[BankAccountController] Error getting accounts:', error);
      res.status(500).json({
        message: 'Failed to retrieve accounts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/accounts
   * Add a new bank account for the authenticated user
   * 
   * Request Body:
   * {
   *   "name": "Checking Account",
   *   "accountNumber": "1234567890", // Optional, for mock service
   *   "initialBalance": 0.00, // Optional, defaults to 0.00
   *   "accountType": "Checking" // Optional
   * }
   * 
   * @param req - Authenticated request with account data in body
   * @param res - Express response object
   * @returns JSON response with created account (201 Created)
   */
  static async addAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      // userId is guaranteed to be present by authenticate middleware
      const userId = req.userId!;

      // Extract and validate request body
      const { name, accountNumber, initialBalance, accountType } = req.body;

      // Validate required fields
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({
          message: 'Validation failed',
          error: 'Account name is required and must be a non-empty string',
        });
        return;
      }

      // Validate initialBalance if provided
      if (initialBalance !== undefined) {
        if (typeof initialBalance !== 'number' || isNaN(initialBalance)) {
          res.status(400).json({
            message: 'Validation failed',
            error: 'Initial balance must be a valid number',
          });
          return;
        }
      }

      // Prepare account info for service
      const accountInfo: AddAccountRequest = {
        name: name.trim(),
        accountNumber: accountNumber ? String(accountNumber).trim() : undefined,
        initialBalance: initialBalance !== undefined ? Number(initialBalance) : undefined,
        accountType: accountType ? String(accountType).trim() : undefined,
      };

      // Call service to add account
      const response = await bankService.addAccount(userId, accountInfo);

      if (!response.success) {
        // Determine appropriate status code based on error
        const statusCode = response.error?.includes('required') || 
                          response.error?.includes('Invalid') 
                          ? 400 
                          : 500;

        res.status(statusCode).json({
          message: 'Failed to add account',
          error: response.error,
        });
        return;
      }

      // Transform BankAccount to API response format
      const account = response.data!;
      const accountResponse = {
        accountId: account.accountId,
        name: account.name,
        balance: account.balance,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      };

      res.status(201).json({
        message: 'Account added successfully',
        account: accountResponse,
      });
    } catch (error) {
      console.error('[BankAccountController] Error adding account:', error);
      res.status(500).json({
        message: 'Failed to add account',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/accounts/:accountId
   * Get a specific account by ID
   * 
   * @param req - Authenticated request with accountId in params
   * @param res - Express response object
   * @returns JSON response with account details
   */
  static async getAccountById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.userId!;
      const { accountId } = req.params;

      if (!accountId) {
        res.status(400).json({
          message: 'Validation failed',
          error: 'Account ID is required',
        });
        return;
      }

      // Get account from service
      const response = await bankService.getAccountById(accountId);

      if (!response.success) {
        res.status(500).json({
          message: 'Failed to retrieve account',
          error: response.error,
        });
        return;
      }

      if (!response.data) {
        res.status(404).json({
          message: 'Account not found',
          error: 'The specified account does not exist',
        });
        return;
      }

      // Verify account belongs to user
      const account = response.data;
      if (account.userId !== userId) {
        res.status(403).json({
          message: 'Access denied',
          error: 'You do not have permission to access this account',
        });
        return;
      }

      // Return account details
      res.status(200).json({
        message: 'Account retrieved successfully',
        account: {
          accountId: account.accountId,
          name: account.name,
          balance: account.balance,
          createdAt: account.createdAt.toISOString(),
          updatedAt: account.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      console.error('[BankAccountController] Error getting account:', error);
      res.status(500).json({
        message: 'Failed to retrieve account',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /api/accounts/:accountId
   * Delete a specific account
   * 
   * @param req - Authenticated request with accountId in params
   * @param res - Express response object
   * @returns JSON response confirming deletion
   */
  static async deleteAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.userId!;
      const { accountId } = req.params;

      if (!accountId) {
        res.status(400).json({
          message: 'Validation failed',
          error: 'Account ID is required',
        });
        return;
      }

      // Delete account via service
      const response = await bankService.deleteAccount(accountId, userId);

      if (!response.success) {
        // Determine appropriate status code
        let statusCode = 500;
        if (response.error?.includes('not found')) {
          statusCode = 404;
        } else if (response.error?.includes('does not belong')) {
          statusCode = 403;
        } else if (response.error?.includes('required')) {
          statusCode = 400;
        }

        res.status(statusCode).json({
          message: 'Failed to delete account',
          error: response.error,
        });
        return;
      }

      res.status(200).json({
        message: 'Account deleted successfully',
      });
    } catch (error) {
      console.error('[BankAccountController] Error deleting account:', error);
      res.status(500).json({
        message: 'Failed to delete account',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

