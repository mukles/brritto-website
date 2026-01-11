import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const dotVariants = cva(
  "h-[3px] w-[3px] inline-block absolute bg-gray-300 dark:bg-[#60677F]",
  {
    variants: {
      shape: {
        default: "",
        circle: "rounded-full",
      },
      position: {
        "top-right": "top-0 right-[-1px]",
        "top-left": "top-0 left-[-1px]",
        "bottom-left": "bottom-0 left-0",
        "bottom-right": "bottom-0 right-0",
        "top-center": "top-0 left-1/2 -translate-x-1/2",
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      shape: "default",
      position: "top-left",
    },
  }
);

interface FloatingDotProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof dotVariants> {}

const FloatingDot = ({
  shape,
  position,
  className,
  ...props
}: FloatingDotProps) => {
  return (
    <span
      className={cn(dotVariants({ shape, position }), className)}
      {...props}
    />
  );
};

export default FloatingDot;

export const TopFloatingDots = ({
  shape = "default",
  className,
}: {
  shape?: "circle" | "default" | null | undefined;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -top-[1.5px] left-0 z-1 h-[3px] w-full",
        className
      )}
    >
      <FloatingDot shape={shape} position="top-left" />
      <FloatingDot shape={shape} position="top-center" />
      <FloatingDot shape={shape} position="top-right" />
    </div>
  );
};

export const BottomFloatingDots = ({
  shape = "default",
  className,
}: {
  shape?: "circle" | "default" | null | undefined;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -bottom-[1.5px] left-0 z-1 h-[3px] w-full",
        className
      )}
    >
      <FloatingDot shape={shape} position="bottom-left" />
      <FloatingDot shape={shape} position="bottom-center" />
      <FloatingDot shape={shape} position="bottom-right" />
    </div>
  );
};
