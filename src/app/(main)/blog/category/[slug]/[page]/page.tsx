import { blogConfig } from "@/config/blog";
import {
  getCategories,
  getCategoryBySlug,
  getPostsByCategory,
} from "@/lib/blog-api";
import { slug as slugger } from "github-slugger";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import BlogHero from "../../../_components/BlogHero";
import BlogListLoader from "../../../_components/BlogListLoader";
import BlogListSkeleton from "../../../_components/BlogListSkeleton";

interface Props {
  params: Promise<{
    slug: string;
    page: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Blogs - Page ${page} | Britto`,
    description: `Explore our articles in ${category.name} - Page ${page}`,
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  const params: { slug: string; page: string }[] = [];
  const POSTS_PER_PAGE = blogConfig.pagination.postsPerPage;

  for (const category of categories) {
    const totalPages = Math.ceil(category.count / POSTS_PER_PAGE);
    for (let i = 2; i <= totalPages; i++) {
      params.push({ slug: category.slug, page: String(i) });
    }
  }

  return params;
}

export default async function CategoryPaginationPage({ params }: Props) {
  const { slug, page } = await params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 2) {
    redirect(`/blog/category/${slug}`);
  }

  const categoryPromise = getCategoryBySlug(slug);
  const categoriesPromise = getCategories();

  const postsPromise = categoryPromise.then((category) => {
    if (!category) return { posts: [], totalPages: 0 };
    return getPostsByCategory(category.id, currentPage);
  });

  const [category, categories] = await Promise.all([
    categoryPromise,
    categoriesPromise,
  ]);

  if (!category) {
    notFound();
  }

  return (
    <>
      <BlogHero
        title={`${slugger(category.name)} Blogs`}
        description={
          <span>
            Found{" "}
            <span className="font-bold text-black dark:text-white">
              {category.count} articles
            </span>{" "}
            in this category
          </span>
        }
        categories={categories}
      />

      <Suspense fallback={<BlogListSkeleton />}>
        <BlogListLoader
          postsPromise={postsPromise}
          initialPage={currentPage}
          basePath={`/blog/category/${slug}`}
          paginationMode="path"
        />
      </Suspense>
    </>
  );
}
