/**
 * Phone Step Component
 *
 * Presentational component for phone input step
 * Following Single Responsibility Principle - only renders phone form UI
 */

"use client";

import PhoneInput from "./PhoneInput";
import { LoadingSpinner } from "./FormFeedback";
import { AUTH_STYLES } from "./styles";

interface PhoneStepProps {
  mobile: string;
  isValidPhone: boolean;
  isLoading: boolean;
  error?: string;
  isVisible: boolean;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PhoneStep({
  mobile,
  isValidPhone,
  isLoading,
  error,
  isVisible,
  onPhoneChange,
  onSubmit,
}: PhoneStepProps) {
  const transitionClasses = isVisible
    ? "opacity-100 translate-x-0"
    : "opacity-0 absolute inset-0 pointer-events-none -translate-x-8";

  return (
    <div
      className={`transition-all duration-500 ease-out ${transitionClasses}`}
    >
      {isVisible && (
        <form onSubmit={onSubmit} className="space-y-6">
          <PhoneInput
            value={mobile}
            onChange={onPhoneChange}
            error={
              error ||
              (mobile && !isValidPhone
                ? "Please enter a valid 11-digit BD phone number"
                : undefined)
            }
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading || !isValidPhone}
            className={AUTH_STYLES.button}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Sending OTP...</span>
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
