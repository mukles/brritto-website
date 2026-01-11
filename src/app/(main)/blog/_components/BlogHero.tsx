"use client";

import Heading from "@/components/ui/Heading";
import PageDots from "@/components/ui/PageDots";
import Separator from "@/components/ui/Separator";
import { cn } from "@/lib/utils";
import CategoriesTag from "./CategoriesTag";
import HeroBorder from "./Heroborder";

import { BlogCategory } from "@/types/blog";

interface BlogHeroProps {
  title?: string;
  description?: React.ReactNode;
  className?: string;
  showCategories?: boolean;
  categories?: BlogCategory[];
}

export default function BlogHero({
  title = "Our Blog & Articles",
  description = (
    <span>
      Stay updated with the latest news, insights, and stories from our blog.
    </span>
  ),
  className,
  showCategories = true,
  categories = [],
}: BlogHeroProps) {
  return (
    <section
      className={cn(
        "bg-white dark:bg-[#0a0a1f] relative transition-colors duration-300",
        className
      )}
    >
      <PageDots hideOnScroll />

      {/* Enhanced background glows matching your design */}
      {/* Enhanced background glows matching your design */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#852DFE]/5 dark:bg-[#852DFE]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ec4899]/5 dark:bg-[#ec4899]/15 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#852DFE]/5 dark:bg-[#852DFE]/10 rounded-full blur-[140px]" />

      {/* Top border - matching your header purple */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#852DFE]/20 dark:via-[#852DFE]/40 to-transparent" />

      {/* Radial gradients - Updated with your brand colors */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(133,45,254,0.05),transparent)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(133,45,254,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_60%,rgba(133,45,254,0.05),transparent)] dark:bg-[radial-gradient(ellipse_50%_50%_at_80%_60%,rgba(133,45,254,0.1),transparent)]" />

      <div className="container-md relative pt-[60px] pb-16 text-center max-lg:overflow-hidden z-10">
        <div className="relative z-30 mx-auto flex max-w-[1180px] flex-col items-center">
          <Heading
            level="h1"
            className="mb-8 text-gray-900 dark:text-white text-[48px] leading-[1.05] md:text-[64px] lg:text-[72px] font-extrabold tracking-tight max-w-[950px] text-balance capitalize"
          >
            {title}
          </Heading>

          <p className="text-gray-600 dark:text-slate-300 mx-auto max-w-[650px] text-lg md:text-xl leading-relaxed text-balance">
            {description}
          </p>

          {showCategories && <CategoriesTag categories={categories} />}
        </div>

        <HeroBorder bottomSquare />
      </div>

      <div className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 h-full w-[15%] bg-gradient-to-r from-white dark:from-[#0a0a1f] to-transparent" />
        <div className="absolute top-0 right-0 h-full w-[15%] bg-gradient-to-l from-white dark:from-[#0a0a1f] to-transparent" />
      </div>

      <PageDots />
      <Separator size="lg" />
    </section>
  );
}
