"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Signup Route Alias
 *
 * Since the authentication flow is unified (login and signup use the same flow),
 * this page simply redirects to the login page with the same redirect parameter.
 * This maintains backward compatibility with existing signup links.
 */

function SignupRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  useEffect(() => {
    // Redirect to login page with the same redirect parameter
    const loginUrl = redirectUrl
      ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
      : "/login";
    router.replace(loginUrl);
  }, [router, redirectUrl]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupRedirect />
    </Suspense>
  );
}
