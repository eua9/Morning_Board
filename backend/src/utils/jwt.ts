/**
 * JWT Token Service
 * Handles JWT token generation, verification, and expiration
 */

import jwt from 'jsonwebtoken';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // Default: 7 days
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'; // Default: 30 days

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until expiration
}

/**
 * Generate access token (short-lived, used for API requests)
 * @param payload - Token payload containing user information
 * @returns JWT access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'morning-board-api',
    audience: 'morning-board-app',
  } as jwt.SignOptions);
}

/**
 * Generate refresh token (long-lived, used to obtain new access tokens)
 * @param payload - Token payload containing user information
 * @returns JWT refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'morning-board-api',
    audience: 'morning-board-app',
  } as jwt.SignOptions);
}

/**
 * Generate both access and refresh tokens
 * @param payload - Token payload containing user information
 * @returns Object containing access token, refresh token, and expiration info
 */
export function generateTokenPair(payload: TokenPayload): TokenPair {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Calculate expiration time in seconds
  let expiresInSeconds = 7 * 24 * 60 * 60; // Default: 7 days in seconds
  if (JWT_EXPIRES_IN.endsWith('d')) {
    const days = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresInSeconds = days * 24 * 60 * 60;
  } else if (JWT_EXPIRES_IN.endsWith('h')) {
    const hours = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresInSeconds = hours * 60 * 60;
  } else if (JWT_EXPIRES_IN.endsWith('m')) {
    const minutes = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresInSeconds = minutes * 60;
  } else if (JWT_EXPIRES_IN.endsWith('s')) {
    expiresInSeconds = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
  }

  return {
    accessToken,
    refreshToken,
    expiresIn: expiresInSeconds,
  };
}

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'morning-board-api',
      audience: 'morning-board-app',
    }) as TokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.warn('Token expired:', error.message);
      return null;
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn('Invalid token:', error.message);
      return null;
    } else {
      console.error('Token verification error:', error);
      return null;
    }
  }
}

/**
 * Get token expiration time (Unix timestamp)
 * @param token - JWT token
 * @returns Expiration timestamp or null if invalid
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (decoded && decoded.exp) {
      return decoded.exp;
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 * @param token - JWT token
 * @returns True if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) {
    return true;
  }
  return Date.now() >= expiration * 1000;
}

