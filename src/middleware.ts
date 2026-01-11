/**
 * Next.js Middleware
 *
 * Protects routes and manages authentication state
 * Enforces profile completion before allowing navigation
 */

import type { AuthSession } from "@/types/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define protected and public routes
const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = ["/login", "/signup"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session cookie
  const sessionCookie = request.cookies.get(
    process.env.SESSION_COOKIE_NAME || "brritto_session"
  );

  const isAuthenticated = !!sessionCookie?.value;

  // Parse session to check profile completion
  let session: AuthSession | null = null;
  if (sessionCookie?.value) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (error) {
      console.error("Failed to parse session:", error);
    }
  }

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Check if profile is explicitly incomplete (false, not undefined)
  const isProfileIncomplete = session?.profileCompleted === false;

  // Redirect authenticated users away from auth pages (if profile is NOT explicitly incomplete)
  if (isAuthRoute && isAuthenticated && !isProfileIncomplete) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Only enforce profile completion for protected routes
  // (not for public routes like home page)
  if (isAuthenticated && isProfileIncomplete && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure which routes should run the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-*).*)",
  ],
};
