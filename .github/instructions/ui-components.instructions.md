---
description: Read this before implementing or modifying UI components in the project.
---

# UI Components Guidelines

## Overview

All UI elements in this application **must** use shadcn/ui components. Custom UI components are prohibited to maintain consistency, accessibility, and code quality.

## Core Rules

### 1. Use shadcn/ui Exclusively

- **Always** use shadcn/ui components for all UI elements
- **Never** create custom button, input, dialog, or form components
- **Never** write custom UI component logic when a shadcn/ui equivalent exists

### 2. Component Installation

When you need a component that isn't installed:

```bash
npx shadcn@latest add [component-name]
```

Common components:

- `button` - All buttons and clickable actions
- `input` - Text inputs and form fields
- `dialog` - Modals and popups
- `card` - Content containers
- `form` - Form handling with React Hook Form
- `table` - Data tables
- `dropdown-menu` - Dropdown menus
- `select` - Select inputs
- `toast` - Notifications

### 3. Component Composition

Build complex UI by **composing** shadcn/ui primitives:

```tsx
// ✅ CORRECT - Compose shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LinkCard() {
  return (
    <Card>
      <CardHeader>Link Details</CardHeader>
      <CardContent>
        <Button>Copy Link</Button>
      </CardContent>
    </Card>
  );
}

// ❌ WRONG - Don't create custom button
export function CustomButton() {
  return <button className="custom-btn">Click</button>;
}
```

### 4. Customization

Customize shadcn/ui components through:

1. **className prop** - Add Tailwind classes
2. **variant prop** - Use built-in variants
3. **Component modification** - Edit the component file in `/components/ui/` if needed

```tsx
// ✅ CORRECT - Customize with className and variant
<Button variant="outline" className="w-full bg-blue-500">
  Create Link
</Button>
```

### 5. Available Component Categories

**Forms**

- Button, Input, Textarea, Select, Checkbox, Radio, Switch, Label

**Layout**

- Card, Separator, Tabs, Accordion, Collapsible

**Overlay**

- Dialog, Sheet, Popover, Tooltip, Alert Dialog

**Feedback**

- Toast, Alert, Progress, Skeleton

**Data Display**

- Table, Badge, Avatar, Calendar

## Common Patterns

### Form with Validation

```tsx
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";

// Use shadcn's form component with React Hook Form
```

### Modal Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Always use shadcn Dialog, never custom modals
```

### Loading States

```tsx
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Submit
</Button>;
```

## Component Location

- **shadcn components**: `/components/ui/`
- **Custom logic**: Create in `/components/` but must use shadcn UI primitives
- **Icons**: Use Lucide React (pre-installed with shadcn)

## Reference

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Component Examples](https://ui.shadcn.com/examples)
- Project components config: `components.json`

## Enforcement

Before creating any UI element, ask:

1. Does shadcn/ui have this component? → Use it
2. Can I compose existing components? → Compose them
3. Do I need to install a new component? → Install it

**Never build from scratch what shadcn/ui already provides.**

---

**Last Updated**: February 15, 2026
