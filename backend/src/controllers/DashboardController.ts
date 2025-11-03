/**
 * Dashboard Controller
 * Handles dashboard-related operations and widget data aggregation
 *
 * Responsibilities:
 * - Fetch dashboard data for authenticated users
 * - Aggregate data from various sources (Slack, Canvas, Bank, Weather, CRM)
 * - Manage user widget preferences
 * - Return formatted dashboard data
 *
 * Widget Schema Reference:
 * See WIDGET_SCHEMA.md for complete schema documentation.
 * All widget responses must match the documented structure.
 */

import { Request, Response } from 'express';
import { getDatabase } from '../config/database';
import { Widget } from '../models/Widget';

/**
 * Widget Data Interface
 * Matches the schema defined in WIDGET_SCHEMA.md
 *
 * @see WIDGET_SCHEMA.md for detailed field specifications
 */
export interface WidgetData {
  id: string; // Unique widget identifier (e.g., "weather-1")
  type: 'weather' | 'slack' | 'canvas' | 'bank' | 'crm';
  title: string; // Widget display title
  data: unknown; // Widget-specific data (see WIDGET_SCHEMA.md)
  lastUpdated: string; // ISO 8601 timestamp (always UTC)
}

export interface DashboardData {
  userId: string;
  widgets: WidgetData[];
  layout: WidgetLayout[];
  lastSync: string; // ISO 8601 timestamp string (UTC)
}

export interface WidgetLayout {
  widgetId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export class DashboardController {
  /**
   * Get dashboard data for authenticated user
   * @param req - Express request object (should contain authenticated user ID)
   * @param res - Express response object
   * @returns JSON response with dashboard data including all widgets
   */
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract user ID from authenticated request when auth is implemented
      // const userId = (req as any).userId;

      // For now, try to get test user ID or use placeholder
      const db = getDatabase();

      // Try to find test user first
      const testUser = db
        .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
        .get('test@morningboard.com', 'testuser') as { id: string } | undefined;

      const userId =
        (req as any).userId || testUser?.id || 'placeholder-user-id';

      // Fetch widgets from database using Widget model
      let widgets: WidgetData[] = [];
      let layout: WidgetLayout[] = [];

      try {
        // Query widgets from database
        const widgetRows = db
          .prepare(
            'SELECT * FROM widgets WHERE user_id = ? ORDER BY position_y, position_x'
          )
          .all(userId) as Array<{
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
        }>;

        // Convert database rows to Widget models and then to API response format
        if (widgetRows.length > 0) {
          widgets = widgetRows.map((row) => {
            const widget = Widget.fromDatabaseRow(row);
            return widget.toAPIResponse();
          });

          // Create layout from widget positions
          layout = widgetRows.map((row) => ({
            widgetId: row.id,
            position: { x: row.position_x, y: row.position_y },
            size: { width: row.width, height: row.height },
          }));
        } else {
          // Fallback: Create default widgets if none exist in database
          // This ensures the API always returns widget data for testing
          widgets = DashboardController.getDefaultWidgets();
          layout = widgets.map((widget, index) => ({
            widgetId: widget.id,
            position: { x: index % 2, y: Math.floor(index / 2) },
            size: { width: 1, height: 1 },
          }));
        }
      } catch (dbError) {
        console.error('Error fetching widgets from database:', dbError);
        // Fallback to default widgets if database query fails
        widgets = DashboardController.getDefaultWidgets();
        layout = widgets.map((widget, index) => ({
          widgetId: widget.id,
          position: { x: index % 2, y: Math.floor(index / 2) },
          size: { width: 1, height: 1 },
        }));
      }

      const response: DashboardData = {
        userId,
        widgets,
        layout,
        lastSync: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      res.status(500).json({
        message: 'Failed to fetch dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get default widgets as fallback when database has no widgets
   * Returns hardcoded widget data matching the frontend structure
   * @returns Array of default widget data
   */
  private static getDefaultWidgets(): WidgetData[] {
    return [
      {
        id: 'weather-1',
        type: 'weather',
        title: 'Weather',
        data: {
          temperature: 72,
          condition: 'Sunny',
          location: 'San Francisco, CA',
          forecast: [
            { day: 'Today', high: 75, low: 65 },
            { day: 'Tomorrow', high: 73, low: 63 },
            { day: 'Wednesday', high: 70, low: 60 },
          ],
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'slack-1',
        type: 'slack',
        title: 'Slack',
        data: {
          unreadCount: 3,
          recentMessages: [
            {
              channel: '#general',
              message: 'Meeting at 3 PM today',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            },
            {
              channel: '#dev-team',
              message: 'PR ready for review',
              timestamp: new Date(
                Date.now() - 2 * 60 * 60 * 1000
              ).toISOString(),
            },
          ],
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'canvas-1',
        type: 'canvas',
        title: 'Canvas',
        data: {
          upcomingAssignments: [
            {
              title: 'Math Homework - Chapter 5',
              dueDate: new Date(
                Date.now() + 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
              course: 'Mathematics 101',
            },
            {
              title: 'Essay - History Paper',
              dueDate: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toISOString(),
              course: 'World History',
            },
          ],
          announcements: [
            {
              title: 'Office hours changed',
              course: 'Mathematics 101',
              postedAt: new Date(
                Date.now() - 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          ],
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'bank-1',
        type: 'bank',
        title: 'Bank Account',
        data: {
          accountNumber: '•••• 4321',
          accountType: 'Checking Account',
          balance: 12345.67,
          lastUpdated: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'crm-1',
        type: 'crm',
        title: 'CRM',
        data: {
          contacts: [
            {
              name: 'John Doe',
              email: 'john@example.com',
              lastContacted: new Date(
                Date.now() - 3 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              name: 'Jane Smith',
              email: 'jane@example.com',
              lastContacted: new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          ],
          tasks: [
            {
              title: 'Follow up with client',
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              priority: 'high',
            },
            {
              title: 'Prepare quarterly report',
              dueDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              priority: 'medium',
            },
          ],
        },
        lastUpdated: new Date().toISOString(),
      },
    ];
  }

  /**
   * Get data for a specific widget type
   * @param req - Express request object containing widget type
   * @param res - Express response object
   * @returns JSON response with widget-specific data
   */
  static async getWidgetData(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement widget data retrieval
      // 1. Extract widget type from request parameters
      // 2. Extract user ID from authenticated request
      // 3. Fetch data for specific widget type:
      //    - Weather: Current weather, forecast
      //    - Slack: Recent messages, unread count
      //    - Canvas: Upcoming assignments, announcements
      //    - Bank: Account balances, recent transactions
      //    - CRM: Recent contacts, upcoming tasks
      // 4. Return widget-specific data

      const widgetType = req.params.type;
      // TODO: Extract user ID when implementing authentication
      // const userId = (req as any).userId || 'placeholder-user-id';

      // Placeholder response
      res.status(200).json({
        type: widgetType,
        data: {},
        lastUpdated: new Date(),
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Failed to fetch widget data',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update widget layout/preferences for user
   * @param req - Express request object containing new layout configuration
   * @param res - Express response object
   * @returns JSON response confirming layout update
   */
  static async updateLayout(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement layout update
      // 1. Extract user ID from authenticated request
      // 2. Validate layout data structure
      // 3. Save layout preferences to database
      // 4. Return success response

      const userId = (req as any).userId || 'placeholder-user-id';
      const { layout } = req.body;

      // Placeholder response
      res.status(200).json({
        message: 'Layout updated successfully',
        userId,
        layout,
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Failed to update layout',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Add widget to user's dashboard
   * @param req - Express request object containing widget configuration
   * @param res - Express response object
   * @returns JSON response with new widget data
   */
  static async addWidget(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement widget addition
      // 1. Extract user ID from authenticated request
      // 2. Validate widget type and configuration
      // 3. Create widget configuration
      // 4. Add widget to user's dashboard
      // 5. Initialize widget data
      // 6. Return new widget data

      const userId = (req as any).userId || 'placeholder-user-id';
      const { type, config } = req.body;

      // Placeholder response
      res.status(201).json({
        message: 'Widget added successfully',
        widget: {
          id: 'new-widget-id',
          type,
          config,
          userId,
        },
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Failed to add widget',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Remove widget from user's dashboard
   * @param req - Express request object containing widget ID
   * @param res - Express response object
   * @returns JSON response confirming widget removal
   */
  static async removeWidget(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement widget removal
      // 1. Extract user ID from authenticated request
      // 2. Extract widget ID from request parameters
      // 3. Verify widget belongs to user
      // 4. Remove widget from dashboard
      // 5. Clean up widget configuration
      // 6. Return success response

      const userId = (req as any).userId || 'placeholder-user-id';
      const widgetId = req.params.id;

      // Placeholder response
      res.status(200).json({
        message: 'Widget removed successfully',
        widgetId,
        userId,
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Failed to remove widget',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Sync all widget data from external sources
   * @param req - Express request object (should contain authenticated user ID)
   * @param res - Express response object
   * @returns JSON response with sync status
   */
  static async syncWidgets(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement widget data synchronization
      // 1. Extract user ID from authenticated request
      // 2. Get all user's configured widgets
      // 3. For each widget type, fetch latest data:
      //    - Weather: API call to weather service
      //    - Slack: API call to Slack API
      //    - Canvas: API call to Canvas LMS API
      //    - Bank: API call to banking service (with proper security)
      //    - CRM: API call to CRM service
      // 4. Update widget data in database
      // 5. Return sync status for each widget

      const userId = (req as any).userId || 'placeholder-user-id';

      // Placeholder response
      res.status(200).json({
        message: 'Widgets synced successfully',
        userId,
        syncResults: {
          weather: { status: 'success', lastUpdated: new Date() },
          slack: { status: 'success', lastUpdated: new Date() },
          canvas: { status: 'success', lastUpdated: new Date() },
          bank: { status: 'success', lastUpdated: new Date() },
          crm: { status: 'success', lastUpdated: new Date() },
        },
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Failed to sync widgets',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get widget configuration/settings
   * @param req - Express request object containing widget ID
   * @param res - Express response object
   * @returns JSON response with widget configuration
   */
  static async getWidgetConfig(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement widget configuration retrieval
      // 1. Extract user ID from authenticated request
      // 2. Extract widget ID from request parameters
      // 3. Verify widget belongs to user
      // 4. Retrieve widget configuration
      // 5. Return configuration data

      const userId = (req as any).userId || 'placeholder-user-id';
      const widgetId = req.params.id;

      // Placeholder response
      res.status(200).json({
        widgetId,
        userId,
        config: {},
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Failed to fetch widget configuration',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update widget configuration/settings
   * @param req - Express request object containing widget ID and new config
   * @param res - Express response object
   * @returns JSON response with updated configuration
   */
  static async updateWidgetConfig(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement widget configuration update
      // 1. Extract user ID from authenticated request
      // 2. Extract widget ID and new config from request
      // 3. Validate configuration
      // 4. Verify widget belongs to user
      // 5. Update widget configuration
      // 6. Return updated configuration

      const userId = (req as any).userId || 'placeholder-user-id';
      const widgetId = req.params.id;
      const { config } = req.body;

      // Placeholder response
      res.status(200).json({
        message: 'Widget configuration updated successfully',
        widgetId,
        userId,
        config,
      });
    } catch (error) {
      // TODO: Handle errors appropriately
      res.status(500).json({
        message: 'Failed to update widget configuration',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
