import { blogConfig } from "@/config/blog";
import { getPostsByTag, getTagBySlug, getTags } from "@/lib/blog-api";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import BlogHero from "../../../_components/BlogHero";
import BlogListSkeleton from "../../../_components/BlogListSkeleton";
import PaginatedBlogView from "../../../_components/PaginatedBlogView";

interface Props {
  params: Promise<{
    slug: string;
    page: string;
  }>;
}

export async function generateStaticParams() {
  const tags = await getTags();
  const params: { slug: string; page: string }[] = [];
  const POSTS_PER_PAGE = blogConfig.pagination.postsPerPage;

  for (const tag of tags) {
    const totalPages = Math.ceil(tag.count / POSTS_PER_PAGE);
    for (let i = 2; i <= totalPages; i++) {
      params.push({ slug: tag.slug, page: String(i) });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  return {
    title: `${tag.name} Blogs - Page ${page} | Britto`,
    description: `Explore our articles tagged with ${tag.name} - Page ${page}`,
  };
}

export default async function TagPaginationPage({ params }: Props) {
  const { slug, page } = await params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 2) {
    redirect(`/blog/tag/${slug}`);
  }

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
