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
  TouchableOpacity,
} from "react-native";
import {
  getWidgetWidth,
  getColumnCount,
  getWidgetSpacing,
  getSafeAreaPadding,
  isTablet,
  isLargeScreen,
} from "../utils/dimensions";
import { useAuth } from "../services/authContext";
import { renderWidget } from "../components/widgets/WidgetFactory";

// Widget types from backend (extended with local widgets)
export type WidgetType = "weather" | "slack" | "canvas" | "bank" | "crm" | "welcome";

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

// Dummy widget data for dashboard demonstration
// TODO: Replace with API call to fetch dashboard data
const mockWidgets: WidgetData[] = [
  {
    id: "welcome-1",
    type: "welcome",
    title: "Welcome",
    data: {},
  },
  {
    id: "bank-1",
    type: "bank",
    title: "Bank Account",
    data: {
      accountNumber: "•••• 4321",
      accountType: "Checking Account",
      balance: 12345.67,
      lastUpdated: "2:30 PM",
    },
    lastUpdated: new Date(),
  },
];

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const { logout } = useAuth();
  const [widgets, setWidgets] = useState<WidgetData[]>(mockWidgets);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(SCREEN_WIDTH);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

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
      
      // For now, refresh with mock data
      setWidgets([...mockWidgets]);
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle widget press (optional)
  const handleWidgetPress = (widget: WidgetData) => {
    console.log("Widget pressed:", widget.type);
    // TODO: Navigate to widget detail or handle widget-specific action
  };

  // Calculate responsive widget width
  const widgetWidth = getWidgetWidth(16, 16); // 16px padding, 16px gap
  const isMultiColumn = getColumnCount() > 1;
  const safeArea = getSafeAreaPadding();

  return (
    <View style={styles.container}>
      {/* Dashboard Header */}
      <View style={[styles.header, { paddingTop: safeArea.top }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Morning Board</Text>
            <Text style={styles.headerSubtitle}>Your dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            accessible={true}
            accessibilityLabel="Logout"
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
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
          {/* Render widgets dynamically using WidgetFactory */}
          {widgets.map((widget) => (
            <View
              key={widget.id}
              style={[
                styles.widgetWrapper,
                {
                  width: widgetWidth,
                  maxWidth: widgetWidth,
                },
                isMultiColumn && styles.widgetMultiColumn,
              ]}
            >
              {renderWidget(widget, () => handleWidgetPress(widget))}
            </View>
          ))}
        </View>

        {/* Empty State */}
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF3B30", // Error/Red color
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
  widgetWrapper: {
    // Wrapper for widgets to ensure proper width
  },
  widgetMultiColumn: {
    marginBottom: 16,
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

