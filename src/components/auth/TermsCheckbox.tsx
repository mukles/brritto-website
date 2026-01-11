/**
 * Terms Checkbox Component
 *
 * Presentational component for terms and privacy policy checkbox
 */

"use client";

import { AUTH_STYLES } from "./styles";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export default function TermsCheckbox({
  checked,
  onChange,
  error,
  disabled = false,
}: TermsCheckboxProps) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
          />
          <div
            className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
              checked
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 border-transparent"
                : error
                  ? "border-red-400 group-hover:border-red-500"
                  : "border-gray-300 group-hover:border-purple-400"
            } ${disabled ? "opacity-60" : ""}`}
          >
            {checked && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
        <span className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}>
          I agree to the{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </a>
        </span>
      </label>
      {error && <p className={`${AUTH_STYLES.errorText} mt-1`}>{error}</p>}
    </div>
  );
}
