/**
 * OTP Input Component
 *
 * Premium 6-digit OTP input with auto-focus and paste support
 * Using Tailwind CSS only
 */

"use client";

import {
  useRef,
  useState,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const digits = value.padEnd(length, "").slice(0, length).split("");

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return;

    const sanitized = newValue.replace(/[^0-9]/g, "");

    if (sanitized.length === 0) {
      const newDigits = [...digits];
      newDigits[index] = "";
      onChange(newDigits.join("").trim());
      return;
    }

    if (sanitized.length === 1) {
      const newDigits = [...digits];
      newDigits[index] = sanitized;
      onChange(newDigits.join("").trim());

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      handlePaste(sanitized, index);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (pastedData: string, startIndex: number = 0) => {
    const sanitized = pastedData.replace(/[^0-9]/g, "").slice(0, length);
    const newDigits = [...digits];

    for (let i = 0; i < sanitized.length && startIndex + i < length; i++) {
      newDigits[startIndex + i] = sanitized[i];
    }

    onChange(newDigits.join("").trim());
    const nextIndex = Math.min(startIndex + sanitized.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handlePasteEvent = (
    e: ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    handlePaste(pastedData, index);
  };

  const baseInputClasses =
    "w-12 h-14 text-center text-xl font-semibold border-2 rounded-xl text-gray-900 bg-white transition-all duration-200 outline-none sm:w-10 sm:h-12 sm:text-lg";
  const focusClasses = "border-purple-500 ring-2 ring-purple-500/20 scale-105";
  const errorClasses = "border-red-400";
  const normalClasses = "border-gray-200";
  const disabledClasses = "bg-gray-50 cursor-not-allowed opacity-60";

  return (
    <div className="flex gap-3 justify-center sm:gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePasteEvent(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
          disabled={disabled}
          className={`${baseInputClasses} ${
            error
              ? errorClasses
              : focusedIndex === index
                ? focusClasses
                : normalClasses
          } ${disabled ? disabledClasses : ""}`}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
