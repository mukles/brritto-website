/**
 * Phone Input Component
 *
 * Phone number input with validation - Tailwind CSS only
 */

"use client";

import { ChangeEvent } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}: PhoneInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const sanitized = input.replace(/[^0-9+\-() ]/g, "");
    onChange(sanitized);
  };

  const inputClasses = `w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200"
  }`;

  return (
    <div className="mb-5">
      <label
        htmlFor="phone"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Phone Number {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id="phone"
        type="tel"
        inputMode="tel"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="01XXXXXXXXX"
        className={inputClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "phone-error" : undefined}
        required={required}
      />
      {error && (
        <p
          id="phone-error"
          className="mt-1.5 text-sm text-red-500 font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
      <p className="mt-1.5 text-sm text-gray-500">
        Enter your phone number (e.g., 01812345678)
      </p>
    </div>
  );
}
