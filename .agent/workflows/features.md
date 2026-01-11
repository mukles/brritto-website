---
description: Feature implementations - authentication, courses, payments, and UI components
---

# Brritto - Features & Flows

> Part 2 of 3: Authentication, course management, payment integration, and reusable components

## Authentication & Registration Flow

### OTP-Based Authentication

1. **Phone Input:** User enters mobile number
2. **Send OTP:** Server sends OTP via SMS
3. **OTP Verification:** User enters OTP
4. **Login/Signup:**
   - **Existing user:** Redirected to home (if profile complete) or registration step
   - **New user:** Proceeds to registration step

### Registration Flow (Multi-Step)

**Step 1: Phone + OTP**

- Phone number input with validation
- OTP verification

**Step 2: Profile Completion** (if `profileCompleted: false`)

- Full Name (required)
- Email (required, validated)
- District (required)
- Gender (Male/Female/Other, required)
- Class (dropdown, required)
- Institution (searchable dropdown, required)
- Class Code (optional)
- Terms & Privacy checkbox (required)

### Profile Completion Guard

- Middleware checks `profileCompleted` flag in session
- Users with incomplete profiles are redirected to `/login` when accessing protected routes
- After profile completion, user is redirected to home page
- Session stores: `accessToken`, `refreshToken`, `mobile`, `profileCompleted`, `expiresAt`

### Session Management

- HTTP-only cookies for security
- Session stored in `brritto_session` cookie
- Automatic token refresh on API 401 errors
- Session includes profile completion status

## Course Management

### Course Explorer

- **Class Tabs:** Filter courses by class (SSC, HSC, etc.)
- **Course Cards:** Display course image, name, price, discount
- **Dynamic Routing:** `/courses/[classSlug]` for class-specific courses

### Course Details

- **Route:** `/courses/details?courseId=...`
- **Data:** Full course info including subjects, pricing, expiration
- **CTA:** "Enroll Now" button redirects to checkout

### Checkout Flow

1. **Route:** `/checkout/[courseId]`
2. **Auth Check:** Must be logged in to access
3. **Payment Selection:** Choose bKash or Aamarpay
4. **Payment Initiation:** Server calls `/web/payments/initiate`
5. **Redirect:** User redirected to payment gateway URL
6. **Return:** Payment status pages at `/payment/status`

## Payment Integration

### Supported Gateways

- **bKash:** Mobile financial service
- **Aamarpay:** Online payment gateway

### Payment Flow

1. User selects course and clicks "Enroll Now"
2. If not logged in, redirected to `/login?redirect=/checkout/[courseId]`
3. After login, redirected back to checkout
4. User selects payment method
5. Server initiates payment via `payment-service.ts`
6. User redirected to payment gateway
7. After payment, redirected to status page

### Payment Status Pages

- **Success:** `/payment/status?status=success`
- **Failed:** `/payment/status?status=failed`
- **Canceled:** `/payment/status?status=canceled`

## Reusable UI Components

### SearchableSelect

- **Location:** `src/components/ui/SearchableSelect.tsx`
- **Usage:** Institution search in registration form
- **Features:** Debounced search, keyboard navigation, loading states
- **Props:** `options`, `value`, `onChange`, `onSearch`, `placeholder`, `isLoading`

### SelectInput

- **Location:** `src/components/ui/SelectInput.tsx`
- **Usage:** Class selection in registration form
- **Features:** Dropdown with custom styling, error states
- **Props:** `options`, `value`, `onChange`, `label`, `error`

### Button

- **Location:** `src/components/ui/Button.tsx`
- **Variants:** `primary`, `secondary`, `outline`, `ghost`
- **Sizes:** `sm`, `md`, `lg`
- **Uses:** `class-variance-authority` for variant management

### Input

- **Location:** `src/components/ui/Input.tsx`
- **Features:** Label, error states, helper text
- **Props:** `label`, `error`, `helperText`, standard input props

### Card

- **Location:** `src/components/ui/Card.tsx`
- **Usage:** Course cards, content containers
- **Features:** Consistent styling, hover effects

## Middleware & Route Protection

### Protected Routes

- `/dashboard` - User dashboard (future)
- `/profile` - User profile page (future)
- `/checkout/*` - Payment checkout pages

### Auth Routes

- `/login` - Login page
- `/signup` - Signup page

### Public Routes

- `/` - Home page
- `/about` - About page (future)
- `/contact` - Contact page
- `/courses/*` - Course pages
- `/blogs` - Blog listing

### Middleware Logic

1. Check for session cookie
2. Parse session to get `profileCompleted` status
3. Redirect unauthenticated users from protected routes to `/login?redirect=...`
4. Redirect authenticated users with incomplete profiles to `/login` when accessing protected routes
5. Redirect authenticated users away from auth pages (unless profile incomplete)

## Content Management

Static content is stored in `src/content/`:

- `metadata.ts` - SEO configuration
- `home.ts` - Home page content
- `features.tsx` - Feature cards
- `navigation.ts` - Navigation links
