# Brritto Web - Architecture Refactoring

**Date**: December 22, 2025  
**Project**: Brritto Learning Platform  
**Version**: 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Refactoring](#architecture-refactoring)
3. [Build Verification](#build-verification)
4. [Developer Guide](#developer-guide)
5. [Maintenance](#maintenance)

---

## Overview

This document outlines the major refactoring completed for the Brritto web application.

**Architecture Refactoring**: Restructured the project to follow Next.js best practices with `src/` folder organization

---

## Architecture Refactoring

### Project Structure

The project was reorganized from a flat structure to a well-organized `src/` based architecture:

```
/Users/ashikjs/Documents/codes/inno-brritto-web/
├── src/
│   ├── app/                    # Next.js App Router (Pages Only)
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout
│   │   └── favicon.ico
│   │
│   ├── components/             # All React Components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── sections/           # Page sections
│   │   │   ├── HeroSection.tsx
│   │   │   └── FeaturesSection.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── ContactSection.tsx
│   │   ├── OfflineIndicator.tsx
│   │   └── PWAStatus.tsx
│   │
│   ├── content/                # 📦 Single Source of Truth
│   │   ├── home.ts             # Hero & features content
│   │   ├── features.tsx        # Features data with icons
│   │   ├── metadata.ts         # SEO metadata
│   │   └── navigation.ts       # Navigation items
│   │
│   ├── config/                 # Configuration
│   │   └── contact.ts          # Contact info & functions
│   │
│   ├── lib/                    # Utilities & Helpers
│   │   ├── contact.ts
│   │   ├── navigation.ts
│   │   ├── pwa.ts
│   │   ├── usePWA.ts
│   │   └── validation.ts
│   │
│   ├── types/                  # TypeScript Type Definitions
│   │   ├── index.ts
│   │   ├── contact.ts
│   │   ├── header.ts
│   │   └── navigation.ts
│   │
│   └── styles/                 # Global Styles
│       └── globals.css
│
├── public/                     # Static Assets
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

### Key Changes

#### 1. Content Separation (Single Source of Truth)

All hardcoded content was extracted into dedicated content files:

**`src/content/home.ts`**:

```typescript
export const homeContent = {
  hero: {
    badge: "Live Learning Platform - Enroll Today",
    title: "Master Your Skills with",
    brandName: "Brritto",
    subtitle: "Your ultimate learning platform...",
    primaryCTA: { text: "Start Learning Now", href: "/explore" },
    secondaryCTA: { text: "Browse Courses", href: "/courses" },
    stats: [
      { value: "100+", label: "Courses" },
      { value: "50+", label: "Books" },
      { value: "300K+", label: "Learners" },
    ],
  },
  features: {
    badge: "Platform Features",
    title: "Everything You Need to",
    titleAccent: "Excel",
    subtitle: "Comprehensive learning tools...",
  },
};
```

**Benefits**:

- ✅ Change content without touching code
- ✅ Easy for non-developers to update
- ✅ Type-safe with TypeScript
- ✅ Reusable across pages

#### 2. Path Aliases

Updated `tsconfig.json` with clean import paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/content/*": ["./src/content/*"],
      "@/config/*": ["./src/config/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  }
}
```

**Usage**:

```typescript
// Before
import Header from "../../../../components/Header";

// After
import Header from "@/components/layout/Header";
import { homeContent } from "@/content/home";
```

#### 3. Next.js Metadata Best Practices

**`src/content/metadata.ts`**:

```typescript
export const siteConfig = {
  name: "Brritto",
  title: "Brritto - Master Your Skills",
  description: "Your ultimate learning platform...",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://brritto.com",
  keywords: ["education", "courses", "books", "learning"],
  themeColor: "#7C3AED",
};

export const baseMetadata: Metadata = {
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    /* ... */
  },
  twitter: {
    /* ... */
  },
};
```

**`src/app/layout.tsx`**:

```typescript
import { baseMetadata } from "@/content/metadata";

export const metadata: Metadata = baseMetadata;
```

#### 4. Clean Page Implementation

**Before** (145 lines with hardcoded data):

```tsx
export default function Home() {
  const features = [
    /* 43 lines of data */
  ];
  return (
    <div>
      <section> {/* 50+ lines inline */} </section>
      <section> {/* 40+ lines inline */} </section>
    </div>
  );
}
```

**After** (52 lines, 60% reduction):

```tsx
import { homeContent } from "@/content/home";
import { features } from "@/content/features";
import HeroSection from "@/components/sections/HeroSection";

export default function HomePage() {
  return (
    <div>
      <Header />
      <HeroSection {...homeContent.hero} />
      <FeaturesSection features={features} />
      <ContactSection />
      <Footer />
    </div>
  );
}
```

---

---

## Build Verification

### Build Output

```bash
$ pnpm build

▲ Next.js 16.1.0 (Turbopack)

Creating an optimized production build ...
✓ Compiled successfully in 1038.9ms
✓ Finished TypeScript in 1009.1ms
✓ Generating static pages (5/5) in 163.8ms
✓ Finalizing page optimization in 8.4ms

Route (app)
┌ ○ /                    # Static Site Generation ✓
├ ○ /_not-found
└ ƒ /api/contact

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

**Status**: ✅ **BUILD SUCCESSFUL**

### Performance Metrics

- **Build Time**: < 2 seconds
- **Static Generation**: Working perfectly
- **Type Safety**: No TypeScript errors

---

## Developer Guide

### Adding Content

**To update homepage content**:

1. Edit `src/content/home.ts`:

```typescript
export const homeContent = {
  hero: {
    title: "New Title",
    subtitle: "New subtitle...",
  },
};
```

2. Changes automatically reflect in the UI

### Creating New Content Files

1. Create file in `src/content/`:

```typescript
// src/content/about.ts
export const aboutContent = {
  title: "About Us",
  description: "...",
};
```

2. Import in page:

```tsx
import { aboutContent } from "@/content/about";
```

---

## Maintenance

### Updating Dependencies

```bash
# Check for updates
pnpm outdated

# Update all dependencies
pnpm update
```

### Adding New Pages

1. Create content file in `src/content/`
2. Create page component in `src/app/`
3. Import content and compose page
4. Run `pnpm build` to verify

### Troubleshooting

#### Import Path Not Working

**Issue**: `@/components/*` not resolving  
**Solution**: Check `tsconfig.json` paths are correct and restart TS server

#### Build Errors

**Issue**: TypeScript errors during build  
**Solution**: Run `pnpm build` locally and fix type errors

---

## Summary

### What Was Accomplished

#### Architecture ✅

- [x] Implemented `src/` folder structure
- [x] Separated content from code (single source of truth)
- [x] Added path aliases for clean imports
- [x] Configured Next.js metadata best practices
- [x] Created reusable component system
- [x] Organized components by purpose

### Benefits Achieved

1. **Better Organization**: Clear separation of concerns
2. **Maintainability**: Easy to update content and components
3. **Developer Experience**: Clean imports, type safety
4. **Performance**: Fast build times and optimal bundle size
5. **SEO**: Proper metadata implementation
6. **Scalability**: Easy to add new pages and features

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Project Repository](file:///Users/ashikjs/Documents/codes/inno-brritto-web)

---

**Last Updated**: December 22, 2025  
**Maintained By**: Development Team  
**Status**: ✅ Production Ready
