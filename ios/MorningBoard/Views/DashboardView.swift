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
    
    // TODO: Add ViewModel when implemented
    // @StateObject private var viewModel = DashboardViewModel()
    
    // MARK: - Body
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: [
                    GridItem(.flexible(), spacing: 16),
                    GridItem(.flexible(), spacing: 16)
                ], spacing: 16) {
                    // TODO: Add widget views here
                    // For example:
                    // ForEach(viewModel.widgets) { widget in
                    //     WidgetView(widget: widget)
                    // }
                    
                    // Placeholder widgets
                    Text("Widget 1")
                        .frame(height: 150)
                        .frame(maxWidth: .infinity)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(12)
                    
                    Text("Widget 2")
                        .frame(height: 150)
                        .frame(maxWidth: .infinity)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(12)
                }
                .padding()
            }
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
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

