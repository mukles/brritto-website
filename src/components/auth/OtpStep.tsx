/**
 * OTP Step Component
 *
 * Presentational component for OTP verification step
 * Following Single Responsibility Principle - only renders OTP form UI
 */

"use client";

import OtpInput from "./OtpInput";
import { LoadingSpinner } from "./FormFeedback";
import { AUTH_STYLES } from "./styles";
import { AuthStep } from "@/hooks/useAuthFlow";

interface OtpStepProps {
  otp: string;
  isLoading: boolean;
  error?: string;
  currentStep: AuthStep;
  onOtpChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onResend: () => void;
}

export default function OtpStep({
  otp,
  isLoading,
  error,
  currentStep,
  onOtpChange,
  onSubmit,
  onBack,
  onResend,
}: OtpStepProps) {
  const isVisible = currentStep === "otp";

  const getTransitionClasses = () => {
    if (isVisible) return "opacity-100 translate-x-0";
    if (currentStep === "phone") {
      return "opacity-0 absolute inset-0 pointer-events-none translate-x-8";
    }
    return "opacity-0 absolute inset-0 pointer-events-none -translate-x-8";
  };

  return (
    <div
      className={`transition-all duration-500 ease-out ${getTransitionClasses()}`}
    >
      {isVisible && (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="mb-5">
            <label className={AUTH_STYLES.label}>Enter OTP</label>
            <OtpInput
              value={otp}
              onChange={onOtpChange}
              disabled={isLoading}
              error={!!error}
              autoFocus
            />
            {error && (
              <p className={AUTH_STYLES.errorText} role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={onBack}
              className={AUTH_STYLES.secondaryButton}
              disabled={isLoading}
            >
              ← Change Number
            </button>
            <button
              type="button"
              onClick={onResend}
              className={AUTH_STYLES.linkButton}
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={AUTH_STYLES.button}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Verifying...</span>
              </>
            ) : (
              "Verify & Continue"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
