import BlogHero from "@/app/(main)/blog/_components/BlogHero";
import PaginatedBlogView from "@/app/(main)/blog/_components/PaginatedBlogView";
import { getPostsByTag, getTagBySlug, getTags } from "@/lib/blog-api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BlogListSkeleton from "../../_components/BlogListSkeleton";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  return {
    title: `${tag.name} Blogs | Britto`,
    description: `Explore our articles tagged with ${tag.name}`,
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const currentPage = 1;

  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const { posts, totalPages } = await getPostsByTag(tag.id, currentPage);
  const blogPosts = posts;

  return (
    <>
      <BlogHero
        title={`${tag.name} Blogs`}
        description={`Found ${tag.count} articles tagged with "${tag.name}"`}
        showCategories={false}
      />

      <Suspense fallback={<BlogListSkeleton />}>
        <PaginatedBlogView
          blogs={blogPosts}
          initialPage={currentPage}
          totalPages={totalPages}
          basePath={`/blog/tag/${slug}`}
          paginationMode="path"
        />
      </Suspense>
    </>
  );
}
