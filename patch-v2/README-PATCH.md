# Daddieshinor reliability patch v2 (targeted, not full-project refactor)

Files changed:
- src/app/api/wp-proxy/route.tsx: restricts proxy to public WordPress REST resources; adds 10-second timeout, 60-second server caching, forwards pagination headers, avoids leaking upstream details.
- src/components/latest.tsx: Promise.allSettled allows partial category success.
- src/components/headlines/MobileAllPosts.tsx: removes ineffective browser `next.revalidate`, uses pagination metadata, distinguishes errors from empty results.

IMPORTANT: This is a source-level patch only. No npm build, deployed smoke test, or load test has been run. Check that all your proxy consumers use supported resources (posts/categories/tags/media) before deploying. Existing WP_URL must point to the WordPress origin, not a REST endpoint.

Install: Extract the ZIP into a clean local copy of the project, preserving paths. Review the diff, run npm install (if needed), npm run build, and test in a Vercel preview deployment. Do not overwrite production without validation.

Known remaining work: consolidate direct browser fetches, fix pagination/category reset in headline components, audit global loader dependencies, optimize image requests, and measure repeated requests on Vercel.
