//
//  AddAccountIntegrationTests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
@testable import MorningBoard

/// Integration tests for Add Account functionality
final class AddAccountIntegrationTests: XCTestCase {
    
    // MARK: - Setup & Teardown
    
    override func setUp() {
        super.setUp()
        TokenStorage.clearAllTokens()
    }
    
    override func tearDown() {
        TokenStorage.clearAllTokens()
        super.tearDown()
    }
    
    // MARK: - Request Construction Tests
    
    func testAddAccountRequestConstruction() {
        // Test that request is properly constructed from form data
        let accountName = "Checking Account"
        let accountNumber = "1234567890"
        
        let request = AddAccountRequest(
            name: accountName,
            accountNumber: accountNumber,
            initialBalance: nil,
            accountType: nil
        )
        
        XCTAssertEqual(request.name, accountName)
        XCTAssertEqual(request.accountNumber, accountNumber)
        XCTAssertNil(request.initialBalance)
        XCTAssertNil(request.accountType)
    }
    
    func testAddAccountRequestWithTrimming() {
        // Test that whitespace is properly handled
        let accountName = "  Checking Account  "
        let accountNumber = "  1234567890  "
        
        let trimmedName = accountName.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedNumber = accountNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        
        let request = AddAccountRequest(
            name: trimmedName,
            accountNumber: trimmedNumber,
            initialBalance: nil,
            accountType: nil
        )
        
        XCTAssertEqual(request.name, "Checking Account")
        XCTAssertEqual(request.accountNumber, "1234567890")
    }
    
    // MARK: - Error Handling Tests
    
    func testErrorHandlingWithoutToken() {
        // Test that error is properly handled when no token is present
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
                XCTFail("Should fail without token")
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
    
    // MARK: - Success Path Tests
    
    func testSuccessResponseHandling() {
        // Test that success response can be decoded
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
        XCTAssertEqual(response.account.name, "Test Account")
    }
}

