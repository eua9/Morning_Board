/**
 * Dashboard Screen Component
 * Scrollable container for multiple widgets with responsive layout
 * Supports small and large devices
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  Platform,
} from "react-native";
import {
  getWidgetWidth,
  getColumnCount,
  getWidgetSpacing,
  getSafeAreaPadding,
  isTablet,
  isLargeScreen,
} from "../utils/dimensions";

// Widget types from backend
export type WidgetType = "weather" | "slack" | "canvas" | "bank" | "crm";

export interface WidgetData {
  id: string;
  type: WidgetType;
  title: string;
  data: unknown;
  lastUpdated?: Date;
}

interface DashboardScreenProps {
  // Optional: For navigation or other props
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Mock widget data for development
// TODO: Replace with actual API call to fetch dashboard data
const mockWidgets: WidgetData[] = [
  {
    id: "1",
    type: "weather",
    title: "Weather",
    data: { temperature: 72, condition: "Sunny" },
  },
  {
    id: "2",
    type: "slack",
    title: "Slack",
    data: { unreadCount: 3, recentMessages: [] },
  },
  {
    id: "3",
    type: "canvas",
    title: "Canvas",
    data: { upcomingAssignments: [], announcements: [] },
  },
  {
    id: "4",
    type: "bank",
    title: "Bank",
    data: { balance: 0, transactions: [] },
  },
  {
    id: "5",
    type: "crm",
    title: "CRM",
    data: { contacts: [], tasks: [] },
  },
];

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const [widgets, setWidgets] = useState<WidgetData[]>(mockWidgets);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(SCREEN_WIDTH);

  // Handle screen rotation/resize
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  // Refresh dashboard data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // TODO: Fetch dashboard data from API
      // const response = await fetchDashboardData();
      // setWidgets(response.widgets);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For now, just refresh the existing widgets
      setWidgets([...mockWidgets]);
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate responsive widget width
  const widgetWidth = getWidgetWidth(16, 16); // 16px padding, 16px gap
  const isMultiColumn = getColumnCount() > 1;
  const safeArea = getSafeAreaPadding();

  return (
    <View style={styles.container}>
      {/* Dashboard Header */}
      <View style={[styles.header, { paddingTop: safeArea.top }]}>
        <Text style={styles.headerTitle}>Morning Board</Text>
        <Text style={styles.headerSubtitle}>Your dashboard</Text>
      </View>

      {/* Scrollable Widget Container */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: 24, // Extra padding at bottom
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF" // iOS
            colors={["#007AFF"]} // Android
          />
        }
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Widget Grid Container */}
        <View
          style={[
            styles.widgetGrid,
            isMultiColumn && styles.widgetGridMultiColumn,
          ]}
        >
          {widgets.map((widget) => (
            <View
              key={widget.id}
              style={[
                styles.widgetContainer,
                {
                  width: widgetWidth,
                  maxWidth: widgetWidth,
                },
                isMultiColumn && styles.widgetMultiColumn,
              ]}
            >
              {/* Widget Header */}
              <View style={styles.widgetHeader}>
                <Text style={styles.widgetTitle}>{widget.title}</Text>
                {widget.lastUpdated && (
                  <Text style={styles.widgetTimestamp}>
                    {new Date(widget.lastUpdated).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>

              {/* Widget Content */}
              <View style={styles.widgetContent}>
                <WidgetContent widget={widget} />
              </View>
            </View>
          ))}
        </View>

        {/* Empty State (if no widgets) */}
        {widgets.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No widgets available. Pull to refresh.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

/**
 * Widget Content Component
 * Displays widget-specific content based on type
 */
interface WidgetContentProps {
  widget: WidgetData;
}

const WidgetContent: React.FC<WidgetContentProps> = ({ widget }) => {
  // Placeholder content - will be replaced with actual widget components
  return (
    <View style={styles.placeholderContent}>
      <Text style={styles.placeholderText}>
        {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Widget
      </Text>
      <Text style={styles.placeholderSubtext}>
        Content will be displayed here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7", // System Grouped Background
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40, // Safe area for iOS
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8", // Separator color
  },
  headerTitle: {
    fontSize: 34, // Large Title
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 17, // Body
    color: "#8E8E93", // Secondary Label
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  widgetGrid: {
    flexDirection: "column",
    alignItems: "center",
  },
  widgetGridMultiColumn: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  widgetContainer: {
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
    elevation: 3, // Android shadow
    // Ensure consistent width
    minWidth: isTablet ? getWidgetWidth() : SCREEN_WIDTH - 32,
  },
  widgetMultiColumn: {
    marginBottom: 16,
  },
  widgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  widgetTitle: {
    fontSize: 20, // Title 3
    fontWeight: "600",
    color: "#000000",
  },
  widgetTimestamp: {
    fontSize: 13, // Footnote
    color: "#8E8E93",
  },
  widgetContent: {
    minHeight: 100, // Minimum height for widget content
  },
  placeholderContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  placeholderText: {
    fontSize: 17, // Body
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 15, // Subheadline
    color: "#8E8E93",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 17,
    color: "#8E8E93",
    textAlign: "center",
  },
});

export default DashboardScreen;

