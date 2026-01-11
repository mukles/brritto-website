/**
 * Select Input Component
 *
 * Modern dropdown select with custom styling matching SearchableSelect
 * Selectable only (no search functionality)
 */

"use client";

import { useState, useRef, useEffect } from "react";

// Default styles (matching project conventions)
const STYLES = {
  label: "block text-sm font-semibold text-gray-700 mb-2",
  input:
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
  inputError: "border-red-400 focus:border-red-500 focus:ring-red-500/20",
  errorText: "mt-1.5 text-sm text-red-500 font-medium",
};

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function SelectInput({
  id,
  label,
  value,
  options,
  onChange,
  error,
  placeholder = "Select an option",
  disabled = false,
  required = false,
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get the selected option's label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className={STYLES.label}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Display Button */}
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        disabled={disabled}
        className={`${STYLES.input} ${error ? STYLES.inputError : ""} text-left flex items-center justify-between cursor-pointer`}
      >
        <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
          {displayValue || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
          <ul className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors cursor-pointer ${
                    option.value === value
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className={STYLES.errorText}>{error}</p>}
    </div>
  );
}
