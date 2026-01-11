---
description: Development guide - API endpoints, patterns, and best practices
---

# Brritto - Development Guide

> Part 3 of 3: API integration, development patterns, and best practices

## API Integration

### API Client Pattern

- All external API calls go through `src/lib/api-client.ts`
- Wrapped in Server Actions to hide endpoints from browser
- Uses HTTP-only cookies for session management
- Automatic token refresh on 401 errors
- Standard response format: `ApiResponse<T>` with success, statusCode, message, data, meta

### Key API Endpoints

**Authentication:**

- `POST /web/auth/send-otp` - Send OTP to mobile
- `POST /web/auth/login` - Verify OTP and login
- `POST /web/auth/logout` - Logout user
- `POST /web/auth/refresh-token` - Refresh access token

**Student:**

- `GET /web/student/profile` - Get student profile
- `PATCH /web/student/profile` - Update student profile
- `POST /web/student/register` - Register new student

**Courses:**

- `GET /web/classes` - Get all classes
- `GET /web/courses?classId=...` - Get courses by class
- `GET /web/courses/:id` - Get course details

**Payment:**

- `POST /web/payments/initiate` - Initiate payment (bKash/Aamarpay)

**Lookups:**

- `GET /web/institutions?search=...` - Search institutions
- `GET /web/classes` - Get all classes

## Development Patterns

### 1. Always Use Tailwind CSS

- Use Tailwind CSS v4 classes for all styling
- Avoid creating new CSS files unless for complex animations
- Custom CSS only in `src/styles/components/`

### 2. Keep API Endpoints Hidden

- Use Server Actions in `src/lib/server/` for all API calls
- Never expose endpoints to client
- All API calls must go through server-side code

### 3. Follow the Purple Theme

- Primary color: `#852DFE`
- Use gradient buttons for primary CTAs
- Consistent color palette across the app

### 4. Use Gradient Buttons

- Primary CTAs use `from-purple-600 to-fuchsia-600` gradient
- Consistent shadow and hover effects
- Follow button style patterns in architecture.md

### 5. Content Separation

- Static content in `src/content/`
- Components in `src/components/`
- Never hardcode content in components

### 6. Type Safety

- All types centralized in `src/types/`
- Use TypeScript for all files
- Define interfaces for all data structures

### 7. Use `src/` Directory

- All application code in `src/`
- No root-level components
- Follow Next.js 13+ conventions

### 8. Server Actions for API Calls

- All API calls through Server Actions
- Never expose endpoints to client
- Use `'use server'` directive

### 9. Session Management

- HTTP-only cookies for security
- Session includes profile completion status
- Automatic token refresh

### 10. Profile Completion Guard

- Middleware enforces profile completion
- Redirect incomplete profiles to `/login`
- Check `profileCompleted` flag in session

### 11. Responsive Design

- Mobile-first approach
- Use Tailwind responsive classes
- Test on multiple screen sizes

### 12. Accessibility

- Minimum touch target size: 44px
- Proper ARIA labels
- Keyboard navigation support

### 13. Error Handling - CRITICAL

> **NEVER throw errors in Server Components!** Thrown errors crash the page and show ugly error screens to users.

**Server Components (async pages/sections) MUST:**

1. **Wrap all API calls in try-catch**
2. **Return a user-friendly error component** instead of throwing
3. **Log errors for debugging** but don't expose to users

**❌ BAD - Don't do this:**

```typescript
// This CRASHES the page if API fails!
export default async function MySection() {
  const data = await fetchData(); // Throws on error
  return <Display data={data} />;
}
```

**✅ GOOD - Do this instead:**

```typescript
// Error fallback component
function ErrorFallback() {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium text-gray-900">Unable to load data</h3>
      <p className="text-gray-500">Please try refreshing the page.</p>
    </div>
  );
}

export default async function MySection() {
  try {
    const response = await fetchData();

    if (!response.success) {
      console.error("Failed to fetch:", response.message);
      return <ErrorFallback />;
    }

    return <Display data={response.data} />;
  } catch (error) {
    console.error("MySection error:", error);
    return <ErrorFallback />;
  }
}
```

**Service Layer Pattern:**

Services in `src/lib/server/` should catch errors and return standardized responses:

```typescript
export async function getData(): Promise<StandardApiResponse<Data[]>> {
  try {
    const response = await get<Data[]>("/endpoint");
    return response;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch data",
      data: [],
    };
  }
}
```

**Error UI Guidelines:**

- Show a friendly message, not technical details
- Provide action hint (refresh, try later)
- Use warning icon with subtle styling
- Keep section structure to avoid layout jumps

## Code Organization

### Server Actions Structure

```typescript
"use server";

import { apiClient } from "@/lib/api-client";

export async function actionName(params: ParamsType) {
  try {
    const response = await apiClient.post("/endpoint", params);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: "Error message" };
  }
}
```

### Component Structure

```typescript
'use client'; // Only if needed

import { useState } from 'react';

interface ComponentProps {
  // Props definition
}

export function Component({ ...props }: ComponentProps) {
  // Component logic
  return (
    // JSX with Tailwind classes
  );
}
```

### Type Definition Structure

```typescript
// src/types/feature.ts

export interface DataType {
  // Fields
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
```

## Common Workflows

### Adding a New Feature

1. Define types in `src/types/`
2. Create Server Action in `src/lib/server/`
3. Build UI components in `src/components/`
4. Create page in `src/app/`
5. Update middleware if route protection needed
6. Add content to `src/content/` if needed

### Adding a New API Endpoint

1. Define types for request/response
2. Create Server Action in `src/lib/server/`
3. Use `apiClient` for HTTP calls
4. Handle errors appropriately
5. Return standardized response

### Creating a New Component

1. Determine if Server or Client Component
2. Create in appropriate `src/components/` subdirectory
3. Use Tailwind CSS for styling
4. Define TypeScript interface for props
5. Export component

### Adding a New Route

1. Create directory/file in `src/app/`
2. Implement page component
3. Update middleware if protection needed
4. Add to navigation if needed
5. Test route protection

## Testing Guidelines

- Write tests for critical flows (auth, payment)
- Use React Testing Library for component tests
- Mock API calls in tests
- Test error states and edge cases

## Performance Optimization

- Use Server Components by default
- Lazy load heavy components
- Optimize images with Next.js Image
- Minimize client-side JavaScript
- Use proper caching strategies

## Security Best Practices

- Never expose API endpoints to client
- Use HTTP-only cookies for sessions
- Validate all user inputs
- Sanitize data before rendering
- Implement proper CORS policies
- Use environment variables for secrets

## Debugging Tips

- Check browser console for client errors
- Check server logs for API errors
- Verify session cookie exists
- Test API endpoints independently
- Use React DevTools for component debugging
- Check middleware logic for route issues
