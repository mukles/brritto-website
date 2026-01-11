import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isCloudflare = !!process.env.CF_PAGES || !!process.env.CLOUDFLARE_WORKER;

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brritto-blog-media-upload.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "webapps.globalaffairs.com.bd",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/courses",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/courses/:classSlug",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/blog",
        permanent: true,
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development" || isCloudflare,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "gstatic-fonts-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-image-cache",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources-cache",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
      },
    },
  ],
})(nextConfig);

// Export without PWA wrapper on Cloudflare to avoid Node.js API usage
export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
