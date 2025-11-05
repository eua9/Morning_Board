# BankService Mock Implementation

## Overview

The `BankService` is a **mock implementation** that simulates bank account operations without calling any real external banking API. This allows frontend and backend development to proceed in parallel while the real banking integration is being developed.

## ⚠️ Important: This is a Mock Service

**This service does NOT:**
- Verify accounts with real banks
- Call external banking APIs
- Validate account numbers against real bank systems
- Perform real authentication with financial institutions

**This service DOES:**
- Store accounts in the database (persistent)
- Provide a stable interface for UI development
- Enable testing without external dependencies
- Simulate realistic responses for development

## Implementation Details

### Location
- **Service:** `backend/src/services/BankService.ts`
- **Tests:** `backend/src/services/__tests__/BankService.test.ts`
- **Model:** `backend/src/models/BankAccount.ts`

### Service Interface

The `IBankService` interface defines the contract that both mock and real implementations must follow:

```typescript
interface IBankService {
  getAccounts(userId: string): Promise<ServiceResponse<BankAccount[]>>;
  addAccount(userId: string, accountInfo: AddAccountRequest): Promise<ServiceResponse<BankAccount>>;
  getAccountById(accountId: string): Promise<ServiceResponse<BankAccount | null>>;
  deleteAccount(accountId: string, userId: string): Promise<ServiceResponse<boolean>>;
}
```

### Methods

#### `getAccounts(userId)`
- **Purpose:** Retrieve all bank accounts for a user
- **Mock Behavior:** Fetches accounts from database using `BankAccount.findByUserId()`
- **Returns:** Array of `BankAccount` objects
- **Error Handling:** Returns error if userId is invalid

#### `addAccount(userId, accountInfo)`
- **Purpose:** Add a new bank account for a user
- **Mock Behavior:**
  - Generates a mock account ID (format: `mock-account-{timestamp}-{random}`)
  - Creates a new `BankAccount` instance
  - Saves to database
  - No verification against real banking API
- **Validation:**
  - Account name is required (1-100 characters)
  - Initial balance must be a valid number (defaults to 0.00)
  - Account number is accepted as-is (no validation)
- **Returns:** Created `BankAccount` object

#### `getAccountById(accountId)`
- **Purpose:** Get a specific account by ID
- **Mock Behavior:** Uses `BankAccount.findById()` to fetch from database
- **Returns:** `BankAccount` object or `null` if not found

#### `deleteAccount(accountId, userId)`
- **Purpose:** Delete an account
- **Mock Behavior:**
  - Verifies account belongs to user
  - Deletes from database using `BankAccount.delete()`
- **Returns:** Success status

## Usage Example

```typescript
import { bankService } from './services/BankService';

// Get all accounts for a user
const accountsResponse = await bankService.getAccounts(userId);
if (accountsResponse.success) {
  console.log(`User has ${accountsResponse.data?.length} accounts`);
}

// Add a new account
const addResponse = await bankService.addAccount(userId, {
  name: 'Checking Account',
  initialBalance: 100.00,
  accountType: 'Checking',
});
if (addResponse.success) {
  console.log(`Account created: ${addResponse.data?.accountId}`);
}
```

## Data Flow

```
Frontend Request
    ↓
BankService (Mock)
    ↓
BankAccount Model
    ↓
Database (SQLite)
```

**When Real Service is Integrated:**
```
Frontend Request
    ↓
BankService (Real)
    ↓
External Banking API
    ↓
BankAccount Model
    ↓
Database (SQLite)
```

## Replacement Strategy

When the real banking API is ready, follow these steps:

### Step 1: Create Real Service Implementation

Create a new file `backend/src/services/BankServiceReal.ts`:

```typescript
import { IBankService, ServiceResponse, AddAccountRequest } from './BankService';
import { BankAccount } from '../models/BankAccount';
import { ExternalBankingAPI } from './external-banking-api'; // Your real API client

export class BankServiceReal implements IBankService {
  private apiClient: ExternalBankingAPI;

  constructor(apiClient: ExternalBankingAPI) {
    this.apiClient = apiClient;
  }

  async getAccounts(userId: string): Promise<ServiceResponse<BankAccount[]>> {
    // Call real banking API
    const apiAccounts = await this.apiClient.fetchUserAccounts(userId);
    
    // Transform API response to BankAccount objects
    const accounts = apiAccounts.map(apiAccount => 
      BankAccount.create({
        accountId: apiAccount.id,
        userId,
        name: apiAccount.displayName,
        balance: apiAccount.currentBalance,
      })
    );

    // Optionally sync with database
    accounts.forEach(account => account.save());

    return {
      success: true,
      data: accounts,
    };
  }

  async addAccount(userId: string, accountInfo: AddAccountRequest): Promise<ServiceResponse<BankAccount>> {
    // Call real banking API to link account
    const apiResponse = await this.apiClient.linkAccount(userId, {
      accountNumber: accountInfo.accountNumber,
      routingNumber: accountInfo.routingNumber, // Add if needed
    });

    // Create BankAccount from API response
    const account = BankAccount.create({
      accountId: apiResponse.accountId,
      userId,
      name: accountInfo.name,
      balance: apiResponse.initialBalance,
    });

    account.save();

    return {
      success: true,
      data: account,
    };
  }

  // ... implement other methods
}
```

### Step 2: Update Service Export

In `backend/src/services/BankService.ts`, add:

```typescript
// Export the appropriate implementation based on environment
export const bankService: IBankService = 
  process.env.USE_REAL_BANK_API === 'true'
    ? new BankServiceReal(externalBankingAPIClient)
    : new BankService();
```

Or use dependency injection:

```typescript
// In your application setup
const bankService = process.env.NODE_ENV === 'production'
  ? new BankServiceReal(externalBankingAPIClient)
  : new BankService();
```

### Step 3: Update Configuration

Add to `.env`:
```env
USE_REAL_BANK_API=false  # Set to true when ready
BANK_API_URL=https://api.bank.com
BANK_API_KEY=your_api_key
```

### Step 4: Update Tests

Create tests for the real implementation:
- `backend/src/services/__tests__/BankServiceReal.test.ts`
- Mock the external API client
- Test error handling for API failures
- Test data transformation from API to BankAccount

## Testing

### Unit Tests
Run tests with:
```bash
npm run test -- BankService.test.ts
```

**Test Coverage:**
- ✅ getAccounts with empty and populated results
- ✅ addAccount with validation
- ✅ getAccountById with found and not found cases
- ✅ deleteAccount with ownership verification
- ✅ Mock behavior (ID generation, persistence)

### Integration Tests
Create integration tests that:
1. Test the service with real database
2. Verify data persistence
3. Test error scenarios

## Frontend Integration

The frontend can use this service immediately:

```typescript
// Frontend API call
const response = await fetch('/api/bank/accounts', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const accounts = await response.json();
```

The backend controller will use `bankService` internally, so the frontend doesn't need to know it's a mock.

## Limitations

**Current Limitations (Mock):**
1. No real account verification
2. Account numbers are not validated
3. No real-time balance updates
4. No transaction history
5. No real account linking

**When Real Service is Integrated:**
- All of the above will be handled by the external banking API
- The interface remains the same, so frontend code won't need changes

## Documentation Updates Needed

When replacing with real service:
1. Update this document with real API details
2. Document authentication flow
3. Document rate limits and error handling
4. Update API endpoint documentation
5. Add security considerations

## Team Review Checklist

Before integrating real service:
- [ ] Review interface with frontend team
- [ ] Confirm all required data is available
- [ ] Verify error handling matches expectations
- [ ] Test data transformation
- [ ] Document API authentication
- [ ] Set up monitoring and logging
- [ ] Plan rollback strategy

---

**Status:** ✅ Mock Implementation Complete  
**Last Updated:** 2025-11-03  
**Next Step:** Coordinate with banking API provider for real integration

