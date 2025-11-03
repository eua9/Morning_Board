/**
 * App Entry Point
 * Main application component with navigation setup
 */

import React from "react";
import { AuthProvider } from "./services/authContext";
import AppNavigator from "./navigation/AppNavigator";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;

