"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  size?: "default" | "lg";
  decorative?: boolean;
}

const Separator: React.FC<SeparatorProps> = ({
  className,
  orientation = "horizontal",
  size = "default",
  decorative = true,
  ...props
}) => {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "bg-divider-lg shrink-0",
        orientation === "horizontal"
          ? "h-[1px] w-full"
          : "vertical h-full w-[1px]",
        size === "default" && "bg-divider",
        size === "lg" && "bg-divider-lg",
        className
      )}
      {...props}
    />
  );
};

export default Separator;
