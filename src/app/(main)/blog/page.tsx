import { getCategories, getPosts } from "@/lib/blog-api";
import { Suspense } from "react";
import BlogHero from "./_components/BlogHero";
import BlogListLoader from "./_components/BlogListLoader";
import BlogListSkeleton from "./_components/BlogListSkeleton";

export default async function BlogsPage() {
  const currentPage = 1;

  const categoriesPromise = getCategories();

  const postsPromise = getPosts(currentPage);

  const categories = await categoriesPromise;

  return (
    <>
      <BlogHero categories={categories} />

      <Suspense fallback={<BlogListSkeleton />}>
        <BlogListLoader
          postsPromise={postsPromise}
          initialPage={currentPage}
          basePath="/blog"
          paginationMode="path"
        />
      </Suspense>
    </>
  );
}
