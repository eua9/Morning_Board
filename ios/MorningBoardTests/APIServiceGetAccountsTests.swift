//
//  APIServiceGetAccountsTests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
@testable import MorningBoard

/// Unit tests for APIService getAccounts method
final class APIServiceGetAccountsTests: XCTestCase {
    
    // MARK: - Setup & Teardown
    
    override func setUp() {
        super.setUp()
        TokenStorage.clearAllTokens()
    }
    
    override func tearDown() {
        TokenStorage.clearAllTokens()
        super.tearDown()
    }
    
    // MARK: - Get Accounts Response Model Tests
    
    func testGetAccountsResponseModel() {
        // Test GetAccountsResponse model structure
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
        
        let response = GetAccountsResponse(
            message: "Accounts retrieved successfully",
            accounts: [account1, account2],
            count: 2
        )
        
        XCTAssertEqual(response.message, "Accounts retrieved successfully")
        XCTAssertEqual(response.accounts.count, 2)
        XCTAssertEqual(response.count, 2)
        XCTAssertEqual(response.accounts[0].name, "Checking Account")
        XCTAssertEqual(response.accounts[1].name, "Savings Account")
    }
    
    func testGetAccountsResponseEmpty() {
        // Test empty accounts response
        let response = GetAccountsResponse(
            message: "Accounts retrieved successfully",
            accounts: [],
            count: 0
        )
        
        XCTAssertEqual(response.message, "Accounts retrieved successfully")
        XCTAssertEqual(response.accounts.count, 0)
        XCTAssertEqual(response.count, 0)
        XCTAssertTrue(response.accounts.isEmpty)
    }
    
    func testGetAccountsWithoutToken() {
        // Test that getAccounts fails without access token
        let expectation = XCTestExpectation(description: "API call should fail without token")
        
        APIService.getAccounts { result in
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
    
    func testGetAccountsResponseWithSingleAccount() {
        // Test response with single account
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
        
        XCTAssertEqual(response.count, 1)
        XCTAssertEqual(response.accounts.count, 1)
        XCTAssertEqual(response.accounts.first?.accountId, "test-123")
    }
}

