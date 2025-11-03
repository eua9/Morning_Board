/**
 * Authentication Context
 * Provides authentication state and navigation helpers
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, getAuthToken, clearAuthData } from "./storage";
import { resetToScreen } from "../navigation/navigationService";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const token = await getAuthToken();
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated && token !== null);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    setIsAuth(true);
    // Navigation is handled by LoginScreen
  };

  const logout = async () => {
    try {
      await clearAuthData();
      setIsAuth(false);
      // Reset navigation stack to login
      resetToScreen("Login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still navigate to login even if clearing storage fails
      resetToScreen("Login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuth,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

