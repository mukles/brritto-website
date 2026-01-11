# Authentication System

Complete authentication system with OTP verification for login and student registration.

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration (Server-side only - NOT exposed to client)
API_BASE_URL=http://localhost:3001

# Session Configuration
SESSION_COOKIE_NAME=brritto_session
SESSION_MAX_AGE=86400
```

### 2. API Endpoints

The system uses the following backend endpoints (all called server-side only):

- `POST /web/auth/send-otp` - Send OTP to phone number (body: `{ mobileNumber: string }`)
- `POST /web/auth/login` - Verify OTP and get access tokens (body: `{ mobileNumber: string, otp: string }`)
- `POST /web/auth/logout` - Logout user (requires Bearer token)
- `POST /web/auth/refresh` - Refresh access token (requires Bearer refresh token)
- `POST /students/register` - Register new student

## Features

### Login Flow (`/login`)

1. User enters phone number
2. System sends OTP via server action
3. User enters 6-digit OTP
4. System verifies OTP and creates session
5. User redirected to home page

### Signup Flow (`/signup`)

1. User enters phone number
2. System sends OTP via server action
3. User enters 6-digit OTP
4. User fills registration form (name, gender, district, institution, class)
5. System registers student and creates session
6. User redirected to home page

### Security Features

- ✅ All API calls made server-side (endpoints never exposed to client)
- ✅ HTTP-only cookies for session storage
- ✅ Protected route middleware
- ✅ Automatic session expiry
- ✅ Token refresh mechanism
- ✅ Secure session management

## Usage

### Protected Routes

Add routes to the middleware configuration in `src/middleware.ts`:

```typescript
const protectedRoutes = ["/dashboard", "/profile"];
```

### Get Current User

```typescript
import { getCurrentSession } from "@/lib/auth-service";

const session = await getCurrentSession();
if (session) {
  console.log("User mobile:", session.mobile);
  console.log("Access token:", session.accessToken);
}
```

### Logout

```typescript
import { logout } from "@/lib/auth-service";

await logout(); // Clears session and redirects to login
```

## File Structure

```
src/
├── app/
│   └── (auth)/
│       ├── layout.tsx           # Auth layout wrapper
│       ├── login/
│       │   └── page.tsx         # Login page
│       └── signup/
│           └── page.tsx         # Signup page
├── components/
│   └── auth/
│       ├── FormFeedback.tsx     # Error/success messages
│       ├── OtpInput.tsx         # OTP input component
│       └── PhoneInput.tsx       # Phone input component
├── lib/
│   ├── api-client.ts            # Server-side API client
│   ├── auth-service.ts          # Auth server actions
│   ├── session.ts               # Session management
│   └── student-service.ts       # Student registration service
├── styles/
│   └── components/
│       └── auth.css             # Authentication styles
├── types/
│   └── auth.ts                  # TypeScript interfaces
└── middleware.ts                # Route protection
```

## Notes

- Institution and class dropdowns are currently text inputs
- These will need to be replaced with proper select dropdowns when the institution/class API endpoints are available
- The `cls` field in registration is a required string field (clarify with backend team on its purpose)
