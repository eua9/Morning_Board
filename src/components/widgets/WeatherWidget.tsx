/**
 * Weather Widget Component
 * Displays weather information (placeholder for future API integration)
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WidgetView from "../WidgetView";
import { BaseWidgetProps } from "./WidgetFactory";

interface WeatherData {
  temperature?: number;
  condition?: string;
  location?: string;
  forecast?: Array<{ day: string; high: number; low: number }>;
}

export const WeatherWidget: React.FC<BaseWidgetProps> = ({
  title,
  data,
  lastUpdated,
  onPress,
}) => {
  const weatherData = (data as WeatherData) || {};
  
  // Placeholder data for now
  const temperature = weatherData.temperature || 72;
  const condition = weatherData.condition || "Sunny";
  const location = weatherData.location || "San Francisco, CA";

  return (
    <WidgetView
      title={title}
      subtitle={location}
      headerIcon={<Text style={styles.icon}>🌤️</Text>}
      minHeight={120}
      onPress={onPress}
    >
      <View style={styles.weatherContent}>
        <Text style={styles.temperature}>{temperature}°F</Text>
        <Text style={styles.condition}>{condition}</Text>
      </View>
    </WidgetView>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  weatherContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  condition: {
    fontSize: 17,
    color: "#8E8E93",
  },
});

