/**
 * Unified Authentication Page
 *
 * Single flow for login and registration:
 * 1. Phone → Send OTP (get profileCompleted)
 * 2. OTP → Verify (get token)
 * 3. If profileCompleted=false → Show registration form
 * 4. If profileCompleted=true → Redirect home
 *
 * Architecture:
 * - useAuthFlow hook: All state management and API logic
 * - Presentational components: UI rendering only
 * - Pure validators: Validation logic with no side effects
 */

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { FormError, FormSuccess } from "@/components/auth/FormFeedback";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthProgressBar from "@/components/auth/AuthProgressBar";
import PhoneStep from "@/components/auth/PhoneStep";
import OtpStep from "@/components/auth/OtpStep";
import RegistrationStep from "@/components/auth/RegistrationStep";

// Only this component needs to be wrapped in Suspense
function LoginContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || undefined;

  const { state, actions, stepInfo, showProgress } = useAuthFlow(redirectUrl);

  return (
    <div>
      {/* Header */}
      <AuthHeader title={stepInfo.title} subtitle={stepInfo.subtitle} />

      {/* Progress indicator - only show for new users */}
      <AuthProgressBar
        currentStepIndex={stepInfo.index}
        showProgress={showProgress}
      />

      {/* Feedback Messages */}
      <FormError message={state.errors.general} />
      <FormSuccess message={state.successMessage} />

      {/* Step Content with Transitions */}
      <div className="relative">
        {/* Phone Step */}
        <PhoneStep
          mobile={state.formData.mobile}
          isValidPhone={state.isValidPhone}
          isLoading={state.isLoading}
          error={state.errors.mobile}
          isVisible={state.step === "phone"}
          onPhoneChange={(value) => actions.updateFormData("mobile", value)}
          onSubmit={actions.handleSendOtp}
        />

        {/* OTP Step */}
        <OtpStep
          otp={state.formData.otp}
          isLoading={state.isLoading}
          error={state.errors.otp}
          currentStep={state.step}
          onOtpChange={(value) => actions.updateFormData("otp", value)}
          onSubmit={actions.handleVerifyOtp}
          onBack={actions.handleBackToPhone}
          onResend={actions.handleResendOtp}
        />

        {/* Registration Step */}
        <RegistrationStep
          formData={state.formData}
          errors={state.errors}
          isLoading={state.isLoading}
          currentStep={state.step}
          onFieldChange={actions.updateFormData}
          onSubmit={actions.handleProfileUpdate}
          onLogout={actions.handleLogout}
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
