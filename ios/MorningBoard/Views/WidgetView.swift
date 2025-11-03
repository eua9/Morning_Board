//
//  WidgetView.swift
//  MorningBoard
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import SwiftUI

/// Individual widget view component that displays specific data or functionality
struct WidgetView: View {
    // MARK: - Properties
    
    // TODO: Add Widget model when implemented
    // let widget: Widget
    
    // MARK: - Initialization
    
    // TODO: Initialize with Widget model
    // init(widget: Widget) {
    //     self.widget = widget
    // }
    
    // MARK: - Body
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Widget Header
            HStack {
                // TODO: Add widget icon
                // Image(systemName: widget.iconName)
                //     .foregroundColor(.blue)
                
                Text("Widget Title")
                    .font(.headline)
                
                Spacer()
            }
            
            // Widget Content
            VStack {
                // TODO: Add widget-specific content
                // This will vary based on widget type:
                // - WeatherWidget: temperature, conditions
                // - SlackWidget: recent messages
                // - CanvasWidget: upcoming assignments
                // - BankWidget: account balance
                // - CRMWidget: recent contacts
                
                Text("Widget content placeholder")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 5, x: 0, y: 2)
    }
}

// MARK: - Preview

#if DEBUG
struct WidgetView_Previews: PreviewProvider {
    static var previews: some View {
        WidgetView()
            .previewLayout(.sizeThatFits)
            .padding()
    }
}
#endif

