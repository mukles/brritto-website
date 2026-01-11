---
description: Project architecture, folder structure, and styling conventions for Brritto
---

# Brritto - Architecture & Setup

> Part 1 of 3: Project structure, styling conventions, and technical setup

## Project Overview

- **Name:** Brritto (inno-brritto-web)
- **Type:** Next.js 16 (App Router) education platform
- **Framework:** React 19, TypeScript
- **Package Manager:** pnpm
- **Styling:** Tailwind CSS v4 (exclusively)

## Folder Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── _components/        # Home page components (co-located)
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── CourseExplorerSection.tsx
│   │   └── ContactSection.tsx
│   ├── (auth)/             # Authentication pages (login, signup)
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/             # Main content group
│   │   └── blog/           # Blog pages
│   │       └── _components/  # Blog components (co-located)
│   ├── api/                # API routes
│   ├── checkout/           # Payment checkout flow
│   │   └── [courseId]/
│   ├── courses/            # Course pages
│   │   ├── _components/    # Course components (co-located)
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseExplorer.tsx
│   │   │   └── ClassTabs.tsx
│   │   ├── [classSlug]/
│   │   └── details/
│   ├── payment/            # Payment status pages
│   │   └── status/
│   ├── layout.tsx          # Root layout with PWA
│   └── page.tsx            # Home page
├── components/             # SHARED React components only
│   ├── auth/               # Auth components (OtpInput, PhoneInput, etc.)
│   ├── layout/             # Layout components (Header, Footer)
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── SelectInput.tsx
│       └── SearchableSelect.tsx
├── config/                 # Configuration files
├── content/                # Static content & metadata
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions & services
│   ├── api-client.ts
│   ├── session.ts
│   ├── server/             # Server Actions
│   │   ├── auth-service.ts
│   │   ├── student-service.ts
│   │   ├── register-service.ts
│   │   ├── course-service.ts
│   │   └── payment-service.ts
│   └── validators/         # Form validators
├── styles/                 # CSS stylesheets
├── types/                  # TypeScript type definitions
└── middleware.ts           # Route protection & profile guard
```

### Co-located \_components Pattern

**IMPORTANT:** Page-specific components should be placed in `_components/` folders next to their pages:

```
src/app/courses/
├── _components/           # Components ONLY used by courses pages
│   ├── CourseCard.tsx
│   └── CourseExplorer.tsx
├── page.tsx               # Imports from ./_components/
└── [classSlug]/
    └── page.tsx           # Imports from ../_components/
```

**When to use `_components/`:**

- Component is ONLY used by pages in that route
- Keeps related code co-located

**When to use `src/components/`:**

- Component is shared across multiple routes (Header, Footer)
- Reusable UI primitives (Button, Input, Card)

## Styling Conventions

### IMPORTANT: Use Tailwind CSS Exclusively

- **Primary styling:** Use Tailwind CSS v4 classes directly in JSX
- **Avoid:** Creating new custom CSS files unless absolutely necessary
- **Custom CSS location:** `src/styles/components/` (only for complex animations)
- **Variables:** Defined in `src/styles/base/variables.css`
- **Configuration:** `tailwind.config.ts` with custom brand colors and spacing

### Color Palette

**Brand Colors (Purple theme):**
| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Primary | `#852DFE` | `brand-primary` | Primary buttons, accents |
| Primary Hover | `#7A29E6` | `brand-primary-hover` | Hover states |
| Primary Light | `#9F4FFF` | `brand-primary-light` | Light accents |
| Primary Dark | `#6B1FD1` | `brand-primary-dark` | Dark accents |

**Accent Colors:**
| Color | Hex | Usage |
|-------|-----|-------|
| Pink | `#EC4899` | Secondary accents, gradients |
| Cyan | `#06B6D4` | Highlights |
| Indigo | `#6366F1` | Alternative accents |

**Built-in Tailwind Classes:**

- Purple gradient: `from-purple-600 to-fuchsia-600`
- Text gradients: `bg-gradient-to-r bg-clip-text text-transparent`
- Theme color: `#7C3AED` (purple-600)

### Typography

- **Font:** Inter (Google Fonts via Geist)
- **Font variables:** `--font-geist-sans`, `--font-geist-mono`
- **Custom font sizes:** Defined in `tailwind.config.ts`

### Button Styles

**Primary Button:**

```jsx
className =
  "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl px-8 py-4 font-semibold shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300";
```

**Secondary Button:**

```jsx
className =
  "bg-white border-2 border-purple-300 text-purple-700 rounded-xl px-8 py-4 font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all duration-300";
```

## Component Patterns

### Server Components (Default)

- Pages and layouts are Server Components by default
- Use for static content and data fetching
- Course pages, checkout pages use Server Components

### Client Components

- Add `'use client'` directive for interactive components
- Use for forms, state management, event handlers
- Examples: Auth forms, SearchableSelect, CourseExplorer

### Server Actions

- Located in `src/lib/server/` with `'use server'` directive
- Used for API calls to keep endpoints hidden from client
- Services:
  - `auth-service.ts` - OTP, login, logout, token refresh
  - `student-service.ts` - Profile fetch and update
  - `register-service.ts` - Student registration, institution/class lookup
  - `course-service.ts` - Course listing and details
  - `payment-service.ts` - Payment initiation (bKash, Aamarpay)

## Environment Variables

```env
# Server-side only (NOT exposed to client)
API_BASE_URL=http://localhost:3001
SESSION_COOKIE_NAME=brritto_session
SESSION_MAX_AGE=86400
```

## Type Safety

All types centralized in `src/types/`:

- `auth.ts` - Authentication, registration, student profile
- `courses.ts` - Courses, classes, API responses
- `api.ts` - Generic API response types
- `contact.ts` - Contact form types
- `navigation.ts` - Navigation types
- `pwa.ts` - PWA types

## PWA Support

- **Manifest:** `/public/manifest.json`
- **Icons:** `/public/icons/` (72x72 to 512x512)
- **Service Worker:** Configured via `next-pwa`
- **Utilities:** `src/lib/pwa.ts` and `src/lib/usePWA.ts`
- **Components:** `PWAStatus.tsx`, `OfflineIndicator.tsx`
- **Features:** Installable, offline support, app-like experience

## Testing & Code Quality

**Testing:**

- Framework: Jest with React Testing Library
- Config: `jest.config.js`, `jest.setup.js`
- Commands: `pnpm test`, `pnpm test:watch`

**Code Quality:**

- Linting: ESLint with Next.js config
- Formatting: Prettier with custom config
- Commands: `pnpm lint`, `pnpm format`, `pnpm format:check`

## Build & Deployment

- **Dev:** `pnpm dev` - Start development server
- **Build:** `pnpm build` - Create production build
- **Start:** `pnpm start` - Start production server
- **Note:** Ensure all environment variables are set in `.env.local`
