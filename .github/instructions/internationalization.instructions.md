---
description: Read this before implementing or modifying internationalization (i18n) in the project.
---

# Internationalization (i18n) Guidelines

## Overview

This application supports multiple languages and must never have hard-coded copy text. All user-facing strings must be internationalized to support seamless language switching.

## Supported Languages

The application currently supports:

- **English** (`en`) - Default
- **Spanish** (`es`)
- **Chinese** (`zh`)
- **Thai** (`th`)
- **Indonesian** (`id`)

## Core Rules

### 1. No Hard-Coded Text

- **NEVER** hard-code user-facing strings directly in components
- **ALWAYS** use translation keys and the i18n system
- All UI text, labels, buttons, error messages, and notifications must be translatable

### 2. i18n Library

- Use **next-intl** for Next.js App Router internationalization
- Leverage server-side translations for React Server Components
- Use client-side hooks only when necessary for Client Components

### 3. Translation Files Structure

```
/messages/
  en.json      # English translations
  es.json      # Spanish translations
  zh.json      # Chinese translations
  th.json      # Thai translations
  id.json      # Indonesian translations
```

### 4. Locale Management

- Store user's language preference in cookies or database
- Provide a language switcher component in the UI
- Default to English (`en`) if no preference is set
- Detect browser language on first visit (optional)

## Implementation Checklist

When adding or modifying UI text:

- [ ] Extract all hard-coded strings to translation files
- [ ] Add translation keys in all supported language files
- [ ] Use `useTranslations()` hook in Client Components
- [ ] Use `getTranslations()` in Server Components
- [ ] Test with multiple languages to ensure layout compatibility
- [ ] Consider text expansion (some languages require more space)

## Common Patterns

### Server Component Translation

```typescript
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### Client Component Translation

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function WelcomeButton() {
  const t = useTranslations('Common');

  return <button>{t('welcome')}</button>;
}
```

### Translation File Example

**messages/en.json:**

```json
{
  "HomePage": {
    "title": "Welcome to Link Shortener",
    "description": "Shorten your links with ease"
  },
  "Common": {
    "welcome": "Welcome",
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

### Language Switcher Component

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    // Update locale in cookies or URL
    router.push(`/${newLocale}`);
  };

  return (
    <select value={locale} onChange={(e) => handleChange(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="zh">中文</option>
      <option value="th">ไทย</option>
      <option value="id">Indonesia</option>
    </select>
  );
}
```

## URL Structure

Use locale-based routing:

- `/en/dashboard` - English dashboard
- `/es/dashboard` - Spanish dashboard
- `/zh/dashboard` - Chinese dashboard
- `/th/dashboard` - Thai dashboard
- `/id/dashboard` - Indonesian dashboard

**OR** use a subdomain/cookie approach if URL-based routing is not desired.

## Configuration

### next.config.ts

```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
```

### i18n.ts (Root Configuration)

```typescript
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

## Best Practices

1. **Organize by Feature**: Group translations by page or feature (e.g., `Dashboard`, `Auth`, `Common`)
2. **Use Nested Keys**: Structure complex translations with nested objects
3. **Pluralization**: Use next-intl's plural handling for count-based strings
4. **Variables**: Support dynamic values in translations using `{variable}` syntax
5. **RTL Support**: Consider right-to-left languages if adding Arabic, Hebrew, etc.
6. **Date/Time**: Use `Intl.DateTimeFormat` for locale-aware date formatting
7. **Numbers/Currency**: Use `Intl.NumberFormat` for locale-aware number formatting

## Testing

- Test all pages in each supported language
- Verify language switcher updates UI immediately
- Check that long translations don't break layouts
- Ensure fallback to English works if a translation is missing

## Maintenance

- Keep all translation files in sync with the same keys
- Document missing translations clearly (use `TODO` markers)
- Have native speakers review translations for accuracy
- Update translations when adding new features

---

**Last Updated**: February 16, 2026
