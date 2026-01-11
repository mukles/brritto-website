import { blogConfig } from "@/config/blog";
import { calculateReadTime } from "@/lib/readTime";
import { BlogCategory, BlogPost, BlogTag } from "@/types/blog";
import type { WPPost } from "@/types/wordpress";

const WP_BASE_URL = process.env.BLOG_API_URL;

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export async function wpFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> {
  // Early return if WordPress API URL is not configured
  if (!WP_BASE_URL) {
    console.warn("BLOG_API_URL is not configured. Skipping WordPress fetch.");
    return null;
  }

  try {
    const { params, ...fetchOptions } = options;

    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== undefined) acc[key] = String(value);
              return acc;
            },
            {} as Record<string, string>
          )
        ).toString()
      : "";

    const res = await fetch(`${WP_BASE_URL}${endpoint}${query}`, {
      headers: {
        "X-API-KEY": process.env.SECRET_KEY || "",
      },
      next: {
        ...(fetchOptions.next || {}),
      },
      ...fetchOptions,
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

export async function wpFetchWithMeta<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T; totalPages: number } | null> {
  // Early return if WordPress API URL is not configured
  if (!WP_BASE_URL) {
    console.warn("BLOG_API_URL is not configured. Skipping WordPress fetch.");
    return null;
  }

  try {
    const { params, ...fetchOptions } = options;

    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== undefined) acc[key] = String(value);
              return acc;
            },
            {} as Record<string, string>
          )
        ).toString()
      : "";

    const res = await fetch(`${WP_BASE_URL}${endpoint}${query}`, {
      headers: {
        "X-API-KEY": process.env.SECRET_KEY || "",
      },
      next: {
        ...(fetchOptions.next || {}),
      },
      ...fetchOptions,
    });

    if (!res.ok) {
      return null;
    }

    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "0", 10);
    const data = await res.json();

    return { data, totalPages };
  } catch {
    return null;
  }
}

// Internal mapping function
function mapWPPostToBlogPost(post: WPPost): BlogPost {
  const authorName = post._embedded?.author?.[0]?.name || "Anonymous";
  const authorAvatar =
    post._embedded?.author?.[0]?.avatar_urls?.["96"] || // Types needs update for avatar_urls
    "/images/avatars/default.png";

  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const image = featuredMedia?.source_url || "/images/blog/placeholder.jpg";

  // Category mapping
  const categoryTerm = post._embedded?.["wp:term"]?.[0]?.find(
    (term) => term.taxonomy === "category"
  );
  const category = categoryTerm?.name || "Uncategorized";

  return {
    id: String(post.id),
    title: post.title.rendered,
    excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ""), // Strip HTML
    category,
    author: {
      name: authorName,
      avatar: authorAvatar,
    },
    publishedDate: new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    readTime: calculateReadTime(post.content.rendered),
    image,
    slug: post.slug,
    content: post.content.rendered,
    tags:
      post._embedded?.["wp:term"]
        ?.flat()
        .filter((term) => term.taxonomy === "post_tag")
        .map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        })) || [],
  };
}

export async function getPosts(
  page = 1,
  perPage: number = blogConfig.pagination.postsPerPage
): Promise<{ posts: BlogPost[]; totalPages: number }> {
  const result = await wpFetchWithMeta<WPPost[]>("/posts", {
    params: {
      page,
      per_page: perPage,
      _embed: true,
    },
    next: { tags: ["posts"] },
  });

  if (!result) return { posts: [], totalPages: 0 };
  const { data, totalPages } = result;

  return { posts: data.map(mapWPPostToBlogPost), totalPages };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await wpFetch<WPPost[]>("/posts", {
    params: {
      slug,
      _embed: true,
    },
    next: { tags: ["posts"] },
  });

  if (!posts || !posts[0]) return null;
  return mapWPPostToBlogPost(posts[0]);
}

export async function getCategories(): Promise<BlogCategory[]> {
  const categories = await wpFetch<BlogCategory[]>("/categories", {
    params: {
      per_page: 100,
    },
    next: { tags: ["categories"] },
  });

  return categories || [];
}

export async function getTags(): Promise<BlogTag[]> {
  const tags = await wpFetch<BlogTag[]>("/tags", {
    params: {
      per_page: 100,
    },
    next: { tags: ["tags"] },
  });

  return tags || [];
}

export async function getPostsByCategory(
  categoryId: number,
  page = 1,
  perPage: number = blogConfig.pagination.postsPerPage
): Promise<{ posts: BlogPost[]; totalPages: number }> {
  const result = await wpFetchWithMeta<WPPost[]>("/posts", {
    params: {
      categories: categoryId,
      page,
      per_page: perPage,
      _embed: true,
    },
    next: { tags: ["posts", "categories"] },
  });

  if (!result) return { posts: [], totalPages: 0 };
  const { data, totalPages } = result;

  return { posts: data.map(mapWPPostToBlogPost), totalPages };
}

export async function getCategoryBySlug(
  slug: string
): Promise<BlogCategory | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}

export async function getTagBySlug(slug: string): Promise<BlogTag | undefined> {
  const tags = await getTags();
  return tags.find((t) => t.slug === slug);
}

export async function getPostsByTag(
  tagId: number,
  page = 1,
  perPage: number = blogConfig.pagination.postsPerPage
): Promise<{ posts: BlogPost[]; totalPages: number }> {
  const result = await wpFetchWithMeta<WPPost[]>("/posts", {
    params: {
      tags: tagId,
      page,
      per_page: perPage,
      _embed: true,
    },
    next: { tags: ["posts", "tags"] },
  });

  if (!result) return { posts: [], totalPages: 0 };
  const { data, totalPages } = result;

  return { posts: data.map(mapWPPostToBlogPost), totalPages };
}
