/**
 * Test Setup
 * Configures test environment before running tests
 */

import { initializeDatabase } from '../database/init';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_DATABASE = 'data/test_morning_board.db';

beforeAll(async () => {
  // Initialize test database
  await initializeDatabase();
});

afterAll(async () => {
  // Cleanup can be done here if needed
  // For now, test database is separate from dev database
});

