import { siteSchema } from '@/lib/schema';

/**
 * `/schema.json`, kept alive and no longer able to go stale.
 *
 * This URL predates the rebuild and is listed among the preserved ones in the
 * README, so it keeps resolving. What changed is where its contents come from:
 * it used to be a hand-written file in `public/` that nothing generated and
 * nothing checked, and it had drifted into naming a replaced social link and a
 * missing image. It is now the same object the pages embed, serialised.
 *
 * The embedded copy in `app/layout.tsx` is the one that does the work — a
 * crawler reads structured data from the page, not from a JSON file it has no
 * way to discover. This route exists so an old link does not break, and so
 * there is exactly one definition of these facts rather than two.
 */
export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify(siteSchema(), null, 2), {
    headers: { 'content-type': 'application/ld+json' },
  });
}
