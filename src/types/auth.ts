/**
 * Authentication Types
 *
 * Type definitions for authentication flows including OTP verification,
 * login, and student registration
 */

// ============================================================================
// OTP Related Types
// ============================================================================

export interface SendOtpRequest {
  mobileNumber: string;
}

/** Data returned from send-otp endpoint */
export interface SendOtpData {
  profileCompleted?: boolean;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}

// ============================================================================
// Authentication Response Data Types
// ============================================================================

/** Data returned from login endpoint */
export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

/** Data returned from refresh token endpoint */
export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
}

// ============================================================================
// Session Types
// ============================================================================

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  mobile: string;
  expiresAt: number;
  profileCompleted?: boolean;
}

// ============================================================================
// Student Registration Types
// ============================================================================

export interface Address {
  district: string;
}

export interface Institution {
  _id: string | null;
  institutionShortName: string;
}

export interface Class {
  _id: string;
  className: string;
}

export interface StudentRegistrationRequest {
  name: string;
  gender: "Male" | "Female" | "Other";
  address: Address;
  institution: Institution;
  class: Class;
  cls: string;
}

// ============================================================================
// Institution & Class Lookup Types (for form dropdowns)
// ============================================================================

export interface InstitutionOption {
  _id: string;
  institutionShortName: string;
  institutionFullName?: string;
}

export interface ClassOption {
  _id: string;
  className: string;
}

// ============================================================================
// Form State Types
// ============================================================================

export interface LoginFormData {
  mobile: string;
  otp?: string;
}

export interface SignupFormData {
  mobile: string;
  otp: string;
  name: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  district: string;
  institutionId: string | null;
  institutionShortName: string;
  classId: string;
  cls: string;
  termsAccepted: boolean;
}

export interface FormErrors {
  mobile?: string;
  otp?: string;
  name?: string;
  email?: string;
  gender?: string;
  district?: string;
  institution?: string;
  class?: string;
  cls?: string;
  terms?: string;
  general?: string;
}

// ============================================================================
// Student Profile Types
// ============================================================================

export interface StudentClass {
  class: string;
  className: string;
}

export interface StudentActiveClass {
  _id: string;
  name: string;
}

export interface StudentAddress {
  district: string;
}

export interface StudentInstitution {
  _id: string;
  institutionShortName: string;
}

export interface StudentTrial {
  status: "ACTIVE" | "EXPIRED" | "NONE";
  startedAt?: string;
  expiresAt?: string;
}

export interface StudentProfile {
  _id: string;
  name: string;
  mobileNumber: string;
  mobileVerified: boolean;
  image: string | null;
  profileCompleted: boolean;
  isActive: boolean;
  class: StudentClass[];
  activeClass: StudentActiveClass;
  address: StudentAddress;
  institution: StudentInstitution;
  gender: "Male" | "Female" | "Other";
  hasEverHadTrial: boolean;
  trial?: StudentTrial;
}
