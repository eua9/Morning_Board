/**
 * Dashboard Widget Component
 * Reusable widget container component for dashboard items
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WidgetData } from "../screens/DashboardScreen";

export interface DashboardWidgetProps {
  widget: WidgetData;
  onPress?: () => void;
  width?: number;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  onPress,
  width,
}) => {
  const WidgetContainer = onPress ? TouchableOpacity : View;

  return (
    <WidgetContainer
      style={[
        styles.container,
        width && { width, maxWidth: width },
        onPress && styles.pressable,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Widget Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{widget.title}</Text>
          {widget.lastUpdated && (
            <Text style={styles.timestamp}>
              Updated{" "}
              {new Date(widget.lastUpdated).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>
        {/* Widget Icon placeholder */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>
            {getWidgetIcon(widget.type)}
          </Text>
        </View>
      </View>

      {/* Widget Content Area */}
      <View style={styles.content}>
        {/* Widget-specific content will be rendered here */}
        <Text style={styles.contentPlaceholder}>
          {widget.type} content
        </Text>
      </View>
    </WidgetContainer>
  );
};

/**
 * Get widget icon emoji based on type
 */
const getWidgetIcon = (type: string): string => {
  const icons: Record<string, string> = {
    weather: "🌤️",
    slack: "💬",
    canvas: "📚",
    bank: "💰",
    crm: "👥",
  };
  return icons[type] || "📱";
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  pressable: {
    // Additional styles for pressable widgets if needed
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20, // Title 3
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 13, // Footnote
    color: "#8E8E93",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  iconText: {
    fontSize: 24,
  },
  content: {
    minHeight: 100,
  },
  contentPlaceholder: {
    fontSize: 15,
    color: "#8E8E93",
    fontStyle: "italic",
  },
});

export default DashboardWidget;

