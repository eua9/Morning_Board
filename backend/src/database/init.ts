/**
 * Database Initialization
 * Creates tables and initial schema
 */

import { getDatabaseConnection } from '../config/database';
import { createTables } from './schema';
import { seedDatabase } from './seed';

/**
 * Initialize the database with schema
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const connection = getDatabaseConnection();
    const db = connection.connect();

    console.log('📊 Initializing database schema...');
    
    // Create tables
    createTables(db);

    // Verify tables were created
    const tables = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      )
      .all() as Array<{ name: string }>;

    console.log(`✅ Database initialized with ${tables.length} tables:`, 
      tables.map((t) => t.name).join(', '));

    // Seed database with test user if in development mode
    if (process.env.NODE_ENV !== 'production') {
      try {
        await seedDatabase();
      } catch (seedError) {
        // Don't fail initialization if seeding fails
        console.warn('⚠️  Seed data creation skipped:', seedError);
      }
    }

    return Promise.resolve();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Check database connection health
 * @returns true if database is healthy, false otherwise
 */
export function checkDatabaseHealth(): boolean {
  try {
    const connection = getDatabaseConnection();
    if (!connection.isConnected()) {
      connection.connect();
    }
    
    const db = connection.getDatabase();
    // Simple query to verify connection
    db.prepare('SELECT 1').get();
    
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
}

