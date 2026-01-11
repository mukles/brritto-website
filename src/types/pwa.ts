/**
 * PWA Manifest interface
 */
export interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: "standalone" | "fullscreen" | "minimal-ui";
  background_color: string;
  theme_color: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
}

/**
 * Service Worker cache configuration
 */
export interface CacheConfig {
  cacheName: string;
  staticAssets: string[];
  cacheStrategy: "cache-first" | "network-first" | "stale-while-revalidate";
}
