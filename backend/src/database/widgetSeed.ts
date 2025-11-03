/**
 * Widget Seed Data
 * Creates mock widget records for testing and development
 */

import { getDatabase } from '../config/database';
import { Widget } from '../models/Widget';

/**
 * Generate a UUID-like string for widget IDs
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Seed widgets for a specific user
 * @param userId - User ID to create widgets for
 * @returns Array of created widget IDs
 */
export async function seedWidgetsForUser(userId: string): Promise<string[]> {
  try {
    const db = getDatabase();
    const widgetIds: string[] = [];

    // Check if user exists
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId) as { id: string } | undefined;
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Mock widgets to create
    const mockWidgets = [
      {
        type: 'weather' as const,
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
        positionX: 0,
        positionY: 0,
        width: 1,
        height: 1,
      },
      {
        type: 'bank' as const,
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
        positionX: 1,
        positionY: 0,
        width: 1,
        height: 1,
      },
      {
        type: 'slack' as const,
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
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
        positionX: 0,
        positionY: 1,
        width: 1,
        height: 1,
      },
    ];

    // Insert widgets
    const insertWidget = db.prepare(`
      INSERT INTO widgets (
        id, user_id, type, title, position_x, position_y, width, height, config, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const mockWidget of mockWidgets) {
      const widget = new Widget({
        id: generateId(),
        userId: userId,
        type: mockWidget.type,
        title: mockWidget.title,
        data: mockWidget.data,
        positionX: mockWidget.positionX,
        positionY: mockWidget.positionY,
        width: mockWidget.width,
        height: mockWidget.height,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastUpdated: new Date(),
      });

      // Validate widget
      if (!widget.validate()) {
        console.warn(`⚠️  Skipping invalid widget: ${widget.title}`);
        continue;
      }

      const dbRow = widget.toDatabaseRow();
      const now = new Date().toISOString();

      insertWidget.run(
        dbRow.id,
        dbRow.user_id,
        dbRow.type,
        dbRow.title,
        dbRow.position_x,
        dbRow.position_y,
        dbRow.width,
        dbRow.height,
        dbRow.config,
        now,
        now
      );

      widgetIds.push(widget.id);
      console.log(`✅ Created widget: ${widget.title} (${widget.type})`);
    }

    return widgetIds;
  } catch (error) {
    console.error('❌ Failed to seed widgets:', error);
    throw error;
  }
}

/**
 * Clear all widgets for a specific user
 * @param userId - User ID to clear widgets for
 */
export async function clearWidgetsForUser(userId: string): Promise<void> {
  try {
    const db = getDatabase();
    const deleteWidgets = db.prepare('DELETE FROM widgets WHERE user_id = ?');
    const result = deleteWidgets.run(userId);
    
    if (result.changes && result.changes > 0) {
      console.log(`✅ Deleted ${result.changes} widget(s) for user ${userId}`);
    } else {
      console.log(`⚠️  No widgets found for user ${userId}`);
    }
  } catch (error) {
    console.error('❌ Failed to clear widgets:', error);
    throw error;
  }
}

/**
 * Seed widgets for the test user (created in seed.ts)
 * This is called automatically during development seeding
 */
export async function seedTestUserWidgets(): Promise<void> {
  try {
    const db = getDatabase();
    
    // Find test user
    const testUser = db
      .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
      .get('test@morningboard.com', 'testuser') as { id: string } | undefined;

    if (!testUser) {
      console.log('⚠️  Test user not found, skipping widget seeding');
      return;
    }

    // Check if widgets already exist
    const existingWidgets = db
      .prepare('SELECT COUNT(*) as count FROM widgets WHERE user_id = ?')
      .get(testUser.id) as { count: number } | undefined;

    if (existingWidgets && existingWidgets.count > 0) {
      console.log('⚠️  Widgets already exist for test user, skipping seed');
      return;
    }

    console.log('🌱 Seeding widgets for test user...');
    const widgetIds = await seedWidgetsForUser(testUser.id);
    console.log(`✅ Created ${widgetIds.length} widgets for test user`);
  } catch (error) {
    console.error('❌ Failed to seed test user widgets:', error);
    throw error;
  }
}

if (require.main === module) {
  // If run directly, seed widgets for test user
  seedTestUserWidgets()
    .then(() => {
      console.log('✅ Widget seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Widget seed script failed:', error);
      process.exit(1);
    });
}

