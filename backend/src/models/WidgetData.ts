/**
 * WidgetData Model
 * Represents the data content of a widget
 * 
 * This is a base interface that widget-specific data types should extend.
 * Widget data is stored as JSON in the database and can vary by widget type.
 */

export interface IWidgetData {
  [key: string]: unknown; // Flexible JSON structure
}

/**
 * Base WidgetData class
 * Provides serialization and validation for widget content
 */
export class WidgetData {
  private data: IWidgetData;

  constructor(data: IWidgetData = {}) {
    this.data = data;
  }

  /**
   * Get the raw data object
   */
  getRawData(): IWidgetData {
    return this.data;
  }

  /**
   * Set data
   */
  setData(data: IWidgetData): void {
    this.data = data;
  }

  /**
   * Get a specific field value
   */
  getField(key: string): unknown {
    return this.data[key];
  }

  /**
   * Set a specific field value
   */
  setField(key: string, value: unknown): void {
    this.data[key] = value;
  }

  /**
   * Serialize to JSON string (for database storage)
   */
  toJSON(): string {
    return JSON.stringify(this.data);
  }

  /**
   * Deserialize from JSON string (from database)
   */
  static fromJSON(jsonString: string | null): WidgetData {
    if (!jsonString) {
      return new WidgetData({});
    }
    try {
      const parsed = JSON.parse(jsonString);
      return new WidgetData(parsed);
    } catch (error) {
      console.error('Failed to parse WidgetData JSON:', error);
      return new WidgetData({});
    }
  }

  /**
   * Validate that the data structure is valid
   */
  validate(): boolean {
    // Basic validation - ensure it's an object
    return typeof this.data === 'object' && this.data !== null && !Array.isArray(this.data);
  }

  /**
   * Check if data is empty
   */
  isEmpty(): boolean {
    return Object.keys(this.data).length === 0;
  }
}

/**
 * Type-specific WidgetData interfaces
 * These can be used for type-safe widget data handling
 */

// Weather Widget Data
export interface WeatherWidgetData extends IWidgetData {
  temperature?: number;
  condition?: string;
  location?: string;
  forecast?: Array<{
    day: string;
    high: number;
    low: number;
  }>;
}

// Slack Widget Data
export interface SlackWidgetData extends IWidgetData {
  unreadCount?: number;
  recentMessages?: Array<{
    channel: string;
    message: string;
    timestamp: string;
  }>;
}

// Canvas Widget Data
export interface CanvasWidgetData extends IWidgetData {
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

// Bank Widget Data
export interface BankWidgetData extends IWidgetData {
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  lastUpdated?: string;
}

// CRM Widget Data
export interface CRMWidgetData extends IWidgetData {
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

// Welcome Widget Data (local widget)
export interface WelcomeWidgetData extends IWidgetData {
  greeting?: string;
  message?: string;
}

