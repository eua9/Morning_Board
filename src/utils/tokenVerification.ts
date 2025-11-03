/**
 * Token Verification Utility
 * Verifies token format and validity
 */

import { getAuthData, isTokenExpired } from '../services/storage';

/**
 * Verify stored token format and validity
 * @returns Object with verification results
 */
export async function verifyStoredToken(): Promise<{
  isValid: boolean;
  hasToken: boolean;
  hasRefreshToken: boolean;
  isExpired: boolean;
  expiresAt: number | null;
  tokenFormat: 'JWT' | 'INVALID' | 'NONE';
  error?: string;
}> {
  try {
    const authData = await getAuthData();

    if (!authData || !authData.token) {
      return {
        isValid: false,
        hasToken: false,
        hasRefreshToken: false,
        isExpired: true,
        expiresAt: null,
        tokenFormat: 'NONE',
        error: 'No token stored',
      };
    }

    // Check token format (JWT tokens have 3 parts separated by dots)
    const tokenParts = authData.token.split('.');
    const isJWTFormat = tokenParts.length === 3;

    // Check expiration
    const expired = await isTokenExpired();

    return {
      isValid: isJWTFormat && !expired && !!authData.userData,
      hasToken: true,
      hasRefreshToken: !!authData.refreshToken,
      isExpired: expired,
      expiresAt: authData.expiresAt || null,
      tokenFormat: isJWTFormat ? 'JWT' : 'INVALID',
    };
  } catch (error) {
    return {
      isValid: false,
      hasToken: false,
      hasRefreshToken: false,
      isExpired: true,
      expiresAt: null,
      tokenFormat: 'NONE',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Decode JWT token payload (without verification)
 * For debugging/verification purposes only
 */
export function decodeTokenPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

