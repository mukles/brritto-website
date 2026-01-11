/**
 * Form Field Component
 *
 * Reusable presentational component for form inputs
 * Following Single Responsibility Principle - only renders input field UI
 */

"use client";

import { AUTH_STYLES } from "./styles";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "text" | "email" | "tel";
}

export default function FormField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  disabled = false,
  required = false,
  type = "text",
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={AUTH_STYLES.label}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${AUTH_STYLES.input} ${error ? AUTH_STYLES.inputError : ""}`}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
      {error && <p className={AUTH_STYLES.errorText}>{error}</p>}
      {hint && (
        <p className={`${AUTH_STYLES.hintText} text-yellow-600`}>{hint}</p>
      )}
    </div>
  );
}
