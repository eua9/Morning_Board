//
//  TokenStorage.swift
//  MorningBoard
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import Foundation

/// Utility for storing and retrieving authentication tokens
class TokenStorage {
    // MARK: - Constants
    
    private static let accessTokenKey = "com.morningboard.accessToken"
    private static let refreshTokenKey = "com.morningboard.refreshToken"
    
    // MARK: - Access Token
    
    /// Save access token to UserDefaults
    static func saveAccessToken(_ token: String) {
        UserDefaults.standard.set(token, forKey: accessTokenKey)
    }
    
    /// Retrieve access token from UserDefaults
    static func getAccessToken() -> String? {
        return UserDefaults.standard.string(forKey: accessTokenKey)
    }
    
    /// Remove access token from UserDefaults
    static func removeAccessToken() {
        UserDefaults.standard.removeObject(forKey: accessTokenKey)
    }
    
    // MARK: - Refresh Token
    
    /// Save refresh token to UserDefaults
    static func saveRefreshToken(_ token: String) {
        UserDefaults.standard.set(token, forKey: refreshTokenKey)
    }
    
    /// Retrieve refresh token from UserDefaults
    static func getRefreshToken() -> String? {
        return UserDefaults.standard.string(forKey: refreshTokenKey)
    }
    
    /// Remove refresh token from UserDefaults
    static func removeRefreshToken() {
        UserDefaults.standard.removeObject(forKey: refreshTokenKey)
    }
    
    // MARK: - Clear All Tokens
    
    /// Clear all stored tokens
    static func clearAllTokens() {
        removeAccessToken()
        removeRefreshToken()
    }
}

