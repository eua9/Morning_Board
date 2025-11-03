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

export interface ApiError {
  message: string;
  error?: string;
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

    const data = await response.json();

    if (!response.ok) {
      // Handle API error response
      const error: ApiError = {
        message: data.message || 'Login failed',
        error: data.error,
      };
      throw error;
    }

    return data as LoginResponse;
  } catch (error) {
    // Handle network errors or parsing errors
    if (error && typeof error === 'object' && 'message' in error) {
      throw error as ApiError;
    }
    throw {
      message: 'Network error. Please check your connection.',
      error: 'Unable to connect to server',
    } as ApiError;
  }
};

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

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || 'Registration failed',
        error: data.error,
      };
      throw error;
    }

    return data as LoginResponse;
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw error as ApiError;
    }
    throw {
      message: 'Network error. Please check your connection.',
      error: 'Unable to connect to server',
    } as ApiError;
  }
};

