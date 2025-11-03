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
const USER_KEY = '@morning_board:user_data';

export interface StoredUserData {
  id: string;
  email: string;
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
 * Store both token and user data
 * @param token - Authentication token
 * @param userData - User information
 */
export const storeAuthData = async (
  token: string,
  userData: StoredUserData
): Promise<void> => {
  try {
    await Promise.all([
      storeAuthToken(token),
      storeUserData(userData),
    ]);
    console.log('[Storage] Authentication data stored successfully');
  } catch (error) {
    console.error('[Storage] Failed to store auth data:', error);
    throw error;
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
      storageInstance.removeItem(USER_KEY),
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

