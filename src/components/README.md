# React Native Components

This directory contains reusable React Native components for the Morning Board app.

## Components

### LoginScreen
- Location: `src/screens/LoginScreen.tsx`
- Description: Login screen with email/username and password fields
- Style: Matches iOS style guide
- Status: UI implementation complete, functionality pending

## Usage

Once React Native is initialized, import components like:

```typescript
import LoginScreen from './src/screens/LoginScreen';

// Use in your navigation or app entry point
<LoginScreen />
```

## Style Guide Compliance

All components follow the style guide defined in `ios/STYLE_GUIDE.md`:
- Colors: Primary Blue (#007AFF), system colors
- Typography: SF Pro font sizes and weights
- Spacing: 4pt base unit system
- Corner radius: 12pt for cards, 10pt for buttons

