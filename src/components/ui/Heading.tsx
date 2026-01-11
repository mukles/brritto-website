import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

export const titleVariants = cva("leading-[1.2]", {
  variants: {
    variant: {
      default: "",
      gradient: "gradient-text",
      "light-gradient": "gradient-text-light",
    },
    level: {
      h1: "text-h1-sm lg:text-h1 tracking-lg",
      h2: "text-h2-sm lg:text-h2 tracking-lg",
      h3: "text-h3-sm lg:text-h3 tracking-sm",
      h4: "text-h4-sm lg:text-h4 tracking-sm",
      h5: "text-h5-sm lg:text-h5 tracking-sm",
      h6: "text-base tracking-normal",
    },
  },
  defaultVariants: {
    level: "h1",
    variant: "default",
  },
});

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof titleVariants> {
  level?: HeadingLevel;
}

const Heading = ({
  className,
  level = "h1",
  variant,
  ...props
}: HeadingProps) => {
  const Comp = level;

  return (
    <Comp
      className={cn(titleVariants({ level, variant, className }))}
      {...props}
    />
  );
};

export default Heading;
