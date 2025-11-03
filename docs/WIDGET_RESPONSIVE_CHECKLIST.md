# Widget Framework Responsive Testing Checklist

## Quick Testing Checklist

Use this checklist when testing widgets on different screen sizes.

---

## iPhone SE (375×667) - Smallest Common Phone

### Layout

- [ ] Widgets render in single column
- [ ] No horizontal scrolling
- [ ] Widgets fill width (minus 16px padding each side = 343px)
- [ ] Vertical spacing: 16px between widgets

### Padding

- [ ] Left/right padding: 16px
- [ ] Top padding accounts for safe area
- [ ] Bottom padding allows full widget visibility

### Font Sizes

- [ ] Header title (34pt) readable
- [ ] Widget titles (20pt) readable
- [ ] Widget body text (17pt) readable
- [ ] Balance amount (32pt) readable
- [ ] No text clipping

### Widget Display

- [ ] Bank widget: Balance ($12,345.67) fully visible
- [ ] Bank widget: Account number doesn't overflow
- [ ] Weather widget: Temperature (72°F) readable
- [ ] Welcome widget: Greeting text fits

### Scroll Behavior

- [ ] Vertical scrolling works smoothly
- [ ] All widgets accessible via scroll
- [ ] No content cut off at bottom
- [ ] Pull-to-refresh works

### Edit Mode

- [ ] Edit button visible in header
- [ ] Reorder controls (▲/▼) visible and accessible
- [ ] Controls don't overlap content
- [ ] Blue border visible on widgets

**Issues Found:**

```
[Document any layout bugs here]
```

---

## iPhone 14 Pro Max (430×932) - Largest iPhone

### Layout

- [ ] Widgets render in single column
- [ ] Widgets use full available width (398px)
- [ ] No horizontal overflow
- [ ] Spacing consistent

### Font Sizes

- [ ] Text sizes appropriate (not too small)
- [ ] Large numbers prominent
- [ ] Text doesn't appear disproportionately small

### Widget Display

- [ ] All widgets display correctly
- [ ] Content fits within widget bounds
- [ ] No clipping or overflow

**Issues Found:**

```
[Document any layout bugs here]
```

---

## iPad (768×1024) - Standard Tablet

### Layout

- [ ] Widgets render in 2 columns
- [ ] Column widths are equal (~368px each)
- [ ] Gap between columns: 16px
- [ ] Widgets wrap to next row correctly

### Padding

- [ ] Left/right padding: 16px
- [ ] Widget spacing: 16px vertical
- [ ] Multi-column spacing: 16px horizontal

### Font Sizes

- [ ] Text remains readable
- [ ] Text sizes appropriate for screen
- [ ] Large numbers (balance) still prominent

### Widget Display

- [ ] Bank widget renders correctly in column
- [ ] Weather widget renders correctly in column
- [ ] Widgets maintain proper proportions
- [ ] No content overflow

### Scroll Behavior

- [ ] Vertical scrolling works
- [ ] Multi-column layout scrolls correctly
- [ ] All widgets accessible

**Issues Found:**

```
[Document any layout bugs here]
```

---

## iPad Pro 12.9" (1024×1366) - Largest Tablet

### Layout

- [ ] 2-column layout works correctly
- [ ] Widgets maintain proper proportions
- [ ] Layout doesn't appear too sparse
- [ ] Column widths: ~496px each

### Font Sizes

- [ ] Text size appropriate
- [ ] Text doesn't appear too small
- [ ] Balance amounts remain prominent

### Widget Display

- [ ] All widgets render correctly
- [ ] Content fits properly
- [ ] Spacing looks balanced

**Issues Found:**

```
[Document any layout bugs here]
```

---

## Orientation Testing

### Portrait → Landscape

**iPhone:**

- [ ] Layout adjusts to landscape width
- [ ] Widgets resize appropriately
- [ ] Text remains readable
- [ ] No horizontal scrolling
- [ ] Header adjusts correctly

**iPad:**

- [ ] 2-column layout maintains
- [ ] Widgets resize for landscape
- [ ] Columns remain equal width
- [ ] Text remains readable

### Landscape → Portrait

**iPhone:**

- [ ] Layout adjusts to portrait
- [ ] Widgets resize correctly
- [ ] No content loss

**iPad:**

- [ ] Layout adjusts correctly
- [ ] Widgets maintain proportions
- [ ] Multi-column works

**Issues Found:**

```
[Document any orientation issues here]
```

---

## Edit Mode Testing

### All Devices

- [ ] Edit button visible in header
- [ ] Edit button shows "Done" when active
- [ ] Reset button appears in edit mode
- [ ] Blue border visible on all widgets
- [ ] Reorder controls (▲/▼) visible on each widget
- [ ] Controls positioned correctly (top-right)
- [ ] Controls don't overlap widget content
- [ ] First widget: Up button disabled
- [ ] Last widget: Down button disabled

**Issues Found:**

```
[Document any edit mode issues here]
```

---

## Common Issues to Watch For

### Text Overflow

- [ ] Long account numbers wrap or truncate
- [ ] Long widget titles don't overflow
- [ ] Subtitle text fits on one line or wraps

### Layout Issues

- [ ] Widgets don't exceed screen width
- [ ] No horizontal scrolling
- [ ] Edit mode borders don't cause overflow
- [ ] Multi-column widgets align correctly

### Spacing Issues

- [ ] Consistent padding on all devices
- [ ] Widget spacing uniform
- [ ] Header buttons don't overflow on small screens
- [ ] Bottom padding allows full widget visibility

### Performance

- [ ] Smooth scrolling with 3+ widgets
- [ ] Smooth scrolling with 10+ widgets
- [ ] No lag when switching orientations
- [ ] Fast response to touch gestures

---

## Test Results Summary

**Date:** ******\_\_\_******  
**Tester:** ******\_\_\_******  
**Environment:** [iOS Simulator / Android Emulator / Physical Device]

### Overall Status

- [ ] All tests passed
- [ ] Issues found (see below)
- [ ] Requires fixes

### Critical Issues

```
[List critical issues that must be fixed]
```

### Non-Critical Issues

```
[List non-critical issues that can be addressed later]
```

### Recommendations

```
[Any recommendations for improvements]
```

---

**For detailed testing instructions, see:** [WIDGET_RESPONSIVE_TEST.md](WIDGET_RESPONSIVE_TEST.md)
