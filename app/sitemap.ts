import type { MetadataRoute } from 'next';
import { INDEXABLE_ROUTES, absoluteUrl } from '@/lib/routes';

/**
 * Required by `output: 'export'`. A `sitemap.ts` / `robots.ts` is a Route
 * Handler, and a handler is dynamic until it says otherwise — which a build
 * with no server cannot honour, so it fails the export outright rather than
 * shipping a route that could never run. Both files are pure functions over a
 * constant, so declaring them static is a statement of fact, not a workaround.
 */
export const dynamic = 'force-static';

/**
 * `out/sitemap.xml`, generated at build time from `lib/routes.ts`.
 *
 * The site had none. Nothing was blocking the crawler — with no `robots.txt`
 * either, everything was allowed by default — but nothing was inviting it
 * past the homepage: `/phoenix/`, `/frequency/` and the two legal routes were
 * reachable only by following links, and the standalone apps are linked from a
 * section most crawls never scroll to.
 *
 * NO `lastModified`. It would have to be `new Date()` — the build clock — which
 * would restamp every URL as freshly changed on every deploy, including the
 * ones the deploy did not touch. A date that is wrong every time is a worse
 * signal than no date, and Google discounts `lastmod` it learns not to trust.
 * Add a real one per route the day the routes carry real dates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
