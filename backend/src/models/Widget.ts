/**
 * Widget Model
 * Represents a widget in the Morning Board application
 * 
 * Properties:
 * - id: Unique identifier
 * - userId: User who owns this widget
 * - type: Widget type (weather, slack, canvas, bank, crm)
 * - title: Widget display title
 * - data: Widget-specific data content (stored as JSON)
 * - positionX: Grid position X coordinate
 * - positionY: Grid position Y coordinate
 * - width: Widget width in grid units
 * - height: Widget height in grid units
 * - createdAt: Widget creation timestamp
 * - updatedAt: Last update timestamp
 * - lastUpdated: Last time widget data was refreshed (ISO 8601 string for API)
 */

import { WidgetData, IWidgetData } from './WidgetData';

export type WidgetType = 'weather' | 'slack' | 'canvas' | 'bank' | 'crm';

export interface IWidget {
  id: string;
  userId: string;
  type: WidgetType;
  title: string;
  data: IWidgetData;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
  lastUpdated?: Date; // For API responses
}

export class Widget implements IWidget {
  id: string;
  userId: string;
  type: WidgetType;
  title: string;
  data: IWidgetData;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
  lastUpdated?: Date;

  private widgetData: WidgetData;

  constructor(data: Partial<IWidget>) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.type = data.type || 'weather';
    this.title = data.title || '';
    this.data = data.data || {};
    this.positionX = data.positionX ?? 0;
    this.positionY = data.positionY ?? 0;
    this.width = data.width ?? 1;
    this.height = data.height ?? 1;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.lastUpdated = data.lastUpdated || new Date();

    // Initialize WidgetData wrapper
    this.widgetData = new WidgetData(this.data);
  }

  /**
   * Get WidgetData wrapper for data manipulation
   */
  getWidgetData(): WidgetData {
    return this.widgetData;
  }

  /**
   * Set widget data
   */
  setData(data: IWidgetData): void {
    this.data = data;
    this.widgetData.setData(data);
    this.updatedAt = new Date();
    this.lastUpdated = new Date();
  }

  /**
   * Update widget data field
   */
  updateDataField(key: string, value: unknown): void {
    this.widgetData.setField(key, value);
    this.data = this.widgetData.getRawData();
    this.updatedAt = new Date();
    this.lastUpdated = new Date();
  }

  /**
   * Serialize widget data to JSON string (for database storage)
   */
  serializeData(): string {
    return this.widgetData.toJSON();
  }

  /**
   * Deserialize widget data from JSON string (from database)
   */
  deserializeData(jsonString: string | null): void {
    this.widgetData = WidgetData.fromJSON(jsonString);
    this.data = this.widgetData.getRawData();
  }

  /**
   * Validate widget structure
   */
  validate(): boolean {
    if (!this.id || !this.userId || !this.type || !this.title) {
      return false;
    }

    if (!this.isValidWidgetType(this.type)) {
      return false;
    }

    if (!this.widgetData.validate()) {
      return false;
    }

    return true;
  }

  /**
   * Check if widget type is valid
   */
  private isValidWidgetType(type: string): type is WidgetType {
    return ['weather', 'slack', 'canvas', 'bank', 'crm'].includes(type);
  }

  /**
   * Convert to API response format
   * Returns widget in the format expected by the frontend
   */
  toAPIResponse(): {
    id: string;
    type: WidgetType;
    title: string;
    data: IWidgetData;
    lastUpdated: string; // ISO 8601 string
  } {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      data: this.data,
      lastUpdated: this.lastUpdated
        ? this.lastUpdated.toISOString()
        : new Date().toISOString(),
    };
  }

  /**
   * Create from database row
   */
  static fromDatabaseRow(row: {
    id: string;
    user_id: string;
    type: string;
    title: string;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    config: string | null;
    created_at: string;
    updated_at: string;
  }): Widget {
    const widget = new Widget({
      id: row.id,
      userId: row.user_id,
      type: row.type as WidgetType,
      title: row.title,
      positionX: row.position_x,
      positionY: row.position_y,
      width: row.width,
      height: row.height,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });

    // Deserialize config JSON string to data object
    widget.deserializeData(row.config);

    // Set lastUpdated from updatedAt
    widget.lastUpdated = widget.updatedAt;

    return widget;
  }

  /**
   * Convert to database row format
   */
  toDatabaseRow(): {
    id: string;
    user_id: string;
    type: string;
    title: string;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    config: string;
    created_at: string;
    updated_at: string;
  } {
    return {
      id: this.id,
      user_id: this.userId,
      type: this.type,
      title: this.title,
      position_x: this.positionX,
      position_y: this.positionY,
      width: this.width,
      height: this.height,
      config: this.serializeData(),
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }

  /**
   * Create a copy of the widget
   */
  clone(): Widget {
    const cloned = new Widget({
      id: this.id,
      userId: this.userId,
      type: this.type,
      title: this.title,
      data: { ...this.data },
      positionX: this.positionX,
      positionY: this.positionY,
      width: this.width,
      height: this.height,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
      lastUpdated: this.lastUpdated ? new Date(this.lastUpdated) : undefined,
    });
    return cloned;
  }
}

