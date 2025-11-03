# Widget Architecture & Dynamic Rendering Strategy

## Decision: Component Map Pattern

After evaluating multiple approaches (FlatList, component map, factory method), we've chosen a **Component Map Pattern with Factory Method** for dynamic widget rendering. This approach provides the best balance of scalability, type safety, maintainability, and performance.

## Architecture Overview

### Component Map Pattern

The widget rendering system uses a centralized registry (`WIDGET_REGISTRY`) that maps widget types to their React component implementations. A factory function (`renderWidget`) dynamically renders the appropriate component based on widget data.

**Structure:**
```
WidgetFactory (Registry + Factory)
    ↓
Individual Widget Components
    ↓
WidgetView (Base Container)
    ↓
Rendered Widget
```

## Why Component Map Over Alternatives

### ✅ Advantages of Component Map

1. **Scalability**: Easy to add new widget types
   - Create new component file
   - Add one line to registry
   - Done!

2. **Type Safety**: TypeScript ensures all widget types are handled
   - Compile-time checking
   - IntelliSense support
   - Type inference for widget data

3. **Performance**: O(1) lookup time
   - Direct object property access
   - No iteration needed
   - Minimal overhead

4. **Maintainability**: All widget definitions in one place
   - Single source of truth
   - Easy to see all supported widgets
   - Clear widget-to-component mapping

5. **Flexibility**: Supports different widget implementations
   - Can use different base components
   - Easy to add conditional rendering
   - Supports both API-driven and local widgets

### ❌ Why Not FlatList?

**FlatList** is optimized for large lists with virtualization, but:
- Widgets are relatively few (5-10 per dashboard)
- Widgets have different structures (not uniform list items)
- Widgets need custom rendering logic per type
- No performance benefit for small widget count

**Verdict**: Component Map is more appropriate for this use case.

### ❌ Why Not Pure Factory Method?

**Pure Factory Method** would require:
- Switch/case statements (harder to maintain)
- Manual type checking
- More code per widget type
- Less flexible for dynamic widget discovery

**Verdict**: Component Map provides better maintainability.

## Implementation

### Widget Registry

```typescript
const WIDGET_REGISTRY: Record<string, WidgetComponent> = {
  welcome: WelcomeWidget,     // Local widget
  weather: WeatherWidget,      // API widget
  slack: SlackWidget,          // API widget
  canvas: CanvasWidget,        // API widget
  bank: BankAccountWidget,     // API widget
  crm: CRMWidget,              // API widget
};
```

### Factory Function

```typescript
export const renderWidget = (
  widget: WidgetData,
  onPress?: () => void
): React.ReactElement => {
  const WidgetComponent = getWidgetComponent(widget.type);
  
  if (!WidgetComponent) {
    return <FallbackWidget widget={widget} />;
  }
  
  return (
    <WidgetComponent
      data={widget.data}
      title={widget.title}
      lastUpdated={widget.lastUpdated}
      onPress={onPress}
    />
  );
};
```

### Usage in DashboardScreen

```typescript
// Render widgets from API data
{widgets.map((widget) => (
  <View key={widget.id} style={widgetWrapperStyle}>
    {renderWidget(widget, () => handleWidgetPress(widget))}
  </View>
))}
```

## Widget Component Structure

### Base Interface

All widget components implement `BaseWidgetProps`:

```typescript
interface BaseWidgetProps {
  data: unknown;           // Widget-specific data
  title: string;           // Widget title
  lastUpdated?: Date;      // Last update timestamp
  onPress?: () => void;    // Optional press handler
}
```

### Widget Implementation Pattern

```typescript
export const MyWidget: React.FC<BaseWidgetProps> = ({
  data,
  title,
  lastUpdated,
  onPress,
}) => {
  // 1. Type-safe data extraction
  const widgetData = data as MyWidgetData;
  
  // 2. Render using WidgetView container
  return (
    <WidgetView
      title={title}
      subtitle={widgetData.subtitle}
      headerIcon={<Icon />}
      onPress={onPress}
    >
      {/* Widget-specific content */}
    </WidgetView>
  );
};
```

## Adding a New Widget

### Step-by-Step Guide

1. **Create Widget Component**
   ```typescript
   // src/components/widgets/NewWidget.tsx
   export const NewWidget: React.FC<BaseWidgetProps> = ({ data, title }) => {
     return (
       <WidgetView title={title}>
         {/* Widget content */}
       </WidgetView>
     );
   };
   ```

2. **Import in WidgetFactory**
   ```typescript
   import { NewWidget } from "./NewWidget";
   ```

3. **Add to Registry**
   ```typescript
   const WIDGET_REGISTRY = {
     // ... existing widgets
     newWidget: NewWidget,
   };
   ```

4. **Update Widget Types** (if needed)
   ```typescript
   export type WidgetType = "weather" | "slack" | ... | "newWidget";
   ```

That's it! The widget will automatically render when the API returns that widget type.

## Current Widget Implementation

### Dummy Widgets

1. **Welcome Widget** (`welcome`)
   - Local widget (not from API)
   - Time-based greeting
   - Static content

2. **Bank Account Widget** (`bank`)
   - Simulates API data structure
   - Displays account balance
   - Placeholder data for demonstration

### API Widgets (Placeholders)

3. **Weather Widget** (`weather`)
4. **Slack Widget** (`slack`)
5. **Canvas Widget** (`canvas`)
6. **CRM Widget** (`crm`)

All API widgets are implemented with placeholder content and proper data type definitions, ready for API integration.

## Data Flow

### Current Flow (Dummy Data)

```
DashboardScreen
    ↓
Static Widget Array (mockWidgets)
    ↓
WidgetFactory.renderWidget()
    ↓
Component Map Lookup
    ↓
Individual Widget Component
    ↓
WidgetView Container
    ↓
Rendered Widget
```

### Future Flow (API-Driven)

```
DashboardScreen
    ↓
API Call (/api/dashboard)
    ↓
Widget Data Array (from backend)
    ↓
WidgetFactory.renderWidget()
    ↓
Component Map Lookup
    ↓
Individual Widget Component (with API data)
    ↓
WidgetView Container
    ↓
Rendered Widget
```

## Performance Considerations

### Rendering Strategy

- **Current**: Uses ScrollView (appropriate for 5-10 widgets)
- **Future**: Could switch to FlatList if widget count grows significantly
- **Optimization**: Widget components are lightweight and memo-friendly

### Memory Management

- Widget components are functional components (low memory footprint)
- Widget data is stored in state (managed by React)
- No need for virtualization at current scale

## Type Safety

### Widget Type Definitions

```typescript
// Backend widget types
type WidgetType = "weather" | "slack" | "canvas" | "bank" | "crm";

// Extended type (includes local widgets)
type ExtendedWidgetType = WidgetType | "welcome";
```

### Data Type Safety

Each widget defines its own data interface:

```typescript
interface BankAccountData {
  accountNumber?: string;
  balance?: number;
  // ...
}

// Type-safe extraction in component
const bankData = data as BankAccountData;
```

## Future Enhancements

### Possible Improvements

1. **Lazy Loading**: Load widget components on demand
2. **Widget Configuration**: Allow users to customize widget settings
3. **Widget Ordering**: Support drag-and-drop reordering
4. **Widget Visibility**: Show/hide widgets based on preferences
5. **Error Boundaries**: Wrap widgets in error boundaries for resilience

### Scalability Path

If widget count grows significantly:
- Switch to FlatList for virtualization
- Implement widget pagination
- Add widget caching
- Lazy load widget components

## Testing Strategy

### Unit Tests

- Test `renderWidget` with various widget types
- Test fallback for unknown widget types
- Test component map lookup

### Integration Tests

- Test widget rendering in DashboardScreen
- Test widget with API data
- Test widget error handling

## Documentation

### For Developers

- Widget component structure in `WIDGET_ARCHITECTURE.md`
- Component map pattern explained
- Adding new widgets guide

### For Future API Integration

- Widget data structures defined
- Type-safe data extraction pattern
- API response format documented

## Conclusion

The Component Map Pattern provides a scalable, maintainable, and type-safe solution for dynamic widget rendering. It's optimized for our use case (5-10 widgets per dashboard) and can easily accommodate future growth.

**Key Benefits:**
- ✅ Easy to add new widgets
- ✅ Type-safe implementation
- ✅ Performance optimized
- ✅ Maintainable codebase
- ✅ Ready for API integration

