/**
 * Measurement identities, and the one decision that governs when they run.
 *
 * NOTHING HERE LOADS BEFORE CONSENT. Not the analytics tag, not the pixel.
 * Google calls this "basic" consent mode, as opposed to "advanced", where the
 * tags load immediately with storage denied and send cookieless pings that feed
 * Google's conversion modelling. Advanced measures more, and there is a real
 * argument that it is lawful — no cookie is written and no identifier is
 * stored. It is a decision for the site's own counsel rather than for its
 * developer, so the build takes the position that cannot be wrong and makes the
 * other one a one-line change: see `components/chrome/Analytics.tsx`.
 *
 * Expect the numbers to drop. Every visitor who ignores the banner is now
 * invisible, where previously all of them were counted. The old figures were
 * not more accurate — they were collected without asking.
 */

/**
 * GA4.
 *
 * Supplied by the owner on 21 August 2026, replacing `G-99P3F76R3D` which had
 * been hardcoded in `app/layout.tsx` since before this file existed. A
 * measurement ID is a different property, not a renamed one: nothing recorded
 * against the old ID appears under this one, and the two do not merge. The old
 * property still holds its history if anyone needs it.
 */
export const GA_MEASUREMENT_ID = 'G-7SRD8PNPXL';

/**
 * Meta (Facebook/Instagram) pixel. Supplied by the owner, 21 August 2026.
 *
 * Setting this constant is not only a measurement change. The cookie policy's
 * marketing rows and its extra-EU transfer notice are derived from it in
 * `lib/legal.ts`, so switching it on also publishes the declaration that this
 * site runs advertising profiling and names Meta Platforms Ireland as a
 * recipient. That is deliberate: the alternative is a live pixel and a policy
 * that says there is not one.
 *
 * Back to `null` removes the pixel and the declaration together, in one edit.
 */
export const META_PIXEL_ID: string | null = '2045132236209414';

/**
 * Where the visitor's answer is kept.
 *
 * `localStorage`, not a cookie: a cookie recording consent would be sent on
 * every request to no purpose, and the irony of setting one to remember a
 * refusal is worth avoiding. Versioned, so that adding a third-party tool later
 * can invalidate old answers — consent is given to a specific set of purposes,
 * and silently extending it to a new one is not consent.
 */
export const CONSENT_KEY = 'bj:consent:v1';

export type ConsentChoice = 'granted' | 'denied';

/** 'unknown' until the visitor has answered, which is not the same as denied. */
export type ConsentStatus = ConsentChoice | 'unknown';

/**
 * The Consent Mode v2 signals, in the two shapes they are ever sent.
 *
 * `ad_user_data` and `ad_personalization` are the two v2 added in March 2024,
 * and they are the reason this matters commercially rather than only legally:
 * without them Google drops EEA traffic from remarketing audiences and
 * conversion measurement outright. A site that intends to advertise cannot skip
 * them and still expect its campaigns to have anything to optimise against.
 */
export const CONSENT_SIGNALS = {
  denied: {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  },
  granted: {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  },
} as const;
