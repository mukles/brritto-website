# Cloudflare Cache Setup Instructions

This guide will help you set up R2, D1, and Durable Objects for Next.js caching on Cloudflare.

## Prerequisites

- Cloudflare account with Workers access
- Wrangler CLI installed (`pnpm install -g wrangler`)
- Logged into Wrangler (`wrangler login`)

## Step 1: Create R2 Bucket

Create an R2 bucket for storing incremental cache data:

```bash
wrangler r2 bucket create inno-brritto-web-cache
```

This bucket is already configured in `wrangler.jsonc`.

## Step 2: Create D1 Database

Create a D1 database for tag cache:

```bash
wrangler d1 create inno-brritto-web-tags
```

**Important:** Copy the `database_id` from the output and update it in `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "NEXT_TAG_CACHE_D1",
    "database_name": "inno-brritto-web-tags",
    "database_id": "YOUR_ACTUAL_DATABASE_ID_HERE"  // ← Update this
  }
]
```

## Step 3: Initialize D1 Database Schema

Create the required table for tag revalidation tracking:

```bash
wrangler d1 execute inno-brritto-web-tags --remote --command "CREATE TABLE IF NOT EXISTS revalidations (
  tag TEXT PRIMARY KEY,
  revalidated_at INTEGER NOT NULL
)"
```

Or create a migration file and run it:

```bash
# Create migration
wrangler d1 migrations create inno-brritto-web-tags create_revalidations_table

# Add this to the generated migration file:
# CREATE TABLE IF NOT EXISTS revalidations (
#   tag TEXT PRIMARY KEY,
#   revalidated_at INTEGER NOT NULL
# );

# Apply migration
wrangler d1 migrations apply inno-brritto-web-tags --remote
```

## Step 4: Deploy Your Application

Build and deploy with the new configuration:

```bash
pnpm run deploy
```

This command will:

1. Build your Next.js application
2. Initialize the cache with build-time revalidation data
3. Deploy to Cloudflare Workers

## Step 5: Test Revalidation

Test time-based revalidation (ISR):

- Visit your blog pages - they should cache for 10 hours (36000 seconds)
- Check cache status in Cloudflare dashboard

Test on-demand revalidation:

```bash
# Set your revalidation secret first (if not already set)
wrangler secret put REVALIDATION_SECRET

# Then test the revalidation endpoint
curl "https://your-domain.com/api/revalidate?secret=YOUR_SECRET&tag=blog-posts"
```

## Environment Variables (Optional)

You can customize queue behavior with these environment variables:

```bash
# Set in wrangler.jsonc under "vars" or use wrangler secret
wrangler secret put NEXT_CACHE_DO_QUEUE_MAX_RETRIES  # default: 3
wrangler secret put NEXT_CACHE_DO_QUEUE_REVALIDATION_TIMEOUT_MS  # default: 30000
wrangler secret put NEXT_CACHE_DO_QUEUE_RETRY_INTERVAL_MS  # default: 1000
```

## Verify Setup

Check that everything is configured correctly:

```bash
# List R2 buckets
wrangler r2 bucket list

# List D1 databases
wrangler d1 list

# Check D1 table
wrangler d1 execute inno-brritto-web-tags --remote --command "SELECT * FROM revalidations LIMIT 5"
```

## Troubleshooting

### "Database not found" error

Make sure you've updated the `database_id` in wrangler.jsonc with the actual ID from Step 2.

### "Bucket not found" error

Verify the bucket was created successfully with `wrangler r2 bucket list`.

### Cache not working

1. Check that you've run the deploy command (not just build)
2. Verify bindings in wrangler.jsonc match the resource names
3. Check Cloudflare dashboard for any errors

## What's Configured

Your setup now includes:

✅ **R2 Incremental Cache** - Stores rendered pages and data
✅ **Durable Objects Queue** - Manages time-based revalidation
✅ **D1 Tag Cache** - Tracks on-demand revalidation tags
✅ **Cache Interception** - Improves cold start performance
✅ **Static Asset Caching** - Optimizes delivery of images/CSS/JS

## Next Steps

- Monitor cache hit rates in Cloudflare Analytics
- Consider adding cache purge if using a custom domain
- Adjust revalidation times based on your content update frequency
