# Widget Rendering Testing Guide

## Quick Test Instructions

### 1. Verify Backend Endpoint

```bash
# Test backend endpoint
curl http://localhost:3000/api/dashboard | jq '.widgets[] | {type, title, id}'
```

**Expected Output:**
```json
{
  "type": "weather",
  "title": "Weather",
  "id": "255043ba-515f-4ff1-bb4a-cd01c24ca187"
}
{
  "type": "bank",
  "title": "Bank Account",
  "id": "aaa44907-5b74-468c-991c-689e74e8ab40"
}
{
  "type": "slack",
  "title": "Slack",
  "id": "70fccf60-ba4b-40d2-9ea5-5ce67918fc35"
}
```

### 2. Launch React Native App

```bash
# Start React Native app
npm start
# Or
npx expo start
```

### 3. Check Console Logs

When the dashboard loads, you should see:

```
[Dashboard] Loaded 3 widgets from backend
[Dashboard] Widget: weather - Weather (ID: 255043ba...)
[Dashboard] Widget: bank - Bank Account (ID: aaa44907...)
[Dashboard] Widget: slack - Slack (ID: 70fccf60...)
[BankWidget] Rendering with data: { accountNumber: '•••• 4321', accountType: 'Checking Account', balance: 12345.67, ... }
```

### 4. Visual Verification

**Bank Widget Should Display:**
- Title: "Bank Account"
- Subtitle: "Checking Account •••• 4321"
- Balance: "$12,345.67" (formatted currency)
- Last Updated: "Last updated: 12:59 AM"
- Icon: 💰

**Weather Widget Should Display:**
- Title: "Weather"
- Subtitle: "San Francisco, CA"
- Temperature: "72°F" (large, bold)
- Condition: "Sunny"
- Icon: 🌤️

---

## Detailed Test Cases

### Test Case: Bank Widget Data Matching

**Backend Data:**
```json
{
  "accountNumber": "•••• 4321",
  "accountType": "Checking Account",
  "balance": 12345.67,
  "lastUpdated": "12:59 AM"
}
```

**Frontend Display:**
- ✅ Account number: "•••• 4321" (in subtitle)
- ✅ Account type: "Checking Account" (in subtitle)
- ✅ Balance: "$12,345.67" (formatted)
- ✅ Last updated: "Last updated: 12:59 AM"

**Verification:**
1. Check console log: `[BankWidget] Rendering with data:`
2. Verify all fields match backend response
3. Verify currency formatting applied
4. Verify UI displays correct values

---

### Test Case: Welcome Widget (Client-Side)

**Backend Data:** None (client-side widget)

**Frontend Display:**
- ✅ Title: "Welcome"
- ✅ Subtitle: "Good [morning/afternoon/evening]" (time-based)
- ✅ Welcome message displayed
- ✅ No backend data required

**Verification:**
1. Widget renders without backend data
2. Greeting changes based on time of day
3. Console log shows: `[WelcomeWidget] Rendering client-side widget`

---

## Common Issues and Solutions

### Issue: Widget Not Rendering

**Symptoms:**
- Widget type not found in registry
- Fallback message displayed: "Widget type 'X' is not yet implemented"

**Solution:**
1. Check `WIDGET_REGISTRY` in `WidgetFactory.tsx`
2. Verify widget type matches backend response
3. Ensure component is imported correctly

### Issue: Data Not Displaying

**Symptoms:**
- Widget renders but shows default values
- Data fields appear empty

**Solution:**
1. Check console logs for data structure
2. Verify data interface matches backend response
3. Check for type mismatches in data extraction

### Issue: Wrong Widget Type

**Symptoms:**
- Widget renders but wrong component used
- Type mismatch between backend and frontend

**Solution:**
1. Verify widget type in backend response
2. Check `WIDGET_REGISTRY` mapping
3. Ensure type is in `WidgetType` union

---

## Testing Checklist

- [ ] Backend endpoint returns 200 OK
- [ ] Widgets array present in response
- [ ] Widget types are valid strings
- [ ] Data structures match expected format
- [ ] Frontend receives widgets correctly
- [ ] Data transformation preserves fields
- [ ] Widget components render correctly
- [ ] UI displays match backend data
- [ ] Console logs show correct data flow
- [ ] Error handling works for missing data

---

## Postman Collection

Create a Postman collection with:

1. **GET Dashboard**
   - URL: `http://localhost:3000/api/dashboard`
   - Method: GET
   - Headers: `Content-Type: application/json`

2. **Test Script:**
```javascript
pm.test("Widgets render correctly", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.widgets).to.be.an('array');
    pm.expect(jsonData.widgets.length).to.be.above(0);
    
    // Verify bank widget
    var bankWidget = jsonData.widgets.find(w => w.type === 'bank');
    if (bankWidget) {
        pm.expect(bankWidget.data).to.have.property('balance');
        pm.expect(bankWidget.data.balance).to.be.a('number');
    }
});
```

---

**For detailed test report, see:** `docs/WIDGET_RENDERING_TEST.md`

