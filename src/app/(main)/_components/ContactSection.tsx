"use client";

import { useState } from "react";
import {
  ContactSectionProps,
  ContactFormData,
  ContactFormState,
} from "@/types";
import { contactInfo } from "@/lib/contact";
import {
  validateContactForm,
  hasValidationErrors,
} from "@/lib/validators/validation";
import { submitContactForm } from "@/lib/contact";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactSection({
  className = "",
}: ContactSectionProps) {
  const [formState, setFormState] = useState<ContactFormState>({
    name: "",
    subject: "",
    email: "",
    message: "",
    errors: {},
    isSubmitting: false,
    submitSuccess: false,
  });

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined,
      },
    }));
  };

  const handleInputBlur = (field: keyof ContactFormData) => {
    const currentData: ContactFormData = {
      name: formState.name,
      subject: formState.subject,
      email: formState.email,
      message: formState.message,
    };

    const fieldErrors = validateContactForm(currentData);

    setFormState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: fieldErrors[field],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: ContactFormData = {
      name: formState.name,
      subject: formState.subject,
      email: formState.email,
      message: formState.message,
    };

    const errors = validateContactForm(formData);

    if (hasValidationErrors(errors)) {
      setFormState((prev) => ({
        ...prev,
        errors,
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      errors: {},
    }));

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setFormState({
          name: "",
          subject: "",
          email: "",
          message: "",
          errors: {},
          isSubmitting: false,
          submitSuccess: true,
        });
      } else {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          errors: {
            general: result.message,
          },
        }));
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: {
          general: "An unexpected error occurred. Please try again.",
        },
      }));
    }
  };

  return (
    <section
      className={`py-24 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 relative overflow-hidden ${className}`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information - Left Side */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4 border border-white/30">
                Get In Touch
              </span>
              <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                Have Questions?
                <br />
                <span className="text-emerald-300">
                  We&rsquo;re Here to Help
                </span>
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Reach out to our team for course inquiries, technical support,
                or any questions about our platform.
              </p>
            </div>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-emerald-400 text-purple-900">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Location
                  </h3>
                  <p className="text-white/80">{contactInfo.location}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-cyan-400 text-purple-900">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Email
                  </h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-emerald-300 hover:text-emerald-200 transition-colors duration-200 font-medium"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-pink-400 text-purple-900">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Phone
                  </h3>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-emerald-300 hover:text-emerald-200 transition-colors duration-200 font-medium"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-3">
                  <a
                    href={contactInfo.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white hover:text-purple-600 backdrop-blur-sm border border-white/20 transition-all duration-300 transform hover:scale-110 hover:-rotate-3"
                    aria-label="Facebook"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href={contactInfo.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-cyan-400 hover:text-white backdrop-blur-sm border border-white/20 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                    aria-label="Twitter"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href={contactInfo.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:text-white backdrop-blur-sm border border-white/20 transition-all duration-300 transform hover:scale-110 hover:-rotate-3"
                    aria-label="Instagram"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a message
            </h3>

            {formState.submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-500 text-white flex-shrink-0">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-800 font-medium">
                  Thank you for your message! We will get back to you soon.
                </p>
              </div>
            )}

            {formState.errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 font-medium">
                  {formState.errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <Input
                label="Name *"
                type="text"
                id="name"
                value={formState.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleInputBlur("name")}
                placeholder="Your full name"
                disabled={formState.isSubmitting}
                error={formState.errors.name}
              />

              {/* Subject Input */}
              <Input
                label="Subject *"
                type="text"
                id="subject"
                value={formState.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                onBlur={() => handleInputBlur("subject")}
                placeholder="What is this about?"
                disabled={formState.isSubmitting}
                error={formState.errors.subject}
              />

              {/* Email Input */}
              <Input
                label="Email *"
                type="email"
                id="email"
                value={formState.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleInputBlur("email")}
                placeholder="your.email@example.com"
                disabled={formState.isSubmitting}
                error={formState.errors.email}
              />

              {/* Message Textarea */}
              <Input
                label="Message *"
                isTextArea={true}
                id="message"
                rows={5}
                value={formState.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                onBlur={() => handleInputBlur("message")}
                placeholder="Tell us more about your inquiry..."
                disabled={formState.isSubmitting}
                error={formState.errors.message}
                className="resize-none"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                isLoading={formState.isSubmitting}
                disabled={formState.isSubmitting}
                className="w-full"
                rightIcon={
                  !formState.isSubmitting && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )
                }
              >
                {formState.isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
