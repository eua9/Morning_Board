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
import { fetchDashboard, ApiError, ErrorType } from "../services/api";
import { getAuthToken, storeWidgetOrder, getWidgetOrder, clearWidgetOrder } from "../services/storage";

// Widget types from backend (extended with local widgets)
export type WidgetType = "weather" | "slack" | "canvas" | "bank" | "account_summary" | "crm" | "welcome";

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
  {
    id: "account-summary-1",
    type: "account_summary",
    title: "Account Summary",
    data: {
      accountNumber: "•••• 5678",
      accountType: "Savings Account",
      balance: 50000.00,
      lastUpdated: "3:45 PM",
    },
    lastUpdated: new Date(),
  },
];

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const { logout } = useAuth();
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState<number>(SCREEN_WIDTH);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [originalWidgetOrder, setOriginalWidgetOrder] = useState<string[]>([]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Fetch dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle screen rotation/resize
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  // Load dashboard data from backend
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get auth token if available
      const token = await getAuthToken();

      // Fetch dashboard data from backend
      const response = await fetchDashboard(token || undefined);

      // Transform backend response to frontend WidgetData format
      let transformedWidgets: WidgetData[] = response.widgets.map((widget) => ({
        id: widget.id,
        type: widget.type as WidgetType,
        title: widget.title,
        data: widget.data,
        lastUpdated: widget.lastUpdated ? new Date(widget.lastUpdated) : undefined,
      }));

      // Debug logging for widget rendering verification
      console.log(`[Dashboard] Loaded ${transformedWidgets.length} widgets from backend`);
      transformedWidgets.forEach((widget) => {
        console.log(`[Dashboard] Widget: ${widget.type} - ${widget.title} (ID: ${widget.id.substring(0, 8)}...)`);
      });

      // Store original order from backend
      const originalOrder = transformedWidgets.map(w => w.id);
      setOriginalWidgetOrder(originalOrder);

      // Try to load saved widget order
      const savedOrder = await getWidgetOrder();
      if (savedOrder && savedOrder.length > 0) {
        // Reorder widgets based on saved order
        const widgetMap = new Map(transformedWidgets.map(w => [w.id, w]));
        const orderedWidgets: WidgetData[] = [];
        
        // Add widgets in saved order
        savedOrder.forEach(id => {
          const widget = widgetMap.get(id);
          if (widget) {
            orderedWidgets.push(widget);
            widgetMap.delete(id);
          }
        });
        
        // Add any remaining widgets (new widgets not in saved order)
        widgetMap.forEach(widget => orderedWidgets.push(widget));
        
        transformedWidgets = orderedWidgets;
      }

      setWidgets(transformedWidgets);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      
      const apiError = err as ApiError;
      let errorMessage = "Failed to load dashboard data.";
      
      if (apiError.type === ErrorType.NETWORK_ERROR) {
        errorMessage = "Unable to connect to the server. Please check your connection.";
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      
      // Fallback to mock data if network error (for development)
      if (apiError.type === ErrorType.NETWORK_ERROR) {
        console.warn("Using mock data due to network error");
        setWidgets(mockWidgets);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh dashboard data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Get auth token if available
      const token = await getAuthToken();

      // Fetch dashboard data from backend
      const response = await fetchDashboard(token || undefined);

      // Transform backend response to frontend WidgetData format
      const transformedWidgets: WidgetData[] = response.widgets.map((widget) => ({
        id: widget.id,
        type: widget.type as WidgetType,
        title: widget.title,
        data: widget.data,
        lastUpdated: widget.lastUpdated ? new Date(widget.lastUpdated) : undefined,
      }));

      setWidgets(transformedWidgets);
    } catch (err) {
      console.error("Failed to refresh dashboard:", err);
      
      const apiError = err as ApiError;
      let errorMessage = "Failed to refresh dashboard data.";
      
      if (apiError.type === ErrorType.NETWORK_ERROR) {
        errorMessage = "Unable to connect to the server. Please check your connection.";
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle widget press (optional)
  const handleWidgetPress = (widget: WidgetData) => {
    if (isEditMode) {
      // In edit mode, widget press might trigger reorder UI
      return;
    }
    console.log("Widget pressed:", widget.type);
    // TODO: Navigate to widget detail or handle widget-specific action
  };

  // Handle widget reorder
  const handleWidgetReorder = (fromIndex: number, toIndex: number) => {
    const reorderedWidgets = [...widgets];
    const [movedWidget] = reorderedWidgets.splice(fromIndex, 1);
    reorderedWidgets.splice(toIndex, 0, movedWidget);
    
    setWidgets(reorderedWidgets);
    
    // Save new order to storage
    const newOrder = reorderedWidgets.map(w => w.id);
    storeWidgetOrder(newOrder).catch(err => {
      console.error("Failed to save widget order:", err);
    });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Reset to default order (from backend)
  const resetWidgetOrder = async () => {
    try {
      await clearWidgetOrder();
      // Reload dashboard data to get original order
      await loadDashboardData();
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to reset widget order:", error);
    }
  };

  // Move widget up
  const moveWidgetUp = (index: number) => {
    if (index > 0) {
      handleWidgetReorder(index, index - 1);
    }
  };

  // Move widget down
  const moveWidgetDown = (index: number) => {
    if (index < widgets.length - 1) {
      handleWidgetReorder(index, index + 1);
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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Morning Board</Text>
            <Text style={styles.headerSubtitle}>Your dashboard</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.headerButton, isEditMode && styles.headerButtonActive]}
              onPress={toggleEditMode}
              accessible={true}
              accessibilityLabel={isEditMode ? "Exit Edit Mode" : "Edit Mode"}
            >
              <Text style={[styles.headerButtonText, isEditMode && styles.headerButtonTextActive]}>
                {isEditMode ? "Done" : "Edit"}
              </Text>
            </TouchableOpacity>
            {isEditMode && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={resetWidgetOrder}
                accessible={true}
                accessibilityLabel="Reset Order"
              >
                <Text style={styles.headerButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
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
        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingState}>
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <View style={styles.errorState}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadDashboardData}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Widget Grid Container */}
        {!isLoading && !error && (
          <View
            style={[
              styles.widgetGrid,
              isMultiColumn && styles.widgetGridMultiColumn,
            ]}
          >
            {/* Render widgets dynamically using WidgetFactory */}
            {widgets.map((widget, index) => (
              <View
                key={widget.id}
                style={[
                  styles.widgetWrapper,
                  {
                    width: widgetWidth,
                    maxWidth: widgetWidth,
                  },
                  isMultiColumn && styles.widgetMultiColumn,
                  isEditMode && styles.widgetWrapperEditMode,
                ]}
              >
                {isEditMode && (
                  <View style={styles.reorderControls}>
                    <TouchableOpacity
                      style={[styles.reorderButton, index === 0 && styles.reorderButtonDisabled]}
                      onPress={() => moveWidgetUp(index)}
                      disabled={index === 0}
                      accessible={true}
                      accessibilityLabel="Move widget up"
                    >
                      <Text style={styles.reorderButtonText}>▲</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.reorderButton, index === widgets.length - 1 && styles.reorderButtonDisabled]}
                      onPress={() => moveWidgetDown(index)}
                      disabled={index === widgets.length - 1}
                      accessible={true}
                      accessibilityLabel="Move widget down"
                    >
                      <Text style={styles.reorderButtonText}>▼</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {renderWidget(widget, () => handleWidgetPress(widget))}
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!isLoading && !error && widgets.length === 0 && (
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
  },
  headerButtonActive: {
    backgroundColor: "#007AFF",
  },
  headerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
  },
  headerButtonTextActive: {
    color: "#FFFFFF",
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
    paddingBottom: 24, // Extra padding at bottom for full widget visibility
  },
  widgetGrid: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%", // Ensure full width
  },
  widgetGridMultiColumn: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%", // Ensure full width
  },
  widgetWrapper: {
    // Wrapper for widgets to ensure proper width
    position: "relative",
  },
  widgetWrapperEditMode: {
    opacity: 0.95,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 4,
  },
  widgetMultiColumn: {
    marginBottom: 16,
  },
  reorderControls: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 6,
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reorderButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  reorderButtonDisabled: {
    opacity: 0.3,
  },
  reorderButtonText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
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
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 17,
    color: "#8E8E93",
    textAlign: "center",
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 17,
    color: "#FF3B30", // Error/Red color
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF", // System Blue
  },
  retryButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default DashboardScreen;

