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
import WidgetView from "../components/WidgetView";

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

// Dummy widgets for dashboard demonstration
const WelcomeWidget = () => (
  <WidgetView
    title="Welcome"
    subtitle={`Good ${getTimeOfDayGreeting()}`}
    headerIcon={<Text style={{ fontSize: 24 }}>🌅</Text>}
    minHeight={120}
  >
    <Text style={styles.welcomeText}>
      Welcome back! Here's your morning overview.
    </Text>
    <Text style={styles.welcomeSubtext}>
      Your dashboard is ready for the day.
    </Text>
  </WidgetView>
);

const BankAccountWidget = () => (
  <WidgetView
    title="Bank Account"
    subtitle="Checking Account •••• 4321"
    headerIcon={<Text style={{ fontSize: 24 }}>💰</Text>}
    backgroundColor="#F8F9FA"
    minHeight={140}
  >
    <View style={styles.bankBalanceContainer}>
      <Text style={styles.bankBalanceLabel}>Available Balance</Text>
      <Text style={styles.bankBalanceAmount}>$12,345.67</Text>
      <Text style={styles.bankBalanceSubtext}>Last updated: 2:30 PM</Text>
    </View>
  </WidgetView>
);

// Helper function to get time-based greeting
const getTimeOfDayGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
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
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Refresh complete
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
          {/* Welcome Widget */}
          <View
            style={[
              styles.widgetWrapper,
              {
                width: widgetWidth,
                maxWidth: widgetWidth,
              },
              isMultiColumn && styles.widgetMultiColumn,
            ]}
          >
            <WelcomeWidget />
          </View>

          {/* Bank Account Widget */}
          <View
            style={[
              styles.widgetWrapper,
              {
                width: widgetWidth,
                maxWidth: widgetWidth,
              },
              isMultiColumn && styles.widgetMultiColumn,
            ]}
          >
            <BankAccountWidget />
          </View>
        </View>
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
  widgetWrapper: {
    // Wrapper for widgets to ensure proper width
  },
  widgetMultiColumn: {
    marginBottom: 16,
  },
  // Welcome Widget Styles
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
  // Bank Account Widget Styles
  bankBalanceContainer: {
    alignItems: "flex-start",
  },
  bankBalanceLabel: {
    fontSize: 13, // Footnote
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bankBalanceAmount: {
    fontSize: 32, // Large display number
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  bankBalanceSubtext: {
    fontSize: 13, // Footnote
    color: "#8E8E93",
  },
});

export default DashboardScreen;

