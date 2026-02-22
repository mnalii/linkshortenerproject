---
description: Read this before implementing or modifying server actions in the project.
---

# Server Actions Guidelines

## Overview

All data mutations in this application **MUST** be performed via server actions. This ensures type-safe, secure, and validated data operations.

## Core Rules

### 1. Server Actions Only for Mutations

- **ALL** data mutations (create, update, delete) must be done via server actions
- **NEVER** perform direct database writes from client components or route handlers
- Server actions provide built-in security and type safety for mutations

### 2. File Naming and Collocation

- Server action files **MUST** be named `actions.ts`
- Actions must be colocated in the **same directory** as the components that call them
- Example: If `app/dashboard/links/link-form.tsx` needs actions, create `app/dashboard/links/actions.ts`

### 3. Client Component Requirement

- Server actions **MUST** be called from client components
- Use `"use client"` directive in components that invoke server actions
- Server actions themselves should use `"use server"` directive

### 4. Type Safety

- **ALL** data passed to server actions must have appropriate TypeScript types
- **DO NOT** use the `FormData` TypeScript type
- Define explicit interfaces or types for action parameters
- Example:

  ```typescript
  interface CreateLinkInput {
    url: string;
    slug?: string;
    expiresAt?: Date;
  }

  export async function createLink(data: CreateLinkInput) {
    // ...
  }
  ```

### 5. Validation with Zod

- **ALL** data passed to server actions **MUST** be validated using Zod
- Define Zod schemas for each action's input
- Validate at the start of every server action
- Example:

  ```typescript
  import { z } from "zod";

  const createLinkSchema = z.object({
    url: z.string().url(),
    slug: z.string().optional(),
    expiresAt: z.date().optional(),
  });

  export async function createLink(data: CreateLinkInput) {
    const validated = createLinkSchema.parse(data);
    // ...
  }
  ```

### 6. Authentication Check

- **ALL** server actions **MUST** check for a logged-in user before proceeding
- Use Clerk's `auth()` helper to get the current user
- Return an error object if no user is authenticated (do not throw)
- Example:

  ```typescript
  import { auth } from "@clerk/nextjs/server";

  export async function createLink(data: CreateLinkInput) {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    // ...
  }
  ```

### 7. Error Handling

- Server actions **MUST NOT** throw errors
- **ALWAYS** return an object with `success` and either `data` or `error` properties
- Wrap all logic in try-catch blocks and return structured responses
- This ensures consistent error handling in client components
- Example:

  ```typescript
  export async function myAction(data: ActionInput) {
    try {
      // ... validation and logic
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  ```

### 8. Database Operations via Helper Functions

- **NEVER** use Drizzle queries directly in server actions
- Database operations **MUST** be done via helper functions in the `/data` directory
- Server actions should call these helper functions, not perform queries themselves
- Example:

  ```typescript
  // ❌ WRONG - Direct Drizzle query in action
  export async function createLink(data: CreateLinkInput) {
    const { userId } = await auth();
    const validated = createLinkSchema.parse(data);
    await db.insert(links).values({ ...validated, userId });
  }

  // ✅ CORRECT - Use helper function
  export async function createLink(data: CreateLinkInput) {
    const { userId } = await auth();
    const validated = createLinkSchema.parse(data);
    await createLinkInDb({ ...validated, userId });
  }
  ```

## Implementation Checklist

When creating or modifying server actions:

- [ ] File is named `actions.ts` and colocated with calling component
- [ ] `"use server"` directive is at the top of the file
- [ ] Called from a client component with `"use client"` directive
- [ ] Explicit TypeScript types defined (no `FormData` type)
- [ ] Zod schema created and validation implemented
- [ ] Authentication check using `auth()` from Clerk
- [ ] Database operations delegated to helper functions in `/data` directory
- [ ] Returns `{ success, data/error }` object (never throws errors)
- [ ] All logic wrapped in try-catch block

## Standard Server Action Template

```typescript
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Define input type
interface ActionInput {
  field1: string;
  field2: number;
}

// Define Zod schema
const actionSchema = z.object({
  field1: z.string().min(1),
  field2: z.number().positive(),
});

export async function myAction(data: ActionInput) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Validate input
    const validated = actionSchema.parse(data);

    // 3. Call helper function from /data directory
    const result = await performDatabaseOperation({ ...validated, userId });

    // 4. Revalidate if needed
    revalidatePath("/dashboard");

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Common Patterns

### Handling Validation Errors

Use Zod's `safeParse` for better error messages:

```typescript
export async function myAction(data: ActionInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const result = actionSchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: result.error.flatten().fieldErrors };
    }

    const dbResult = await performDatabaseOperation({ ...result.data, userId });
    return { success: true, data: dbResult };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Revalidation

Always revalidate relevant paths after mutations:

```typescript
import { revalidatePath } from "next/cache";

export async function updateLink(data: UpdateLinkInput) {
  // ... mutation logic
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/links/${linkId}`);
}
```
