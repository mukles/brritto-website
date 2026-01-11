---
description: Project context, architecture, styling conventions, and development guidelines for Brritto web application
---

# Brritto - Project Documentation Index

> **IMPORTANT:** Update relevant documentation files after completing any significant new feature or task that adds new patterns, components, services, or conventions to the project.

## Documentation Structure

The project documentation is split into three focused files for better organization and readability:

### 📁 [Architecture & Setup](./architecture.md)

**What's inside:**

- Project overview and tech stack
- Folder structure and organization
- Styling conventions (Tailwind CSS v4)
- Color palette and typography
- Component patterns (Server/Client)
- Environment variables
- Type safety approach
- PWA support
- Testing & code quality setup
- Build & deployment

**When to use:** Setting up the project, understanding the structure, styling guidelines, or technical configuration.

---

### 🎯 [Features & Flows](./features.md)

**What's inside:**

- Authentication & registration flow
- OTP-based login
- Profile completion guard
- Course management (explorer, details, checkout)
- Payment integration (bKash, Aamarpay)
- Reusable UI components
- Middleware & route protection
- Content management

**When to use:** Understanding user flows, implementing features, working with authentication, courses, or payments.

---

### 🛠️ [Development Guide](./development-guide.md)

**What's inside:**

- API endpoints reference
- API client patterns
- Development best practices (13 key patterns)
- Code organization templates
- Common workflows (adding features, routes, components)
- Testing guidelines
- Performance optimization
- Security best practices
- Debugging tips

**When to use:** Writing code, integrating APIs, following best practices, or debugging issues.

---

## Quick Reference

**Project:** Brritto (inno-brritto-web)  
**Framework:** Next.js 16 (App Router) + React 19 + TypeScript  
**Styling:** Tailwind CSS v4 (exclusively)  
**Package Manager:** pnpm

**Key Principles:**

1. ✅ Always use Tailwind CSS for styling
2. ✅ Keep API endpoints hidden via Server Actions
3. ✅ Follow purple theme (`#852DFE`)
4. ✅ Centralize types in `src/types/`
5. ✅ Separate content from components

**Quick Commands:**

```bash
pnpm dev          # Start development server
pnpm build        # Create production build
pnpm test         # Run tests
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

---

## How to Navigate

- **New to the project?** Start with [Architecture & Setup](./architecture.md)
- **Building a feature?** Check [Features & Flows](./features.md) and [Development Guide](./development-guide.md)
- **Need API info?** Go to [Development Guide](./development-guide.md)
- **Styling questions?** See [Architecture & Setup](./architecture.md)
- **Best practices?** Review [Development Guide](./development-guide.md)
