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
} from "react-native";

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

  const handleLogin = () => {
    // Validate form before submitting
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      setTouched({ email: true, password: true });
      return;
    }

    // TODO: Implement login functionality
    console.log("Login attempted:", { email, password });
    setIsLoading(true);

    // Placeholder for API call
    setTimeout(() => {
      setIsLoading(false);
      // TODO: Navigate to dashboard on success
    }, 1500);
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
});

export default LoginScreen;
