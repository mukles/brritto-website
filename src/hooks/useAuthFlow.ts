/**
 * useAuthFlow Hook
 *
 * Custom hook encapsulating all authentication flow logic
 * Following Single Responsibility Principle - handles only auth state & actions
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtpAndLogin, logout } from "@/lib/server/auth-service";
import { updateStudentProfile } from "@/lib/server/student-service";
import { FormErrors, SignupFormData } from "@/types/auth";
import {
  validatePhone,
  validateOtp,
  validateRegistrationForm,
  isFormValid,
  isValidBDPhone,
} from "@/lib/validators/auth-validators";

// ============================================================================
// Types
// ============================================================================

export type AuthStep = "phone" | "otp" | "registration";

export interface AuthStepInfo {
  title: string;
  subtitle: string;
  index: number;
}

export interface AuthState {
  step: AuthStep;
  profileCompleted: boolean | null;
  formData: SignupFormData;
  errors: FormErrors;
  successMessage: string;
  isLoading: boolean;
  isValidPhone: boolean;
}

export interface AuthActions {
  updateFormData: (
    field: keyof SignupFormData,
    value: string | boolean | null
  ) => void;
  handleSendOtp: (e: React.FormEvent) => Promise<void>;
  handleVerifyOtp: (e: React.FormEvent) => Promise<void>;
  handleProfileUpdate: (e: React.FormEvent) => Promise<void>;
  handleResendOtp: () => Promise<void>;
  handleBackToPhone: () => void;
  handleLogout: () => Promise<void>;
}

// ============================================================================
// Initial State
// ============================================================================

const initialFormData: SignupFormData = {
  mobile: "",
  otp: "",
  name: "",
  email: "",
  gender: "Male",
  district: "",
  institutionId: null,
  institutionShortName: "",
  classId: "",
  cls: "",
  termsAccepted: false,
};

// ============================================================================
// Session Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  STEP: "auth_step",
  MOBILE: "auth_mobile",
  PROFILE_COMPLETED: "auth_profile_completed",
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets step info for header and progress display
 * @pure
 */
export const getStepInfo = (step: AuthStep): AuthStepInfo => {
  switch (step) {
    case "phone":
      return {
        title: "Welcome",
        subtitle: "Enter your phone number to continue",
        index: 0,
      };
    case "otp":
      return {
        title: "Verify OTP",
        subtitle: "Enter the OTP sent to your phone",
        index: 1,
      };
    case "registration":
      return {
        title: "Complete Profile",
        subtitle: "Fill in your details to finish registration",
        index: 2,
      };
  }
};

/**
 * Clears all auth-related session storage
 */
const clearAuthStorage = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.STEP);
  sessionStorage.removeItem(STORAGE_KEYS.MOBILE);
  sessionStorage.removeItem(STORAGE_KEYS.PROFILE_COMPLETED);
};

// ============================================================================
// Hook Implementation
// ============================================================================

export function useAuthFlow(redirectUrl?: string): {
  state: AuthState;
  actions: AuthActions;
  stepInfo: AuthStepInfo;
  showProgress: boolean;
} {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>("phone");
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(
    null
  );
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // Persistence Effects
  // ============================================================================

  // Load persisted state on mount
  useEffect(() => {
    const savedStep = sessionStorage.getItem(
      STORAGE_KEYS.STEP
    ) as AuthStep | null;
    const savedMobile = sessionStorage.getItem(STORAGE_KEYS.MOBILE);
    const savedProfileCompleted = sessionStorage.getItem(
      STORAGE_KEYS.PROFILE_COMPLETED
    );

    if (savedStep && savedMobile) {
      setStep(savedStep);
      setFormData((prev) => ({ ...prev, mobile: savedMobile }));
      if (savedProfileCompleted !== null) {
        setProfileCompleted(savedProfileCompleted === "false" ? false : null);
      }
    }
  }, []);

  // Persist state and prevent back navigation on registration step
  useEffect(() => {
    if (step === "registration") {
      sessionStorage.setItem(STORAGE_KEYS.STEP, step);
      sessionStorage.setItem(STORAGE_KEYS.MOBILE, formData.mobile);
      sessionStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETED, "false");

      // Prevent browser back navigation on registration step
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [step, formData.mobile]);

  // ============================================================================
  // Form Data Actions
  // ============================================================================

  const updateFormData = useCallback(
    (field: keyof SignupFormData, value: string | boolean | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // ============================================================================
  // API Actions
  // ============================================================================

  const handleSendOtp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validation = validatePhone(formData.mobile);
      if (!validation.isValid) {
        setErrors({ mobile: validation.error });
        return;
      }

      setIsLoading(true);
      setErrors({});
      setSuccessMessage("");

      try {
        const result = await sendOtp(formData.mobile);
        if (result.success) {
          setSuccessMessage(result.message);
          setProfileCompleted(result.data?.profileCompleted ?? null);
          setStep("otp");
        } else {
          setErrors({ general: result.message });
        }
      } catch {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData.mobile]
  );

  const handleVerifyOtp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validation = validateOtp(formData.otp);
      if (!validation.isValid) {
        setErrors({ otp: validation.error });
        return;
      }

      setIsLoading(true);
      setErrors({});
      setSuccessMessage("");

      try {
        const result = await verifyOtpAndLogin(formData.mobile, formData.otp);
        if (result.success) {
          const profile = result.data?.profile;

          // Store profile in localStorage if available
          if (profile) {
            localStorage.setItem("studentProfile", JSON.stringify(profile));
          }

          // Check if profile is completed - use API response OR state from sendOtp
          // Priority: 1) profile.profileCompleted, 2) profileCompleted state from sendOtp
          const isProfileComplete =
            profile?.profileCompleted ?? profileCompleted;

          if (isProfileComplete === false) {
            setSuccessMessage("OTP verified! Please complete your profile.");
            setStep("registration");
          } else {
            setSuccessMessage(result.message);
            // Redirect to specified URL or home page
            const destination =
              redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/";
            router.push(destination);
            router.refresh();
          }
        } else {
          setErrors({ general: result.message });
        }
      } catch {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData.mobile, formData.otp, profileCompleted, redirectUrl, router]
  );

  const handleProfileUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateRegistrationForm(formData);
      if (!isFormValid(validationErrors)) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      setErrors({});
      setSuccessMessage("");

      try {
        const result = await updateStudentProfile({
          name: formData.name,
          gender: formData.gender,
          address: { district: formData.district },
          institution: {
            _id: formData.institutionId,
            institutionShortName: formData.institutionShortName,
          },
          class: { _id: formData.classId, className: formData.classId },
          cls: formData.cls,
        });

        if (result.success) {
          // Store profile in localStorage for Header to display user name
          if (result.data) {
            localStorage.setItem("studentProfile", JSON.stringify(result.data));
          } else {
            // Store at least the name from form data
            localStorage.setItem(
              "studentProfile",
              JSON.stringify({ name: formData.name })
            );
          }

          setSuccessMessage("Profile completed successfully!");
          clearAuthStorage();
          // Redirect to specified URL or home page
          const destination =
            redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/";
          setTimeout(() => {
            window.location.href = destination; // Hard refresh to ensure Header reads new profile
          }, 1000);
        } else {
          setErrors({ general: result.message });
        }
      } catch {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, redirectUrl, router]
  );

  const handleResendOtp = useCallback(async () => {
    setFormData((prev) => ({ ...prev, otp: "" }));
    setErrors({});
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await sendOtp(formData.mobile);
      if (result.success) {
        setSuccessMessage("OTP resent successfully");
      } else {
        setErrors({ general: result.message });
      }
    } catch {
      setErrors({ general: "Failed to resend OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }, [formData.mobile]);

  const handleBackToPhone = useCallback(() => {
    setStep("phone");
    setFormData((prev) => ({ ...prev, otp: "" }));
    setErrors({});
    setSuccessMessage("");
    setProfileCompleted(null);
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logout();
      clearAuthStorage();
      setStep("phone");
      setFormData(initialFormData);
      setProfileCompleted(null);
      setErrors({});
      setSuccessMessage("");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const stepInfo = getStepInfo(step);
  const showProgress = profileCompleted === false || step === "registration";

  return {
    state: {
      step,
      profileCompleted,
      formData,
      errors,
      successMessage,
      isLoading,
      isValidPhone: isValidBDPhone(formData.mobile),
    },
    actions: {
      updateFormData,
      handleSendOtp,
      handleVerifyOtp,
      handleProfileUpdate,
      handleResendOtp,
      handleBackToPhone,
      handleLogout,
    },
    stepInfo,
    showProgress,
  };
}
