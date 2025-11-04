//
//  AddAccountView.swift
//  MorningBoard
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import SwiftUI

/// Add Account view for adding a new bank account
struct AddAccountView: View {
    // MARK: - Properties
    
    @Environment(\.dismiss) private var dismiss
    @State private var accountName: String = ""
    @State private var accountNumber: String = ""
    @State private var isLoading: Bool = false
    @State private var accountNameError: String? = nil
    @State private var accountNumberError: String? = nil
    @State private var hasAttemptedSubmit: Bool = false
    @State private var showErrorAlert: Bool = false
    @State private var errorMessage: String = ""
    @State private var showSuccessAlert: Bool = false
    
    // MARK: - Body
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: AppSpacing.l) {
                    // Header Section
                    VStack(spacing: AppSpacing.s) {
                        Image(systemName: "creditcard.fill")
                            .resizable()
                            .frame(width: 60, height: 40)
                            .foregroundColor(.morningBoardBlue)
                            .padding(.top, AppSpacing.xl)
                        
                        Text("Add Bank Account")
                            .font(AppTypography.title2)
                            .foregroundColor(.primary)
                        
                        Text("Add a test account to your dashboard. This is a mock integration for testing purposes.")
                            .font(AppTypography.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, AppSpacing.m)
                    }
                    .padding(.bottom, AppSpacing.m)
                    
                    // Form Section
                    VStack(spacing: AppSpacing.m) {
                        // Account Name Field
                        VStack(alignment: .leading, spacing: AppSpacing.xs) {
                            Text("Account Name")
                                .font(AppTypography.headline)
                                .foregroundColor(.primary)
                            
                            TextField("e.g., Checking Account", text: $accountName)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .autocapitalization(.words)
                                .disableAutocorrection(true)
                                .overlay(
                                    RoundedRectangle(cornerRadius: AppCornerRadius.small)
                                        .stroke(accountNameError != nil ? Color.morningBoardError : Color.clear, lineWidth: 2)
                                )
                                .onChange(of: accountName) { _ in
                                    if hasAttemptedSubmit {
                                        _ = validateAccountName()
                                    }
                                }
                            
                            if let error = accountNameError {
                                Text(error)
                                    .font(AppTypography.caption2)
                                    .foregroundColor(.morningBoardError)
                            }
                        }
                        
                        // Account Number Field
                        VStack(alignment: .leading, spacing: AppSpacing.xs) {
                            Text("Account Number / API Key")
                                .font(AppTypography.headline)
                                .foregroundColor(.primary)
                            
                            TextField("Enter account number or API key", text: $accountNumber)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .keyboardType(.default)
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                                .overlay(
                                    RoundedRectangle(cornerRadius: AppCornerRadius.small)
                                        .stroke(accountNumberError != nil ? Color.morningBoardError : Color.clear, lineWidth: 2)
                                )
                                .onChange(of: accountNumber) { _ in
                                    if hasAttemptedSubmit {
                                        _ = validateAccountNumber()
                                    }
                                }
                            
                            if let error = accountNumberError {
                                Text(error)
                                    .font(AppTypography.caption2)
                                    .foregroundColor(.morningBoardError)
                            } else {
                                Text("This is a dummy identifier for testing purposes.")
                                    .font(AppTypography.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .padding(.horizontal, AppSpacing.m)
                    .padding(.vertical, AppSpacing.m)
                    .background(Color(.systemBackground))
                    .cornerRadius(AppCornerRadius.card)
                    .customShadow(AppShadow.card)
                    .padding(.horizontal, AppSpacing.m)
                    
                    // Submit Button
                    Button(action: {
                        handleSubmit()
                    }) {
                        if isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Add Account")
                                .fontWeight(.semibold)
                        }
                    }
                    .buttonStyle(PrimaryButtonStyle())
                    .disabled(isLoading || !isFormValid())
                    .opacity(isLoading || !isFormValid() ? 0.6 : 1.0)
                    .padding(.horizontal, AppSpacing.m)
                    .padding(.top, AppSpacing.l)
                    
                    Spacer()
                }
                .padding(.top, AppSpacing.m)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Add Account")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
            .alert("Error", isPresented: $showErrorAlert) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(errorMessage)
            }
            .alert("Success", isPresented: $showSuccessAlert) {
                Button("OK") {
                    dismiss()
                }
            } message: {
                Text("Account added successfully!")
            }
        }
    }
    
    // MARK: - Methods
    
    /// Validate the entire form
    private func validateForm() -> Bool {
        let nameValid = validateAccountName()
        let numberValid = validateAccountNumber()
        return nameValid && numberValid
    }
    
    /// Validate account name field
    private func validateAccountName() -> Bool {
        let trimmedName = accountName.trimmingCharacters(in: .whitespacesAndNewlines)
        
        if trimmedName.isEmpty {
            accountNameError = "Account name is required"
            return false
        }
        
        if trimmedName.count < 1 {
            accountNameError = "Account name must be at least 1 character"
            return false
        }
        
        if trimmedName.count > 100 {
            accountNameError = "Account name must be 100 characters or less"
            return false
        }
        
        accountNameError = nil
        return true
    }
    
    /// Validate account number field
    private func validateAccountNumber() -> Bool {
        let trimmedNumber = accountNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        
        if trimmedNumber.isEmpty {
            accountNumberError = "Account number is required"
            return false
        }
        
        if trimmedNumber.count < 1 {
            accountNumberError = "Account number must be at least 1 character"
            return false
        }
        
        accountNumberError = nil
        return true
    }
    
    /// Check if form is valid (for button state)
    private func isFormValid() -> Bool {
        let trimmedName = accountName.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedNumber = accountNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        return !trimmedName.isEmpty && !trimmedNumber.isEmpty
    }
    
    /// Format error message for user display
    private func formatErrorMessage(_ error: APIError) -> String {
        switch error {
        case .networkError(let message):
            return "Network error: \(message). Please check your connection and try again."
        case .unauthorized(let message):
            return "Authentication required: \(message). Please log in again."
        case .badRequest(let message):
            return "Validation error: \(message). Please check your input and try again."
        case .serverError(let message):
            return "Server error: \(message). Please try again later."
        default:
            return "Failed to add account. Please try again."
        }
    }
    
    private func handleSubmit() {
        hasAttemptedSubmit = true
        
        // Validate form before submission
        guard validateForm() else {
            return
        }
        
        // Prepare request
        let trimmedName = accountName.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedNumber = accountNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        
        let request = AddAccountRequest(
            name: trimmedName,
            accountNumber: trimmedNumber,
            initialBalance: nil,
            accountType: nil
        )
        
        // Set loading state
        isLoading = true
        
        // Make API call
        APIService.addAccount(request: request) { result in
            DispatchQueue.main.async {
                self.isLoading = false
                
                switch result {
                case .success(_):
                    // Success - show success message and dismiss
                    self.showSuccessAlert = true
                    // The dismiss will happen when user taps OK in the alert
                    
                case .failure(let error):
                    // Error - show user-friendly error message
                    self.errorMessage = self.formatErrorMessage(error)
                    self.showErrorAlert = true
                }
            }
        }
    }
}

// MARK: - Preview

#if DEBUG
struct AddAccountView_Previews: PreviewProvider {
    static var previews: some View {
        AddAccountView()
    }
}
#endif

