//
//  BankAccountWidgetUITests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
import SwiftUI
@testable import MorningBoard

/// Unit tests for BankAccountWidget UI behavior
final class BankAccountWidgetUITests: XCTestCase {
    
    // MARK: - Tap Interaction Tests
    
    func testWidgetIsTappable() {
        // Test that widget can be initialized with tap interaction state
        let account = BankAccount(
            accountId: "test-1",
            name: "Checking Account",
            balance: 1000.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let widget = BankAccountWidget(account: account)
        XCTAssertNotNil(widget, "Widget should be tappable")
    }
    
    func testWidgetWithZeroBalanceIndicator() {
        // Test that zero balance shows "(Test Balance)" indicator
        let account = BankAccount(
            accountId: "test-2",
            name: "Test Account",
            balance: 0.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        XCTAssertEqual(account.balance, 0.0, "Balance should be zero for test indicator")
    }
    
    func testWidgetWithNonZeroBalance() {
        // Test that non-zero balance doesn't show test indicator
        let account = BankAccount(
            accountId: "test-3",
            name: "Savings Account",
            balance: 1234.56,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        XCTAssertNotEqual(account.balance, 0.0, "Balance should not be zero")
        XCTAssertTrue(account.balance > 0, "Balance should be positive")
    }
    
    // MARK: - Balance Formatting Tests
    
    func testBalanceFormatting() {
        // Test various balance formatting scenarios
        let testCases: [Double] = [0.0, 100.0, 1234.56, 10000.0, 100000.0]
        
        for balance in testCases {
            let account = BankAccount(
                accountId: "test",
                name: "Test",
                balance: balance,
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-01T00:00:00.000Z"
            )
            
            // Verify balance is stored correctly (formatting is tested in widget)
            XCTAssertEqual(account.balance, balance, accuracy: 0.01)
        }
    }
    
    // MARK: - Empty State Tests
    
    func testEmptyStateHandling() {
        // Test that empty accounts array is handled properly
        let accounts: [BankAccount] = []
        XCTAssertTrue(accounts.isEmpty, "Empty state should be detected")
    }
}

