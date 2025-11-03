/**
 * Welcome Widget Component
 * Displays time-based greeting and welcome message
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WidgetView from "../WidgetView";
import { BaseWidgetProps } from "./WidgetFactory";

export const WelcomeWidget: React.FC<BaseWidgetProps> = ({
  title,
  lastUpdated,
  onPress,
}) => {
  // Debug logging for welcome widget (client-side only)
  console.log(`[WelcomeWidget] Rendering client-side widget (no backend data)`);
  
  const greeting = getTimeOfDayGreeting();

  return (
    <WidgetView
      title={title}
      subtitle={`Good ${greeting}`}
      headerIcon={<Text style={styles.icon}>🌅</Text>}
      minHeight={120}
      onPress={onPress}
    >
      <Text style={styles.welcomeText}>
        Welcome back! Here's your morning overview.
      </Text>
      <Text style={styles.welcomeSubtext}>
        Your dashboard is ready for the day.
      </Text>
    </WidgetView>
  );
};

/**
 * Get time-based greeting
 */
const getTimeOfDayGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  welcomeText: {
    fontSize: 17, // Body
    color: "#000000",
    marginBottom: 8,
    lineHeight: 24,
  },
  welcomeSubtext: {
    fontSize: 15, // Subheadline
    color: "#8E8E93",
    lineHeight: 20,
  },
});

