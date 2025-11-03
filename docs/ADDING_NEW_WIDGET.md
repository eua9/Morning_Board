# Adding a New Widget Type - Developer Guide

## Overview

This guide explains how to add a new widget type to the Morning Board application. Widgets are dynamically rendered components that display different types of data (weather, bank accounts, Slack messages, etc.) on the user's dashboard.

### Architecture

The widget system uses a **Component Map Pattern** with a factory method:

- **WidgetFactory**: Central registry that maps widget types to React components
- **WidgetView**: Base reusable component for consistent widget styling
- **Widget Components**: Individual components for each widget type (in `src/components/widgets/`)

---

## Step-by-Step Process

### Step 1: Create the Widget Component

Create a new React component in `src/components/widgets/` directory.

**File:** `src/components/widgets/YourNewWidget.tsx`

```typescript
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WidgetView from "../WidgetView";
import { BaseWidgetProps } from "./WidgetFactory";

/**
 * Your New Widget Component
 * Brief description of what this widget displays
 */

// Define the expected data structure for this widget
interface YourNewWidgetData {
  // Define your widget-specific data fields here
  field1?: string;
  field2?: number;
  field3?: Array<{ key: string; value: any }>;
}

export const YourNewWidget: React.FC<BaseWidgetProps> = ({
  title,
  data,
  lastUpdated,
  onPress,
}) => {
  // Type-safe data extraction
  const widgetData = (data as YourNewWidgetData) || {};
  
  // Extract your data fields with defaults
  const field1 = widgetData.field1 || "Default value";
  const field2 = widgetData.field2 || 0;

  return (
    <WidgetView
      title={title}
      subtitle="Optional subtitle"
      headerIcon={<Text style={styles.icon}>📊</Text>}
      minHeight={120}
      onPress={onPress}
    >
      {/* Your widget content */}
      <View style={styles.content}>
        <Text style={styles.text}>{field1}</Text>
        <Text style={styles.value}>{field2}</Text>
      </View>
    </WidgetView>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  content: {
    paddingVertical: 8,
  },
  text: {
    fontSize: 17,
    color: "#000000",
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
});
```

**Key Points:**
- Import `BaseWidgetProps` from `WidgetFactory`
- Define a TypeScript interface for your widget's data structure
- Use type assertion: `const widgetData = (data as YourNewWidgetData) || {}`
- Provide default values for optional fields
- Use `WidgetView` as the container for consistent styling

---

### Step 2: Register the Widget Type

Add your widget to the `WIDGET_REGISTRY` in `src/components/widgets/WidgetFactory.tsx`.

**File:** `src/components/widgets/WidgetFactory.tsx`

1. **Import your widget component:**
```typescript
import { YourNewWidget } from "./YourNewWidget";
```

2. **Add to WIDGET_REGISTRY:**
```typescript
const WIDGET_REGISTRY: Record<string, WidgetComponent> = {
  // ... existing widgets
  your_new_widget: YourNewWidget, // Add your widget here
};
```

**Widget Type Naming:**
- Use lowercase with underscores (snake_case): `your_new_widget`
- Keep it descriptive and consistent with existing patterns
- This type must match what the backend returns in the API response

---

### Step 3: Update Type Definitions

Add your widget type to the `WidgetType` union type.

**File:** `src/screens/DashboardScreen.tsx`

```typescript
export type WidgetType = 
  | "weather" 
  | "slack" 
  | "canvas" 
  | "bank" 
  | "account_summary" 
  | "crm" 
  | "welcome"
  | "your_new_widget"; // Add your new type here
```

---

### Step 4: Define Backend Data Schema (Optional)

If your widget receives data from the backend, document its expected structure.

**File:** `WIDGET_SCHEMA.md` (root directory)

Add a new section describing your widget's data structure:

```markdown
## Widget Type: `your_new_widget`

**Title:** "Your New Widget"

**Data Structure:**
```typescript
interface YourNewWidgetData {
  field1: string;           // Required description
  field2: number;           // Required description
  field3?: Array<{          // Optional description
    key: string;
    value: any;
  }>;
}
```

**Example Response:**
```json
{
  "id": "your-widget-1",
  "type": "your_new_widget",
  "title": "Your New Widget",
  "data": {
    "field1": "Example value",
    "field2": 42,
    "field3": [
      { "key": "item1", "value": "data" }
    ]
  },
  "lastUpdated": "2024-11-03T12:00:00.000Z"
}
```

**Frontend Rendering Notes:**
- How to display field1
- How to format field2
- When to show field3
```

---

### Step 5: Update Shared Types (If Needed)

If your widget type needs to be shared with backend, add it to shared types.

**File:** `shared/types/widgets.ts`

```typescript
export type WidgetType = 
  | 'weather' 
  | 'slack' 
  | 'canvas' 
  | 'bank' 
  | 'account_summary'
  | 'crm' 
  | 'welcome'
  | 'your_new_widget'; // Add here

export interface YourNewWidgetData extends IWidgetData {
  field1: string;
  field2: number;
  field3?: Array<{ key: string; value: any }>;
}
```

---

## Complete Example: Weather Summary Widget

Here's a complete example of adding a `weather_summary` widget that displays a simplified weather view.

### 1. Create the Component

**File:** `src/components/widgets/WeatherSummaryWidget.tsx`

```typescript
/**
 * Weather Summary Widget Component
 * Displays simplified weather information with current conditions
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WidgetView from "../WidgetView";
import { BaseWidgetProps } from "./WidgetFactory";

interface WeatherSummaryData {
  temperature: number;        // Current temperature in Fahrenheit
  condition: string;          // Weather condition (e.g., "Sunny", "Cloudy")
  location: string;           // Location name (e.g., "San Francisco, CA")
  high?: number;              // Today's high temperature
  low?: number;               // Today's low temperature
  icon?: string;              // Optional emoji icon
}

export const WeatherSummaryWidget: React.FC<BaseWidgetProps> = ({
  title,
  data,
  lastUpdated,
  onPress,
}) => {
  const weatherData = (data as WeatherSummaryData) || {};
  
  // Extract with defaults
  const temperature = weatherData.temperature ?? 72;
  const condition = weatherData.condition || "Sunny";
  const location = weatherData.location || "Unknown";
  const high = weatherData.high;
  const low = weatherData.low;
  const icon = weatherData.icon || "🌤️";

  // Format temperature with degree symbol
  const formattedTemp = `${temperature}°F`;
  const tempRange = high && low ? `${high}° / ${low}°` : null;

  return (
    <WidgetView
      title={title}
      subtitle={location}
      headerIcon={<Text style={styles.icon}>{icon}</Text>}
      backgroundColor="#E3F2FD"
      minHeight={140}
      onPress={onPress}
    >
      <View style={styles.content}>
        {/* Main Temperature Display */}
        <View style={styles.temperatureRow}>
          <Text style={styles.temperature}>{formattedTemp}</Text>
          <Text style={styles.condition}>{condition}</Text>
        </View>
        
        {/* Temperature Range */}
        {tempRange && (
          <Text style={styles.range}>High: {tempRange}</Text>
        )}
        
        {/* Last Updated */}
        {lastUpdated && (
          <Text style={styles.updated}>
            Updated {formatRelativeTime(lastUpdated)}
          </Text>
        )}
      </View>
    </WidgetView>
  );
};

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  content: {
    paddingVertical: 8,
  },
  temperatureRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  temperature: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    marginRight: 12,
  },
  condition: {
    fontSize: 17,
    color: "#8E8E93",
    flex: 1,
  },
  range: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 4,
  },
  updated: {
    fontSize: 13,
    color: "#8E8E93",
    fontStyle: "italic",
  },
});
```

### 2. Register in WidgetFactory

**File:** `src/components/widgets/WidgetFactory.tsx`

```typescript
// Import
import { WeatherSummaryWidget } from "./WeatherSummaryWidget";

// Add to registry
const WIDGET_REGISTRY: Record<string, WidgetComponent> = {
  // ... existing widgets
  weather_summary: WeatherSummaryWidget,
};
```

### 3. Update Type Definitions

**File:** `src/screens/DashboardScreen.tsx`

```typescript
export type WidgetType = 
  | "weather" 
  | "weather_summary"  // Add new type
  | "slack" 
  // ... other types
```

### 4. Document in Schema

**File:** `WIDGET_SCHEMA.md`

```markdown
## Widget Type: `weather_summary`

**Title:** "Weather Summary"

**Data Structure:**
```typescript
interface WeatherSummaryData {
  temperature: number;        // Current temperature in Fahrenheit (required)
  condition: string;          // Weather condition (required)
  location: string;           // Location name (required)
  high?: number;              // Today's high temperature (optional)
  low?: number;               // Today's low temperature (optional)
  icon?: string;              // Optional emoji icon
}
```

**Example Response:**
```json
{
  "id": "weather-summary-1",
  "type": "weather_summary",
  "title": "Weather Summary",
  "data": {
    "temperature": 72,
    "condition": "Sunny",
    "location": "San Francisco, CA",
    "high": 75,
    "low": 65,
    "icon": "☀️"
  },
  "lastUpdated": "2024-11-03T12:00:00.000Z"
}
```
```

---

## Best Practices

### 1. **Component Structure**
- Always use `WidgetView` as the base container
- Follow the existing widget component patterns
- Use consistent styling (see `STYLE_GUIDE.md`)

### 2. **Data Handling**
- Always provide default values for optional fields
- Use type assertions carefully: `(data as YourDataType) || {}`
- Handle null/undefined gracefully

### 3. **Error States**
- Display meaningful fallback content if data is missing
- Use placeholder text for empty states
- Consider showing loading skeletons for async data

### 4. **Accessibility**
- Use semantic HTML elements where possible
- Provide proper accessibility labels
- Ensure sufficient color contrast

### 5. **Performance**
- Avoid heavy computations in render
- Use `React.memo()` if component receives stable props
- Optimize image loading if applicable

### 6. **Testing**
- Test with various data combinations
- Test with missing optional fields
- Test edge cases (empty arrays, null values, etc.)

---

## Widget Component Props Reference

All widget components receive these props via `BaseWidgetProps`:

```typescript
interface BaseWidgetProps {
  data: unknown;           // Widget-specific data (cast to your interface)
  title: string;           // Widget title from backend
  lastUpdated?: Date;     // Last update timestamp
  onPress?: () => void;   // Optional press handler
}
```

### WidgetView Props

You can pass these props to `WidgetView`:

- `title`: Widget title (required)
- `subtitle`: Optional subtitle text
- `headerIcon`: Optional icon component
- `backgroundColor`: Custom background color
- `minHeight`: Minimum widget height
- `onPress`: Press handler
- `footer`: Optional footer component

See `src/components/WidgetView.tsx` for full prop list.

---

## Common Patterns

### Pattern 1: Simple Display Widget
Display a single value or short text.

```typescript
<WidgetView title={title} subtitle={subtitle}>
  <Text style={styles.value}>{displayValue}</Text>
</WidgetView>
```

### Pattern 2: List Widget
Display a list of items.

```typescript
<WidgetView title={title}>
  {items.map((item, index) => (
    <View key={index} style={styles.item}>
      <Text>{item.name}</Text>
    </View>
  ))}
</WidgetView>
```

### Pattern 3: Key-Value Widget
Display structured key-value pairs.

```typescript
<WidgetView title={title}>
  <View style={styles.row}>
    <Text style={styles.label}>Balance:</Text>
    <Text style={styles.value}>${balance}</Text>
  </View>
</WidgetView>
```

---

## Troubleshooting

### Widget Not Rendering

1. **Check Registration**: Ensure widget is added to `WIDGET_REGISTRY`
2. **Check Type**: Verify widget type matches backend response
3. **Check Import**: Ensure component is properly imported
4. **Check Console**: Look for errors in React Native debugger

### Type Errors

1. **Update WidgetType**: Add new type to `WidgetType` union
2. **Check Data Interface**: Ensure data interface matches backend schema
3. **Use Type Assertions**: Cast `data` to your interface type

### Styling Issues

1. **Check WidgetView Props**: Verify props are correctly passed
2. **Check StyleSheet**: Ensure styles are defined correctly
3. **Test on Different Screens**: Verify responsive design works

---

## Testing Your Widget

### Manual Testing Checklist

- [ ] Widget renders with valid data
- [ ] Widget handles missing optional fields gracefully
- [ ] Widget displays correct title
- [ ] Widget handles empty data object
- [ ] Widget handles null/undefined values
- [ ] Widget responds to onPress handler
- [ ] Widget displays lastUpdated timestamp correctly
- [ ] Widget looks good on different screen sizes

### Example Test Data

```typescript
// Valid data
const validData = {
  field1: "Value 1",
  field2: 42,
  field3: [{ key: "test", value: "data" }]
};

// Missing optional fields
const minimalData = {
  field1: "Value 1",
  field2: 0
};

// Empty data
const emptyData = {};
```

---

## Next Steps

After adding your widget:

1. **Update Documentation**: Add widget to `WIDGET_SCHEMA.md`
2. **Backend Integration**: Coordinate with backend team if widget needs API changes
3. **Testing**: Test widget with real backend data
4. **Code Review**: Submit PR with widget implementation

---

## Related Documentation

- **Widget Architecture**: See `WIDGET_ARCHITECTURE.md`
- **Widget Schema**: See `WIDGET_SCHEMA.md`
- **Style Guide**: See `ios/STYLE_GUIDE.md`
- **Component Examples**: See `src/components/WidgetView.example.tsx`

---

## Questions or Issues?

- **Frontend Team**: Update widget components and this guide
- **Backend Team**: Ensure API responses match widget schemas
- **Documentation**: Keep this guide up to date with new patterns

**Last Updated:** 2024-11-03

