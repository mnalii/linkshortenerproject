# Link Shortener

> A fast, modern URL shortener built with Next.js 16, Clerk authentication, Neon PostgreSQL, and full multi-language support.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)
![Neon](https://img.shields.io/badge/DB-Neon_PostgreSQL-00e599?logo=postgresql)

---

## Overview

Link Shortener lets you turn long URLs into clean, shareable short links in seconds. Each link is tied to your account, so you can create, edit, and delete your links from a personal dashboard. The app is fully internationalized with support for five languages and resolves short links at the edge via a dedicated redirect route.

---

## Built With GitHub Copilot

This project was built by **vibe coding** using [GitHub Copilot](https://github.com/features/copilot) — AI-assisted development from architecture to implementation. The entire `.github/` directory is dedicated to shaping how Copilot understands and works within this codebase.

### Agent

A custom Copilot agent is defined in `.github/agents/` to automate the creation of instruction files:

| Agent | Description |
|---|---|
| `instruction-generator.agent.md` | Reads architecture details provided by the developer and generates a correctly formatted `.instructions.md` file, complete with frontmatter and concise rules. Equipped with `read`, `edit`, `search`, and `web` tools. |

### Instructions

Five domain-specific instruction files in `.github/instructions/` are automatically applied by Copilot when working in relevant areas of the codebase. Each file tells Copilot the rules, patterns, and anti-patterns for that layer:

| File | Scope | Key Rules |
|---|---|---|
| `authentication.instructions.md` | Auth | Clerk-only; never implement custom auth; Sign In / Sign Up must use modals; protect `/dashboard` with `auth()`; redirect authenticated users away from the homepage |
| `data-fetching.instructions.md` | Data layer | Always use Server Components for fetching; never fetch in Client Components; all DB access must go through `/data` helper functions using Drizzle ORM |
| `internationalization.instructions.md` | i18n | No hard-coded UI strings; use `next-intl` with `getTranslations()` (server) and `useTranslations()` (client); keep all five locale files in sync |
| `server-actions.instructions.md` | Mutations | All writes via Server Actions in colocated `actions.ts` files; mandatory Zod validation; auth check via `auth()` on every action; never throw — always return `{ success, data \| error }`; delegate DB calls to `/data` helpers |
| `ui-components.instructions.md` | UI | shadcn/ui exclusively; never write custom button/input/dialog components; install missing components with `npx shadcn@latest add`; customise via `className` and `variant` props only |

### Prompts

Two reusable prompt files in `.github/prompts/` let you generate new Copilot configuration files on demand:

| File | What it does |
|---|---|
| `create-copilot-instructions.prompt.md` | Takes architecture or coding-standard details and scaffolds a new `.instructions.md` file in `.github/instructions/` with proper frontmatter and concise rules — delegates to the **Instructions Generator** agent |
| `create-instructions.prompt.md` | Generates a new agent-instructions `.md` file and automatically updates `AGENTS.md` to reference it — also delegates to the **Instructions Generator** agent |

### AGENTS.md

The root [`AGENTS.md`](AGENTS.md) acts as the master context file for all AI agents. It documents the project overview, tech stack, critical rules (e.g. never use `middleware.ts` — use `proxy.ts` instead in Next.js 16), folder structure, path aliases, and key commands. Every agent reads this file before taking action.

---

## Screenshots

<table>
  <tr>
    <td align="center">
      <strong>Home Page</strong><br/>
      <img src="public/screenshots/home.png" alt="Home page — hero and features grid" width="480"/>
    </td>
    <td align="center">
      <strong>Dashboard — Links List</strong><br/>
      <img src="public/screenshots/dashboard.png" alt="Dashboard with link cards" width="480"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Create Link Dialog</strong><br/>
      <img src="public/screenshots/create.png" alt="Create link dialog" width="480"/>
    </td>
    <td align="center">
      <strong>Delete Link Dialog</strong><br/>
      <img src="public/screenshots/delete.png" alt="Delete link confirmation dialog" width="480"/>
    </td>
  </tr>
</table>

---

## Features

- **Custom short codes** — auto-generated 6-character codes or your own slug (3–32 chars, alphanumeric, hyphens, underscores)
- **Instant redirects** — `/r/[shortCode]` resolves and redirects at the server edge
- **Personal dashboard** — create, edit, and delete your own links
- **Clerk authentication** — sign-up / sign-in with modal flows; all dashboard routes are auth-protected
- **Multi-language UI** — English, Español, 中文, ภาษาไทย, Bahasa Indonesia (switchable from the header without reloading)
- **Dark mode by default** — system-level `dark` class applied on the root layout
- **Type-safe forms** — react-hook-form + Zod validation throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16.1.6](https://nextjs.org) (App Router, React 19) |
| Language | TypeScript 5 — strict mode |
| Styling | Tailwind CSS v4 + tw-animate-css |
| Authentication | [Clerk](https://clerk.com) (`@clerk/nextjs` v6) |
| Database | [Neon](https://neon.tech) PostgreSQL (serverless) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) v0.45 |
| Internationalization | [next-intl](https://next-intl.dev) v4 |
| UI Components | [Radix UI](https://www.radix-ui.com) + [shadcn/ui](https://ui.shadcn.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Forms | react-hook-form + Zod + @hookform/resolvers |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Clerk](https://clerk.com) account (free tier works)
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/mnalii/linkshortenerproject.git
cd linkshortenerproject
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local   # if .env.example exists, otherwise create manually
```

Populate it with the values described in the [Environment Variables](#environment-variables) section below.

### 4. Set up the database

```bash
# Generate migration files from the schema
npm run db:generate

# Apply migrations to your Neon database
npm run db:migrate
```

> For rapid local prototyping you can use `npm run db:push` instead, which pushes the schema directly without generating migration files.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app. It redirects to `/en` automatically.

---

## Environment Variables

Create a `.env.local` file at the project root with the following keys:

| Variable | Description | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (frontend) | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side) | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in redirect URL | Set to `/en/sign-in` or leave modal-based (omit for modals) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up redirect URL | Set to `/en/sign-up` or leave modal-based (omit for modals) |
| `DATABASE_URL` | Neon PostgreSQL connection string | [Neon Console](https://console.neon.tech) → your project → Connection Details |

**Example `.env.local`:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## Project Structure

```
linkshortenerproject/
├── app/
│   ├── layout.tsx              # Root layout (pass-through)
│   ├── page.tsx                # Root redirect → /en
│   ├── [locale]/               # Locale-scoped app shell
│   │   ├── layout.tsx          # ClerkProvider, NextIntlClientProvider, Header
│   │   ├── page.tsx            # Home / landing page
│   │   └── dashboard/
│   │       ├── page.tsx        # Dashboard (auth-protected)
│   │       ├── actions.ts      # Server Actions: create, update, delete link
│   │       ├── link-card.tsx   # Individual link card component
│   │       ├── create-link-dialog.tsx
│   │       ├── edit-link-dialog.tsx
│   │       └── delete-link-dialog.tsx
│   └── r/
│       └── [shortCode]/
│           └── route.ts        # Redirect handler for short links
├── components/
│   ├── header.tsx              # App header with logo, locale switcher, auth buttons
│   └── ui/                     # shadcn/ui primitives (button, dialog, form, …)
├── data/
│   └── links.ts                # Data access layer (get, create, update, delete)
├── db/
│   ├── index.ts                # Drizzle client (Neon serverless)
│   └── schema.ts               # links table schema
├── messages/                   # i18n translation files
│   ├── en.json
│   ├── es.json
│   ├── zh.json
│   ├── th.json
│   └── id.json
├── lib/
│   └── utils.ts                # cn() helper and shared utilities
├── proxy.ts                    # Clerk + next-intl middleware (replaces middleware.ts)
├── routing.ts                  # Locale routing config
└── drizzle/                    # Auto-generated migration SQL files
```

---

## Internationalization

The app supports five locales out of the box:

| Code | Language |
|---|---|
| `en` | English (default) |
| `es` | Español |
| `zh` | 中文 |
| `th` | ภาษาไทย |
| `id` | Bahasa Indonesia |

All routes are prefixed with the locale: `/{locale}/dashboard`, `/{locale}/`, etc. Visiting `/` redirects to `/en`. Users can switch languages from the header dropdown — the locale is swapped in the URL without a full page reload.

For full i18n implementation details, see [I18N_README.md](I18N_README.md).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server at `http://localhost:3000` |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the project |
| `npm run db:generate` | Generate Drizzle migration files from the schema |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:push` | Push schema changes directly (dev shortcut, no migration files) |
| `npm run db:studio` | Open Drizzle Studio — a GUI for browsing your database |

---

## How Short Link Redirection Works

When a user visits `/{shortCode}` (actually `/r/{shortCode}`), the Next.js Route Handler in `app/r/[shortCode]/route.ts` looks up the code in the database and issues a `307 Temporary Redirect` to the original URL. If the code is not found, the user is sent to the home page.

---

## Deploy on Vercel

1. Push your repository to GitHub.
2. Import the project in the [Vercel dashboard](https://vercel.com/new).
3. Add all environment variables from the [Environment Variables](#environment-variables) section in the Vercel project settings.
4. Deploy — Vercel auto-detects Next.js and configures the build pipeline.

---

## License

This project is for personal and educational use.


