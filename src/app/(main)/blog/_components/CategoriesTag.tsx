"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { slug } from "github-slugger";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BlogCategory } from "@/types/blog";

interface CategoriesTagProps {
  categories?: BlogCategory[];
}

const CategoriesTag = ({ categories = [] }: CategoriesTagProps) => {
  const pathname = usePathname();

  return (
    <div className="mx-auto mt-2 flex max-w-[800px] flex-wrap items-center justify-center gap-2.5">
      <Link href="/blog" className="group">
        <Button
          variant="tag"
          size="sm"
          className={cn(
            "transition-all duration-300 px-4 py-2 text-sm rounded-full",
            pathname === "/blog" ||
              (pathname.startsWith("/blog") && !pathname.includes("/category/"))
              ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:text-white hover:border-purple-700 shadow-md shadow-purple-600/20"
              : "text-gray-600 dark:text-white/70 hover:text-purple-600 dark:hover:text-purple-400 border-gray-200 dark:border-white/10 hover:border-purple-200 dark:hover:border-purple-500/30 bg-white/50 dark:bg-white/5 backdrop-blur-sm"
          )}
        >
          All
        </Button>
      </Link>

      {categories.map((category) => {
        const href = `/blog/category/${category.slug}`;
        const isActive = pathname === href;

        return (
          <Link key={category.id} href={href} className="group">
            <Button
              variant="tag"
              size="sm"
              className={cn(
                "transition-all duration-300 px-4 py-2 text-sm rounded-full capitalize",
                isActive
                  ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:text-white hover:border-purple-700 shadow-md shadow-purple-600/20"
                  : "text-gray-600 dark:text-white/70 hover:text-purple-600 dark:hover:text-purple-400 border-gray-200 dark:border-white/10 hover:border-purple-200 dark:hover:border-purple-500/30 bg-white/50 dark:bg-white/5 backdrop-blur-sm"
              )}
            >
              {slug(category.name)}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
export default CategoriesTag;
