/**
 * LoginScreen Component
 * React Native login screen with email/username and password fields
 * Matches app style guide design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = () => {
    // TODO: Implement login functionality
    console.log('Login attempted:', { email, password });
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              style={styles.input}
              placeholder="Enter your email or username"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#8E8E93"
                value={password}
                onChangeText={setPassword}
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
                <Text style={styles.eyeIcon}>{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              (!email || !password || isLoading) && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!email || !password || isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
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
    backgroundColor: '#F2F2F7', // System Grouped Background from style guide
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 34, // Large Title from style guide
    fontWeight: 'bold',
    color: '#000000', // Primary text color
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24, // Large spacing (XL from style guide)
  },
  label: {
    fontSize: 17, // Body/Headline from style guide
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8, // Small spacing (S from style guide)
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C6C8', // Separator color
    borderRadius: 12, // Medium corner radius
    paddingHorizontal: 16, // Card padding
    fontSize: 17, // Body text
    color: '#000000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C6C8',
    borderRadius: 12,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 17,
    color: '#000000',
  },
  eyeButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
  },
  loginButton: {
    height: 50,
    backgroundColor: '#007AFF', // Primary Blue from style guide
    borderRadius: 10, // Button corner radius
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  loginButtonDisabled: {
    backgroundColor: '#C7C7CC', // Tertiary label color
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '600', // Semibold
    color: '#FFFFFF',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 15, // Subheadline
    color: '#007AFF', // Primary Blue
  },
});

export default LoginScreen;

