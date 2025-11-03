/**
 * Storage Service
 * Handles secure storage of authentication tokens and user data
 * 
 * Uses AsyncStorage for development (works on iOS/Android)
 * For production, consider using:
 * - expo-secure-store (Expo projects)
 * - react-native-keychain (bare React Native)
 */

const TOKEN_KEY = '@morning_board:auth_token';
const REFRESH_TOKEN_KEY = '@morning_board:refresh_token';
const USER_KEY = '@morning_board:user_data';
const TOKEN_EXPIRES_KEY = '@morning_board:token_expires';
const WIDGET_ORDER_KEY = '@morning_board:widget_order';

export interface StoredUserData {
  id: string;
  email: string;
  username?: string;
}

export interface StoredAuthData {
  token: string;
  refreshToken?: string;
  expiresAt?: number; // Unix timestamp
  userData: StoredUserData;
}

/**
 * Storage interface for abstracting storage implementation
 * Allows easy switching between AsyncStorage and secure storage
 */
interface StorageInterface {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

// Default to AsyncStorage
// TODO: Replace with secure storage in production
// For Expo: import * as SecureStore from 'expo-secure-store';
// For bare RN: import * as Keychain from 'react-native-keychain';
let storage: StorageInterface | null = null;

/**
 * Initialize storage interface
 * Uses AsyncStorage for now, can be switched to secure storage
 */
const initializeStorage = async (): Promise<StorageInterface> => {
  // TODO: When React Native is initialized, use actual AsyncStorage
  // import AsyncStorage from '@react-native-async-storage/async-storage';
  // return AsyncStorage as StorageInterface;
  
  // For now, create a mock storage that will be replaced
  // This allows the code to compile and be ready for RN initialization
  return {
    async setItem(key: string, value: string): Promise<void> {
      // Mock implementation - will be replaced with AsyncStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      console.log(`[Storage] Set item: ${key}`);
    },
    async getItem(key: string): Promise<string | null> {
      // Mock implementation - will be replaced with AsyncStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      console.log(`[Storage] Get item: ${key}`);
      return null;
    },
    async removeItem(key: string): Promise<void> {
      // Mock implementation - will be replaced with AsyncStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      console.log(`[Storage] Remove item: ${key}`);
    },
  };
};

/**
 * Get storage instance (lazy initialization)
 */
const getStorage = async (): Promise<StorageInterface> => {
  if (!storage) {
    storage = await initializeStorage();
  }
  return storage;
};

/**
 * Store authentication token
 * @param token - JWT token or session token
 */
export const storeAuthToken = async (token: string): Promise<void> => {
  try {
    const storageInstance = await getStorage();
    await storageInstance.setItem(TOKEN_KEY, token);
    console.log('[Storage] Auth token stored successfully');
  } catch (error) {
    console.error('[Storage] Failed to store auth token:', error);
    throw new Error('Failed to store authentication token');
  }
};

/**
 * Retrieve authentication token
 * @returns Token string or null if not found
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const storageInstance = await getStorage();
    const token = await storageInstance.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('[Storage] Failed to retrieve auth token:', error);
    return null;
  }
};

/**
 * Store user data
 * @param userData - User information to store
 */
export const storeUserData = async (userData: StoredUserData): Promise<void> => {
  try {
    const storageInstance = await getStorage();
    const userDataString = JSON.stringify(userData);
    await storageInstance.setItem(USER_KEY, userDataString);
    console.log('[Storage] User data stored successfully');
  } catch (error) {
    console.error('[Storage] Failed to store user data:', error);
    throw new Error('Failed to store user data');
  }
};

/**
 * Retrieve user data
 * @returns User data object or null if not found
 */
export const getUserData = async (): Promise<StoredUserData | null> => {
  try {
    const storageInstance = await getStorage();
    const userDataString = await storageInstance.getItem(USER_KEY);
    
    if (!userDataString) {
      return null;
    }
    
    return JSON.parse(userDataString) as StoredUserData;
  } catch (error) {
    console.error('[Storage] Failed to retrieve user data:', error);
    return null;
  }
};

/**
 * Store refresh token
 * @param refreshToken - JWT refresh token
 */
export const storeRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    const storageInstance = await getStorage();
    await storageInstance.setItem(REFRESH_TOKEN_KEY, refreshToken);
    console.log('[Storage] Refresh token stored successfully');
  } catch (error) {
    console.error('[Storage] Failed to store refresh token:', error);
    throw new Error('Failed to store refresh token');
  }
};

/**
 * Retrieve refresh token
 * @returns Refresh token string or null if not found
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const storageInstance = await getStorage();
    const token = await storageInstance.getItem(REFRESH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('[Storage] Failed to retrieve refresh token:', error);
    return null;
  }
};

/**
 * Store token expiration timestamp
 * @param expiresIn - Expiration time in seconds from now
 */
export const storeTokenExpiration = async (expiresIn: number): Promise<void> => {
  try {
    const storageInstance = await getStorage();
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn; // Unix timestamp
    await storageInstance.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());
    console.log('[Storage] Token expiration stored successfully');
  } catch (error) {
    console.error('[Storage] Failed to store token expiration:', error);
    throw new Error('Failed to store token expiration');
  }
};

/**
 * Get token expiration timestamp
 * @returns Expiration timestamp (Unix seconds) or null
 */
export const getTokenExpiration = async (): Promise<number | null> => {
  try {
    const storageInstance = await getStorage();
    const expiresAt = await storageInstance.getItem(TOKEN_EXPIRES_KEY);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  } catch (error) {
    console.error('[Storage] Failed to retrieve token expiration:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const expiresAt = await getTokenExpiration();
    if (!expiresAt) {
      return true; // Assume expired if no expiration stored
    }
    const now = Math.floor(Date.now() / 1000);
    return now >= expiresAt;
  } catch (error) {
    console.error('[Storage] Failed to check token expiration:', error);
    return true;
  }
};

/**
 * Store both token and user data with refresh token and expiration
 * @param token - JWT access token
 * @param userData - User information
 * @param refreshToken - JWT refresh token (optional)
 * @param expiresIn - Token expiration in seconds (optional)
 */
export const storeAuthData = async (
  token: string,
  userData: StoredUserData,
  refreshToken?: string,
  expiresIn?: number
): Promise<void> => {
  try {
    const promises: Promise<void>[] = [
      storeAuthToken(token),
      storeUserData(userData),
    ];

    if (refreshToken) {
      promises.push(storeRefreshToken(refreshToken));
    }

    if (expiresIn) {
      promises.push(storeTokenExpiration(expiresIn));
    }

    await Promise.all(promises);
    console.log('[Storage] Authentication data stored successfully');
  } catch (error) {
    console.error('[Storage] Failed to store auth data:', error);
    throw error;
  }
};

/**
 * Retrieve all authentication data
 * @returns Complete auth data or null if not found
 */
export const getAuthData = async (): Promise<StoredAuthData | null> => {
  try {
    const [token, refreshToken, userData, expiresAt] = await Promise.all([
      getAuthToken(),
      getRefreshToken(),
      getUserData(),
      getTokenExpiration(),
    ]);

    if (!token || !userData) {
      return null;
    }

    return {
      token,
      refreshToken: refreshToken || undefined,
      expiresAt: expiresAt || undefined,
      userData,
    };
  } catch (error) {
    console.error('[Storage] Failed to retrieve auth data:', error);
    return null;
  }
};

/**
 * Clear all authentication data (logout)
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    const storageInstance = await getStorage();
    await Promise.all([
      storageInstance.removeItem(TOKEN_KEY),
      storageInstance.removeItem(REFRESH_TOKEN_KEY),
      storageInstance.removeItem(USER_KEY),
      storageInstance.removeItem(TOKEN_EXPIRES_KEY),
    ]);
    console.log('[Storage] Authentication data cleared successfully');
  } catch (error) {
    console.error('[Storage] Failed to clear auth data:', error);
    throw new Error('Failed to clear authentication data');
  }
};

/**
 * Check if user is authenticated (has valid token)
 * @returns True if token exists, false otherwise
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    return token !== null && token.length > 0;
  } catch (error) {
    console.error('[Storage] Failed to check authentication status:', error);
    return false;
  }
};

/**
 * Store widget order (array of widget IDs)
 * @param widgetIds - Array of widget IDs in desired order
 */
export const storeWidgetOrder = async (widgetIds: string[]): Promise<void> => {
  try {
    const storageInstance = await getStorage();
    await storageInstance.setItem(WIDGET_ORDER_KEY, JSON.stringify(widgetIds));
    console.log('[Storage] Widget order stored successfully');
  } catch (error) {
    console.error('[Storage] Failed to store widget order:', error);
    throw new Error('Failed to store widget order');
  }
};

/**
 * Retrieve widget order
 * @returns Array of widget IDs in stored order, or null if not found
 */
export const getWidgetOrder = async (): Promise<string[] | null> => {
  try {
    const storageInstance = await getStorage();
    const orderString = await storageInstance.getItem(WIDGET_ORDER_KEY);
    
    if (!orderString) {
      return null;
    }
    
    return JSON.parse(orderString) as string[];
  } catch (error) {
    console.error('[Storage] Failed to retrieve widget order:', error);
    return null;
  }
};

/**
 * Clear widget order (reset to default)
 */
export const clearWidgetOrder = async (): Promise<void> => {
  try {
    const storageInstance = await getStorage();
    await storageInstance.removeItem(WIDGET_ORDER_KEY);
    console.log('[Storage] Widget order cleared successfully');
  } catch (error) {
    console.error('[Storage] Failed to clear widget order:', error);
    throw new Error('Failed to clear widget order');
  }
};

