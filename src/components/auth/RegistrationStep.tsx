/**
 * Registration Step Component
 *
 * Presentational component for profile registration step
 * Single column layout - one input per row
 * Uses API calls for classes and institutions
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { SignupFormData, FormErrors } from "@/types/auth";
import { LoadingSpinner } from "./FormFeedback";
import { AUTH_STYLES } from "./styles";
import FormField from "./FormField";
import GenderSelector from "./GenderSelector";
import SearchableSelect, {
  SelectOption,
} from "@/components/ui/SearchableSelect";
import SelectInput from "@/components/ui/SelectInput";
import TermsCheckbox from "./TermsCheckbox";
import { AuthStep } from "@/hooks/useAuthFlow";
import {
  getClasses,
  searchInstitutions,
  searchDistricts,
} from "@/lib/server/register-service";

interface RegistrationStepProps {
  formData: SignupFormData;
  errors: FormErrors;
  isLoading: boolean;
  currentStep: AuthStep;
  onFieldChange: (
    field: keyof SignupFormData,
    value: string | boolean | null
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLogout: () => void;
}

export default function RegistrationStep({
  formData,
  errors,
  isLoading,
  currentStep,
  onFieldChange,
  onSubmit,
  onLogout,
}: RegistrationStepProps) {
  const isVisible = currentStep === "registration";
  const [classOptions, setClassOptions] = useState<SelectOption[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  // Fetch classes on mount
  useEffect(() => {
    async function fetchClasses() {
      setIsLoadingClasses(true);
      const result = await getClasses();
      if (result.success && result.data) {
        setClassOptions(
          result.data.map((cls) => ({
            value: cls._id,
            label: cls.className,
          }))
        );
      }
      setIsLoadingClasses(false);
    }

    if (isVisible) {
      fetchClasses();
    }
  }, [isVisible]);

  // Search institutions handler for API mode
  const handleInstitutionSearch = useCallback(
    async (query: string): Promise<SelectOption[]> => {
      const result = await searchInstitutions(query);
      if (result.success && result.data) {
        return result.data.map((inst) => ({
          value: inst._id,
          label: inst.institutionShortName,
        }));
      }
      return [];
    },
    []
  );

  // Search districts handler for API mode
  const handleDistrictSearch = useCallback(
    async (query: string): Promise<SelectOption[]> => {
      const result = await searchDistricts(query);
      if (result.success && result.data) {
        return result.data.map((district) => ({
          value: district._id,
          label: district.name,
        }));
      }
      return [];
    },
    []
  );

  const handleInstitutionChange = useCallback(
    (value: string, label?: string) => {
      const isExistingInstitution = label !== undefined && label !== value;
      if (isExistingInstitution) {
        onFieldChange("institutionId", value);
        onFieldChange("institutionShortName", label);
      } else {
        onFieldChange("institutionId", "0");
        onFieldChange("institutionShortName", value);
      }
    },
    [onFieldChange]
  );

  const transitionClasses = isVisible
    ? "opacity-100 translate-x-0"
    : "opacity-0 absolute inset-0 pointer-events-none translate-x-8";

  return (
    <div
      className={`transition-all duration-500 ease-out ${transitionClasses}`}
    >
      {isVisible && (
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Full Name */}
          <FormField
            id="name"
            label="Full Name"
            value={formData.name}
            onChange={(value) => onFieldChange("name", value)}
            error={errors.name}
            placeholder="Enter your full name"
            disabled={isLoading}
            required
          />

          {/* Email (Optional) */}
          <FormField
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => onFieldChange("email", value)}
            error={errors.email}
            placeholder="Enter your email address (optional)"
            disabled={isLoading}
          />

          {/* Gender */}
          <GenderSelector
            value={formData.gender}
            onChange={(value) => onFieldChange("gender", value)}
            disabled={isLoading}
          />

          {/* District - API search (no add new) */}
          <SearchableSelect
            id="district"
            label="District"
            value={formData.district}
            onSearch={handleDistrictSearch}
            onChange={(value) => onFieldChange("district", value)}
            error={errors.district}
            placeholder="Select your district"
            searchPlaceholder="Search district..."
            disabled={isLoading}
            required
            minSearchLength={1}
          />

          {/* Class - Selectable dropdown (API-loaded) */}
          <SelectInput
            id="class"
            label="Class"
            value={formData.classId}
            options={classOptions}
            onChange={(value) => onFieldChange("classId", value)}
            error={errors.class}
            placeholder={
              isLoadingClasses ? "Loading classes..." : "Select your class"
            }
            disabled={isLoading || isLoadingClasses}
            required
          />

          {/* Institution - API search with custom input */}
          <SearchableSelect
            id="institution"
            label="Institution"
            value={formData.institutionShortName}
            onSearch={handleInstitutionSearch}
            onChange={handleInstitutionChange}
            error={errors.institution}
            placeholder="Select or type your institution"
            searchPlaceholder="Search institution..."
            disabled={isLoading}
            required
            allowCustom
            minSearchLength={2}
          />

          {/* Terms & Privacy Checkbox */}
          <TermsCheckbox
            checked={formData.termsAccepted}
            onChange={(checked) => onFieldChange("termsAccepted", checked)}
            error={errors.terms}
            disabled={isLoading}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onLogout}
              disabled={isLoading}
              className={AUTH_STYLES.logoutButton}
            >
              Logout
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 ${AUTH_STYLES.button}`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Saving...</span>
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
