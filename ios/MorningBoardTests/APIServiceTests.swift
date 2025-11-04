//
//  APIServiceTests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
@testable import MorningBoard

/// Unit tests for APIService
final class APIServiceTests: XCTestCase {
    
    // MARK: - Setup & Teardown
    
    override func setUp() {
        super.setUp()
        TokenStorage.clearAllTokens()
    }
    
    override func tearDown() {
        TokenStorage.clearAllTokens()
        super.tearDown()
    }
    
    // MARK: - Add Account Tests
    
    func testAddAccountRequestModel() {
        // Test creating AddAccountRequest
        let request = AddAccountRequest(
            name: "Test Account",
            accountNumber: "1234567890",
            initialBalance: 100.0,
            accountType: "Checking"
        )
        
        XCTAssertEqual(request.name, "Test Account")
        XCTAssertEqual(request.accountNumber, "1234567890")
        XCTAssertEqual(request.initialBalance, 100.0)
        XCTAssertEqual(request.accountType, "Checking")
    }
    
    func testAddAccountRequestModelOptionalFields() {
        // Test creating AddAccountRequest with only required fields
        let request = AddAccountRequest(
            name: "Test Account",
            accountNumber: nil,
            initialBalance: nil,
            accountType: nil
        )
        
        XCTAssertEqual(request.name, "Test Account")
        XCTAssertNil(request.accountNumber)
        XCTAssertNil(request.initialBalance)
        XCTAssertNil(request.accountType)
    }
    
    func testBankAccountModel() {
        // Test creating BankAccount model
        let account = BankAccount(
            accountId: "test-123",
            name: "Test Account",
            balance: 1000.50,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        XCTAssertEqual(account.accountId, "test-123")
        XCTAssertEqual(account.name, "Test Account")
        XCTAssertEqual(account.balance, 1000.50)
        XCTAssertEqual(account.id, account.accountId) // Test Identifiable conformance
    }
    
    func testAddAccountResponseModel() {
        // Test creating AddAccountResponse model
        let account = BankAccount(
            accountId: "test-123",
            name: "Test Account",
            balance: 0.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let response = AddAccountResponse(
            message: "Account added successfully",
            account: account
        )
        
        XCTAssertEqual(response.message, "Account added successfully")
        XCTAssertEqual(response.account.accountId, "test-123")
    }
    
    func testAddAccountWithoutToken() {
        // Test that addAccount fails without access token
        let request = AddAccountRequest(
            name: "Test Account",
            accountNumber: "12345",
            initialBalance: nil,
            accountType: nil
        )
        
        let expectation = XCTestExpectation(description: "API call should fail without token")
        
        APIService.addAccount(request: request) { result in
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
    
    func testAPIErrorTypes() {
        // Test error descriptions
        let errors: [APIError] = [
            .invalidURL,
            .networkError("Network issue"),
            .badRequest("Validation failed"),
            .unauthorized("No token"),
            .serverError("Server issue")
        ]
        
        for error in errors {
            XCTAssertNotNil(error.errorDescription, "Error should have description: \(error)")
        }
    }
    
    // MARK: - Delete Account Tests
    
    func testDeleteAccountWithoutToken() {
        // Test that deleteAccount fails without access token
        let accountId = "test-account-123"
        
        let expectation = XCTestExpectation(description: "API call should fail without token")
        
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
}

