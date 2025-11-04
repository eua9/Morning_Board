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
                                BankAccountWidget(account: account)
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
                fetchAccounts()
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
}

// MARK: - Preview

#if DEBUG
struct DashboardView_Previews: PreviewProvider {
    static var previews: some View {
        DashboardView()
    }
}
#endif

