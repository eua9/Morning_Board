# Widget Schema Quick Reference (Backend)

This is a quick reference for backend developers. For complete documentation, see [WIDGET_SCHEMA.md](../WIDGET_SCHEMA.md).

## Response Structure

All widgets returned by `GET /api/dashboard` must follow this structure:

```typescript
{
  id: string;           // e.g., "weather-1"
  type: string;         // "weather" | "slack" | "canvas" | "bank" | "crm"
  title: string;        // e.g., "Weather"
  data: object;         // Widget-specific (see below)
  lastUpdated: string;  // ISO 8601 timestamp (UTC)
}
```

## Widget-Specific Data Structures

### Weather (`type: "weather"`)
```typescript
{
  temperature: number;     // Fahrenheit
  condition: string;       // e.g., "Sunny"
  location: string;        // e.g., "San Francisco, CA"
  forecast?: Array<{       // Optional
    day: string;
    high: number;
    low: number;
  }>;
}
```

### Slack (`type: "slack"`)
```typescript
{
  unreadCount: number;     // Non-negative integer
  recentMessages?: Array<{ // Optional
    channel: string;       // e.g., "#general"
    message: string;
    timestamp: string;     // ISO 8601
  }>;
}
```

### Canvas (`type: "canvas"`)
```typescript
{
  upcomingAssignments?: Array<{ // Optional
    title: string;
    dueDate: string;            // ISO 8601
    course: string;
  }>;
  announcements?: Array<{        // Optional
    title: string;
    course: string;
    postedAt: string;            // ISO 8601
  }>;
}
```

### Bank (`type: "bank"`)
```typescript
{
  accountNumber: string;   // e.g., "•••• 4321"
  accountType: string;    // e.g., "Checking Account"
  balance: number;        // Decimal number
  lastUpdated?: string;   // Optional, e.g., "2:30 PM"
}
```

### CRM (`type: "crm"`)
```typescript
{
  contacts?: Array<{      // Optional
    name: string;
    email: string;
    lastContacted: string; // ISO 8601
  }>;
  tasks?: Array<{         // Optional
    title: string;
    dueDate: string;       // ISO 8601
    priority: "high" | "medium" | "low";
  }>;
}
```

## Important Notes

1. **Timestamps**: Always use ISO 8601 format in UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`)
2. **Required Fields**: All base widget fields are required. Optional fields are marked with `?`
3. **Validation**: Validate data structure before sending response
4. **Error Handling**: Return proper error responses if widget data cannot be fetched

## Implementation Example

```typescript
const widget: WidgetData = {
  id: 'weather-1',
  type: 'weather',
  title: 'Weather',
  data: {
    temperature: 72,
    condition: 'Sunny',
    location: 'San Francisco, CA',
    forecast: [
      { day: 'Today', high: 75, low: 65 }
    ]
  },
  lastUpdated: new Date().toISOString()
};
```

## Testing

When implementing widget data fetching:
1. Test that all required fields are present
2. Test that timestamps are valid ISO 8601 format
3. Test with missing optional fields (should still work)
4. Verify data types match schema

For complete schema documentation, see [WIDGET_SCHEMA.md](../WIDGET_SCHEMA.md).

