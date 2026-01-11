import {
  getCategories,
  getCategoryBySlug,
  getPostsByCategory,
} from "@/lib/blog-api";
import { slug as slugger } from "github-slugger";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BlogHero from "../../_components/BlogHero";
import BlogListLoader from "../../_components/BlogListLoader";
import BlogListSkeleton from "../../_components/BlogListSkeleton";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Blogs | Britto`,
    description: `Explore our articles in ${category.name}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const currentPage = 1;

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
