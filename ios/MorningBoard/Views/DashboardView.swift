//
//  DashboardView.swift
//  MorningBoard
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import SwiftUI

/// Main dashboard view that displays all widgets in a grid layout
struct DashboardView: View {
    // MARK: - Properties
    
    @State private var showAddAccount = false
    @State private var accounts: [BankAccount] = []
    @State private var isLoadingAccounts: Bool = false
    @State private var errorMessage: String? = nil
    @State private var showDeleteError = false
    @State private var showDeleteSuccess = false
    @State private var isDeletingAccount = false
    
    // TODO: Add ViewModel when implemented
    // @StateObject private var viewModel = DashboardViewModel()
    
    // MARK: - Body
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: AppSpacing.l) {
                    // Bank Account Widget Section
                    if isLoadingAccounts {
                        // Loading state
                        ProgressView("Loading accounts...")
                            .padding()
                    } else if accounts.isEmpty {
                        // Empty state
                        VStack(spacing: AppSpacing.m) {
                            Image(systemName: "creditcard")
                                .font(.system(size: 50))
                                .foregroundColor(.secondary)
                            
                            Text("No accounts linked")
                                .font(AppTypography.headline)
                                .foregroundColor(.primary)
                            
                            Text("Add an account to get started")
                                .font(AppTypography.subheadline)
                                .foregroundColor(.secondary)
                            
                            Button(action: {
                                showAddAccount = true
                            }) {
                                HStack {
                                    Image(systemName: "plus.circle.fill")
                                    Text("Add Account")
                                }
                                .fontWeight(.semibold)
                            }
                            .buttonStyle(PrimaryButtonStyle())
                            .padding(.horizontal, AppSpacing.m)
                            .padding(.top, AppSpacing.s)
                        }
                        .padding(AppSpacing.xl)
                        .frame(maxWidth: .infinity)
                    } else {
                        // Display accounts
                        VStack(alignment: .leading, spacing: AppSpacing.m) {
                            // Section Header
                            HStack {
                                Text("Bank Accounts")
                                    .font(AppTypography.title3)
                                    .fontWeight(.semibold)
                                
                                Spacer()
                                
                                Button(action: {
                                    showAddAccount = true
                                }) {
                                    Image(systemName: "plus.circle.fill")
                                        .font(.title3)
                                        .foregroundColor(.morningBoardBlue)
                                }
                            }
                            .padding(.horizontal, AppSpacing.m)
                            
                            // Account Widgets
                            ForEach(accounts) { account in
                                BankAccountWidget(
                                    account: account,
                                    onDelete: { accountId in
                                        handleDeleteAccount(accountId: accountId)
                                    }
                                )
                                .padding(.horizontal, AppSpacing.m)
                            }
                        }
                        .padding(.top, AppSpacing.m)
                    }
                    
                    // Add Account Button (shown when accounts exist)
                    if !accounts.isEmpty {
                        Button(action: {
                            showAddAccount = true
                        }) {
                            HStack {
                                Image(systemName: "plus.circle.fill")
                                Text("Add Another Account")
                            }
                            .fontWeight(.semibold)
                        }
                        .buttonStyle(SecondaryButtonStyle())
                        .padding(.horizontal, AppSpacing.m)
                        .padding(.top, AppSpacing.m)
                    }
                }
                .padding(.vertical, AppSpacing.m)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showAddAccount) {
                AddAccountView()
                    .onDisappear {
                        // Refresh accounts when Add Account view is dismissed
                        fetchAccounts()
                    }
            }
            .onAppear {
                // TEMPORARY: For QA testing only - remove after testing
                // To get a fresh token:
                // 1. Ensure backend server is running (npm run dev in backend/)
                // 2. Run: curl -X POST http://localhost:3000/api/auth/login \
                //          -H "Content-Type: application/json" \
                //          -d '{"email":"test@morningboard.com","password":"TestPassword123!"}'
                // 3. Copy the "token" value from the response and replace below
                if TokenStorage.getAccessToken() == nil {
                    // TODO: Update this token if it expires or becomes invalid
                    // Token expires: 2025-11-11 (check JWT exp field)
                    TokenStorage.saveAccessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZWU2YzlkNy02NTkxLTQ5MmQtOTBjMi1jMzBjOGVlZTMwMDEiLCJlbWFpbCI6InRlc3RAbW9ybmluZ2JvYXJkLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NjIzMTQwNTAsImV4cCI6MTc2MjkxODg1MCwiYXVkIjoibW9ybmluZy1ib2FyZC1hcHAiLCJpc3MiOiJtb3JuaW5nLWJvYXJkLWFwaSJ9.N4gAyVdIwx8NVuOEH5dVcTa7GTODUvapcRruLknZz3Q")
                }
                fetchAccounts()
            }
            .alert("Error", isPresented: $showDeleteError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(errorMessage ?? "Failed to delete account. Please try again.")
            }
            .alert("Success", isPresented: $showDeleteSuccess) {
                Button("OK", role: .cancel) { }
            } message: {
                Text("Account removed successfully.")
            }
        }
    }
    
    // MARK: - Methods
    
    /// Fetch accounts from the backend
    private func fetchAccounts() {
        isLoadingAccounts = true
        errorMessage = nil
        
        APIService.getAccounts { result in
            DispatchQueue.main.async {
                isLoadingAccounts = false
                
                switch result {
                case .success(let response):
                    accounts = response.accounts
                case .failure(let error):
                    errorMessage = error.localizedDescription
                    // On error, clear accounts
                    accounts = []
                }
            }
        }
    }
    
    /// Handle account deletion
    /// - Parameter accountId: The account ID to delete
    private func handleDeleteAccount(accountId: String) {
        isDeletingAccount = true
        errorMessage = nil
        
        APIService.deleteAccount(accountId: accountId) { result in
            DispatchQueue.main.async {
                isDeletingAccount = false
                
                switch result {
                case .success:
                    // Show success message
                    showDeleteSuccess = true
                    // Refresh accounts list
                    fetchAccounts()
                case .failure(let error):
                    // Show error message
                    errorMessage = error.localizedDescription
                    showDeleteError = true
                }
            }
        }
    }
}

// MARK: - Preview

#if DEBUG
struct DashboardView_Previews: PreviewProvider {
    static var previews: some View {
        DashboardView()
    }
}
#endif

