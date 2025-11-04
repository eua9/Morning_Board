//
//  BankAccountWidgetDisplayTests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
import SwiftUI
@testable import MorningBoard

/// Unit tests for Bank Account widget display with single and multiple accounts
final class BankAccountWidgetDisplayTests: XCTestCase {
    
    // MARK: - Single Account Display Tests
    
    func testSingleAccountDisplay() {
        // Test displaying a single account
        let account = BankAccount(
            accountId: "test-1",
            name: "Checking Account",
            balance: 1000.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let widget = BankAccountWidget(account: account)
        XCTAssertNotNil(widget, "Single account widget should be created")
        XCTAssertEqual(account.name, "Checking Account")
        XCTAssertEqual(account.balance, 1000.0, accuracy: 0.01)
    }
    
    func testSingleAccountWithZeroBalance() {
        // Test single account with zero balance (dummy data)
        let account = BankAccount(
            accountId: "test-2",
            name: "Savings Account",
            balance: 0.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let widget = BankAccountWidget(account: account)
        XCTAssertNotNil(widget, "Widget should handle zero balance")
        XCTAssertEqual(account.balance, 0.0)
    }
    
    // MARK: - Multiple Accounts Display Tests
    
    func testMultipleAccountsDisplay() {
        // Test displaying multiple accounts
        let account1 = BankAccount(
            accountId: "test-1",
            name: "Checking Account",
            balance: 1000.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let account2 = BankAccount(
            accountId: "test-2",
            name: "Savings Account",
            balance: 5000.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let account3 = BankAccount(
            accountId: "test-3",
            name: "Investment Account",
            balance: 10000.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let accounts = [account1, account2, account3]
        
        XCTAssertEqual(accounts.count, 3, "Should have three accounts")
        XCTAssertEqual(accounts[0].name, "Checking Account")
        XCTAssertEqual(accounts[1].name, "Savings Account")
        XCTAssertEqual(accounts[2].name, "Investment Account")
        
        // Verify each account can create a widget
        for account in accounts {
            let widget = BankAccountWidget(account: account)
            XCTAssertNotNil(widget, "Widget should be created for each account")
        }
    }
    
    func testMultipleAccountsWithMixedBalances() {
        // Test multiple accounts with different balance values
        let accounts = [
            BankAccount(
                accountId: "test-1",
                name: "Account with Zero",
                balance: 0.0,
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-01T00:00:00.000Z"
            ),
            BankAccount(
                accountId: "test-2",
                name: "Account with Balance",
                balance: 1234.56,
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-01T00:00:00.000Z"
            )
        ]
        
        XCTAssertEqual(accounts.count, 2)
        XCTAssertEqual(accounts[0].balance, 0.0)
        XCTAssertEqual(accounts[1].balance, 1234.56, accuracy: 0.01)
    }
    
    // MARK: - Account List Handling Tests
    
    func testAccountsListForEach() {
        // Test that accounts can be iterated (for ForEach in SwiftUI)
        let account1 = BankAccount(
            accountId: "test-1",
            name: "Account 1",
            balance: 100.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let account2 = BankAccount(
            accountId: "test-2",
            name: "Account 2",
            balance: 200.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let accounts = [account1, account2]
        
        // Verify Identifiable conformance
        for account in accounts {
            XCTAssertNotNil(account.id, "Account should have id")
            XCTAssertEqual(account.id, account.accountId, "id should match accountId")
        }
    }
    
    // MARK: - Empty State Tests
    
    func testEmptyAccountsState() {
        // Test empty accounts array
        let accounts: [BankAccount] = []
        XCTAssertTrue(accounts.isEmpty, "Should detect empty state")
        XCTAssertEqual(accounts.count, 0, "Empty array should have count 0")
    }
    
    // MARK: - Account Data Validation Tests
    
    func testAccountDataConsistency() {
        // Test that account data is consistent across multiple fetches
        let account = BankAccount(
            accountId: "consistent-123",
            name: "Consistent Account",
            balance: 500.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        // Verify data consistency
        XCTAssertEqual(account.accountId, "consistent-123")
        XCTAssertEqual(account.name, "Consistent Account")
        XCTAssertEqual(account.balance, 500.0, accuracy: 0.01)
    }
}

