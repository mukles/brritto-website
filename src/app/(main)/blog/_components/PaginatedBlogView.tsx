"use client";

import Pagination from "@/components/ui/Pagination";
import { blogConfig } from "@/config/blog";
import { BlogPost } from "@/types/blog";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import BlogRow from "./BlogRow";

interface PaginatedBlogViewProps {
  blogs: BlogPost[];
  itemsPerPage?: number;
  initialPage?: number;
  totalPages?: number;
  basePath?: string;
  paginationMode?: "path" | "query";
}

export default function PaginatedBlogView({
  blogs,
  itemsPerPage = blogConfig.pagination.postsPerPage,
  initialPage = 1,
  totalPages: serverTotalPages,
  basePath = "/blog",
  paginationMode = "path",
}: PaginatedBlogViewProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [isPending, startTransition] = useTransition();

  // If serverTotalPages is provided, use it. Otherwise calculate from blogs length (client-side fallback/filtering)
  const totalPages = serverTotalPages ?? Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // If serverTotalPages is provided, assume blogs are already paginated
  const currentBlogs = serverTotalPages
    ? blogs
    : blogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    startTransition(() => {
      // Navigate to the correct URL
      if (paginationMode === "path") {
        if (page === 1) {
          router.push(basePath);
        } else {
          router.push(`${basePath}/${page}`);
        }
      } else {
        // Query mode
        if (page === 1) {
          router.push(basePath);
        } else {
          router.push(`${basePath}?page=${page}`);
        }
      }
    });

    // Scroll to top
    const element = document.getElementById("all-blogs");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (currentBlogs.length === 0) {
    return (
      <div id="all-blogs" className="py-20 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
          <svg
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          No articles found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          We couldn&apos;t find any articles matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      id="all-blogs"
      className={`transition-opacity duration-300 ${isPending ? "opacity-50" : "opacity-100"}`}
    >
      <BlogRow
        title="All Blogs"
        description="Explore our complete collection of articles, insights, and resources."
        blogs={currentBlogs}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </BlogRow>
    </div>
  );
}
