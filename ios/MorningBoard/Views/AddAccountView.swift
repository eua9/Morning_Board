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
    @State private var existingAccounts: [BankAccount] = []
    @State private var isLoadingAccounts: Bool = false
    
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
                                        // Also validate cross-field rules if both fields have values
                                        if !accountNumber.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                                            _ = validateNameNotEqualToNumber()
                                        }
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
                                        // Also validate cross-field rules if both fields have values
                                        if !accountName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                                            _ = validateNameNotEqualToNumber()
                                        }
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
                    // Dismiss view after success - DashboardView will refresh on onDisappear
                    dismiss()
                }
            } message: {
                Text("Account added successfully! The account will appear on your dashboard.")
            }
            .onAppear {
                fetchExistingAccounts()
            }
        }
    }
    
    // MARK: - Methods
    
    /// Validate the entire form
    private func validateForm() -> Bool {
        let nameValid = validateAccountName()
        let numberValid = validateAccountNumber()
        
        if !nameValid || !numberValid {
            return false
        }
        
        // Additional validation: Check that name and number are not the same
        return validateNameNotEqualToNumber() && validateNoDuplicateNameAndNumber()
    }
    
    /// Validate that account name is not the same as account number
    private func validateNameNotEqualToNumber() -> Bool {
        let trimmedName = accountName.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedNumber = accountNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Only validate if both fields have values
        guard !trimmedName.isEmpty && !trimmedNumber.isEmpty else {
            return true
        }
        
        if trimmedName.lowercased() == trimmedNumber.lowercased() {
            accountNameError = "Account name cannot be the same as account number. Please use different values."
            accountNumberError = "Account number cannot be the same as account name. Please use different values."
            return false
        }
        
        return true
    }
    
    /// Validate that the account name and number combination is not a duplicate
    private func validateNoDuplicateNameAndNumber() -> Bool {
        let trimmedName = accountName.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedNumber = accountNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Check for duplicate account name (case-insensitive)
        let duplicateName = existingAccounts.first { account in
            account.name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() == trimmedName.lowercased()
        }
        
        if duplicateName != nil {
            accountNameError = "An account with this name already exists. Please use a different name."
            return false
        }
        
        return true
    }
    
    /// Validate account name field
    private func validateAccountName() -> Bool {
        let trimmedName = accountName.trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Store previous error to check if it was a cross-field validation error
        let previousError = accountNameError
        
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
        
        // Validate special characters - allow alphanumeric, spaces, hyphens, underscores, periods, apostrophes
        let allowedCharacterSet = CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_'.")
        if trimmedName.rangeOfCharacter(from: allowedCharacterSet.inverted) != nil {
            accountNameError = "Account name can only contain letters, numbers, spaces, hyphens, underscores, periods, and apostrophes"
            return false
        }
        
        // Check for duplicate account names (case-insensitive)
        let duplicateName = existingAccounts.first { account in
            account.name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() == trimmedName.lowercased()
        }
        if duplicateName != nil {
            accountNameError = "An account with this name already exists. Please use a different name."
            return false
        }
        
        // All validation passed - clear error unless it's a cross-field validation error
        // Cross-field errors will be re-validated separately
        if previousError != "Account name cannot be the same as account number. Please use different values." {
            accountNameError = nil
        }
        
        // Re-check cross-field validation after clearing field-specific errors
        if !accountNumber.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            _ = validateNameNotEqualToNumber()
        }
        
        return accountNameError == nil
    }
    
    /// Validate account number field
    private func validateAccountNumber() -> Bool {
        let trimmedNumber = accountNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Store previous error to check if it was a cross-field validation error
        let previousError = accountNumberError
        
        if trimmedNumber.isEmpty {
            accountNumberError = "Account number is required"
            return false
        }
        
        if trimmedNumber.count < 1 {
            accountNumberError = "Account number must be at least 1 character"
            return false
        }
        
        // Validate account number length (max 200 characters)
        if trimmedNumber.count > 200 {
            accountNumberError = "Account number must be 200 characters or less"
            return false
        }
        
        // All validation passed - clear error unless it's a cross-field validation error
        // Cross-field errors will be re-validated separately
        if previousError != "Account number cannot be the same as account name. Please use different values." {
            accountNumberError = nil
        }
        
        // Re-check cross-field validation after clearing field-specific errors
        if !accountName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            _ = validateNameNotEqualToNumber()
        }
        
        return accountNumberError == nil
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
    
    /// Fetch existing accounts to check for duplicates
    private func fetchExistingAccounts() {
        isLoadingAccounts = true
        
        APIService.getAccounts { result in
            DispatchQueue.main.async {
                self.isLoadingAccounts = false
                
                switch result {
                case .success(let response):
                    self.existingAccounts = response.accounts
                case .failure:
                    // If fetch fails, we'll still allow submission but backend will handle duplicates
                    self.existingAccounts = []
                }
            }
        }
    }
    
    private func handleSubmit() {
        hasAttemptedSubmit = true
        
        // Re-fetch accounts before validation to ensure we have the latest list
        if existingAccounts.isEmpty {
            fetchExistingAccounts()
            // Wait a moment for accounts to load, then re-validate
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                self.performSubmission()
            }
            return
        }
        
        performSubmission()
    }
    
    /// Perform the actual form submission
    private func performSubmission() {
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
                    // Check if error is about duplicate account
                    let errorMsg = self.formatErrorMessage(error)
                    if errorMsg.contains("already exists") || errorMsg.contains("duplicate") {
                        self.accountNameError = "An account with this name already exists. Please use a different name."
                    } else {
                        self.errorMessage = errorMsg
                        self.showErrorAlert = true
                    }
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

