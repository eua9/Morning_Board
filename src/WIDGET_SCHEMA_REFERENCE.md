# Widget Schema Quick Reference (Frontend)

This is a quick reference for frontend developers. For complete documentation, see [WIDGET_SCHEMA.md](../WIDGET_SCHEMA.md).

## Expected Response Structure

All widgets received from `GET /api/dashboard` follow this structure:

```typescript
{
  id: string;           // e.g., "weather-1"
  type: string;         // "weather" | "slack" | "canvas" | "bank" | "crm" | "welcome"
  title: string;        // e.g., "Weather"
  data: unknown;        // Widget-specific (see below)
  lastUpdated?: string; // ISO 8601 timestamp (optional in frontend)
}
```

## Widget Component Data Types

Import data interfaces from widget components or use type assertions:

### Weather Widget
```typescript
interface WeatherWidgetData {
  temperature?: number;
  condition?: string;
  location?: string;
  forecast?: Array<{ day: string; high: number; low: number }>;
}
```

### Slack Widget
```typescript
interface SlackWidgetData {
  unreadCount?: number;
  recentMessages?: Array<{
    channel: string;
    message: string;
    timestamp: string;
  }>;
}
```

### Canvas Widget
```typescript
interface CanvasWidgetData {
  upcomingAssignments?: Array<{
    title: string;
    dueDate: string;
    course: string;
  }>;
  announcements?: Array<{
    title: string;
    course: string;
    postedAt: string;
  }>;
}
```

### Bank Widget
```typescript
interface BankWidgetData {
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  lastUpdated?: string;
}
```

### CRM Widget
```typescript
interface CRMWidgetData {
  contacts?: Array<{
    name: string;
    email: string;
    lastContacted: string;
  }>;
  tasks?: Array<{
    title: string;
    dueDate: string;
    priority: string;
  }>;
}
```

## Type Safety in Components

Always use type assertions when accessing widget data:

```typescript
const widgetData = data as WeatherWidgetData;
const temperature = widgetData.temperature || 72; // Default fallback
```

## Handling Missing/Optional Fields

All fields in widget data interfaces are optional (marked with `?`) to handle:
- Missing optional fields from API
- Partial data during loading
- Backward compatibility

Always provide fallback values:
```typescript
const unreadCount = slackData.unreadCount || 0;
const balance = bankData.balance || 0;
```

## Date Handling

Timestamps from API are ISO 8601 format:
- Parse: `new Date(timestamp)`
- Format: Use relative time (e.g., "30 min ago") or local timezone
- Validation: Check if date is valid before using

Example:
```typescript
const date = new Date(timestamp);
if (!isNaN(date.getTime())) {
  // Use date
}
```

## Widget Rendering

Widget components are located in `src/components/widgets/`:
- Each widget defines its expected data interface
- Use `WidgetView` as the base container
- Handle optional fields gracefully

## Testing

When rendering widgets:
1. Test with complete data
2. Test with missing optional fields
3. Test with invalid data types
4. Test date parsing and formatting

For complete schema documentation, see [WIDGET_SCHEMA.md](../WIDGET_SCHEMA.md).

