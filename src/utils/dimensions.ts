/**
 * Dimensions Utility
 * Helper functions for responsive design and screen dimension calculations
 */

import { Dimensions, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Breakpoints
export const BREAKPOINTS = {
  SMALL_PHONE: 375,
  LARGE_PHONE: 414,
  TABLET: 768,
  LARGE_TABLET: 1024,
} as const;

// Screen size detection
export const isSmallPhone = SCREEN_WIDTH < BREAKPOINTS.LARGE_PHONE;
export const isLargePhone = SCREEN_WIDTH >= BREAKPOINTS.LARGE_PHONE && SCREEN_WIDTH < BREAKPOINTS.TABLET;
export const isTablet = SCREEN_WIDTH >= BREAKPOINTS.TABLET && SCREEN_WIDTH < BREAKPOINTS.LARGE_TABLET;
export const isLargeScreen = SCREEN_WIDTH >= BREAKPOINTS.LARGE_TABLET;

// Layout calculations
export const getColumnCount = (): number => {
  if (isLargeScreen) return 2;
  if (isTablet) return 2;
  return 1; // Phones
};

export const getWidgetWidth = (padding: number = 16, gap: number = 16): number => {
  const columns = getColumnCount();
  const totalPadding = padding * 2; // Left and right
  const totalGaps = gap * (columns - 1); // Gaps between columns
  
  if (columns === 1) {
    return SCREEN_WIDTH - totalPadding;
  } else {
    return (SCREEN_WIDTH - totalPadding - totalGaps) / columns;
  }
};

export const getWidgetSpacing = (): number => {
  if (isTablet || isLargeScreen) {
    return 16; // Gap between widgets in multi-column layout
  }
  return 16; // Vertical spacing for single column
};

// Safe area calculations
export const getSafeAreaPadding = (): { top: number; bottom: number } => {
  return {
    top: Platform.OS === "ios" ? 60 : 40,
    bottom: Platform.OS === "ios" ? 34 : 0,
  };
};

// Export screen dimensions
export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} as const;

// Responsive value helper
export const responsiveValue = <T,>(values: {
  phone?: T;
  tablet?: T;
  desktop?: T;
}): T | undefined => {
  if (isTablet || isLargeScreen) {
    return values.tablet || values.desktop || values.phone;
  }
  return values.phone;
};

export default {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  isSmallPhone,
  isLargePhone,
  isTablet,
  isLargeScreen,
  getColumnCount,
  getWidgetWidth,
  getWidgetSpacing,
  getSafeAreaPadding,
  responsiveValue,
};

