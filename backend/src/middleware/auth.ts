/**
 * Authentication Middleware
 * Verifies JWT tokens and extracts user information from requests
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

/**
 * Extended Request interface to include userId
 */
export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: TokenPayload;
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches userId to request
 *
 * Usage:
 * app.get('/api/accounts', authenticate, BankAccountController.getAccounts);
 */
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Authentication required',
        error:
          'No token provided. Please include a Bearer token in the Authorization header.',
      });
      return;
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    if (!token || token.trim().length === 0) {
      res.status(401).json({
        message: 'Authentication required',
        error: 'Invalid token format',
      });
      return;
    }

    // Verify and decode token
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({
        message: 'Authentication failed',
        error: 'Invalid or expired token',
      });
      return;
    }

    // Attach user information to request
    req.userId = payload.userId;
    req.user = payload;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    res.status(500).json({
      message: 'Authentication error',
      error: 'An error occurred while verifying authentication',
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 * Useful for endpoints that work both authenticated and unauthenticated
 */
export function optionalAuthenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);

      if (payload) {
        req.userId = payload.userId;
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    // Ignore errors in optional auth
    next();
  }
}
