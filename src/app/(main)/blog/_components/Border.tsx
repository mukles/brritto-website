import { cn } from "@/lib/utils";

export const BorderLeft = ({
  className,
  square = false,
}: {
  className?: string;
  square?: boolean;
}) => {
  return (
    <div
      className={cn(
        "main-border-gradient pointer-events-none absolute bottom-0 left-0 top-0 h-[calc(100%_*_1.2)] w-[1px]",
        square &&
          "before:!content-['] before:absolute before:left-0 before:top-0 before:z-[10000] before:size-[3px] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-muted",
        className
      )}
    />
  );
};
export const BorderRight = ({
  className,
  square = false,
}: {
  className?: string;
  square?: boolean;
}) => {
  return (
    <div
      className={cn(
        "main-border-gradient pointer-events-none absolute bottom-0 right-0 top-0 h-[calc(100%_*_1.2)] w-[1px]",
        square &&
          "before:!content-['] before:absolute before:right-0 before:top-0 before:z-[10000] before:size-[3px] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-muted",
        className
      )}
    />
  );
};

export const BorderFatCenter = ({
  className,
  square = false,
}: {
  className?: string;
  square?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-gradient-gray pointer-events-none absolute bottom-0 left-1/2 top-0 w-[410px] max-w-full -translate-x-1/2",
        className
      )}
    >
      <BorderLeft square={square} />
      <BorderRight square={square} />
    </div>
  );
};
