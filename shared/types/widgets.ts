/**
 * Shared Widget Type Definitions
 * 
 * These types are shared between frontend and backend to ensure
 * type safety and consistency in widget data structures.
 * 
 * Usage:
 * - Backend: Import and use in DashboardController
 * - Frontend: Import and use in widget components
 * 
 * Last Updated: 2024-11-03
 */

// Base widget structure
export interface BaseWidget {
  id: string;
  type: WidgetType;
  title: string;
  data: unknown;
  lastUpdated: string; // ISO 8601 timestamp
}

// Widget type enumeration
export type WidgetType = 
  | 'weather' 
  | 'slack' 
  | 'canvas' 
  | 'bank' 
  | 'crm' 
  | 'welcome';

// Weather Widget Data
export interface WeatherWidgetData {
  temperature: number;
  condition: string;
  location: string;
  forecast?: Array<{
    day: string;
    high: number;
    low: number;
  }>;
}

// Slack Widget Data
export interface SlackWidgetData {
  unreadCount: number;
  recentMessages?: Array<{
    channel: string;
    message: string;
    timestamp: string; // ISO 8601
  }>;
}

// Canvas Widget Data
export interface CanvasWidgetData {
  upcomingAssignments?: Array<{
    title: string;
    dueDate: string; // ISO 8601
    course: string;
  }>;
  announcements?: Array<{
    title: string;
    course: string;
    postedAt: string; // ISO 8601
  }>;
}

// Bank Widget Data
export interface BankWidgetData {
  accountNumber: string;
  accountType: string;
  balance: number;
  lastUpdated?: string; // Human-readable time (e.g., "2:30 PM")
}

// CRM Widget Data
export interface CRMWidgetData {
  contacts?: Array<{
    name: string;
    email: string;
    lastContacted: string; // ISO 8601
  }>;
  tasks?: Array<{
    title: string;
    dueDate: string; // ISO 8601
    priority: 'high' | 'medium' | 'low';
  }>;
}

// Welcome Widget Data (local widget, minimal data)
export interface WelcomeWidgetData {
  // Empty or minimal data
  // Greeting is generated client-side based on time
}

// Union type for all widget data types
export type WidgetData =
  | WeatherWidgetData
  | SlackWidgetData
  | CanvasWidgetData
  | BankWidgetData
  | CRMWidgetData
  | WelcomeWidgetData;

// Widget with typed data
export interface TypedWidget<T extends WidgetData = WidgetData> extends BaseWidget {
  data: T;
}

// Dashboard response structure
export interface DashboardResponse {
  userId: string;
  widgets: BaseWidget[];
  layout: WidgetLayout[];
  lastSync: string; // ISO 8601 timestamp
}

// Widget layout structure
export interface WidgetLayout {
  widgetId: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

// Type guard functions
export function isWeatherWidget(widget: BaseWidget): widget is TypedWidget<WeatherWidgetData> {
  return widget.type === 'weather';
}

export function isSlackWidget(widget: BaseWidget): widget is TypedWidget<SlackWidgetData> {
  return widget.type === 'slack';
}

export function isCanvasWidget(widget: BaseWidget): widget is TypedWidget<CanvasWidgetData> {
  return widget.type === 'canvas';
}

export function isBankWidget(widget: BaseWidget): widget is TypedWidget<BankWidgetData> {
  return widget.type === 'bank';
}

export function isCRMWidget(widget: BaseWidget): widget is TypedWidget<CRMWidgetData> {
  return widget.type === 'crm';
}

export function isWelcomeWidget(widget: BaseWidget): widget is TypedWidget<WelcomeWidgetData> {
  return widget.type === 'welcome';
}

