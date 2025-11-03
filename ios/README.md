# Morning Board iOS App

Native iOS application built with SwiftUI.

## Style Guide

For design consistency, refer to the [Style Guide](STYLE_GUIDE.md) which includes:
- Color palette and semantic colors
- Typography system
- Spacing guidelines
- Reusable UI component patterns
- Button styles and widget containers

Style constants are available in `MorningBoard/Utils/AppStyle.swift` for use throughout the app.

## Project Structure

```
ios/MorningBoard/
├── MorningBoardApp.swift    # Main app entry point
├── Views/
│   ├── DashboardView.swift  # Main dashboard displaying widgets
│   ├── WidgetView.swift     # Individual widget component
│   └── LoginView.swift      # User authentication view
├── Models/                  # Data models (to be implemented)
├── ViewModels/              # View models for MVVM pattern (to be implemented)
├── Utils/                   # Utility classes and extensions
└── Info.plist               # App configuration
```

## Views

### DashboardView
- Main view that displays all widgets in a grid layout
- Placeholder implementation with basic structure
- Ready for widget integration

### WidgetView
- Reusable component for displaying individual widgets
- Supports different widget types (Weather, Slack, Canvas, Bank, CRM)
- Placeholder implementation with TODO comments for future features

### LoginView
- User authentication interface
- Email and password input fields
- Login button with loading state
- Placeholder implementation ready for authentication logic

## Setup Instructions

1. Open Xcode
2. Create a new iOS App project
3. Choose SwiftUI as the interface
4. Copy the files from this directory into your Xcode project:
   - `MorningBoardApp.swift` → Replace App file
   - `Views/` → Add to project
   - `Info.plist` → Update your Info.plist if needed

5. Ensure minimum iOS version is iOS 14.0+ (for SwiftUI support)

## Next Steps

- [ ] Implement ViewModels for MVVM pattern
- [ ] Create data models (Widget, User, etc.)
- [ ] Integrate authentication service
- [ ] Add API integration for widget data
- [ ] Implement navigation between views
- [ ] Add widget-specific views (Weather, Slack, Canvas, Bank, CRM)

