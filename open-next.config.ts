import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import * as kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache.default,
});
