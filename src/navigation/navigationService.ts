/**
 * Navigation Service
 * Centralized navigation helper to access navigation from outside components
 */

import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./AppNavigator";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navigate to a screen
 */
export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params as any);
  }
}

/**
 * Reset navigation stack (useful for login/logout)
 */
export function resetToScreen(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
}

/**
 * Go back (if possible)
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

