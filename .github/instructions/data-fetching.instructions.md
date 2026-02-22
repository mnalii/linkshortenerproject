---
description: Read this file to understand how to fetch data in the project.
---

# Data Fetching Guidelines

This document outlines the best practices for fetching data in our Next.js project. Follow these guidelines to ensure consistency and maintainability across the codebase.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS using Server Components for data fetching. Never use Client Components to fetch data.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in the components.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions.
