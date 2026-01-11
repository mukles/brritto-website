/**
 * Student Service
 *
 * Server Actions for student registration and profile management
 */

"use server";

import { post, ApiError, put } from "../api-client";
import { createSession, getSession } from "../session";
import {
  StudentRegistrationRequest,
  LoginData,
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
// Registration Operations
// ============================================================================

/**
 * Register a new student
 * After successful registration, verify OTP and create session
 */
export async function registerStudent(
  mobile: string,
  otp: string,
  registrationData: Omit<StudentRegistrationRequest, "mobile">
): Promise<ServiceResult> {
  try {
    // Step 1: Verify OTP first
    const verifyResponse = await post<LoginData>("/auth/verify", {
      mobile,
      otp,
    });

    if (!verifyResponse.data) {
      return {
        success: false,
        message: "Invalid response from server",
      };
    }

    // Step 2: Register student
    const registerResponse = await post<StudentProfile>(
      "/students/register",
      registrationData,
      verifyResponse.data.accessToken
    );

    // Step 3: Create session with tokens from verification
    await createSession(
      verifyResponse.data.accessToken,
      verifyResponse.data.refreshToken,
      mobile
    );

    return {
      success: true,
      message: registerResponse.message || "Registration successful",
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
      message: "Failed to register. Please try again.",
    };
  }
}

// ============================================================================
// Profile Operations
// ============================================================================

/**
 * Update student profile for users who verified OTP but haven't completed registration
 * Uses existing session token
 */
export async function updateStudentProfile(
  profileData: Omit<StudentRegistrationRequest, "mobile">
): Promise<ServiceResult<StudentProfile>> {
  try {
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        message: "Not authenticated. Please login again.",
      };
    }

    const response = await put<StudentProfile>(
      "/web/student/profile",
      profileData,
      session.accessToken
    );

    // After successful profile update, refresh session with profileCompleted=true
    // This allows middleware to permit navigation
    await createSession(
      session.accessToken,
      session.refreshToken,
      session.mobile,
      true // Profile is now complete
    );

    return {
      success: true,
      message: response.message || "Profile updated successfully",
      data: response.data, // Return profile data
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
      message: "Failed to update profile. Please try again.",
    };
  }
}
