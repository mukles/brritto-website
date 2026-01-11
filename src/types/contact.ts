/**
 * Contact form data interface
 */
export interface ContactFormData {
  name: string;
  subject: string;
  email: string;
  message: string;
}

/**
 * Contact form state interface for managing form state and validation
 */
export interface ContactFormState {
  name: string;
  subject: string;
  email: string;
  message: string;
  errors: FormErrors;
  isSubmitting: boolean;
  submitSuccess: boolean;
}

/**
 * Contact information interface
 */
export interface ContactInfo {
  location: string;
  email: string;
  phone: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

/**
 * Form validation errors interface
 */
export interface FormErrors {
  name?: string;
  subject?: string;
  email?: string;
  message?: string;
  general?: string;
}
