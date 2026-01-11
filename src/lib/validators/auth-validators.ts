/**
 * Authentication Validators
 *
 * Pure validation functions - no side effects, same input → same output
 * Following Single Responsibility Principle (SRP)
 */

import { FormErrors, SignupFormData } from "@/types/auth";

// ============================================================================
// Constants
// ============================================================================

/** Regex pattern for valid Bangladesh phone numbers */
const BD_PHONE_REGEX = /^01[3-9][0-9]{8}$/;

/** Characters to strip from phone numbers before validation */
const PHONE_STRIP_CHARS = /[\s\-()]/g;

// ============================================================================
// Phone Validation
// ============================================================================

/**
 * Sanitizes a phone number by removing formatting characters
 * @pure
 */
export const sanitizePhone = (phone: string): string => {
  return phone.replace(PHONE_STRIP_CHARS, "");
};

/**
 * Checks if a phone number is a valid Bangladesh mobile number
 * @pure
 */
export const isValidBDPhone = (phone: string): boolean => {
  const cleaned = sanitizePhone(phone);
  return BD_PHONE_REGEX.test(cleaned);
};

/**
 * Validates a phone number and returns error message if invalid
 * @pure
 */
export const validatePhone = (
  phone: string
): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  if (!isValidBDPhone(phone)) {
    return {
      isValid: false,
      error:
        "Please enter a valid 11-digit BD phone number (e.g., 01812345678)",
    };
  }

  return { isValid: true };
};

// ============================================================================
// OTP Validation
// ============================================================================

/**
 * Validates OTP input
 * @pure
 */
export const validateOtp = (
  otp: string
): { isValid: boolean; error?: string } => {
  if (!otp || otp.length !== 6) {
    return { isValid: false, error: "Please enter a valid 6-digit OTP" };
  }
  return { isValid: true };
};

/**
 * Validates email format
 * @pure
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates the registration form data
 * @pure
 * @returns FormErrors object with all validation errors (empty if valid)
 */
export const validateRegistrationForm = (
  formData: Pick<
    SignupFormData,
    | "name"
    | "email"
    | "district"
    | "institutionShortName"
    | "classId"
    | "termsAccepted"
  >
): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Email is optional - only validate format if provided
  if (formData.email && !isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.district || formData.district.trim().length < 2) {
    errors.district = "District is required";
  }

  if (
    !formData.institutionShortName ||
    formData.institutionShortName.trim().length < 2
  ) {
    errors.institution = "Please select or enter an institution";
  }

  if (!formData.classId) {
    errors.class = "Please select a class";
  }

  if (!formData.termsAccepted) {
    errors.terms = "You must accept the terms and privacy policy";
  }

  return errors;
};

/**
 * Checks if form validation passed (no errors)
 * @pure
 */
export const isFormValid = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};
