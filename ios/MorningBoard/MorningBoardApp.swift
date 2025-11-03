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
            if isAuthenticated {
                DashboardView()
            } else {
                LoginView()
                    .onAppear {
                        // TODO: Check authentication status
                        // Check if user has valid session token
                    }
            }
        }
    }
}

