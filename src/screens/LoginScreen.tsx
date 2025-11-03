/**
 * LoginScreen Component
 * React Native login screen with email/username and password fields
 * Matches app style guide design
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { login, ApiError, ErrorType } from "../services/api";

interface ValidationErrors {
  email?: string;
  password?: string;
}

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState<string>("");
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>(
    {
      email: false,
      password: false,
    }
  );

  // Email validation function
  const validateEmail = (emailValue: string): string | undefined => {
    if (!emailValue.trim()) {
      return "Email or username is required";
    }
    // Check if it's an email format (contains @ and .)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Allow username format (alphanumeric, underscore, hyphen, dot)
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;

    // If it contains @, validate as email; otherwise validate as username
    if (emailValue.includes("@")) {
      if (!emailRegex.test(emailValue)) {
        return "Please enter a valid email address";
      }
    } else {
      if (!usernameRegex.test(emailValue)) {
        return "Username can only contain letters, numbers, and ._-";
      }
      if (emailValue.length < 3) {
        return "Username must be at least 3 characters";
      }
    }
    return undefined;
  };

  // Password validation function
  const validatePassword = (passwordValue: string): string | undefined => {
    if (!passwordValue) {
      return "Password is required";
    }
    if (passwordValue.length < 8) {
      return "Password must be at least 8 characters";
    }
    return undefined;
  };

  // Validate form
  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  // Handle email input change
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (touched.email) {
      const error = validateEmail(text);
      setErrors((prev) => ({ ...prev, email: error }));
    }
  };

  // Handle password input change
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (touched.password) {
      const error = validatePassword(text);
      setErrors((prev) => ({ ...prev, password: error }));
    }
  };

  // Handle email blur
  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    const error = validateEmail(email);
    setErrors((prev) => ({ ...prev, email: error }));
  };

  // Handle password blur
  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    const error = validatePassword(password);
    setErrors((prev) => ({ ...prev, password: error }));
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    return (
      !emailError && !passwordError && email.trim() !== "" && password !== ""
    );
  };

  const handleLogin = async () => {
    // Validate form before submitting
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      setTouched({ email: true, password: true });
      return;
    }

    // Clear previous API errors
    setApiError("");

    setIsLoading(true);

    try {
      // Call login API
      const response = await login({
        email: email.trim(),
        password: password,
      });

      // Store token (TODO: Use secure storage in production)
      // For now, storing in a simple way - replace with secure storage later
      console.log("Login successful, token:", response.token);

      // TODO: Store token in secure storage (e.g., AsyncStorage or Keychain)
      // await SecureStore.setItemAsync('auth_token', response.token);

      // TODO: Navigate to dashboard
      // For now, show success alert
      Alert.alert("Success", "Login successful!", [
        {
          text: "OK",
          onPress: () => {
            // TODO: Navigate to dashboard
            // navigation.navigate('Dashboard');
            console.log("Navigate to dashboard");
          },
        },
      ]);
    } catch (error) {
      // Handle API error with specific error types
      const apiError = error as ApiError;
      
      // Get user-friendly error message based on error type
      let errorMessage = apiError.message || "Login failed. Please try again.";
      let alertTitle = "Login Failed";
      
      // Customize messages based on error type
      switch (apiError.type) {
        case ErrorType.NETWORK_ERROR:
          errorMessage =
            "Unable to connect to the server. Please check your internet connection and try again.";
          alertTitle = "Connection Error";
          break;
        case ErrorType.UNAUTHORIZED:
          // Check if it's a wrong password or user not found
          if (
            apiError.error?.toLowerCase().includes("password") ||
            apiError.error?.toLowerCase().includes("invalid")
          ) {
            errorMessage = "Incorrect password. Please try again.";
            alertTitle = "Authentication Failed";
          } else if (
            apiError.error?.toLowerCase().includes("not found") ||
            apiError.error?.toLowerCase().includes("user")
          ) {
            errorMessage =
              "User not found. Please check your email address and try again.";
            alertTitle = "User Not Found";
          } else {
            errorMessage = "Invalid email or password. Please try again.";
            alertTitle = "Authentication Failed";
          }
          break;
        case ErrorType.NOT_FOUND:
          errorMessage =
            "User not found. Please check your email address and try again.";
          alertTitle = "User Not Found";
          break;
        case ErrorType.SERVER_ERROR:
          errorMessage =
            "Server error. Please try again in a few moments. If the problem persists, contact support.";
          alertTitle = "Server Error";
          break;
        case ErrorType.VALIDATION_ERROR:
          errorMessage = "Invalid input. Please check your credentials and try again.";
          alertTitle = "Validation Error";
          break;
        default:
          // Use the message from the API error
          break;
      }
      
      setApiError(errorMessage);

      // Show error alert with appropriate title
      Alert.alert(alertTitle, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* App Logo/Title Section */}
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🌅</Text>
          <Text style={styles.appTitle}>Morning Board</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          {/* Email/Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email or Username</Text>
            <TextInput
              style={[
                styles.input,
                touched.email && errors.email && styles.inputError,
              ]}
              placeholder="Enter your email or username"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordContainer,
                touched.password &&
                  errors.password &&
                  styles.passwordContainerError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#8E8E93"
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={handlePasswordBlur}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={isLoading}
              >
                <Text style={styles.eyeIcon}>
                  {isPasswordVisible ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* API Error Message */}
          {apiError && (
            <View style={styles.apiErrorContainer}>
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              (!isFormValid() || isLoading) && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!isFormValid() || isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password Link (Optional) */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7", // System Grouped Background from style guide
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 34, // Large Title from style guide
    fontWeight: "bold",
    color: "#000000", // Primary text color
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 24, // Large spacing (XL from style guide)
  },
  label: {
    fontSize: 17, // Body/Headline from style guide
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8, // Small spacing (S from style guide)
  },
  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C6C6C8", // Separator color
    borderRadius: 12, // Medium corner radius
    paddingHorizontal: 16, // Card padding
    fontSize: 17, // Body text
    color: "#000000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C6C6C8",
    borderRadius: 12,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 17,
    color: "#000000",
  },
  eyeButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIcon: {
    fontSize: 20,
  },
  loginButton: {
    height: 50,
    backgroundColor: "#007AFF", // Primary Blue from style guide
    borderRadius: 10, // Button corner radius
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  loginButtonDisabled: {
    backgroundColor: "#C7C7CC", // Tertiary label color
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: "600", // Semibold
    color: "#FFFFFF",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 15, // Subheadline
    color: "#007AFF", // Primary Blue
  },
  inputError: {
    borderColor: "#FF3B30", // Error color from style guide
    borderWidth: 1.5,
  },
  passwordContainerError: {
    borderColor: "#FF3B30", // Error color from style guide
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 13, // Footnote
    color: "#FF3B30", // Error color from style guide
    marginTop: 4, // XS spacing
    marginLeft: 4,
  },
  apiErrorContainer: {
    backgroundColor: "#FFEBEE", // Light red background
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  apiErrorText: {
    fontSize: 15, // Subheadline
    color: "#FF3B30", // Error color from style guide
    textAlign: "center",
  },
});

export default LoginScreen;
