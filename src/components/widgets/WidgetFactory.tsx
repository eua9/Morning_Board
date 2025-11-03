/**
 * Widget Factory
 * Dynamically renders widgets based on type using a component map
 * 
 * Architecture Decision: Component Map Pattern
 * - Scalable: Easy to add new widget types
 * - Type-safe: TypeScript ensures all widget types are handled
 * - Maintainable: All widget definitions in one place
 * - Performance: Direct component lookup (O(1))
 */

import React from "react";
import { View, Text } from "react-native";
import { WidgetData, WidgetType } from "../../screens/DashboardScreen";
import WidgetView from "../WidgetView";

// Import widget components
import { WelcomeWidget } from "./WelcomeWidget";
import { BankAccountWidget } from "./BankAccountWidget";
import { AccountSummaryWidget } from "./AccountSummaryWidget";
import { WeatherWidget } from "./WeatherWidget";
import { SlackWidget } from "./SlackWidget";
import { CanvasWidget } from "./CanvasWidget";
import { CRMWidget } from "./CRMWidget";

/**
 * Widget Component Props
 * All widget components should accept these props
 */
export interface BaseWidgetProps {
  data: unknown; // Widget-specific data structure
  title: string;
  lastUpdated?: Date;
  onPress?: () => void;
}

/**
 * Widget Component Type
 * Function component that renders a widget
 */
type WidgetComponent = React.FC<BaseWidgetProps>;

/**
 * Widget Registry
 * Maps widget types to their component implementations
 * 
 * To add a new widget:
 * 1. Create widget component in widgets/ directory
 * 2. Import it above
 * 3. Add entry to WIDGET_REGISTRY below
 */
const WIDGET_REGISTRY: Record<string, WidgetComponent> = {
  // Local widgets (not from API)
  welcome: WelcomeWidget,
  
  // API-driven widgets (from backend)
  weather: WeatherWidget,
  slack: SlackWidget,
  canvas: CanvasWidget,
  bank: BankAccountWidget,
  account_summary: AccountSummaryWidget, // Alias for bank widget
  crm: CRMWidget,
};

/**
 * Get widget component for a given type
 * @param type - Widget type identifier
 * @returns Widget component or null if not found
 */
export const getWidgetComponent = (
  type: string | WidgetType
): WidgetComponent | null => {
  return WIDGET_REGISTRY[type] || null;
};

/**
 * Render a widget dynamically based on its type and data
 * @param widget - Widget data object
 * @param onPress - Optional press handler
 * @returns Rendered widget component or fallback
 */
export const renderWidget = (
  widget: WidgetData,
  onPress?: () => void
): React.ReactElement => {
  const WidgetComponent = getWidgetComponent(widget.type);

  if (!WidgetComponent) {
    // Fallback for unknown widget types
    return (
      <WidgetView
        title={widget.title}
        subtitle={`Unknown widget type: ${widget.type}`}
      >
        <Text style={{ color: "#8E8E93", fontSize: 15 }}>
          Widget type "{widget.type}" is not yet implemented.
        </Text>
      </WidgetView>
    );
  }

  // Render the widget component with its data
  return (
    <WidgetComponent
      data={widget.data}
      title={widget.title}
      lastUpdated={widget.lastUpdated}
      onPress={onPress}
    />
  );
};

/**
 * Render widget by type (factory method)
 * Convenience function for rendering widgets based on type string
 * 
 * @param type - Widget type identifier (e.g., "welcome", "bank", "account_summary")
 * @param data - Widget-specific data object
 * @param title - Widget title
 * @param onPress - Optional press handler
 * @param lastUpdated - Optional last updated timestamp
 * @returns Rendered widget component or fallback
 * 
 * @example
 * renderWidgetByType("welcome", {}, "Welcome")
 * renderWidgetByType("account_summary", { balance: 1000 }, "Account Summary")
 */
export const renderWidgetByType = (
  type: string | WidgetType,
  data: unknown,
  title: string,
  onPress?: () => void,
  lastUpdated?: Date
): React.ReactElement => {
  return renderWidget(
    {
      id: `${type}-${Date.now()}`,
      type: type as WidgetType,
      title,
      data,
      lastUpdated,
    },
    onPress
  );
};

/**
 * Check if a widget type is supported
 * @param type - Widget type to check
 * @returns True if widget type is registered
 */
export const isWidgetTypeSupported = (type: string): boolean => {
  return type in WIDGET_REGISTRY;
};

/**
 * Get all supported widget types
 * @returns Array of supported widget type strings
 */
export const getSupportedWidgetTypes = (): string[] => {
  return Object.keys(WIDGET_REGISTRY);
};

export default {
  getWidgetComponent,
  renderWidget,
  renderWidgetByType,
  isWidgetTypeSupported,
  getSupportedWidgetTypes,
};

