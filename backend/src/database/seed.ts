/**
 * Database Seed Script
 * Populates the database with test data for development
 */

import { getDatabase } from '../config/database';
import { User } from '../models/User';

/**
 * Generate a simple UUID v4-like ID
 * In production, use a proper UUID library
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Seed the database with test users
 */
export async function seedDatabase(): Promise<void> {
  try {
    const db = getDatabase();

    console.log('🌱 Seeding database with test data...');

    // Check if test user already exists
    const existingUser = db
      .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
      .get('test@morningboard.com', 'testuser') as { id: string } | undefined;

    if (existingUser) {
      console.log('⚠️  Test user already exists, skipping seed');
      return;
    }

    // Create test user password hash
    const testPassword = 'TestPassword123!';
    const hashedPassword = await User.hashPassword(testPassword);

    // Generate user ID
    const userId = generateId();

    // Insert test user
    const insertUser = db.prepare(`
      INSERT INTO users (
        id,
        username,
        email,
        password,
        first_name,
        last_name,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    insertUser.run(
      userId,
      'testuser',
      'test@morningboard.com',
      hashedPassword,
      'Test',
      'User',
      now,
      now
    );

        console.log('✅ Test user created successfully');
        console.log('📝 Test credentials:');
        console.log('   Username: testuser');
        console.log('   Email: test@morningboard.com');
        console.log('   Password: TestPassword123!');
        console.log('   (Password is hashed in database)');

        // Seed widgets for the test user
        try {
          const { seedTestUserWidgets } = await import('./widgetSeed');
          await seedTestUserWidgets();
        } catch (widgetError) {
          console.warn('⚠️  Widget seeding skipped:', widgetError);
        }
      } catch (error) {
        console.error('❌ Database seeding failed:', error);
        throw error;
      }
    }

/**
 * Clear all seed data (use with caution)
 */
export async function clearSeedData(): Promise<void> {
  try {
    const db = getDatabase();

    console.log('🗑️  Clearing seed data...');

    // Delete test user
    const deleteUser = db.prepare('DELETE FROM users WHERE email = ? OR username = ?');
    const result = deleteUser.run('test@morningboard.com', 'testuser');

    if (result.changes && result.changes > 0) {
      console.log(`✅ Deleted ${result.changes} test user(s)`);
    } else {
      console.log('⚠️  No test users found to delete');
    }
  } catch (error) {
    console.error('❌ Failed to clear seed data:', error);
    throw error;
  }
}

// Run seed if script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed script failed:', error);
      process.exit(1);
    });
}

