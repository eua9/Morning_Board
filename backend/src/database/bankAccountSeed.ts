/**
 * Bank Account Seed Script
 * Creates sample bank accounts for testing the BankAccount model and schema
 */

import { getDatabase } from '../config/database';
import { BankAccount } from '../models/BankAccount';

/**
 * Generate a unique ID for test data
 */
function generateId(): string {
  return `bank-account-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Seed bank accounts for the test user
 */
export async function seedBankAccounts(): Promise<void> {
  try {
    const db = getDatabase();
    console.log('🌱 Seeding bank accounts...');

    // Find the test user ID
    const testUser = db
      .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
      .get('test@morningboard.com', 'testuser') as { id: string } | undefined;

    if (!testUser) {
      console.warn('⚠️  Test user not found, cannot seed bank accounts.');
      console.log('💡 Run the user seed script first: npm run seed');
      return;
    }

    const userId = testUser.id;

    // Check if accounts already exist for this user
    const existingAccounts = BankAccount.findByUserId(userId);
    if (existingAccounts.length > 0) {
      console.log(`⚠️  User already has ${existingAccounts.length} bank account(s), skipping seed`);
      return;
    }

    // Create sample bank accounts
    const sampleAccounts = [
      {
        accountId: generateId(),
        userId,
        name: 'Checking Account',
        balance: 1234.56,
      },
      {
        accountId: generateId(),
        userId,
        name: 'Savings Account',
        balance: 5000.00,
      },
      {
        accountId: generateId(),
        userId,
        name: 'Credit Card',
        balance: -250.00, // Negative balance for credit card
      },
    ];

    let accountsCreated = 0;
    for (const accountData of sampleAccounts) {
      const account = BankAccount.create(accountData);
      
      // Check if account already exists (by ID)
      const existing = BankAccount.findById(account.accountId);
      if (!existing) {
        account.save();
        accountsCreated++;
        console.log(`  ✅ Created ${account.name}: ${account.formatBalance()}`);
      }
    }

    console.log(`✅ Created ${accountsCreated} bank account(s) for test user`);
  } catch (error) {
    console.error('❌ Bank account seeding failed:', error);
    throw error;
  }
}

/**
 * Clear all seeded bank accounts
 */
export async function clearBankAccountSeed(): Promise<void> {
  try {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM bank_accounts WHERE account_id LIKE ?').run('bank-account-%');
    console.log(`🗑️  Cleared ${result.changes} seeded bank account(s)`);
  } catch (error) {
    console.error('❌ Failed to clear bank account seed data:', error);
    throw error;
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedBankAccounts()
    .then(() => {
      console.log('✅ Bank account seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Bank account seed script failed:', error);
      process.exit(1);
    });
}

