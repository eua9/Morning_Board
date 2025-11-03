/**
 * Slack Widget Component
 * Displays Slack messages and notifications (placeholder for future API integration)
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WidgetView from "../WidgetView";
import { BaseWidgetProps } from "./WidgetFactory";

interface SlackData {
  unreadCount?: number;
  recentMessages?: Array<{
    channel: string;
    message: string;
    timestamp: string;
  }>;
}

export const SlackWidget: React.FC<BaseWidgetProps> = ({
  title,
  data,
  lastUpdated,
  onPress,
}) => {
  const slackData = (data as SlackData) || {};
  const unreadCount = slackData.unreadCount || 3;

  return (
    <WidgetView
      title={title}
      subtitle={`${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`}
      headerIcon={<Text style={styles.icon}>💬</Text>}
      minHeight={120}
      onPress={onPress}
    >
      <View style={styles.slackContent}>
        <Text style={styles.messageText}>
          Recent messages will appear here
        </Text>
      </View>
    </WidgetView>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  slackContent: {
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 15,
    color: "#8E8E93",
  },
});

