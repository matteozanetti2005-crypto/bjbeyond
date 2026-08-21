'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useConsent } from './Consent';
import {
  CONSENT_SIGNALS,
  GA_MEASUREMENT_ID,
  META_PIXEL_ID,
} from '@/lib/analytics';

/**
 * The measurement tags, and the only place they are allowed to load.
 *
 * Rendered inside ConsentProvider, and it renders nothing at all until the
 * visitor has said yes. Refusing, or ignoring the banner, means no request is
 * made to Google or to Meta — not a request with storage disabled, no request.
 * See the note in lib/analytics.ts for what that costs and what the alternative
 * would be.
 *
 * ONE PAGE VIEW PER PAGE, AND NO CODE HERE TO ARRANGE IT.
 *
 * This file sends no page views. Every link between pages is a plain anchor —
 * see components/primitives/ArrowLink.tsx — so each page is a fresh document
 * load, which is the situation both tags are built for: `gtag('config')` sends
 * one page view, the pixel snippet sends one PageView, and neither needs help.
 *
 * IT WAS NOT ALWAYS THIS WAY, and the measurements are worth keeping because
 * every wrong version of this looked like it worked.
 *
 * With `next/link` the document never reloads, so both tags had to be driven by
 * hand from a `usePathname` effect. Three attempts, each failing quietly:
 *
 *  - Manual `page_view` on every route change DOUBLED the count, because GA4's
 *    Enhanced Measurement is already watching History API changes and sending
 *    its own. Eleven hits across a six-page walk.
 *  - `send_page_view: false` removed the landing page instead of the duplicate.
 *  - Leaving GA to Enhanced Measurement alone LOST navigations: four page views
 *    across the same six pages, `/art/` and `/labs/` missing entirely. A third
 *    of the traffic, absent from the report the ad spend would be judged on.
 *
 * None of the three raised an error. The only way to tell them apart was to
 * intercept `sendBeacon`, `fetch`, `XMLHttpRequest` and `Image.src` and count
 * what actually left the browser — resource timing undercounts, because GA4
 * batches several events into one request.
 *
 * Full document loads end the whole category. The cost is a repaint between
 * pages, on a static file already sitting on a CDN. The benefit is that the
 * numbers are right without anyone maintaining the thing that makes them right.
 *
 * IF CLIENT-SIDE NAVIGATION IS EVER WANTED BACK, the manual sending has to be
 * rebuilt AND re-measured on the live domain — not on localhost, where the
 * pixel reports the origin instead of the page path and cannot be checked.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: {
      (...args: unknown[]): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      push?: unknown;
      loaded?: boolean;
      version?: string;
    };
    _fbq?: unknown;
  }
}

export function Analytics() {
  const { status } = useConsent();
  const granted = status === 'granted';

  /*
    Lifts the consent signals from the denied defaults set in app/layout.tsx.

    A separate effect from the tags themselves because it has to be able to run
    in both directions: a visitor who accepts and later refuses gets an
    `update` back to denied, and the tags — already on the page, and not
    removable once loaded — stop storing anything from that moment.
  */
  useEffect(() => {
    if (status === 'unknown') return;
    window.gtag?.('consent', 'update', CONSENT_SIGNALS[status]);
  }, [status]);

  if (!granted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          /*
            cookie_expires is 13 months, matching what the cookie policy
            declares. Google's own default is two years, which would have made
            the published document wrong by 11 months, and 13 is the ceiling
            the EDPB treats as proportionate for analytics.

            send_page_view is deliberately left at its default of true. This
            call is the page view. Every internal link is a plain anchor, so a
            navigation loads a new document and runs this again for that page,
            which is why nothing else in this component sends anything.

            No backticks in this comment: it sits inside a template literal,
            and one would close it. That has broken this file once.
          */
          gtag('config', '${GA_MEASUREMENT_ID}', { cookie_expires: 34214400 });
        `}
      </Script>

      {META_PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
