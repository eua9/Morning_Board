/**
 * Database Configuration
 * Handles database connection and initialization
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface DatabaseConfig {
  type: 'sqlite' | 'postgresql';
  database?: string; // SQLite database file path or PostgreSQL database name
  host?: string; // PostgreSQL host
  port?: number; // PostgreSQL port
  user?: string; // PostgreSQL user
  password?: string; // PostgreSQL password
}

class DatabaseConnection {
  private db: Database.Database | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * Initialize and connect to the database
   * @returns Database instance
   */
  connect(): Database.Database {
    try {
      if (this.config.type === 'sqlite') {
        // SQLite connection
        const dbPath = this.config.database || path.join(process.cwd(), 'data', 'morning_board.db');
        
        // Ensure data directory exists
        const dataDir = path.dirname(dbPath);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        this.db = new Database(dbPath);
        
        // Enable foreign keys and WAL mode for better performance
        this.db.pragma('foreign_keys = ON');
        this.db.pragma('journal_mode = WAL');
        
        console.log(`✅ Connected to SQLite database: ${dbPath}`);
      } else {
        // PostgreSQL connection would go here
        // For now, throw error if PostgreSQL is selected
        throw new Error('PostgreSQL support not yet implemented. Use SQLite for development.');
      }

      return this.db!;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Get the database instance
   * @returns Database instance
   */
  getDatabase(): Database.Database {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('✅ Database connection closed');
    }
  }

  /**
   * Check if database is connected
   * @returns true if connected, false otherwise
   */
  isConnected(): boolean {
    return this.db !== null;
  }

  /**
   * Run a database migration/initialization
   * @param sql - SQL script to execute
   */
  runMigration(sql: string): void {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    try {
      this.db.exec(sql);
      console.log('✅ Database migration executed successfully');
    } catch (error) {
      console.error('❌ Database migration failed:', error);
      throw error;
    }
  }
}

// Singleton instance
let dbConnection: DatabaseConnection | null = null;

/**
 * Get database connection instance
 * @returns Database connection instance
 */
export function getDatabaseConnection(): DatabaseConnection {
  if (!dbConnection) {
    const config: DatabaseConfig = {
      type: (process.env.DB_TYPE as 'sqlite' | 'postgresql') || 'sqlite',
      database: process.env.DB_DATABASE || 'data/morning_board.db',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    };

    dbConnection = new DatabaseConnection(config);
  }

  return dbConnection;
}

/**
 * Get the database instance directly
 * @returns Database instance
 */
export function getDatabase(): Database.Database {
  const connection = getDatabaseConnection();
  if (!connection.isConnected()) {
    connection.connect();
  }
  return connection.getDatabase();
}

export default getDatabaseConnection;

