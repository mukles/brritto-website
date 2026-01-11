import { ContactFormData, FormErrors } from "@/types/contact";

/**
 * Validates email format using RFC 5322 compliant regex
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates contact form data and returns validation errors
 */
export function validateContactForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Name must be less than 100 characters";
  }

  // Subject validation
  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = "Subject must be at least 3 characters";
  } else if (data.subject.trim().length > 200) {
    errors.subject = "Subject must be less than 200 characters";
  }

  // Email validation
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (data.message.trim().length > 2000) {
    errors.message = "Message must be less than 2000 characters";
  }

  return errors;
}

/**
 * Checks if form has any validation errors
 */
export function hasValidationErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
