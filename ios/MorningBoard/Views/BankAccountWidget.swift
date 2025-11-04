//
//  BankAccountWidget.swift
//  MorningBoard
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import SwiftUI

/// Bank Account Widget - Displays bank account information on the dashboard
struct BankAccountWidget: View {
    // MARK: - Properties
    
    let account: BankAccount
    @State private var showComingSoonAlert = false
    
    // MARK: - Body
    
    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.m) {
            // Widget Header
            HStack {
                // Bank Icon
                Image(systemName: "creditcard.fill")
                    .font(.title2)
                    .foregroundColor(.bankWidget)
                
                Text("Bank Account")
                    .font(AppTypography.headline)
                    .foregroundColor(.primary)
                
                Spacer()
            }
            
            Divider()
            
            // Account Information
            VStack(alignment: .leading, spacing: AppSpacing.s) {
                // Account Name
                Text(account.name)
                    .font(AppTypography.title3)
                    .foregroundColor(.primary)
                
                // Balance
                HStack(alignment: .firstTextBaseline, spacing: AppSpacing.xs) {
                    Text(formatBalance(account.balance))
                        .font(AppTypography.title1)
                        .fontWeight(.bold)
                        .foregroundColor(.primary)
                    
                    // Placeholder indicator for dummy data
                    if account.balance == 0.0 {
                        Text("(Test Balance)")
                            .font(AppTypography.caption2)
                            .foregroundColor(.secondary)
                            .italic()
                    }
                }
            }
        }
        .padding(AppSpacing.widgetPadding)
        .background(Color(.systemBackground))
        .cornerRadius(AppCornerRadius.widget)
        .customShadow(AppShadow.widget)
        .contentShape(Rectangle())
        .onTapGesture {
            showComingSoonAlert = true
        }
        .alert("Account Details", isPresented: $showComingSoonAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text("Detailed account view coming soon. This will show transaction history and more details.")
        }
    }
    
    // MARK: - Helper Methods
    
    /// Format balance as currency string
    private func formatBalance(_ balance: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "USD"
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        return formatter.string(from: NSNumber(value: balance)) ?? "$0.00"
    }
}

// MARK: - Preview

#if DEBUG
struct BankAccountWidget_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 16) {
            // Preview with zero balance (dummy data)
            BankAccountWidget(
                account: BankAccount(
                    accountId: "test-1",
                    name: "Checking Account",
                    balance: 0.0,
                    createdAt: "2025-01-01T00:00:00.000Z",
                    updatedAt: "2025-01-01T00:00:00.000Z"
                )
            )
            
            // Preview with balance
            BankAccountWidget(
                account: BankAccount(
                    accountId: "test-2",
                    name: "Savings Account",
                    balance: 1234.56,
                    createdAt: "2025-01-01T00:00:00.000Z",
                    updatedAt: "2025-01-01T00:00:00.000Z"
                )
            )
        }
        .padding()
        .background(Color(.systemGroupedBackground))
    }
}
#endif

