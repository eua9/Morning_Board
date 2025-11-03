# Widget Model Documentation

## Overview

The Widget and WidgetData models provide a structured way to represent and manage widgets in the Morning Board application. These models handle serialization, validation, and database operations for widgets.

**Last Updated:** 2024-11-03

---

## Models

### WidgetData Model

**File:** `backend/src/models/WidgetData.ts`

**Purpose:** Represents the flexible JSON data content of a widget.

#### Class: `WidgetData`

**Methods:**
- `getRawData()` - Returns the raw data object
- `setData(data)` - Sets the entire data object
- `getField(key)` - Gets a specific field value
- `setField(key, value)` - Sets a specific field value
- `toJSON()` - Serializes to JSON string (for database)
- `fromJSON(jsonString)` - Deserializes from JSON string (static)
- `validate()` - Validates data structure
- `isEmpty()` - Checks if data is empty

**Usage:**
```typescript
// Create empty WidgetData
const widgetData = new WidgetData();

// Create with data
const weatherData = new WidgetData({
  temperature: 72,
  condition: 'Sunny',
  location: 'San Francisco, CA'
});

// Serialize for database
const json = weatherData.toJSON(); // Returns JSON string

// Deserialize from database
const data = WidgetData.fromJSON(json); // Returns WidgetData instance
```

#### Type-Specific Interfaces

The model includes TypeScript interfaces for type-safe widget data:

- `WeatherWidgetData` - Weather widget data structure
- `SlackWidgetData` - Slack widget data structure
- `CanvasWidgetData` - Canvas widget data structure
- `BankWidgetData` - Bank widget data structure
- `CRMWidgetData` - CRM widget data structure
- `WelcomeWidgetData` - Welcome widget data structure

---

### Widget Model

**File:** `backend/src/models/Widget.ts`

**Purpose:** Represents a complete widget with metadata, positioning, and data.

#### Interface: `IWidget`

```typescript
interface IWidget {
  id: string;
  userId: string;
  type: WidgetType;
  title: string;
  data: IWidgetData;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
  lastUpdated?: Date;
}
```

#### Class: `Widget`

**Properties:**
- `id` - Unique widget identifier
- `userId` - Owner user ID
- `type` - Widget type (weather, slack, canvas, bank, crm)
- `title` - Display title
- `data` - Widget data content (JSON object)
- `positionX`, `positionY` - Grid position
- `width`, `height` - Grid dimensions
- `createdAt`, `updatedAt` - Timestamps
- `lastUpdated` - Last data refresh timestamp

**Methods:**
- `getWidgetData()` - Get WidgetData wrapper
- `setData(data)` - Set widget data
- `updateDataField(key, value)` - Update specific data field
- `serializeData()` - Serialize data to JSON string
- `deserializeData(jsonString)` - Deserialize data from JSON
- `validate()` - Validate widget structure
- `toAPIResponse()` - Convert to frontend API format
- `fromDatabaseRow(row)` - Create from database row (static)
- `toDatabaseRow()` - Convert to database row format
- `clone()` - Create a copy of the widget

**Usage:**
```typescript
// Create widget
const widget = new Widget({
  id: 'widget-1',
  userId: 'user-1',
  type: 'bank',
  title: 'Bank Account',
  data: {
    accountNumber: '•••• 4321',
    balance: 12345.67
  }
});

// Validate
if (widget.validate()) {
  // Widget is valid
}

// Convert to API response
const apiResponse = widget.toAPIResponse();
// Returns: { id, type, title, data, lastUpdated: ISO string }

// Convert to database format
const dbRow = widget.toDatabaseRow();
// Returns: { id, user_id, type, title, position_x, position_y, width, height, config, created_at, updated_at }
```

---

## Database Schema

### Widgets Table

The widgets table stores widget configurations:

```sql
CREATE TABLE widgets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('weather', 'slack', 'canvas', 'bank', 'crm')),
  title TEXT NOT NULL,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  config TEXT, -- JSON string for widget data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

**Key Points:**
- `config` field stores widget data as JSON string
- Widget is linked to user via `user_id`
- Position and size are stored as grid coordinates

---

## Seeding Widget Data

### Widget Seed Script

**File:** `backend/src/database/widgetSeed.ts`

**Functions:**
- `seedWidgetsForUser(userId)` - Creates mock widgets for a user
- `clearWidgetsForUser(userId)` - Removes all widgets for a user
- `seedTestUserWidgets()` - Seeds widgets for test user (automated)

**Mock Widgets Created:**
1. **Weather Widget**
   - Temperature, condition, location
   - 3-day forecast

2. **Bank Account Widget**
   - Account number (masked)
   - Account type
   - Balance

3. **Slack Widget**
   - Unread count
   - Recent messages

**Usage:**
```bash
# Seed widgets for test user
npm run seed:widgets

# Widgets are automatically seeded when running npm run seed
```

---

## Testing

### Unit Tests

**File:** `backend/src/models/__tests__/Widget.test.ts`

**Test Coverage:**
- ✅ WidgetData construction
- ✅ Data manipulation (get/set fields)
- ✅ JSON serialization/deserialization
- ✅ Validation
- ✅ Widget construction
- ✅ Data management
- ✅ API response format
- ✅ Database row conversion
- ✅ Cloning

**Run Tests:**
```bash
npm test -- src/models/__tests__/Widget.test.ts
```

**Test Results:** 25/25 tests passing ✅

---

## Integration with Dashboard Controller

The Widget model can be used in DashboardController to:

1. **Fetch widgets from database:**
```typescript
const db = getDatabase();
const rows = db.prepare('SELECT * FROM widgets WHERE user_id = ?').all(userId);

const widgets = rows.map(row => Widget.fromDatabaseRow(row));
```

2. **Convert to API response:**
```typescript
const apiWidgets = widgets.map(widget => widget.toAPIResponse());
```

3. **Update widget data:**
```typescript
widget.updateDataField('temperature', 75);
widget.setData({ ...widget.data, temperature: 75 });
```

---

## Example Usage

### Creating a Widget

```typescript
import { Widget } from './models/Widget';

const widget = new Widget({
  id: 'weather-1',
  userId: 'user-123',
  type: 'weather',
  title: 'Weather',
  data: {
    temperature: 72,
    condition: 'Sunny',
    location: 'San Francisco, CA'
  },
  positionX: 0,
  positionY: 0,
  width: 1,
  height: 1
});
```

### Saving to Database

```typescript
const db = getDatabase();
const dbRow = widget.toDatabaseRow();

db.prepare(`
  INSERT INTO widgets (id, user_id, type, title, position_x, position_y, width, height, config, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  dbRow.id,
  dbRow.user_id,
  dbRow.type,
  dbRow.title,
  dbRow.position_x,
  dbRow.position_y,
  dbRow.width,
  dbRow.height,
  dbRow.config,
  dbRow.created_at,
  dbRow.updated_at
);
```

### Loading from Database

```typescript
const db = getDatabase();
const row = db.prepare('SELECT * FROM widgets WHERE id = ?').get(widgetId) as DatabaseRow;

const widget = Widget.fromDatabaseRow(row);
```

### Converting to API Response

```typescript
const apiResponse = widget.toAPIResponse();
// {
//   id: 'weather-1',
//   type: 'weather',
//   title: 'Weather',
//   data: { temperature: 72, ... },
//   lastUpdated: '2024-11-03T12:00:00.000Z'
// }
```

---

## Schema Validation

### Widget Validation Rules

A widget is valid if:
- ✅ Has an `id` (non-empty string)
- ✅ Has a `userId` (non-empty string)
- ✅ Has a valid `type` (one of: weather, slack, canvas, bank, crm)
- ✅ Has a `title` (non-empty string)
- ✅ Has valid `data` (object structure)

### WidgetData Validation

WidgetData is valid if:
- ✅ Is an object (not null, not array)
- ✅ Can be serialized to JSON

---

## Future Enhancements

### Potential Improvements

1. **Widget Data Validation:**
   - Type-specific validation for each widget type
   - Schema validation using JSON Schema

2. **Widget Templates:**
   - Predefined widget configurations
   - Easy widget creation from templates

3. **Widget Versioning:**
   - Track widget data changes over time
   - Revert to previous widget states

4. **Widget Permissions:**
   - Share widgets between users
   - Widget-level access control

---

## Files Summary

| File | Purpose |
|------|---------|
| `src/models/WidgetData.ts` | WidgetData model class |
| `src/models/Widget.ts` | Widget model class |
| `src/models/__tests__/Widget.test.ts` | Unit tests |
| `src/database/widgetSeed.ts` | Widget seeding script |

---

## Testing Status

✅ **All tests passing:**
- WidgetData tests: 10/10
- Widget tests: 15/15
- **Total: 25/25 tests passing**

---

**Last Updated:** 2024-11-03  
**Status:** ✅ **IMPLEMENTED AND TESTED**

