//
//  AddAccountResponseHandlingTests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
@testable import MorningBoard

/// Unit tests for Add Account response handling
final class AddAccountResponseHandlingTests: XCTestCase {
    
    // MARK: - Success Response Tests
    
    func testSuccessResponseHandling() {
        // Test successful response structure
        let account = BankAccount(
            accountId: "mock-account-123",
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
        XCTAssertEqual(response.account.accountId, "mock-account-123")
        XCTAssertEqual(response.account.name, "Test Account")
    }
    
    // MARK: - Error Response Tests
    
    func testErrorResponseHandling() {
        // Test various error types
        let errors: [APIError] = [
            .networkError("Connection timeout"),
            .unauthorized("Invalid token"),
            .badRequest("Account name is required"),
            .serverError("Internal server error")
        ]
        
        for error in errors {
            let description = error.localizedDescription
            XCTAssertFalse(description.isEmpty, "Error should have a description")
            
            // Test that error messages are user-friendly
            switch error {
            case .networkError:
                XCTAssertTrue(description.contains("Network") || description.contains("connection"), "Network error should mention connection")
            case .unauthorized:
                XCTAssertTrue(description.contains("Authentication") || description.contains("token"), "Unauthorized error should mention authentication")
            case .badRequest:
                XCTAssertTrue(description.contains("Validation") || description.contains("required"), "Bad request should mention validation")
            case .serverError:
                XCTAssertTrue(description.contains("Server") || description.contains("error"), "Server error should mention server")
            default:
                break
            }
        }
    }
    
    // MARK: - Response Flow Tests
    
    func testCompleteResponseFlow() {
        // Test that response can be processed end-to-end
        let successResponse = AddAccountResponse(
            message: "Account added successfully",
            account: BankAccount(
                accountId: "test-123",
                name: "Test Account",
                balance: 0.0,
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-01T00:00:00.000Z"
            )
        )
        
        // Verify success response
        XCTAssertEqual(successResponse.message, "Account added successfully")
        XCTAssertNotNil(successResponse.account)
        
        // Test error response
        let error = APIError.networkError("Connection failed")
        let errorDescription = error.localizedDescription
        XCTAssertFalse(errorDescription.isEmpty)
    }
}

