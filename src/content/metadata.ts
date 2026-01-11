import { Metadata } from "next";

export const siteConfig = {
  name: "Brritto",
  title: "Brritto - Master Your Skills",
  description:
    "Your ultimate learning platform for courses, books, and customized testing. Practice with chapter-wise tests, track your progress, and achieve excellence.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://brritto.com",
  ogImage: "/images/og-image.png",
  keywords: [
    "education",
    "courses",
    "books",
    "learning",
    "testing",
    "Brritto",
    "online learning",
  ],
  creator: "Brritto Team",
  themeColor: "#7C3AED", // purple-600
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@brritto",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const homeMetadata: Metadata = {
  ...baseMetadata,
  title: "Home",
  openGraph: {
    ...baseMetadata.openGraph,
    title: siteConfig.title,
  },
};
