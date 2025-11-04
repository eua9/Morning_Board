//
//  BankAccount.swift
//  MorningBoard
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import Foundation

/// Model representing a bank account
struct BankAccount: Codable, Identifiable {
    let accountId: String
    let name: String
    let balance: Double
    let createdAt: String
    let updatedAt: String
    
    var id: String {
        return accountId
    }
}

/// Request model for adding a new bank account
struct AddAccountRequest: Codable {
    let name: String
    let accountNumber: String?
    let initialBalance: Double?
    let accountType: String?
}

/// Response model for adding a bank account
struct AddAccountResponse: Codable {
    let message: String
    let account: BankAccount
}

