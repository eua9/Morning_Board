/**
 * Canvas Widget Component
 * Displays Canvas assignments and announcements (placeholder for future API integration)
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WidgetView from "../WidgetView";
import { BaseWidgetProps } from "./WidgetFactory";

interface CanvasData {
  upcomingAssignments?: Array<{
    title: string;
    dueDate: string;
    course: string;
  }>;
  announcements?: Array<{
    title: string;
    course: string;
    postedAt: string;
  }>;
}

export const CanvasWidget: React.FC<BaseWidgetProps> = ({
  title,
  data,
  lastUpdated,
  onPress,
}) => {
  const canvasData = (data as CanvasData) || {};
  const assignmentCount = canvasData.upcomingAssignments?.length || 0;

  return (
    <WidgetView
      title={title}
      subtitle={assignmentCount > 0 ? `${assignmentCount} upcoming assignments` : "No upcoming assignments"}
      headerIcon={<Text style={styles.icon}>📚</Text>}
      minHeight={120}
      onPress={onPress}
    >
      <View style={styles.canvasContent}>
        <Text style={styles.messageText}>
          Upcoming assignments will appear here
        </Text>
      </View>
    </WidgetView>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  canvasContent: {
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 15,
    color: "#8E8E93",
  },
});

