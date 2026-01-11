import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
  // R2 for incremental cache storage (ISR/SSG data)
  incrementalCache: r2IncrementalCache,

  // Durable Objects Queue for time-based revalidation
  queue: doQueue,

  // D1 Tag Cache for on-demand revalidation (revalidateTag/revalidatePath)
  tagCache: d1NextTagCache,

  // Enable cache interception for better performance on cached routes
  // Disable this if you use PPR
  enableCacheInterception: true,
});
