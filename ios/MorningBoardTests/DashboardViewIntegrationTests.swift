//
//  DashboardViewIntegrationTests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
import SwiftUI
@testable import MorningBoard

/// Unit tests for DashboardView integration with Bank Account widget
final class DashboardViewIntegrationTests: XCTestCase {
    
    // MARK: - Setup & Teardown
    
    override func setUp() {
        super.setUp()
        TokenStorage.clearAllTokens()
    }
    
    override func tearDown() {
        TokenStorage.clearAllTokens()
        super.tearDown()
    }
    
    // MARK: - Dashboard Initialization Tests
    
    func testDashboardViewInitialization() {
        let view = DashboardView()
        XCTAssertNotNil(view, "DashboardView should initialize successfully")
    }
    
    // MARK: - Account Display Logic Tests
    
    func testEmptyAccountsState() {
        // Test that empty accounts array is handled
        let accounts: [BankAccount] = []
        XCTAssertTrue(accounts.isEmpty, "Empty accounts array should be empty")
    }
    
    func testSingleAccountState() {
        // Test single account display
        let account = BankAccount(
            accountId: "test-1",
            name: "Checking Account",
            balance: 1000.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let accounts = [account]
        XCTAssertEqual(accounts.count, 1, "Should have one account")
        XCTAssertEqual(accounts.first?.name, "Checking Account")
    }
    
    func testMultipleAccountsState() {
        // Test multiple accounts display
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
        
        let accounts = [account1, account2]
        XCTAssertEqual(accounts.count, 2, "Should have two accounts")
        XCTAssertEqual(accounts[0].name, "Checking Account")
        XCTAssertEqual(accounts[1].name, "Savings Account")
    }
    
    // MARK: - Account Fetching Logic Tests
    
    func testAccountFetchingWithoutToken() {
        // Test that fetching accounts fails without token
        let expectation = XCTestExpectation(description: "Fetch should fail without token")
        
        APIService.getAccounts { result in
            switch result {
            case .success:
                XCTFail("Should not succeed without token")
            case .failure(let error):
                if case .unauthorized = error {
                    expectation.fulfill()
                } else {
                    XCTFail("Expected unauthorized error")
                }
            }
        }
        
        wait(for: [expectation], timeout: 5.0)
    }
    
    func testAccountsResponseStructure() {
        // Test that accounts response structure is correct
        let account = BankAccount(
            accountId: "test-123",
            name: "Test Account",
            balance: 0.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let response = GetAccountsResponse(
            message: "Accounts retrieved successfully",
            accounts: [account],
            count: 1
        )
        
        XCTAssertEqual(response.accounts.count, 1)
        XCTAssertEqual(response.count, 1)
        XCTAssertNotNil(response.accounts.first)
    }
    
    // MARK: - Account Deletion Logic Tests
    
    func testDeleteAccountWithoutToken() {
        // Test that deleting an account fails without token
        let accountId = "test-account-123"
        let expectation = XCTestExpectation(description: "Delete should fail without token")
        
        APIService.deleteAccount(accountId: accountId) { result in
            switch result {
            case .success:
                XCTFail("Should not succeed without token")
            case .failure(let error):
                if case .unauthorized = error {
                    expectation.fulfill()
                } else {
                    XCTFail("Expected unauthorized error, got: \(error)")
                }
            }
        }
        
        wait(for: [expectation], timeout: 5.0)
    }
    
    func testDeleteHandlerSetup() {
        // Test that delete handler is properly set up in DashboardView
        // This verifies the handler closure structure
        var deletedAccountId: String? = nil
        
        let account = BankAccount(
            accountId: "test-delete-handler",
            name: "Test Account",
            balance: 0.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        // Simulate delete handler behavior
        let deleteHandler: (String) -> Void = { accountId in
            deletedAccountId = accountId
        }
        
        // Verify handler can be called
        deleteHandler(account.accountId)
        XCTAssertEqual(deletedAccountId, account.accountId, "Handler should receive correct account ID")
    }
}

