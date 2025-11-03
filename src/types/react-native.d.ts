/**
 * Stub type declarations for React Native
 * These are temporary until React Native is initialized with proper dependencies
 */

declare module "react-native" {
  import { Component } from "react";

  export interface ViewProps {
    style?: any;
    children?: any;
    [key: string]: any;
  }

  export interface TextProps {
    style?: any;
    children?: any;
    [key: string]: any;
  }

  export interface TextInputProps {
    style?: any;
    placeholder?: string;
    placeholderTextColor?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onBlur?: () => void;
    keyboardType?: string;
    autoCapitalize?: string;
    autoCorrect?: boolean;
    editable?: boolean;
    secureTextEntry?: boolean;
    [key: string]: any;
  }

  export interface TouchableOpacityProps {
    style?: any;
    onPress?: () => void;
    disabled?: boolean;
    children?: any;
    [key: string]: any;
  }

  export const View: any;
  export const Text: any;
  export const TextInput: any;
  export const TouchableOpacity: any;
  export const KeyboardAvoidingView: any;
  export const ScrollView: any;
  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
  };
  export const Platform: {
    OS: "ios" | "android" | "web";
  };
}

