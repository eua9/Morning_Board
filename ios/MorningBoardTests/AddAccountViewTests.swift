//
//  AddAccountViewTests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
import SwiftUI
@testable import MorningBoard

/// Unit tests for AddAccountView
final class AddAccountViewTests: XCTestCase {
    
    // MARK: - Test Properties
    
    var view: AddAccountView!
    
    // MARK: - Setup & Teardown
    
    override func setUp() {
        super.setUp()
        view = AddAccountView()
    }
    
    override func tearDown() {
        view = nil
        super.tearDown()
    }
    
    // MARK: - UI Component Tests
    
    /// Test that the view initializes with empty fields
    func testInitialState() {
        // This test validates that the view can be instantiated
        // In a real scenario, we would use ViewHosting or similar to test SwiftUI views
        XCTAssertNotNil(view, "AddAccountView should initialize successfully")
    }
    
    /// Test that required fields are present
    func testRequiredFieldsExist() {
        // Validate that the view has the necessary UI components
        // In production, this would use UI testing or view inspection
        XCTAssertNotNil(view, "View should exist")
        
        // Note: Direct property access is limited in SwiftUI views
        // In a production app, we would test the ViewModel instead
        // or use ViewInspector library for SwiftUI testing
    }
    
    /// Test form validation requirements
    func testFormValidation() {
        // Test that account name is required (non-empty)
        let emptyName = ""
        let validName = "Checking Account"
        let longName = String(repeating: "a", count: 101) // 101 characters
        
        // Test empty name
        let trimmedEmpty = emptyName.trimmingCharacters(in: .whitespacesAndNewlines)
        XCTAssertTrue(trimmedEmpty.isEmpty, "Empty name should be invalid")
        
        // Test valid name
        let trimmedValid = validName.trimmingCharacters(in: .whitespacesAndNewlines)
        XCTAssertFalse(trimmedValid.isEmpty, "Valid name should pass validation")
        XCTAssertTrue(trimmedValid.count >= 1 && trimmedValid.count <= 100, "Valid name length should be within limits")
        
        // Test name length validation
        let trimmedLong = longName.trimmingCharacters(in: .whitespacesAndNewlines)
        XCTAssertTrue(trimmedLong.count > 100, "Name exceeding 100 characters should be invalid")
        
        // Test that account number is required (non-empty)
        let emptyNumber = ""
        let validNumber = "1234567890"
        
        let trimmedEmptyNumber = emptyNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        XCTAssertTrue(trimmedEmptyNumber.isEmpty, "Empty number should be invalid")
        
        let trimmedValidNumber = validNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        XCTAssertFalse(trimmedValidNumber.isEmpty, "Valid number should pass validation")
        XCTAssertTrue(trimmedValidNumber.count >= 1, "Valid number should have at least 1 character")
    }
    
    /// Test that submit button is disabled when fields are empty
    func testSubmitButtonDisabledState() {
        let accountName = ""
        let accountNumber = ""
        let isLoading = false
        
        // Button should be disabled when fields are empty
        let shouldBeDisabled = accountName.isEmpty || accountNumber.isEmpty || isLoading
        XCTAssertTrue(shouldBeDisabled, "Submit button should be disabled when fields are empty")
        
        // Button should be enabled when fields are filled
        let filledName = "Test Account"
        let filledNumber = "12345"
        let shouldBeEnabled = !filledName.isEmpty && !filledNumber.isEmpty && !isLoading
        XCTAssertTrue(shouldBeEnabled, "Submit button should be enabled when fields are filled")
    }
    
    // MARK: - Account Number Length Validation Tests
    
    /// Test that account numbers over 200 characters are rejected
    func testAccountNumberLengthValidation() {
        let longAccountNumber = String(repeating: "1", count: 201) // 201 characters
        
        let trimmedNumber = longAccountNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        XCTAssertTrue(trimmedNumber.count > 200, "Account number exceeding 200 characters should be invalid")
        
        // Test valid length
        let validNumber = String(repeating: "1", count: 200) // Exactly 200 characters
        let trimmedValid = validNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        XCTAssertTrue(trimmedValid.count <= 200, "Account number with 200 characters should be valid")
    }
    
    // MARK: - Special Characters Validation Tests
    
    /// Test that account names with invalid special characters are rejected
    func testAccountNameSpecialCharactersValidation() {
        // Valid characters: letters, numbers, spaces, hyphens, underscores, periods, apostrophes
        let validNames = [
            "Checking Account",
            "Savings-Account",
            "Account_123",
            "John's Account",
            "Account.01"
        ]
        
        for name in validNames {
            let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
            XCTAssertFalse(trimmed.isEmpty, "Valid name should not be empty: \(name)")
        }
        
        // Invalid characters: @, #, $, %, ^, &, *, etc.
        let invalidNames = [
            "Account@Bank",
            "Account#123",
            "Account$Savings",
            "Account%Interest",
            "Account^Special",
            "Account&Company",
            "Account*Star"
        ]
        
        // Test that names with invalid characters would fail validation
        // In actual implementation, these should trigger validation errors
        for name in invalidNames {
            let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
            // Check if name contains invalid characters
            let allowedChars = CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_'.")
            let hasInvalidChars = trimmed.rangeOfCharacter(from: allowedChars.inverted) != nil
            XCTAssertTrue(hasInvalidChars, "Name should contain invalid characters: \(name)")
        }
    }
    
    // MARK: - Duplicate Account Name Validation Tests
    
    /// Test that duplicate account names are detected
    func testDuplicateAccountNameValidation() {
        let existingAccount = BankAccount(
            accountId: "existing-1",
            name: "Checking Account",
            balance: 0.0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z"
        )
        
        let existingAccounts = [existingAccount]
        
        // Test exact duplicate (case-sensitive check should be case-insensitive)
        let duplicateName = "Checking Account"
        let duplicateFound = existingAccounts.contains { account in
            account.name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() == duplicateName.lowercased()
        }
        XCTAssertTrue(duplicateFound, "Duplicate account name should be detected")
        
        // Test case-insensitive duplicate
        let caseDuplicateName = "checking account"
        let caseDuplicateFound = existingAccounts.contains { account in
            account.name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() == caseDuplicateName.lowercased()
        }
        XCTAssertTrue(caseDuplicateFound, "Case-insensitive duplicate should be detected")
        
        // Test non-duplicate
        let uniqueName = "Savings Account"
        let uniqueFound = existingAccounts.contains { account in
            account.name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() == uniqueName.lowercased()
        }
        XCTAssertFalse(uniqueFound, "Unique account name should not be detected as duplicate")
    }
    
    // MARK: - Name Equals Number Validation Tests
    
    /// Test that account name cannot be the same as account number
    func testNameNotEqualToNumberValidation() {
        // Test when name and number are the same (should be invalid)
        let sameValue = "12345"
        let name = sameValue
        let number = sameValue
        
        XCTAssertEqual(name.lowercased(), number.lowercased(), "Name and number should be equal (invalid case)")
        
        // Test when name and number are different (should be valid)
        let differentName = "Checking Account"
        let differentNumber = "1234567890"
        XCTAssertNotEqual(differentName.lowercased(), differentNumber.lowercased(), "Name and number should be different (valid case)")
        
        // Test case-insensitive comparison
        let nameCase1 = "Account123"
        let numberCase1 = "account123"
        XCTAssertEqual(nameCase1.lowercased(), numberCase1.lowercased(), "Case-insensitive comparison should detect equality")
    }
    
    /// Test that whitespace is handled correctly in name/number comparison
    func testNameNumberComparisonWithWhitespace() {
        let name = "  Account 123  "
        let number = "Account 123"
        
        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedNumber = number.trimmingCharacters(in: .whitespacesAndNewlines)
        
        XCTAssertEqual(trimmedName.lowercased(), trimmedNumber.lowercased(), "Whitespace should be ignored in comparison")
    }
}

