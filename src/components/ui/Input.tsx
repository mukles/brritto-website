import React, {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "w-full px-4 py-3.5",
    "bg-gray-50",
    "border border-gray-200",
    "rounded-xl",
    "text-gray-900 placeholder-gray-400",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus:ring-0",
    "focus:border-purple-500 focus:bg-white",
    "focus:shadow-[0_0_0_4px_rgba(147,51,234,0.1)]",
    "hover:border-gray-300",
    "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60",
  ],
  {
    variants: {
      hasError: {
        true: [
          "border-red-400 bg-red-50/50",
          "focus:border-red-500",
          "focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]",
        ],
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isTextArea?: false;
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isTextArea: true;
}

type CombinedInputProps = InputProps | TextAreaProps;

const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  CombinedInputProps
>(({ label, error, className, isTextArea, ...props }, ref) => {
  const inputElement = isTextArea ? (
    <textarea
      ref={ref as React.Ref<HTMLTextAreaElement>}
      className={cn(inputVariants({ hasError: !!error }), className)}
      {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
    />
  ) : (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      className={cn(inputVariants({ hasError: !!error }), className)}
      {...(props as InputHTMLAttributes<HTMLInputElement>)}
    />
  );

  if (!label && !error) {
    return inputElement;
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      {inputElement}
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
          <svg
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
