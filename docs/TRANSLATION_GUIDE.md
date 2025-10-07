# Translation Management Guide

## Overview

This project uses Next.js internationalization (i18n) with `next-intl` for handling translations. All translations are centrally managed in the `/src/messages/` directory.

## Translation System Architecture

### Message Files Structure
```
/src/messages/
├── en.json  # English translations
└── ne.json  # Nepali translations
```

### Configuration Files
- `/src/i18n/config.ts` - i18n configuration
- `/src/i18n/request.ts` - Request configuration that loads messages
- `/src/i18n/routing.ts` - Routing configuration

## Domain-Specific Translations

### Current Domains
1. **HR (Human Resources)** - `hr.*`
2. **Notices** - `notices.*`
3. **Content Management** - `content.*`
4. **Navigation** - `navigation.*`
5. **Header/Footer** - `header.*`, `footer.*`
6. **Common** - `common.*`

### Translation Key Structure

```json
{
  "hr": {
    "title": "Official and Staff",
    "loading": "Loading...",
    "filters": {
      "allPositions": "All Positions",
      "enterCustom": "Enter custom"
    },
    "employees": {
      "name": "Name",
      "phone": "Phone",
      "department": "Department"
    }
  }
}
```

## Usage Patterns

### Basic Translation Usage
```tsx
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('hr'); // Domain-specific
  return <h1>{t('title')}</h1>; // Renders: "Official and Staff"
}
```

### Nested Key Access
```tsx
const t = useTranslations('hr');
return (
  <div>
    <h1>{t('employees.name')}</h1>
    <p>{t('filters.allPositions')}</p>
  </div>
);
```

### Safe Translation with Fallbacks
```tsx
import { safeTranslate } from '@/lib/translation-utils';

const t = useTranslations('hr');
const text = safeTranslate(t, 'someKey', 'Fallback text', locale);
```

## Common Translation Issues & Solutions

### Issue 1: Missing Translation Keys
**Error**: `MISSING_MESSAGE: Could not resolve 'hr.filters.allPositions'`

**Solution**: Add the missing key to both message files:
```json
// en.json
{
  "hr": {
    "filters": {
      "allPositions": "All Positions"
    }
  }
}

// ne.json
{  
  "hr": {
    "filters": {
      "allPositions": "सबै पदहरू"
    }
  }
}
```

### Issue 2: Incorrect Namespace Usage
**Problem**: Using `useTranslations('hr')` but calling `t('hr.loading')`

**Solution**: Choose one approach:
```tsx
// Option 1: Use domain namespace
const t = useTranslations('hr');
return t('loading'); // Just 'loading', not 'hr.loading'

// Option 2: Use root namespace  
const t = useTranslations();
return t('hr.loading'); // Full path
```

### Issue 3: Mixed Translation Systems
**Problem**: Having translations in both `/src/messages/` and `/locales/`

**Solution**: Consolidate all translations in `/src/messages/` as that's what the i18n system loads.

## Best Practices

### 1. Consistent Key Naming
- Use camelCase for keys: `firstName`, `lastName`
- Use descriptive names: `noEmployeesFound` instead of `empty`
- Group related keys: `employees.name`, `employees.phone`

### 2. Fallback Strategies
```tsx
// Always provide fallbacks for optional data
const displayName = t('employees.name') || (locale === 'ne' ? 'नाम' : 'Name');
```

### 3. Error Handling
```tsx
// Wrap translation calls in try-catch for better error handling
function safeTranslate(key: string, fallback: string) {
  try {
    return t(key);
  } catch (error) {
    console.warn(`Missing translation: ${key}`);
    return fallback;
  }
}
```

### 4. Validation
- Always add translations for both locales (`en` and `ne`)
- Test all translation keys during development
- Use TypeScript for translation key validation when possible

## Adding New Translations

### Step 1: Identify the Domain
Determine which domain your translation belongs to:
- HR/Employee related → `hr.*`  
- Content/Documents → `content.*`
- Notices/Announcements → `notices.*`

### Step 2: Add to Message Files
Add the same key structure to both `en.json` and `ne.json`:

```json
// en.json
{
  "domainName": {
    "newKey": "English Translation"
  }
}

// ne.json  
{
  "domainName": {
    "newKey": "नेपाली अनुवाद"
  }
}
```

### Step 3: Use in Components
```tsx
const t = useTranslations('domainName');
return <span>{t('newKey')}</span>;
```

## Translation Key Reference

### HR Domain (`hr.*`)
- `title` - Page title
- `loading` - Loading message
- `error` - Error message  
- `noEmployees` - No employees found
- `filters.allPositions` - All positions filter
- `filters.enterCustom` - Enter custom position
- `employees.name` - Employee name
- `employees.phone` - Employee phone
- `employees.department` - Employee department

### Notices Domain (`notices.*`)
- `title` - Notices page title
- `loading` - Loading notices
- `error` - Error loading notices
- `noNotices` - No notices found
- `filtersTitle` - Filters section title

### Content Domain (`content.*`)
- `title` - Content page title
- `loading` - Loading content
- `publishedOn` - Published date label
- `attachments` - Attachments label

## Troubleshooting

### Debug Translation Issues
1. Check browser console for missing key warnings
2. Verify key exists in both `en.json` and `ne.json`
3. Ensure correct namespace usage in `useTranslations()`
4. Check for typos in key names
5. Restart development server after adding new translations

### Performance Considerations
- All translations are loaded at build time
- Large translation files may impact bundle size
- Consider lazy loading for rarely used translations

## Migration Notes

If you have existing translations in `/locales/` directory:
1. Copy all translations to `/src/messages/`
2. Update component imports to use main message system
3. Remove `/locales/` directory
4. Update any custom i18n configuration

This ensures consistency and proper loading of all translations.
