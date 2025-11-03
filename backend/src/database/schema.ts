/**
 * Database Schema
 * Defines all database tables and their structure
 */

import Database from 'better-sqlite3';

/**
 * Create all database tables
 * @param db - Database instance
 */
export function createTables(db: Database.Database): void {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Indexes for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
  `);

  // Widgets table - stores user widget configurations
  db.exec(`
    CREATE TABLE IF NOT EXISTS widgets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('weather', 'slack', 'canvas', 'bank', 'crm')),
      title TEXT NOT NULL,
      position_x INTEGER DEFAULT 0,
      position_y INTEGER DEFAULT 0,
      width INTEGER DEFAULT 1,
      height INTEGER DEFAULT 1,
      config TEXT, -- JSON string for widget-specific configuration
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Index on user_id for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_widgets_user_id ON widgets(user_id)
  `);

  // Dashboard layouts table - stores user dashboard layouts
  db.exec(`
    CREATE TABLE IF NOT EXISTS dashboard_layouts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      layout TEXT NOT NULL, -- JSON string for layout configuration
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Index on user_id
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_dashboard_layouts_user_id ON dashboard_layouts(user_id)
  `);

  // Widget data cache - stores cached widget data
  db.exec(`
    CREATE TABLE IF NOT EXISTS widget_data_cache (
      id TEXT PRIMARY KEY,
      widget_id TEXT NOT NULL,
      data TEXT NOT NULL, -- JSON string for cached data
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (widget_id) REFERENCES widgets(id) ON DELETE CASCADE
    )
  `);

  // Index on widget_id and expires_at for cleanup
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_widget_data_cache_widget_id ON widget_data_cache(widget_id)
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_widget_data_cache_expires_at ON widget_data_cache(expires_at)
  `);

  // Sessions table - for authentication tokens (optional, can use JWT instead)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Index on token and expires_at
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)
  `);

  // Bank Accounts table - stores user bank accounts
  db.exec(`
    CREATE TABLE IF NOT EXISTS bank_accounts (
      account_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Index on user_id for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id)
  `);

  console.log('✅ Database tables created successfully');
}

/**
 * Drop all tables (use with caution - for development only)
 * @param db - Database instance
 */
export function dropTables(db: Database.Database): void {
  db.exec(`
    DROP TABLE IF EXISTS widget_data_cache;
    DROP TABLE IF EXISTS dashboard_layouts;
    DROP TABLE IF EXISTS widgets;
    DROP TABLE IF EXISTS bank_accounts;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS users;
  `);
  
  console.log('⚠️  All database tables dropped');
}

