import { ContactFormData } from "@/types/contact";

/**
 * Submits contact form data
 * This implementation can work with either a mock submission or real API
 */
export async function submitContactForm(data: ContactFormData): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Validate data before submission
    if (!data.name || !data.email || !data.subject || !data.message) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    // Option 1: Use API route (uncomment for production)
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // const result = await response.json();
    // return result;

    // Option 2: Mock implementation (current)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Contact form submitted:", {
      ...data,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "server",
    });

    return {
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);

    // Different error messages based on error type
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }

    return {
      success: false,
      message:
        "Sorry, there was an error sending your message. Please try again.",
    };
  }
}

/**
 * Validates form data on the server side (for API routes)
 */
export function validateFormData(data: ContactFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.push("Subject must be at least 3 characters");
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Contact information data
 */
export const contactInfo = {
  location: "123 Education Street, Learning City, LC 12345",
  email: "contact@innobrritto.com",
  phone: "+1 (555) 123-4567",
  socialMedia: {
    facebook: "https://facebook.com/innobrritto",
    twitter: "https://twitter.com/innobrritto",
    instagram: "https://instagram.com/innobrritto",
  },
};
