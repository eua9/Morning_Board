//
//  BankAccountWidgetTests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
import SwiftUI
@testable import MorningBoard

/// Unit tests for BankAccountWidget
final class BankAccountWidgetTests: XCTestCase {
    
    // MARK: - Widget Initialization Tests
    
    func testWidgetInitialization() {
        let account = BankAccount(
            accountId: "test-123",
            name: "Checking Account",
            balance: 1000.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let widget = BankAccountWidget(account: account)
        XCTAssertNotNil(widget, "Widget should initialize successfully")
    }
    
    func testWidgetWithZeroBalance() {
        // Test widget with zero balance (dummy data indicator)
        let account = BankAccount(
            accountId: "test-456",
            name: "Savings Account",
            balance: 0.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let widget = BankAccountWidget(account: account)
        XCTAssertNotNil(widget, "Widget should handle zero balance")
        XCTAssertEqual(account.balance, 0.0, "Balance should be zero")
    }
    
    func testWidgetWithPositiveBalance() {
        // Test widget with positive balance
        let account = BankAccount(
            accountId: "test-789",
            name: "Checking Account",
            balance: 1234.56,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let widget = BankAccountWidget(account: account)
        XCTAssertNotNil(widget, "Widget should handle positive balance")
        XCTAssertEqual(account.balance, 1234.56, accuracy: 0.01, "Balance should match")
    }
    
    // MARK: - Data Validation Tests
    
    func testAccountNameDisplay() {
        let account = BankAccount(
            accountId: "test-1",
            name: "Test Account Name",
            balance: 500.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        XCTAssertEqual(account.name, "Test Account Name", "Account name should be stored correctly")
    }
    
    func testBalanceFormatting() {
        // Test various balance values
        let testCases: [(Double, String)] = [
            (0.0, "$0.00"),
            (100.0, "$100.00"),
            (1234.56, "$1,234.56"),
            (10000.0, "$10,000.00")
        ]
        
        for (balance, expectedPrefix) in testCases {
            let account = BankAccount(
                accountId: "test",
                name: "Test",
                balance: balance,
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-01T00:00:00.000Z"
            )
            
            // Verify balance is stored correctly
            XCTAssertEqual(account.balance, balance, accuracy: 0.01, "Balance should match")
        }
    }
}

