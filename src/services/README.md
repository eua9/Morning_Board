# Services

This directory contains service modules for API communication and data storage.

## API Service (`api.ts`)

Handles HTTP requests to the backend API with comprehensive error handling.

## Storage Service (`storage.ts`)

Handles secure storage of authentication tokens and user data.

### Current Implementation

Currently uses a mock storage interface that will work with localStorage in development. When React Native is initialized, this should be upgraded to secure storage.

### Upgrading to Secure Storage

#### For Expo Projects

1. Install `expo-secure-store`:
   ```bash
   npx expo install expo-secure-store
   ```

2. Update `storage.ts`:
   ```typescript
   import * as SecureStore from 'expo-secure-store';
   
   const initializeStorage = async (): Promise<StorageInterface> => {
     return {
       async setItem(key: string, value: string): Promise<void> {
         await SecureStore.setItemAsync(key, value);
       },
       async getItem(key: string): Promise<string | null> {
         return await SecureStore.getItemAsync(key);
       },
       async removeItem(key: string): Promise<void> {
         await SecureStore.deleteItemAsync(key);
       },
     };
   };
   ```

#### For Bare React Native Projects

1. Install `@react-native-async-storage/async-storage` for basic storage:
   ```bash
   npm install @react-native-async-storage/async-storage
   ```

2. Or install `react-native-keychain` for secure storage:
   ```bash
   npm install react-native-keychain
   ```

3. Update `storage.ts` with AsyncStorage:
   ```typescript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   const initializeStorage = async (): Promise<StorageInterface> => {
     return AsyncStorage as StorageInterface;
   };
   ```

4. Or with Keychain (more secure):
   ```typescript
   import * as Keychain from 'react-native-keychain';
   
   const initializeStorage = async (): Promise<StorageInterface> => {
     return {
       async setItem(key: string, value: string): Promise<void> {
         await Keychain.setGenericPassword(key, value);
       },
       async getItem(key: string): Promise<string | null> => {
         const credentials = await Keychain.getGenericPassword();
         if (credentials && credentials.username === key) {
           return credentials.password;
         }
         return null;
       },
       async removeItem(key: string): Promise<void> {
         await Keychain.resetGenericPassword();
       },
     };
   };
   ```

### API Reference

#### `storeAuthToken(token: string)`
Stores the authentication token securely.

#### `getAuthToken(): Promise<string | null>`
Retrieves the stored authentication token.

#### `storeUserData(userData: StoredUserData)`
Stores user information securely.

#### `getUserData(): Promise<StoredUserData | null>`
Retrieves stored user information.

#### `storeAuthData(token: string, userData: StoredUserData)`
Stores both token and user data in a single operation.

#### `clearAuthData()`
Removes all authentication data (for logout).

#### `isAuthenticated(): Promise<boolean>`
Checks if user has a valid stored token.

