import { BlogPost } from "@/types/blog";
import PaginatedBlogView from "./PaginatedBlogView";

interface BlogListLoaderProps {
  postsPromise: Promise<{
    posts: BlogPost[];
    totalPages: number;
  }>;
  initialPage: number;
  basePath: string;
  paginationMode?: "path" | "query";
}

export default async function BlogListLoader({
  postsPromise,
  initialPage,
  basePath,
  paginationMode = "query",
}: BlogListLoaderProps) {
  const { posts, totalPages } = await postsPromise;

  const blogPosts = posts;

  return (
    <PaginatedBlogView
      blogs={blogPosts}
      initialPage={initialPage}
      totalPages={totalPages}
      basePath={basePath}
      paginationMode={paginationMode}
    />
  );
}
