# Authentication Guidelines

## Overview

All authentication in this application is handled exclusively by **Clerk**. No other authentication methods or libraries should be implemented or used.

## Core Rules

### 1. Clerk Only

- **NEVER** implement custom authentication logic
- **NEVER** use alternative auth libraries (NextAuth, Auth.js, Passport, etc.)
- All auth-related features must use Clerk's APIs and components

### 2. Protected Routes

#### Dashboard Protection

- The `/dashboard` route **MUST** require authentication
- Unauthenticated users attempting to access `/dashboard` should be redirected to sign in
- Use Clerk's middleware or `auth()` helper to protect this route

#### Homepage Behavior

- If a user is already logged in and visits the homepage (`/`), redirect them to `/dashboard`
- This prevents authenticated users from seeing the landing page unnecessarily

### 3. Sign In/Sign Up Modals

- **ALWAYS** launch Sign In and Sign Up flows as modals
- Do not use full-page redirects for authentication
- Use Clerk's modal components: `<SignIn />` and `<SignUp />` with `mode="modal"` or similar configuration
- Ensure modals can be dismissed and return users to their previous location

## Implementation Checklist

When working with authentication features:

- [ ] Verify Clerk is configured in environment variables
- [ ] Use Clerk's App Router helpers (`auth()`, `currentUser()`)
- [ ] Implement middleware for route protection
- [ ] Configure modal mode for auth components
- [ ] Test redirect behavior for authenticated/unauthenticated states
- [ ] Ensure TypeScript types from `@clerk/nextjs` are properly used

## Common Patterns

### Protecting a Route

```typescript
// In middleware or server component
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) {
  redirect("/sign-in");
}
```

### Conditional Redirects

```typescript
// Homepage redirect for authenticated users
const { userId } = await auth();
if (userId) {
  redirect("/dashboard");
}
```

### Modal Authentication

```typescript
// Use Clerk components in modal mode
<SignIn mode="modal" />
<SignUp mode="modal" />
```

## What NOT to Do

- ❌ Create custom login forms
- ❌ Store passwords or credentials
- ❌ Implement JWT handling manually
- ❌ Use session storage for auth state
- ❌ Mix Clerk with other auth solutions
- ❌ Use full-page auth flows instead of modals

---

**Last Updated**: February 15, 2026
