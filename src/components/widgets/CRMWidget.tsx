/**
 * CRM Widget Component
 * Displays CRM contacts and tasks (placeholder for future API integration)
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WidgetView from "../WidgetView";
import { BaseWidgetProps } from "./WidgetFactory";

interface CRMData {
  contacts?: Array<{
    name: string;
    email: string;
    lastContacted: string;
  }>;
  tasks?: Array<{
    title: string;
    dueDate: string;
    priority: string;
  }>;
}

export const CRMWidget: React.FC<BaseWidgetProps> = ({
  title,
  data,
  lastUpdated,
  onPress,
}) => {
  const crmData = (data as CRMData) || {};
  const taskCount = crmData.tasks?.length || 0;

  return (
    <WidgetView
      title={title}
      subtitle={taskCount > 0 ? `${taskCount} active tasks` : "No active tasks"}
      headerIcon={<Text style={styles.icon}>👥</Text>}
      minHeight={120}
      onPress={onPress}
    >
      <View style={styles.crmContent}>
        <Text style={styles.messageText}>
          Recent contacts and tasks will appear here
        </Text>
      </View>
    </WidgetView>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  crmContent: {
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 15,
    color: "#8E8E93",
  },
});

