"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import FloatingDot from "./FloatingDot";

function PageDots({
  className,
  hideOnScroll = false,
}: {
  className?: string;
  hideOnScroll?: boolean;
}) {
  const { scrollY } = useScroll();
  const [isShow, setIsHow] = useState<boolean>(true);

  useEffect(() => {
    if (!hideOnScroll) return;
    const unSubY = scrollY.on("change", (val) => {
      if (val > 0) {
        setIsHow(false);
      } else {
        setIsHow(true);
      }
    });

    return () => {
      unSubY();
    };
  }, []);

  return (
    <motion.div
      className={cn(
        "container-md absolute left-1/2 -mt-[1.5px] h-[3px] w-full -translate-x-1/2 overflow-hidden max-lg:hidden",
        hideOnScroll && "z-30",
        className
      )}
      transition={{ duration: 0.1 }}
      initial={{ opacity: 1 }}
      animate={isShow ? { opacity: 1 } : { opacity: 0 }}
    >
      <FloatingDot position="top-left" />
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-1/2 top-0 h-full w-[410px] max-w-full -translate-x-1/2"
        )}
      >
        <FloatingDot position="top-left" />
        <FloatingDot position="top-right" />
      </div>
      <FloatingDot position="top-right" />
    </motion.div>
  );
}

export default PageDots;
