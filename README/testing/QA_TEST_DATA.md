# QA Test Data - Quick Reference

This document provides ready-to-use test data for QA test execution. Copy and paste these values directly into the app during testing.

---

## Test Accounts

### Standard Test Account 1

- **Account Name:** `Test Checking Account`
- **Account Number:** `1234567890`

### Standard Test Account 2

- **Account Name:** `Savings Account`
- **Account Number:** `0987654321`

### Standard Test Account 3

- **Account Name:** `Business Account`
- **Account Number:** `5555555555`

---

## Validation Test Data

### Empty Values

- **Account Name:** (leave empty)
- **Account Number:** (leave empty)

### Whitespace Test

- **Account Name:** `Test Account` (with leading/trailing spaces)
- **Account Number:** `1234567890` (with leading/trailing spaces)

### Long Account Name (200+ characters)

Copy and paste this string:

```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

Or use this more realistic long name:

```
My Very Long Account Name That Exceeds Normal Limits And Should Trigger Validation Errors If There Is A Maximum Length Restriction In Place For Account Names In The Application
```

### Long Account Number (200+ characters)

Copy and paste this string:

```
11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
```

---

## Test Account Names (Various Formats)

### Short Names

- `A` (1 character - minimum length test)
- `AB` (2 characters)
- `Test` (4 characters)

### Normal Names

- `My Checking Account`
- `Primary Savings`
- `Business Checking 123`
- `Personal Account`

### Names with Special Characters

- `Account #123`
- `My-Account`
- `Account_Test`
- `Account.Test`
- `Account (Primary)`

### Duplicate Names (for TC-6)

- First account: `My Account`
- Second account: `My Account` (same name)

---

## Authentication Test Data

### Test User Credentials

- **Email:** `test@morningboard.com`
- **Password:** `TestPassword123!`

---

## How to Use This Document

1. **For Manual Testing:** Copy the exact values above and paste them into the app fields
2. **For Automated Testing:** Use these values as constants in your test scripts
3. **For Boundary Testing:** Use the long strings to test field length limits
4. **For Validation Testing:** Use empty values, whitespace, and special characters

---

## Quick Copy Strings

### 200 Character String (Account Name)

```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

### 200 Character String (Account Number)

```
11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
```

### Whitespace Test (Account Name)

```
  Test Account
```

### Whitespace Test (Account Number)

```
  1234567890
```

---

## Tips

- **Copy/Paste:** Use Command+C (Mac) or Ctrl+C (Windows) to copy, Command+V or Ctrl+V to paste
- **Long Strings:** For very long strings, you can paste multiple copies of a shorter string
- **Special Characters:** Test with various special characters to ensure proper validation
- **Unicode:** Test with international characters if needed (e.g., `测试账户`, `Compte Test`)

---

**Last Updated:** 2024-11-04  
**For Use With:** QA Test Plan - Bank Account Features
