//
//  AppStyle.swift
//  MorningBoard
//
//  Style constants and reusable UI components for consistent design
//

import SwiftUI

// MARK: - Color Palette

extension Color {
    // Primary Colors
    static let morningBoardBlue = Color(red: 0, green: 0.478, blue: 1.0) // #007AFF
    static let morningBoardOrange = Color(red: 1.0, green: 0.584, blue: 0.0) // #FF9500
    
    // Semantic Colors
    static let morningBoardSuccess = Color(red: 0.204, green: 0.78, blue: 0.349) // #34C759
    static let morningBoardWarning = Color(red: 1.0, green: 0.584, blue: 0.0) // #FF9500
    static let morningBoardError = Color(red: 1.0, green: 0.231, blue: 0.188) // #FF3B30
    static let morningBoardInfo = Color(red: 0, green: 0.478, blue: 1.0) // #007AFF
    
    // Widget-Specific Colors
    static let weatherWidget = Color(red: 0.353, green: 0.784, blue: 0.98) // #5AC8FA
    static let slackWidget = Color(red: 0.29, green: 0.082, blue: 0.294) // #4A154B
    static let canvasWidget = Color(red: 0.886, green: 0.239, blue: 0.157) // #E23D28
    static let bankWidget = Color(red: 0.106, green: 0.212, blue: 0.365) // #1B365D
    static let crmWidget = Color(red: 0, green: 0.659, blue: 0.91) // #00A8E8
}

// MARK: - Typography

struct AppTypography {
    // Headings
    static let largeTitle = Font.largeTitle.weight(.bold)
    static let title1 = Font.title
    static let title2 = Font.title2.weight(.bold)
    static let title3 = Font.title3
    
    // Body
    static let headline = Font.headline
    static let body = Font.body
    static let callout = Font.callout
    static let subheadline = Font.subheadline
    static let footnote = Font.footnote
    static let caption = Font.caption
    static let caption2 = Font.caption2
}

// MARK: - Spacing

struct AppSpacing {
    static let xs: CGFloat = 4
    static let s: CGFloat = 8
    static let m: CGFloat = 16
    static let l: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
    
    // Common spacing values
    static let cardPadding: CGFloat = 16
    static let screenPadding: CGFloat = 16
    static let widgetPadding: CGFloat = 16
    static let buttonVerticalPadding: CGFloat = 12
    static let buttonHorizontalPadding: CGFloat = 12
}

// MARK: - Corner Radius

struct AppCornerRadius {
    static let small: CGFloat = 8
    static let medium: CGFloat = 12
    static let large: CGFloat = 16
    static let button: CGFloat = 10
    static let widget: CGFloat = 12
    static let card: CGFloat = 12
}

// MARK: - Shadows

struct AppShadow {
    static let widget = Shadow(
        color: Color.black.opacity(0.1),
        radius: 5,
        x: 0,
        y: 2
    )
    
    static let card = Shadow(
        color: Color.black.opacity(0.1),
        radius: 5,
        x: 0,
        y: 2
    )
}

struct Shadow {
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
}

extension View {
    func customShadow(_ shadow: Shadow) -> some View {
        self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }
}

// MARK: - Button Styles

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .fontWeight(.semibold)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.morningBoardBlue)
            .foregroundColor(.white)
            .cornerRadius(AppCornerRadius.button)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .fontWeight(.semibold)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color(.systemGray6))
            .foregroundColor(.blue)
            .cornerRadius(AppCornerRadius.button)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
    }
}

struct TextButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(.blue)
            .opacity(configuration.isPressed ? 0.6 : 1.0)
    }
}

// MARK: - Widget Container Modifier

struct WidgetContainer: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(AppSpacing.widgetPadding)
            .background(Color(.systemBackground))
            .cornerRadius(AppCornerRadius.widget)
            .customShadow(AppShadow.widget)
    }
}

extension View {
    func widgetContainer() -> some View {
        modifier(WidgetContainer())
    }
}

// MARK: - Card Modifier

struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(AppSpacing.cardPadding)
            .background(Color(.systemBackground))
            .cornerRadius(AppCornerRadius.card)
            .customShadow(AppShadow.card)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardModifier())
    }
}

// MARK: - Usage Examples

/*
 Example Usage:

 // Primary Button
 Button("Submit") {
     // action
 }
 .buttonStyle(PrimaryButtonStyle())

 // Secondary Button
 Button("Cancel") {
     // action
 }
 .buttonStyle(SecondaryButtonStyle())

 // Widget Container
 VStack {
     // Widget content
 }
 .widgetContainer()

 // Card
 VStack {
     // Card content
 }
 .cardStyle()

 // Custom Colors
 Text("Hello")
     .foregroundColor(.morningBoardBlue)

 // Typography
 Text("Title")
     .font(AppTypography.title2)

 // Spacing
 VStack(spacing: AppSpacing.m) {
     // content
 }
 */

