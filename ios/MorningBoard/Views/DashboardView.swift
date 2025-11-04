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
    
    // TODO: Add ViewModel when implemented
    // @StateObject private var viewModel = DashboardViewModel()
    
    // MARK: - Body
    
    var body: some View {
        NavigationView {
            VStack {
                // Basic smoke test - Hello World display
                VStack {
                    Text("Hello World")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .padding()
                    
                    // Add Account Button
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
                    .padding(.top, AppSpacing.l)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(.systemBackground))
            }
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showAddAccount) {
                AddAccountView()
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

