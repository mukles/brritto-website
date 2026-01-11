import Head from "next/head"; // If using Next.js, or adjust for your framework

interface RankMathSeoData {
  // RankMath SEO fields
  rank_math_title?: string;
  rank_math_description?: string;
  rank_math_focus_keyword?: string;
  rank_math_robots?: string[];
  rank_math_canonical_url?: string;
  rank_math_facebook_title?: string;
  rank_math_facebook_description?: string;
  rank_math_facebook_image?: string;
  rank_math_twitter_title?: string;
  rank_math_twitter_description?: string;
  rank_math_twitter_image?: string;
  rank_math_twitter_card_type?: string;
  // WordPress fallback fields
  title?: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  link?: string;
  // Embedded featured media
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
}

interface SeoMetaProps {
  seoData?: RankMathSeoData;
  // Override options
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
}

// Utility to strip HTML tags
const stripHtml = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

// Decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  if (!text) return "";
  const textarea =
    typeof document !== "undefined" ? document.createElement("textarea") : null;
  if (textarea) {
    textarea.innerHTML = text;
    return textarea.value;
  }
  // Server-side fallback
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");
};

// Site config - adjust to your needs
const siteConfig = {
  siteName: "Your Site Name",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com",
  defaultImage: "/images/default-og.jpg",
  defaultDescription: "Your default site description",
  twitterHandle: "@yourhandle",
  locale: "en_US",
};

const SeoMeta = ({
  seoData,
  title: overrideTitle,
  description: overrideDescription,
  image: overrideImage,
  canonical: overrideCanonical,
  noindex: overrideNoindex,
}: SeoMetaProps) => {
  // Get featured image from embedded media
  const featuredImage =
    seoData?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  // Resolve values with priority: override > RankMath > WordPress fallback > default
  const title = decodeHtmlEntities(
    overrideTitle ||
      seoData?.rank_math_title ||
      stripHtml(seoData?.title?.rendered || "") ||
      siteConfig.siteName
  );

  const description = decodeHtmlEntities(
    overrideDescription ||
      seoData?.rank_math_description ||
      stripHtml(seoData?.excerpt?.rendered || "") ||
      siteConfig.defaultDescription
  );

  const canonical =
    overrideCanonical ||
    seoData?.rank_math_canonical_url ||
    seoData?.link ||
    siteConfig.baseUrl;

  const ogImage =
    overrideImage ||
    seoData?.rank_math_facebook_image ||
    featuredImage ||
    `${siteConfig.baseUrl}${siteConfig.defaultImage}`;

  const twitterImage =
    overrideImage ||
    seoData?.rank_math_twitter_image ||
    seoData?.rank_math_facebook_image ||
    featuredImage ||
    `${siteConfig.baseUrl}${siteConfig.defaultImage}`;

  // Facebook/OG specific
  const ogTitle = decodeHtmlEntities(
    seoData?.rank_math_facebook_title || title
  );
  const ogDescription = decodeHtmlEntities(
    seoData?.rank_math_facebook_description || description
  );

  // Twitter specific
  const twitterTitle = decodeHtmlEntities(
    seoData?.rank_math_twitter_title ||
      seoData?.rank_math_facebook_title ||
      title
  );
  const twitterDescription = decodeHtmlEntities(
    seoData?.rank_math_twitter_description ||
      seoData?.rank_math_facebook_description ||
      description
  );
  const twitterCardType =
    seoData?.rank_math_twitter_card_type || "summary_large_image";

  // Handle robots/noindex
  const robots = seoData?.rank_math_robots || [];
  const shouldNoindex = overrideNoindex || robots.includes("noindex");
  const shouldNofollow = robots.includes("nofollow");

  const robotsContent = [
    shouldNoindex ? "noindex" : "index",
    shouldNofollow ? "nofollow" : "follow",
  ].join(",");

  // Focus keyword for meta (optional)
  const focusKeyword = seoData?.rank_math_focus_keyword;

  return (
    <Head>
      {/* Title */}
      <title>{title}</title>

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Robots */}
      <meta name="robots" content={robotsContent} />

      {/* Basic Meta */}
      <meta name="description" content={description} />

      {/* Focus Keyword (optional) */}
      {focusKeyword && <meta name="keywords" content={focusKeyword} />}

      {/* Open Graph */}
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:site" content={siteConfig.twitterHandle} />
      <meta name="twitter:creator" content={siteConfig.twitterHandle} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
    </Head>
  );
};

export default SeoMeta;
