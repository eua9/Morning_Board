//
//  MorningBoardApp.swift
//  MorningBoard
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import SwiftUI

@main
struct MorningBoardApp: App {
    // MARK: - Properties
    
    @State private var isAuthenticated: Bool = false
    
    // MARK: - Body
    
    var body: some Scene {
        WindowGroup {
            // Smoke test: Display DashboardView directly for testing
            DashboardView()
            
            // TODO: Re-enable authentication flow after smoke test passes
            // if isAuthenticated {
            //     DashboardView()
            // } else {
            //     LoginView()
            //         .onAppear {
            //             // TODO: Check authentication status
            //             // Check if user has valid session token
            //         }
            // }
        }
    }
}

