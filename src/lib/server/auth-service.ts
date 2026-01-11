/**
 * Authentication Service
 *
 * Server Actions for authentication operations
 * All API calls are made server-side to protect endpoints
 */

"use server";

import { post, get, ApiError } from "../api-client";
import {
  createSession,
  deleteSession,
  getSession,
  updateSession,
} from "../session";
import {
  SendOtpRequest,
  SendOtpData,
  VerifyOtpRequest,
  LoginData,
  RefreshTokenData,
  StudentProfile,
} from "@/types/auth";

// ============================================================================
// Service Response Types
// ============================================================================

interface ServiceResult<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

// ============================================================================
// OTP Operations
// ============================================================================

/**
 * Send OTP to phone number
 * Returns profileCompleted status to determine if user needs registration
 */
export async function sendOtp(
  mobile: string
): Promise<ServiceResult<{ profileCompleted?: boolean }>> {
  try {
    const response = await post<SendOtpData>("/web/auth/send-otp", {
      mobileNumber: mobile,
    } as SendOtpRequest);

    return {
      success: true,
      message: response.message || "OTP sent successfully",
      data: {
        profileCompleted: response.data?.profileCompleted,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to send OTP. Please try again.",
    };
  }
}

// ============================================================================
// Login Operations
// ============================================================================

/**
 * Verify OTP and create session
 */
export async function verifyOtpAndLogin(
  mobile: string,
  otp: string
): Promise<ServiceResult<{ profile?: StudentProfile }>> {
  try {
    const response = await post<LoginData>("/web/auth/login", {
      mobileNumber: mobile,
      otp,
    } as VerifyOtpRequest);

    if (!response.data) {
      return {
        success: false,
        message: "Invalid response from server",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loginData = (response.data as any).data;

    // Fetch and store student profile after successful login
    let profile: StudentProfile | undefined;
    let profileCompleted: boolean | undefined;
    try {
      const profileResponse = await get<StudentProfile>(
        "/web/student/profile",
        loginData.accessToken
      );
      if (profileResponse.success && profileResponse.data) {
        profile = profileResponse.data;
        profileCompleted = profile.profileCompleted;
      }
    } catch (profileError) {
      console.error("Failed to fetch student profile:", profileError);
      profileCompleted = false;
    }

    await createSession(
      loginData.accessToken,
      loginData.refreshToken,
      mobile,
      profileCompleted
    );

    return {
      success: true,
      message: response.message || "Login successful",
      data: { profile },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to verify OTP. Please try again.",
    };
  }
}

// ============================================================================
// Logout Operations
// ============================================================================

/**
 * Logout user and clear session
 */
export async function logout(): Promise<void> {
  const session = await getSession();

  if (session) {
    try {
      // Call backend logout endpoint
      await post("/web/auth/logout", {}, session.accessToken);
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with local logout even if API call fails
    }
  }

  // Clear session cookie
  await deleteSession();
}

// ============================================================================
// Token Operations
// ============================================================================

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<ServiceResult> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "No active session",
    };
  }

  try {
    const response = await post<RefreshTokenData>(
      "/web/auth/refresh",
      {},
      session.refreshToken
    );

    if (response.data) {
      await updateSession(
        response.data.accessToken,
        response.data.refreshToken
      );

      return {
        success: true,
        message: "Token refreshed successfully",
      };
    }

    return {
      success: false,
      message: "Failed to refresh token",
    };
  } catch (error) {
    // If refresh fails, logout user
    await deleteSession();

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Session expired. Please login again.",
    };
  }
}

// ============================================================================
// Session Operations
// ============================================================================

/**
 * Get current user session (for protected pages)
 */
export async function getCurrentSession() {
  return await getSession();
}

/**
 * Check if user is currently authenticated
 * Used by client components to determine auth state
 */
export async function checkAuthStatus(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

// ============================================================================
// Profile Operations
// ============================================================================

/**
 * Get student profile from API
 */
export async function getStudentProfile(): Promise<
  ServiceResult<StudentProfile>
> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  try {
    const response = await get<StudentProfile>(
      "/web/student/profile",
      session.accessToken
    );

    return {
      success: true,
      message: "Profile fetched successfully",
      data: response.data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to fetch profile",
    };
  }
}
