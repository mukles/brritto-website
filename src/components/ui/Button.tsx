"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React, { ButtonHTMLAttributes, useState } from "react";

const buttonVariants = cva(
  [
    "relative",
    "rounded-xl",
    "font-semibold",
    "transition-all duration-300 ease-out",
    "transform hover:scale-[1.02] active:scale-[0.98]",
    "focus:outline-none focus:ring-0",
    "focus:shadow-[0_0_0_4px_rgba(147,51,234,0.2)]",
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
    "inline-flex items-center justify-center gap-2",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-purple-600 text-white",
          "hover:bg-purple-700",
          "active:bg-purple-800",
          "shadow-lg shadow-purple-600/30",
          "hover:shadow-purple-600/50",
        ],
        secondary: [
          "bg-white text-purple-600",
          "hover:bg-gray-50",
          "active:bg-gray-100",
          "shadow-lg shadow-gray-300/50",
          "hover:shadow-gray-400/50",
          "border border-purple-100",
        ],
        outline: [
          "bg-transparent text-purple-600",
          "border-2 border-purple-600",
          "hover:bg-purple-50",
          "active:bg-purple-100",
        ],
        gradient: [
          "bg-gradient-to-r from-purple-600 to-pink-600",
          "text-white",
          "hover:from-purple-700 hover:to-pink-700",
          "active:from-purple-800 active:to-pink-800",
          "shadow-lg shadow-purple-600/30",
          "hover:shadow-purple-600/50",
        ],
        tag: [
          "border text-[10px] lg:text-xs rounded-full border-gray-200 dark:border-[#595f78]/10 text-gray-600 dark:text-[#595f78] relative overflow-hidden bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-[#0f1324] hover:text-gray-900 dark:hover:text-[#b9c0da] hover:border-gray-300 dark:hover:border-transparent transition-all",
        ],
      },
      size: {
        sm: "px-4 py-2 text-sm min-h-[40px]",
        md: "px-6 py-3 text-base min-h-[48px]",
        lg: "px-8 py-4 text-lg min-h-[56px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({
  children,
  variant,
  size,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) => {
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!isLoading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}

      <span className="z-[1] flex items-center gap-2">{children}</span>

      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
