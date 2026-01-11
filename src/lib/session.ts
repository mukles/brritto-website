/**
 * Session Management
 *
 * Utilities for managing user sessions with HTTP-only cookies
 * Tokens are stored securely and never exposed to client-side JavaScript
 */

import { cookies } from "next/headers";
import { AuthSession } from "@/types/auth";

const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || "brritto_session";
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || "86400", 10); // 24 hours

/**
 * Create a new session and store tokens in HTTP-only cookie
 */
export async function createSession(
  accessToken: string,
  refreshToken: string,
  mobile: string,
  profileCompleted?: boolean
): Promise<void> {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;

  const session: AuthSession = {
    accessToken,
    refreshToken,
    mobile,
    expiresAt,
    profileCompleted,
  };

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/**
 * Get the current session from cookie
 */
export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session: AuthSession = JSON.parse(sessionCookie.value);

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      await deleteSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error parsing session:", error);
    await deleteSession();
    return null;
  }
}

/**
 * Delete the session cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Update session with new tokens (for refresh)
 */
export async function updateSession(
  accessToken: string,
  refreshToken: string
): Promise<boolean> {
  const session = await getSession();

  if (!session) {
    console.error("Failed to update session: No active session found");
    return false;
  }

  await createSession(accessToken, refreshToken, session.mobile);
  return true;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
