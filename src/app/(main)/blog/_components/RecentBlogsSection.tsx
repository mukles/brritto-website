import { getPosts } from "@/lib/blog-api";
import BlogRow from "./BlogRow";

export default async function RecentBlogsSection() {
  const { posts } = await getPosts(1, 4);
  const blogPosts = posts;

  return (
    <BlogRow
      title="Recent Blogs"
      description="Check out our latest articles and updates."
      buttonLabel="View All"
      blogs={blogPosts}
      className="bg-gray-50 dark:bg-[#0a0a1f]/50"
    />
  );
}
