/**
 * WidgetView Usage Examples
 * Demonstrates various ways to use the WidgetView component
 */

import React from "react";
import { View, Text, Button } from "react-native";
import WidgetView from "./WidgetView";

// Example 1: Basic widget with title and content
export const BasicWidgetExample = () => (
  <WidgetView title="Weather Widget">
    <Text>Current temperature: 72°F</Text>
    <Text>Condition: Sunny</Text>
  </WidgetView>
);

// Example 2: Widget with subtitle and footer
export const AdvancedWidgetExample = () => (
  <WidgetView
    title="Slack Messages"
    subtitle="3 unread messages"
    footer={
      <Button
        title="View All"
        onPress={() => console.log("View all messages")}
      />
    }
  >
    <Text>Recent messages will appear here</Text>
  </WidgetView>
);

// Example 3: Custom styled widget
export const CustomStyledWidgetExample = () => (
  <WidgetView
    title="Bank Balance"
    backgroundColor="#F8F9FA"
    borderRadius={16}
    padding={20}
    elevation={5}
    shadowOpacity={0.15}
  >
    <Text style={{ fontSize: 24, fontWeight: "bold" }}>$1,234.56</Text>
    <Text style={{ color: "#34C759" }}>Available Balance</Text>
  </WidgetView>
);

// Example 4: Interactive widget (pressable)
export const InteractiveWidgetExample = () => (
  <WidgetView
    title="Canvas Assignments"
    subtitle="2 due this week"
    onPress={() => console.log("Widget pressed")}
    headerIcon={<Text style={{ fontSize: 24 }}>📚</Text>}
  >
    <Text>Tap to view assignments</Text>
  </WidgetView>
);

// Example 5: Widget without header
export const NoHeaderWidgetExample = () => (
  <WidgetView title="" showHeader={false}>
    <Text>Custom content without header</Text>
  </WidgetView>
);

// Example 6: Widget with header right component
export const HeaderRightWidgetExample = () => (
  <WidgetView
    title="CRM Contacts"
    headerRight={<Text style={{ color: "#007AFF" }}>Edit</Text>}
  >
    <Text>Contact list content</Text>
  </WidgetView>
);

