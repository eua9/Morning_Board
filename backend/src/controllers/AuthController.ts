/**
 * Authentication Controller
 * Handles user authentication-related operations
 *
 * Responsibilities:
 * - User registration
 * - User login
 * - Password reset
 * - Token management
 * - Session management
 */

import { Request, Response } from 'express';
import { User } from '../models/User';
import { getDatabase } from '../config/database';
import {
  generateTokenPair,
  generateAccessToken,
  verifyToken,
  isTokenExpired,
  TokenPayload,
} from '../utils/jwt';

export class AuthController {
  /**
   * Register a new user
   * @param req - Express request object containing user registration data
   * @param res - Express response object
   * @returns JSON response with user data and token (excluding password)
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement user registration
      // 1. Validate request data (email, password, firstName, lastName)
      // 2. Check if user with email already exists
      // 3. Hash password
      // 4. Create new User instance
      // 5. Save user to database
      // 6. Generate JWT token
      // 7. Return user data and token (exclude password)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, password: _password, firstName, lastName } = req.body;

      // Placeholder response
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: 'placeholder-id',
          email: email || 'placeholder@example.com',
          firstName,
          lastName,
        },
        token: 'placeholder-token',
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Authenticate user and return token
   * @param req - Express request object containing username/email and password
   * @param res - Express response object
   * @returns JSON response with user data and token
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validate request data
      const { email: identifier, password } = req.body;

      if (!identifier || !password) {
        res.status(400).json({
          message: 'Login failed',
          error: 'Username/email and password are required',
        });
        return;
      }

      if (typeof identifier !== 'string' || typeof password !== 'string') {
        res.status(400).json({
          message: 'Login failed',
          error: 'Invalid input format',
        });
        return;
      }

      // 2. Find user by username or email
      const db = getDatabase();

      // Try username first, then email
      let userRow = db
        .prepare('SELECT * FROM users WHERE username = ?')
        .get(identifier) as
        | {
            id: string;
            username: string;
            email: string;
            password: string;
            first_name: string;
            last_name: string;
            created_at: string;
            updated_at: string;
          }
        | undefined;

      // If not found by username, try email
      if (!userRow) {
        userRow = db
          .prepare('SELECT * FROM users WHERE email = ?')
          .get(identifier) as typeof userRow;
      }

      if (!userRow) {
        res.status(401).json({
          message: 'Login failed',
          error: 'User not found',
        });
        return;
      }

      // 3. Create User instance from database row
      const user = new User({
        id: userRow.id,
        username: userRow.username,
        email: userRow.email,
        password: userRow.password,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        createdAt: new Date(userRow.created_at),
        updatedAt: new Date(userRow.updated_at),
      });

      // 4. Authenticate password using User model's authenticate method
      const isAuthenticated = await user.authenticate(password);

      if (!isAuthenticated) {
        res.status(401).json({
          message: 'Login failed',
          error: 'Invalid password',
        });
        return;
      }

      // 5. Generate JWT token pair (access + refresh tokens)
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        username: user.username,
      };

      const tokens = generateTokenPair(tokenPayload);

      // 6. Return user data and tokens (exclude password)
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Login failed',
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    }
  }

  /**
   * Logout user (invalidate token/session)
   * @param req - Express request object (should contain auth token)
   * @param res - Express response object
   * @returns JSON response confirming logout
   */
  static async logout(_req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement logout
      // 1. Extract token from request
      // 2. Invalidate token (add to blacklist or remove from active sessions)
      // 3. Return success response

      // Placeholder response
      res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Logout failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Request password reset
   * @param req - Express request object containing email
   * @param res - Express response object
   * @returns JSON response confirming password reset email sent
   */
  static async requestPasswordReset(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // TODO: Implement password reset request
      // 1. Validate email in request
      // 2. Find user by email
      // 3. Generate reset token
      // 4. Store reset token with expiration
      // 5. Send password reset email
      // 6. Return success response (don't expose if user exists)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email: _email } = req.body;

      // Placeholder response
      res.status(200).json({
        message:
          'If an account exists with this email, a password reset link has been sent',
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Password reset request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Reset password using reset token
   * @param req - Express request object containing reset token and new password
   * @param res - Express response object
   * @returns JSON response confirming password reset
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement password reset
      // 1. Validate reset token and new password
      // 2. Verify reset token is valid and not expired
      // 3. Find user associated with token
      // 4. Hash new password
      // 5. Update user password
      // 6. Invalidate reset token
      // 7. Return success response

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { token: _token, newPassword: _newPassword } = req.body;

      // Placeholder response
      res.status(200).json({
        message: 'Password reset successful',
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(400).json({
        message: 'Password reset failed',
        error:
          error instanceof Error ? error.message : 'Invalid or expired token',
      });
    }
  }

  /**
   * Verify authentication token
   * @param req - Express request object containing auth token
   * @param res - Express response object
   * @returns JSON response with user data if token is valid
   */
  static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      // 1. Extract token from request headers
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          message: 'Token verification failed',
          error: 'No token provided',
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // 2. Verify JWT token signature and expiration
      const payload = verifyToken(token);

      if (!payload) {
        res.status(401).json({
          message: 'Token verification failed',
          error: 'Invalid or expired token',
        });
        return;
      }

      // 3. Get user data from database
      const db = getDatabase();
      const userRow = db
        .prepare('SELECT * FROM users WHERE id = ?')
        .get(payload.userId) as
        | {
            id: string;
            username: string;
            email: string;
            first_name: string;
            last_name: string;
          }
        | undefined;

      if (!userRow) {
        res.status(401).json({
          message: 'Token verification failed',
          error: 'User not found',
        });
        return;
      }

      // 4. Return user data if valid
      res.status(200).json({
        message: 'Token is valid',
        user: {
          id: userRow.id,
          email: userRow.email,
          username: userRow.username,
          firstName: userRow.first_name,
          lastName: userRow.last_name,
        },
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        message: 'Token verification failed',
        error: error instanceof Error ? error.message : 'Invalid token',
      });
    }
  }

  /**
   * Refresh authentication token
   * @param req - Express request object containing refresh token
   * @param res - Express response object
   * @returns JSON response with new access token
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      // 1. Extract refresh token from request body
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          message: 'Token refresh failed',
          error: 'Refresh token is required',
        });
        return;
      }

      // 2. Verify refresh token
      const payload = verifyToken(refreshToken);

      if (!payload || isTokenExpired(refreshToken)) {
        res.status(401).json({
          message: 'Token refresh failed',
          error: 'Invalid or expired refresh token',
        });
        return;
      }

      // 3. Verify user still exists
      const db = getDatabase();
      const userRow = db
        .prepare('SELECT id FROM users WHERE id = ?')
        .get(payload.userId) as { id: string } | undefined;

      if (!userRow) {
        res.status(401).json({
          message: 'Token refresh failed',
          error: 'User not found',
        });
        return;
      }

      // 4. Generate new access token
      const newAccessToken = generateAccessToken({
        userId: payload.userId,
        email: payload.email,
        username: payload.username,
      });

      // 5. Return new token
      res.status(200).json({
        message: 'Token refreshed successfully',
        token: newAccessToken,
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        message: 'Token refresh failed',
        error: error instanceof Error ? error.message : 'Invalid refresh token',
      });
    }
  }
}
