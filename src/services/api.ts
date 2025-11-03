/**
 * API Service
 * Handles HTTP requests to the backend API
 */

// TODO: Use environment variables or config file for API URL
// For now, using localhost for development
// For iOS simulator: use 'http://localhost:3000'
// For Android emulator: use 'http://10.0.2.2:3000'
// For physical device: use your computer's IP address, e.g., 'http://192.168.1.100:3000'
const API_BASE_URL = 'http://localhost:3000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface ApiError {
  message: string;
  error?: string;
  type: ErrorType;
  statusCode?: number;
}

/**
 * Perform login request
 * @param credentials - User email/username and password
 * @returns Promise with login response
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, create error from status
      const error: ApiError = {
        message: getErrorMessageForStatus(response.status),
        error: 'Failed to parse server response',
        type: getErrorTypeForStatus(response.status),
        statusCode: response.status,
      };
      throw error;
    }

    if (!response.ok) {
      // Handle API error response with specific error types
      const errorType = getErrorTypeForStatus(response.status);
      const error: ApiError = {
        message: data.message || getErrorMessageForStatus(response.status),
        error: data.error,
        type: errorType,
        statusCode: response.status,
      };
      throw error;
    }

    return data as LoginResponse;
  } catch (error) {
    // Handle network errors (no response received)
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      'type' in error
    ) {
      throw error as ApiError;
    }

    // Network error - fetch failed (no internet, server down, etc.)
    throw {
      message:
        'Unable to connect to the server. Please check your internet connection and try again.',
      error: 'Network connection failed',
      type: ErrorType.NETWORK_ERROR,
    } as ApiError;
  }
};

/**
 * Get error type based on HTTP status code
 */
function getErrorTypeForStatus(status: number): ErrorType {
  switch (status) {
    case 401:
      return ErrorType.UNAUTHORIZED;
    case 404:
      return ErrorType.NOT_FOUND;
    case 400:
    case 422:
      return ErrorType.VALIDATION_ERROR;
    case 500:
    case 502:
    case 503:
      return ErrorType.SERVER_ERROR;
    default:
      return ErrorType.UNKNOWN;
  }
}

/**
 * Get user-friendly error message based on HTTP status code
 */
function getErrorMessageForStatus(status: number): string {
  switch (status) {
    case 401:
      return 'Invalid email or password. Please try again.';
    case 404:
      return 'User not found. Please check your email and try again.';
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 422:
      return 'Validation error. Please check your input.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise with registration response
 */
export const register = async (userData: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, create error from status
      const error: ApiError = {
        message: getErrorMessageForStatus(response.status),
        error: 'Failed to parse server response',
        type: getErrorTypeForStatus(response.status),
        statusCode: response.status,
      };
      throw error;
    }

    if (!response.ok) {
      const errorType = getErrorTypeForStatus(response.status);
      const error: ApiError = {
        message: data.message || getErrorMessageForStatus(response.status),
        error: data.error,
        type: errorType,
        statusCode: response.status,
      };
      throw error;
    }

    return data as LoginResponse;
  } catch (error) {
    // Handle network errors (no response received)
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      'type' in error
    ) {
      throw error as ApiError;
    }

    // Network error - fetch failed (no internet, server down, etc.)
    throw {
      message:
        'Unable to connect to the server. Please check your internet connection and try again.',
      error: 'Network connection failed',
      type: ErrorType.NETWORK_ERROR,
    } as ApiError;
  }
};

