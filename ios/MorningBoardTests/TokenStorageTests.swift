//
//  TokenStorageTests.swift
//  MorningBoardTests
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import XCTest
@testable import MorningBoard

/// Unit tests for TokenStorage
final class TokenStorageTests: XCTestCase {
    
    // MARK: - Setup & Teardown
    
    override func setUp() {
        super.setUp()
        // Clear tokens before each test
        TokenStorage.clearAllTokens()
    }
    
    override func tearDown() {
        // Clear tokens after each test
        TokenStorage.clearAllTokens()
        super.tearDown()
    }
    
    // MARK: - Access Token Tests
    
    func testSaveAndRetrieveAccessToken() {
        let testToken = "test-access-token-123"
        
        // Save token
        TokenStorage.saveAccessToken(testToken)
        
        // Retrieve token
        let retrievedToken = TokenStorage.getAccessToken()
        
        XCTAssertEqual(retrievedToken, testToken, "Retrieved token should match saved token")
    }
    
    func testRemoveAccessToken() {
        let testToken = "test-access-token-123"
        
        // Save token
        TokenStorage.saveAccessToken(testToken)
        XCTAssertNotNil(TokenStorage.getAccessToken(), "Token should exist after saving")
        
        // Remove token
        TokenStorage.removeAccessToken()
        
        // Verify token is removed
        XCTAssertNil(TokenStorage.getAccessToken(), "Token should be nil after removal")
    }
    
    // MARK: - Refresh Token Tests
    
    func testSaveAndRetrieveRefreshToken() {
        let testToken = "test-refresh-token-456"
        
        // Save token
        TokenStorage.saveRefreshToken(testToken)
        
        // Retrieve token
        let retrievedToken = TokenStorage.getRefreshToken()
        
        XCTAssertEqual(retrievedToken, testToken, "Retrieved refresh token should match saved token")
    }
    
    func testRemoveRefreshToken() {
        let testToken = "test-refresh-token-456"
        
        // Save token
        TokenStorage.saveRefreshToken(testToken)
        XCTAssertNotNil(TokenStorage.getRefreshToken(), "Refresh token should exist after saving")
        
        // Remove token
        TokenStorage.removeRefreshToken()
        
        // Verify token is removed
        XCTAssertNil(TokenStorage.getRefreshToken(), "Refresh token should be nil after removal")
    }
    
    // MARK: - Clear All Tests
    
    func testClearAllTokens() {
        // Save both tokens
        TokenStorage.saveAccessToken("access-token")
        TokenStorage.saveRefreshToken("refresh-token")
        
        // Verify both exist
        XCTAssertNotNil(TokenStorage.getAccessToken())
        XCTAssertNotNil(TokenStorage.getRefreshToken())
        
        // Clear all
        TokenStorage.clearAllTokens()
        
        // Verify both are removed
        XCTAssertNil(TokenStorage.getAccessToken(), "Access token should be cleared")
        XCTAssertNil(TokenStorage.getRefreshToken(), "Refresh token should be cleared")
    }
}

