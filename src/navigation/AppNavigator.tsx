/**
 * App Navigator
 * Main navigation configuration with authentication flow
 * Prevents back navigation from dashboard to login
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationRef } from "./navigationService";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import { useAuth } from "../services/authContext";

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking auth status
  if (isLoading) {
    return null; // Could show a loading screen here
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Dashboard" : "Login"}
        screenOptions={{
          headerShown: false, // Hide default headers
          animation: "slide_from_right",
        }}
      >
        {/* Login Screen - Only accessible when not authenticated */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            // Prevent going back to login after successful login
            gestureEnabled: false,
            animation: "fade",
          }}
        />

        {/* Dashboard Screen - Only accessible when authenticated */}
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            // Prevent back navigation to login
            gestureEnabled: false,
            headerBackVisible: false,
            // Replace login in stack when navigating to dashboard
            animation: "fade",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

