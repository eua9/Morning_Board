/**
 * WidgetView Component
 * Reusable card-style widget component for displaying content
 * Features: title, body area, customizable styling, and elevation
 */

import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import { renderWidget } from "./widgets/WidgetFactory";

export interface WidgetViewProps {
  // Content
  title: string;
  children?: ReactNode;
  subtitle?: string;
  
  // Dynamic Widget Rendering (alternative to children)
  type?: string; // Widget type (e.g., "welcome", "bank", "account_summary")
  data?: unknown; // Widget-specific data
  
  // Styling
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  borderColor?: string;
  
  // Layout
  padding?: number;
  marginBottom?: number;
  minHeight?: number;
  
  // Elevation/Shadow
  elevation?: number; // Android
  shadowOpacity?: number; // iOS
  borderRadius?: number;
  
  // Interactive
  onPress?: () => void;
  disabled?: boolean;
  
  // Header customization
  showHeader?: boolean;
  headerRight?: ReactNode;
  headerIcon?: ReactNode;
  
  // Footer (optional)
  footer?: ReactNode;
  
  // Custom styles
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
}

const WidgetView: React.FC<WidgetViewProps> = ({
  title,
  children,
  subtitle,
  type,
  data,
  backgroundColor = "#FFFFFF",
  titleColor = "#000000",
  subtitleColor = "#8E8E93",
  borderColor,
  padding = 16,
  marginBottom = 16,
  minHeight,
  elevation = 3,
  shadowOpacity = 0.1,
  borderRadius = 12,
  onPress,
  disabled = false,
  showHeader = true,
  headerRight,
  headerIcon,
  footer,
  containerStyle,
  titleStyle,
  contentStyle,
}) => {
  // If type is provided, render widget dynamically
  // Otherwise, render children normally
  const shouldRenderDynamic = type && data !== undefined;
  
  if (shouldRenderDynamic) {
    // Use WidgetFactory to render the widget based on type
    return renderWidget(
      {
        id: `dynamic-${type}-${Date.now()}`,
        type: type as any,
        title,
        data,
      },
      onPress
    );
  }
  const Container = onPress ? TouchableOpacity : View;

  const containerStyles: ViewStyle[] = [
    styles.container,
    {
      backgroundColor,
      borderRadius,
      padding,
      marginBottom,
      minHeight,
      ...(borderColor && { borderWidth: 1, borderColor }),
      ...containerStyle,
    },
    // Shadow/Elevation styles
    Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity,
          shadowRadius: 5,
        }
      : {
          elevation,
        },
  ];

  return (
    <Container
      style={containerStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Header Section */}
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {headerIcon && <View style={styles.iconContainer}>{headerIcon}</View>}
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: titleColor }, titleStyle]}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: subtitleColor }]}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      )}

      {/* Divider (shown when header is present) */}
      {showHeader && (
        <View style={styles.divider} />
      )}

      {/* Body Content Area */}
      <View style={[styles.content, contentStyle]}>
        {children || (
          <Text style={{ color: "#8E8E93", fontSize: 15 }}>
            No content provided
          </Text>
        )}
      </View>

      {/* Footer Section (optional) */}
      {footer && <View style={styles.footer}>{footer}</View>}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    // Base container styles are applied via props
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20, // Title 3 from style guide
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13, // Footnote from style guide
  },
  headerRight: {
    marginLeft: 12,
    alignItems: "flex-end",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#C6C6C8", // Separator color from style guide
    marginBottom: 12,
  },
  content: {
    // Content area - flex to fill available space
    minHeight: 100,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#C6C6C8",
  },
});

export default WidgetView;

