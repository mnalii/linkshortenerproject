# Agent Instructions - Link Shortener Project

## ⚠️ CRITICAL REQUIREMENT ⚠️

**BEFORE GENERATING ANY CODE, YOU MUST:**

1. **READ the relevant documentation files in `/docs/agents/`** for the specific area you're working on
2. **FOLLOW the guidelines** specified in those files
3. **VERIFY your approach** aligns with the documented standards

**This is NOT optional. Every code generation task requires consulting the appropriate documentation first.**

---

This document serves as the master guide for AI coding agents working on this Next.js-based link shortener project. All agents must follow these instructions to ensure code quality, consistency, and maintainability.

## Project Overview

This is a **Next.js 16** link shortener application with the following tech stack:

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React

## Core Principles

1. **Type Safety First**: All code must be fully typed with TypeScript strict mode
2. **Server-First Architecture**: Leverage React Server Components by default
3. **Performance**: Optimize for speed and minimal client-side JavaScript
4. **Accessibility**: Follow WCAG 2.1 AA standards
5. **Code Quality**: Clean, maintainable, and well-documented code

## ⚠️ CRITICAL: Routing and Middleware ⚠️

**NEVER use `middleware.ts` in this project.**

- `middleware.ts` is **DEPRECATED** in Next.js 16 and later versions
- This project uses **`proxy.ts`** instead for all middleware functionality
- All route protection, authentication middleware, and internationalization routing logic belongs in `proxy.ts`
- Do NOT create or suggest creating a `middleware.ts` file under any circumstances

## Quick Reference

### File Structure

```
/app                  # Next.js App Router pages and layouts
/components           # Reusable React components
/lib                  # Utility functions and shared logic
/db                   # Database schema and queries
/public               # Static assets
/docs                 # Documentation including agent instructions
```

### Path Aliases

- `@/*` - Root directory alias (configured in tsconfig.json)

### Key Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Getting Help

**⚠️ MANDATORY FIRST STEP: Always consult the relevant documentation file BEFORE writing any code ⚠️**

When working on any task, you MUST first read the appropriate documentation:

- **Authentication**: READ [Authentication Guidelines](./docs/agents/authentication.md) FIRST
- **UI Components**: READ [UI Components Guidelines](./docs/agents/ui-components.md) FIRST
- **Internationalization**: READ [Internationalization Guidelines](./docs/agents/internationalization.md) FIRST
- **Coding standards**: READ [LLM Coding Standards](./docs/agents/llm-coding-standards.md) FIRST
- **Making changes**: READ [Migration Guidelines](./docs/agents/migration-guideline.md) FIRST
- **Testing & bugs**: READ [Patch & Testing](./docs/agents/patch-and-testing.md) FIRST

**DO NOT skip this step. DO NOT generate code without consulting these files. This is a strict requirement.**

## Version Control

- Always check file contents before making edits
- Use descriptive commit messages
- Test changes before committing
- Follow the branching strategy defined in migration guidelines

---

**Last Updated**: February 17, 2026  
**Project Version**: 0.1.0
