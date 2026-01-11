import { getPostBySlug, getPosts } from "@/lib/blog-api";
import { Calendar, Clock } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import BlogHero from "../_components/BlogHero";
import PaginatedBlogView from "../_components/PaginatedBlogView";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const { posts } = await getPosts(1, 20);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const isPageNumber = /^\d+$/.test(slug);

  if (isPageNumber) {
    const pageNum = parseInt(slug);
    return {
      title: `All Blogs - Page ${pageNum} | Britto`,
      description: "Explore our collection of articles and resources.",
    };
  }

  const wpPost = await getPostBySlug(slug);

  if (!wpPost) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${wpPost.title} | Britto`,
    description: wpPost.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const isPageNumber = /^\d+$/.test(slug);

  if (isPageNumber) {
    const pageNum = parseInt(slug);

    if (pageNum === 1) {
      redirect("/blog");
    }

    const { posts, totalPages } = await getPosts(pageNum);
    const blogPosts = posts;

    return (
      <>
        <BlogHero />
        <PaginatedBlogView
          blogs={blogPosts}
          initialPage={pageNum}
          totalPages={totalPages}
        />
      </>
    );
  }

  const wpPost = await getPostBySlug(slug);

  if (!wpPost) {
    notFound();
  }

  const post = wpPost;

  /*
   * Removing Related Articles logic as requested
   */
  // const { posts: recentPosts } = await getPosts(1, 5);
  // const relatedPosts = recentPosts
  //   .filter((p) => String(p.id) !== String(post.id))
  //   .slice(0, 4);

  return (
    <>
      <BlogHero
        title={post.title}
        description={post.excerpt}
        showCategories={false}
        className="pb-20"
      />

      <article className="relative z-10 container max-w-4xl mx-auto px-4 pb-20 text-gray-900 dark:text-white">
        {/* Featured Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-[#852DFE]/20 mb-10 group">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Meta Info Bar */}
        <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-sm mb-12">
          <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-sm font-medium">
            <Calendar className="w-4 h-4 text-[#852DFE]" />
            <span>{post.publishedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-sm font-medium">
            <Clock className="w-4 h-4 text-[#852DFE]" />
            <span>{post.readTime}</span>
          </div>

          <div className="ml-auto">
            <span className="px-3 py-1 bg-[#852DFE]/20 border border-[#852DFE]/30 text-[#852DFE] rounded-full text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-6 prose-h3:text-gray-800 dark:prose-h3:text-[#efeff1]
            prose-p:text-gray-700 dark:prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-a:text-[#852DFE] prose-a:no-underline hover:prose-a:text-[#ec4899] prose-a:transition-colors
            prose-a:text-[#852DFE] prose-a:no-underline hover:prose-a:text-[#ec4899] prose-a:transition-colors
            mb-10"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
              Tags:
            </span>
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white/80 rounded-full text-xs transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Separator */}
        <div className="border-b border-gray-200 dark:border-white/10 mb-20" />
      </article>

      {/* Related Articles Removed */}
    </>
  );
}
