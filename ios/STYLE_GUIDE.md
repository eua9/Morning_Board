# Morning Board iOS Style Guide

This document defines the design system for the Morning Board iOS application, ensuring consistency across all views and components.

## Color Palette

### Primary Colors
- **Primary Blue**: `#007AFF` (System Blue)
  - Used for primary actions, links, and highlights
  - Hex: `#007AFF` | RGB: `0, 122, 255`

- **Primary Orange**: `#FF9500` (System Orange)
  - Used for app branding, sunrise icon, warm accents
  - Hex: `#FF9500` | RGB: `255, 149, 0`

### Semantic Colors
- **Success**: `#34C759` (System Green)
  - Success states, completed actions
  - Hex: `#34C759` | RGB: `52, 199, 89`

- **Warning**: `#FF9500` (System Orange)
  - Warning states, attention needed
  - Hex: `#FF9500` | RGB: `255, 149, 0`

- **Error**: `#FF3B30` (System Red)
  - Error states, destructive actions
  - Hex: `#FF3B30` | RGB: `255, 59, 48`

- **Info**: `#007AFF` (System Blue)
  - Informational messages
  - Hex: `#007AFF` | RGB: `0, 122, 255`

### Neutral Colors
- **Background Primary**: `#FFFFFF` (System Background)
  - Main app background

- **Background Secondary**: `#F2F2F7` (System Grouped Background)
  - Grouped views, card backgrounds
  - Hex: `#F2F2F7` | RGB: `242, 242, 247`

- **Text Primary**: `#000000` (Label)
  - Main text color, high contrast

- **Text Secondary**: `#8E8E93` (Secondary Label)
  - Secondary text, captions
  - Hex: `#8E8E93` | RGB: `142, 142, 147`

- **Text Tertiary**: `#C7C7CC` (Tertiary Label)
  - Placeholder text, disabled states
  - Hex: `#C7C7CC` | RGB: `199, 199, 204`

- **Separator**: `#C6C6C8` (Separator)
  - Dividers, borders
  - Hex: `#C6C6C8` | RGB: `198, 198, 200`

### Widget-Specific Colors
- **Weather Widget**: `#5AC8FA` (Light Blue)
  - Hex: `#5AC8FA` | RGB: `90, 200, 250`

- **Slack Widget**: `#4A154B` (Slack Purple)
  - Hex: `#4A154B` | RGB: `74, 21, 75`

- **Canvas Widget**: `#E23D28` (Canvas Red)
  - Hex: `#E23D28` | RGB: `226, 61, 40`

- **Bank Widget**: `#1B365D` (Dark Blue)
  - Hex: `#1B365D` | RGB: `27, 54, 93`

- **CRM Widget**: `#00A8E8` (CRM Blue)
  - Hex: `#00A8E8` | RGB: `0, 168, 232`

## Typography

### Font Families
- **Primary**: San Francisco (SF Pro) - System font
- **Monospace**: SF Mono - For code or technical data

### Font Sizes & Weights

#### Headings
- **Large Title**: 34pt, Bold (`.font(.largeTitle).fontWeight(.bold)`)
  - Screen titles, main headers

- **Title 1**: 28pt, Regular (`.font(.title)`)
  - Section headers

- **Title 2**: 22pt, Bold (`.font(.title2).fontWeight(.bold)`)
  - Subsection headers

- **Title 3**: 20pt, Regular (`.font(.title3)`)
  - Card titles, widget headers

#### Body Text
- **Headline**: 17pt, Semibold (`.font(.headline)`)
  - Important body text

- **Body**: 17pt, Regular (`.font(.body)`)
  - Standard body text, paragraphs

- **Callout**: 16pt, Regular (`.font(.callout)`)
  - Emphasized callout text

- **Subheadline**: 15pt, Regular (`.font(.subheadline)`)
  - Secondary information

- **Footnote**: 13pt, Regular (`.font(.footnote)`)
  - Footnotes, captions

- **Caption 1**: 12pt, Regular (`.font(.caption)`)
  - Small captions, labels

- **Caption 2**: 11pt, Regular (`.font(.caption2)`)
  - Smallest text

## Spacing System

Use multiples of 4 points for consistent spacing.

### Base Unit: 4pt

### Spacing Scale
- **XS (4pt)**: Very tight spacing
- **S (8pt)**: Tight spacing between related elements
- **M (16pt)**: Standard spacing, most common
- **L (24pt)**: Comfortable spacing between sections
- **XL (32pt)**: Large spacing, major sections
- **XXL (48pt)**: Extra large spacing, screen margins

### Padding Guidelines
- **Card Padding**: 16pt
- **Screen Padding**: 16-24pt
- **Widget Padding**: 12-16pt
- **Button Padding**: 12pt horizontal, 8-12pt vertical

### Layout Spacing
- **Section Spacing**: 24pt between major sections
- **Element Spacing**: 16pt between related elements
- **Group Spacing**: 8pt within groups

## UI Components & Patterns

### Buttons

#### Primary Button
```swift
Button(action: { }) {
    Text("Button Text")
        .fontWeight(.semibold)
}
.frame(maxWidth: .infinity)
.frame(height: 50)
.background(Color.blue)
.foregroundColor(.white)
.cornerRadius(10)
```
- Height: 50pt
- Corner radius: 10pt
- Background: Primary Blue
- Text: White, Semibold
- Full width with padding

#### Secondary Button
```swift
Button(action: { }) {
    Text("Button Text")
        .fontWeight(.semibold)
}
.frame(maxWidth: .infinity)
.frame(height: 50)
.background(Color(.systemGray6))
.foregroundColor(.blue)
.cornerRadius(10)
```
- Same dimensions as primary
- Background: Light gray
- Text: Primary Blue

#### Text Button
```swift
Button(action: { }) {
    Text("Button Text")
        .foregroundColor(.blue)
}
```
- No background
- Text color: Primary Blue

#### Icon Button
```swift
Button(action: { }) {
    Image(systemName: "icon.name")
        .foregroundColor(.blue)
        .font(.system(size: 20))
}
.frame(width: 44, height: 44)
```
- Minimum touch target: 44x44pt
- Icon size: 20pt

### Widget Box Pattern

#### Standard Widget Container
```swift
VStack(alignment: .leading, spacing: 12) {
    // Widget Header
    HStack {
        Image(systemName: "icon")
            .foregroundColor(.blue)
        Text("Widget Title")
            .font(.headline)
        Spacer()
    }
    
    // Widget Content
    VStack {
        // Widget-specific content
    }
}
.padding(16)
.background(Color(.systemBackground))
.cornerRadius(12)
.shadow(color: Color.black.opacity(0.1), radius: 5, x: 0, y: 2)
```

#### Widget Specifications
- **Padding**: 16pt
- **Corner Radius**: 12pt
- **Shadow**: 
  - Color: Black at 10% opacity
  - Radius: 5pt
  - Offset: (0, 2)
- **Background**: System background color
- **Spacing**: 12pt between header and content

### Cards

#### Standard Card
- Padding: 16pt
- Corner radius: 12pt
- Background: System background
- Shadow: Same as widget box
- Spacing: 16pt between elements

### Input Fields

#### Text Field
```swift
TextField("Placeholder", text: $text)
    .textFieldStyle(RoundedBorderTextFieldStyle())
    .padding(.vertical, 8)
```
- Style: Rounded border
- Vertical padding: 8pt

#### Secure Field
```swift
SecureField("Placeholder", text: $password)
    .textFieldStyle(RoundedBorderTextFieldStyle())
    .padding(.vertical, 8)
```

### Navigation

#### Navigation Bar
- Title: Large title display mode
- Background: System background
- Tint: Primary Blue

### Lists

#### Standard List Row
- Height: 44pt minimum
- Padding: 16pt horizontal
- Separator: System separator color
- Font: Body (17pt)

## Layout Patterns

### Grid Layout
- **Dashboard Grid**: 2 columns, 16pt spacing
- **Widget Spacing**: 16pt between widgets
- **Screen Margins**: 16-24pt

### Stack Layout
- **Vertical Stack (VStack)**: 16pt spacing (default)
- **Horizontal Stack (HStack)**: 8pt spacing (default)
- Adjust spacing based on content relationship

## Accessibility

### Minimum Touch Targets
- Buttons: 44x44pt minimum
- Interactive elements: 44pt minimum dimension

### Contrast Ratios
- Text on background: Minimum 4.5:1
- Large text (18pt+): Minimum 3:1
- Interactive elements: Clear visual distinction

### Dynamic Type Support
- Support all Dynamic Type sizes
- Use `.font(.body)` instead of fixed sizes where possible
- Test with largest and smallest text sizes

## Dark Mode Support

All colors should use system colors that automatically adapt:
- Use `Color(.systemBackground)` instead of `Color.white`
- Use `Color(.label)` instead of `Color.black`
- Use semantic colors that adapt to dark mode

## Platform-Specific Guidelines

### iOS Human Interface Guidelines
- Follow iOS design patterns and conventions
- Use native iOS controls where possible
- Respect safe areas and layout margins
- Support all device sizes (iPhone and iPad)

## Examples

### Complete Widget Example
```swift
VStack(alignment: .leading, spacing: 12) {
    // Header
    HStack {
        Image(systemName: "cloud.sun.fill")
            .foregroundColor(.blue)
            .font(.title3)
        Text("Weather")
            .font(.headline)
        Spacer()
    }
    
    // Content
    VStack(alignment: .leading, spacing: 8) {
        Text("72°F")
            .font(.title)
            .fontWeight(.bold)
        Text("Sunny")
            .font(.subheadline)
            .foregroundColor(.secondary)
    }
}
.padding(16)
.background(Color(.systemBackground))
.cornerRadius(12)
.shadow(color: Color.black.opacity(0.1), radius: 5, x: 0, y: 2)
```

## Version History

- **v1.0** (Current): Initial style guide
  - Color palette defined
  - Typography system established
  - Spacing system defined
  - UI component patterns documented

## Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [Color System Reference](https://developer.apple.com/design/human-interface-guidelines/color)

