# Navigation Setup

This directory contains the navigation configuration for the Morning Board app.

## Files

- **`AppNavigator.tsx`** - Main navigation container with stack navigator
- **`navigationService.ts`** - Centralized navigation helpers
- **`README.md`** - This file

## Navigation Structure

### Stack Navigator

The app uses React Navigation's Stack Navigator with the following screens:

1. **Login Screen** (`Login`)
   - Authentication screen
   - Not accessible when authenticated
   - Prevents back navigation after login

2. **Dashboard Screen** (`Dashboard`)
   - Main dashboard with widgets
   - Only accessible when authenticated
   - Back button disabled (prevents return to login)

## Authentication Flow

### Login Success Flow

1. User enters credentials in LoginScreen
2. API call succeeds and token is stored
3. Navigation stack is reset to Dashboard:
   ```typescript
   navigation.reset({
     index: 0,
     routes: [{ name: "Dashboard" }],
   });
   ```
4. Login screen is removed from navigation stack
5. User cannot navigate back to login

### Logout Flow

1. User taps logout button in Dashboard
2. Auth data is cleared from storage
3. Navigation stack is reset to Login:
   ```typescript
   resetToScreen("Login");
   ```
4. Dashboard is removed from navigation stack
5. User must log in again

## Preventing Back Navigation

### Techniques Used

1. **Navigation Stack Reset**
   - Using `navigation.reset()` removes previous screens from stack
   - Login screen is not in stack when on Dashboard

2. **Gesture Disabled**
   - `gestureEnabled: false` prevents swipe back on iOS
   - `headerBackVisible: false` hides back button

3. **Initial Route**
   - Navigator checks auth status on mount
   - Sets initial route based on authentication state

## Usage

### In Components

```typescript
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type MyScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const MyComponent = () => {
  const navigation = useNavigation<MyScreenNavigationProp>();
  
  // Navigate
  navigation.navigate("Dashboard");
  
  // Reset stack (prevents back navigation)
  navigation.reset({
    index: 0,
    routes: [{ name: "Dashboard" }],
  });
};
```

### Using Navigation Service

```typescript
import { navigate, resetToScreen } from "../navigation/navigationService";

// Navigate
navigate("Dashboard");

// Reset to screen (removes previous screens)
resetToScreen("Dashboard");
```

## Dependencies Required

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/native-stack": "^6.x",
  "react-native-screens": "^3.x",
  "react-native-safe-area-context": "^4.x"
}
```

## Testing Navigation

### Test Cases

1. ✅ Login redirects to Dashboard
2. ✅ Back button doesn't return to Login from Dashboard
3. ✅ Logout returns to Login
4. ✅ Login screen is not in navigation stack after login
5. ✅ Dashboard screen is not in navigation stack after logout
6. ✅ Initial route is correct based on auth status

