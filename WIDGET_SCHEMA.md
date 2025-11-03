# Widget Response Schema Specification

## Overview

This document defines the expected response structure for each widget type returned by the `/api/dashboard` endpoint. This schema ensures consistency between backend API responses and frontend rendering logic.

**API Endpoint:** `GET /api/dashboard`

**Last Updated:** 2024-11-03

---

## Common Widget Structure

All widgets share a common base structure:

```typescript
interface BaseWidget {
  id: string;                    // Unique widget identifier
  type: WidgetType;               // Widget type identifier
  title: string;                  // Widget display title
  data: WidgetSpecificData;       // Widget-specific data (see below)
  lastUpdated: string;            // ISO 8601 timestamp (e.g., "2024-11-03T12:00:00.000Z")
}
```

**Field Requirements:**
- `id`: Must be unique across all widgets. Format: `{type}-{number}` (e.g., "weather-1")
- `type`: Must be one of: `"weather" | "slack" | "canvas" | "bank" | "crm" | "welcome"`
- `title`: Human-readable widget title (e.g., "Weather", "Bank Account")
- `data`: Widget-specific data structure (see widget-specific schemas below)
- `lastUpdated`: ISO 8601 formatted date string (always UTC)

---

## Widget Type: `weather`

**Title:** "Weather"

**Data Structure:**
```typescript
interface WeatherWidgetData {
  temperature: number;           // Temperature in Fahrenheit (required)
  condition: string;            // Weather condition (e.g., "Sunny", "Cloudy") (required)
  location: string;              // Location string (e.g., "San Francisco, CA") (required)
  forecast?: Array<{             // Optional 3-day forecast
    day: string;                 // Day name (e.g., "Today", "Tomorrow")
    high: number;                // High temperature in Fahrenheit
    low: number;                 // Low temperature in Fahrenheit
  }>;
}
```

**Example Response:**
```json
{
  "id": "weather-1",
  "type": "weather",
  "title": "Weather",
  "data": {
    "temperature": 72,
    "condition": "Sunny",
    "location": "San Francisco, CA",
    "forecast": [
      {
        "day": "Today",
        "high": 75,
        "low": 65
      },
      {
        "day": "Tomorrow",
        "high": 73,
        "low": 63
      },
      {
        "day": "Wednesday",
        "high": 70,
        "low": 60
      }
    ]
  },
  "lastUpdated": "2024-11-03T12:00:00.000Z"
}
```

**Frontend Rendering:**
- Displays temperature prominently (large font)
- Shows condition below temperature
- Uses location as widget subtitle
- Forecast is optional and can be displayed in expanded view

---

## Widget Type: `slack`

**Title:** "Slack"

**Data Structure:**
```typescript
interface SlackWidgetData {
  unreadCount: number;           // Number of unread messages (required)
  recentMessages?: Array<{       // Optional array of recent messages
    channel: string;              // Channel name (e.g., "#general")
    message: string;              // Message text (truncated if too long)
    timestamp: string;            // ISO 8601 timestamp
  }>;
}
```

**Example Response:**
```json
{
  "id": "slack-1",
  "type": "slack",
  "title": "Slack",
  "data": {
    "unreadCount": 3,
    "recentMessages": [
      {
        "channel": "#general",
        "message": "Meeting at 3 PM today",
        "timestamp": "2024-11-03T11:30:00.000Z"
      },
      {
        "channel": "#dev-team",
        "message": "PR ready for review",
        "timestamp": "2024-11-03T10:00:00.000Z"
      }
    ]
  },
  "lastUpdated": "2024-11-03T12:00:00.000Z"
}
```

**Frontend Rendering:**
- Shows unread count in subtitle (e.g., "3 unread messages")
- Displays recent messages list (optional)
- Timestamps are relative (e.g., "30 min ago")

---

## Widget Type: `canvas`

**Title:** "Canvas"

**Data Structure:**
```typescript
interface CanvasWidgetData {
  upcomingAssignments?: Array<{   // Optional array of upcoming assignments
    title: string;                 // Assignment title (required)
    dueDate: string;              // ISO 8601 timestamp (required)
    course: string;                // Course name (required)
  }>;
  announcements?: Array<{         // Optional array of announcements
    title: string;                 // Announcement title (required)
    course: string;                // Course name (required)
    postedAt: string;              // ISO 8601 timestamp (required)
  }>;
}
```

**Example Response:**
```json
{
  "id": "canvas-1",
  "type": "canvas",
  "title": "Canvas",
  "data": {
    "upcomingAssignments": [
      {
        "title": "Math Homework - Chapter 5",
        "dueDate": "2024-11-05T23:59:59.000Z",
        "course": "Mathematics 101"
      },
      {
        "title": "Essay - History Paper",
        "dueDate": "2024-11-08T23:59:59.000Z",
        "course": "World History"
      }
    ],
    "announcements": [
      {
        "title": "Office hours changed",
        "course": "Mathematics 101",
        "postedAt": "2024-11-02T10:00:00.000Z"
      }
    ]
  },
  "lastUpdated": "2024-11-03T12:00:00.000Z"
}
```

**Frontend Rendering:**
- Shows assignment count in subtitle (e.g., "2 upcoming assignments")
- Displays assignments with due dates
- Formats due dates relative (e.g., "Due in 2 days")
- Announcements shown separately or in expanded view

---

## Widget Type: `bank`

**Title:** "Bank Account"

**Data Structure:**
```typescript
interface BankWidgetData {
  accountNumber: string;          // Masked account number (e.g., "•••• 4321") (required)
  accountType: string;             // Account type (e.g., "Checking Account") (required)
  balance: number;                 // Account balance in dollars (required)
  lastUpdated?: string;            // Optional human-readable time (e.g., "2:30 PM")
}
```

**Example Response:**
```json
{
  "id": "bank-1",
  "type": "bank",
  "title": "Bank Account",
  "data": {
    "accountNumber": "•••• 4321",
    "accountType": "Checking Account",
    "balance": 12345.67,
    "lastUpdated": "2:30 PM"
  },
  "lastUpdated": "2024-11-03T14:30:00.000Z"
}
```

**Frontend Rendering:**
- Shows account type and masked number in subtitle
- Displays balance prominently (large, bold font)
- Formats balance as currency (e.g., "$12,345.67")
- Shows lastUpdated time if provided

---

## Widget Type: `crm`

**Title:** "CRM"

**Data Structure:**
```typescript
interface CRMWidgetData {
  contacts?: Array<{              // Optional array of recent contacts
    name: string;                   // Contact full name (required)
    email: string;                 // Contact email (required)
    lastContacted: string;         // ISO 8601 timestamp (required)
  }>;
  tasks?: Array<{                  // Optional array of tasks
    title: string;                 // Task title (required)
    dueDate: string;               // ISO 8601 timestamp (required)
    priority: string;              // Priority level: "high" | "medium" | "low" (required)
  }>;
}
```

**Example Response:**
```json
{
  "id": "crm-1",
  "type": "crm",
  "title": "CRM",
  "data": {
    "contacts": [
      {
        "name": "John Doe",
        "email": "john@example.com",
        "lastContacted": "2024-10-31T10:00:00.000Z"
      },
      {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "lastContacted": "2024-10-27T14:00:00.000Z"
      }
    ],
    "tasks": [
      {
        "title": "Follow up with client",
        "dueDate": "2024-11-04T17:00:00.000Z",
        "priority": "high"
      },
      {
        "title": "Prepare quarterly report",
        "dueDate": "2024-11-10T17:00:00.000Z",
        "priority": "medium"
      }
    ]
  },
  "lastUpdated": "2024-11-03T12:00:00.000Z"
}
```

**Frontend Rendering:**
- Shows task count in subtitle (e.g., "2 active tasks")
- Displays tasks with priority indicators (color-coded)
- Formats due dates relative (e.g., "Due in 1 day")
- Contacts shown in expanded view or separate section

---

## Widget Type: `welcome`

**Note:** This is a local widget type (not from backend API). It's rendered client-side only.

**Title:** "Welcome"

**Data Structure:**
```typescript
interface WelcomeWidgetData {
  // Empty object or minimal data
  // Widget generates greeting based on time of day
}
```

**Example Response:**
```json
{
  "id": "welcome-1",
  "type": "welcome",
  "title": "Welcome",
  "data": {},
  "lastUpdated": "2024-11-03T12:00:00.000Z"
}
```

**Frontend Rendering:**
- Time-based greeting ("Good morning/afternoon/evening")
- Welcome message
- Not fetched from API, rendered locally

---

## Complete Dashboard Response

**Endpoint:** `GET /api/dashboard`

**Response Structure:**
```typescript
interface DashboardResponse {
  userId: string;                 // User identifier
  widgets: BaseWidget[];          // Array of widget objects
  layout: WidgetLayout[];          // Widget positioning information
  lastSync: string;                // ISO 8601 timestamp of last sync
}

interface WidgetLayout {
  widgetId: string;               // References widget.id
  position: {
    x: number;                    // X grid position
    y: number;                    // Y grid position
  };
  size: {
    width: number;                // Width in grid units
    height: number;               // Height in grid units
  };
}
```

**Example Complete Response:**
```json
{
  "userId": "user-123",
  "widgets": [
    {
      "id": "weather-1",
      "type": "weather",
      "title": "Weather",
      "data": { /* ... */ },
      "lastUpdated": "2024-11-03T12:00:00.000Z"
    },
    {
      "id": "slack-1",
      "type": "slack",
      "title": "Slack",
      "data": { /* ... */ },
      "lastUpdated": "2024-11-03T12:00:00.000Z"
    }
    // ... more widgets
  ],
  "layout": [
    {
      "widgetId": "weather-1",
      "position": { "x": 0, "y": 0 },
      "size": { "width": 1, "height": 1 }
    }
    // ... more layout entries
  ],
  "lastSync": "2024-11-03T12:00:00.000Z"
}
```

---

## Field Type Specifications

### Date/Time Fields

All timestamp fields use **ISO 8601 format** (UTC):
- Format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `"2024-11-03T12:00:00.000Z"`
- Always in UTC timezone (Z suffix)

**Frontend Handling:**
- Parse with `new Date(timestamp)` 
- Format for display (relative time or local timezone)
- Use `Date.toISOString()` when sending back to API

### Numeric Fields

- **Temperatures**: Always in Fahrenheit (°F)
- **Currency/Balances**: Decimal numbers (e.g., `12345.67`)
- **Counts**: Non-negative integers

### String Fields

- **Titles**: Human-readable, title case (e.g., "Weather", "Bank Account")
- **IDs**: Kebab-case with type prefix (e.g., "weather-1", "slack-2")
- **Channel names**: Include # prefix (e.g., "#general")

---

## Validation Rules

### Required Fields (All Widgets)
- `id`: Must be unique, non-empty string
- `type`: Must match one of defined widget types
- `title`: Non-empty string
- `data`: Object (can be empty for welcome widget)
- `lastUpdated`: Valid ISO 8601 timestamp

### Widget-Specific Requirements

**Weather Widget:**
- `temperature`: Required number
- `condition`: Required non-empty string
- `location`: Required non-empty string
- `forecast`: Optional array (if present, must have valid structure)

**Slack Widget:**
- `unreadCount`: Required non-negative integer
- `recentMessages`: Optional array (if present, must have valid structure)

**Canvas Widget:**
- At least one of `upcomingAssignments` or `announcements` should be present
- Arrays must have valid structure if present

**Bank Widget:**
- `accountNumber`: Required non-empty string
- `accountType`: Required non-empty string
- `balance`: Required number (can be negative for overdrawn accounts)

**CRM Widget:**
- At least one of `contacts` or `tasks` should be present
- Arrays must have valid structure if present

---

## Error Handling

### Missing Fields
- If required fields are missing, frontend should display fallback/placeholder values
- Log warning to console for debugging

### Invalid Data Types
- Frontend should validate data types before rendering
- Display error message in widget if data is invalid

### Network Errors
- Handle API errors gracefully
- Show error state in widget or dashboard
- Retry logic should be implemented

---

## Versioning

**Current Version:** 1.0.0

**Breaking Changes:**
- Schema version will be incremented for breaking changes
- Backend should maintain backward compatibility when possible
- Frontend should handle missing optional fields gracefully

**Future Enhancements:**
- Additional widget types will be added to this document
- New optional fields may be added to existing widgets
- Breaking changes will be versioned and documented

---

## Frontend/Backend Alignment

### Frontend Implementation
- Widget components are located in `src/components/widgets/`
- Each widget component defines its expected data interface
- Type casting: `const widgetData = data as WidgetDataType`
- Components handle missing/optional fields with defaults

### Backend Implementation
- Controller: `backend/src/controllers/DashboardController.ts`
- Schema validated in controller before sending response
- Hardcoded data currently, will be replaced with database queries

### Shared Types
- Types can be shared via a common package or copied
- Keep interfaces in sync between frontend and backend
- Document any discrepancies in this file

---

## Testing

### Backend Tests
- Test each widget type response structure
- Verify all required fields are present
- Validate date format (ISO 8601)
- Test with missing optional fields

### Frontend Tests
- Test widget rendering with valid data
- Test widget rendering with missing optional fields
- Test error handling for invalid data
- Test date formatting and relative time display

---

## Contact

For questions or updates to this schema:
- **Frontend Team:** Update widget components and this document
- **Backend Team:** Ensure API responses match this schema
- **Documentation:** Keep this file synchronized with code changes

---

**Document Status:** ✅ Approved for Development

**Next Review Date:** 2024-12-01

