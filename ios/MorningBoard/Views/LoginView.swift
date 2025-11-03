//
//  LoginView.swift
//  MorningBoard
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import SwiftUI

/// Login view for user authentication
struct LoginView: View {
    // MARK: - Properties
    
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var isPasswordVisible: Bool = false
    @State private var isLoading: Bool = false
    
    // TODO: Add ViewModel when implemented
    // @StateObject private var viewModel = LoginViewModel()
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 24) {
            // App Logo/Title
            VStack(spacing: 8) {
                Image(systemName: "sunrise.fill")
                    .resizable()
                    .frame(width: 80, height: 80)
                    .foregroundColor(.orange)
                
                Text("Morning Board")
                    .font(.largeTitle)
                    .fontWeight(.bold)
            }
            .padding(.top, 60)
            .padding(.bottom, 40)
            
            // Login Form
            VStack(spacing: 16) {
                // Email Field
                TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                
                // Password Field
                HStack {
                    if isPasswordVisible {
                        TextField("Password", text: $password)
                    } else {
                        SecureField("Password", text: $password)
                    }
                    
                    Button(action: {
                        isPasswordVisible.toggle()
                    }) {
                        Image(systemName: isPasswordVisible ? "eye.slash.fill" : "eye.fill")
                            .foregroundColor(.gray)
                    }
                }
                .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Login Button
                Button(action: {
                    handleLogin()
                }) {
                    if isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Text("Login")
                            .fontWeight(.semibold)
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 50)
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)
                .disabled(isLoading || email.isEmpty || password.isEmpty)
                .opacity(isLoading || email.isEmpty || password.isEmpty ? 0.6 : 1.0)
            }
            .padding(.horizontal, 32)
            
            Spacer()
        }
        .background(Color(.systemGroupedBackground))
    }
    
    // MARK: - Methods
    
    private func handleLogin() {
        // TODO: Implement login logic
        // viewModel.login(email: email, password: password)
        
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isLoading = false
            // TODO: Navigate to DashboardView on successful login
            // NavigationLink or presentation binding should be handled by parent view
        }
    }
}

// MARK: - Preview

#if DEBUG
struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}
#endif

