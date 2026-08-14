import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { SITE } from '@/lib/content';
import './globals.css';

/**
 * Self-hosted by next/font at build time: no request to a third-party origin,
 * no layout shift from a late swap, files fingerprinted and immutably cached.
 *
 * Only the weights the stylesheet actually applies. Inter runs at 200
 * (`font-extralight`), 300 (`font-light`, and the base weight for h1–h6) and
 * 400 (body default) — `font-medium` and `font-semibold` appear nowhere in the
 * markup. The mono is applied in exactly one rule, `.u-label`, which sets 500,
 * so its 400 was never requested either. Each weight dropped is a woff2 the
 * build stops emitting.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['200', '300', '400'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-jetbrains',
  display: 'swap',
  weight: ['500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — One Step Beyond AI`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'art market intelligence',
    'AI strategy',
    'data systems',
    'Power BI',
    'Phoenix Soulfire',
    'art authentication',
    'BJ Beyond',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    type: 'website',
    locale: 'en',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Bj_Beyond',
    creator: '@Bj_Beyond',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  /* Never add maximumScale / userScalable — pinch-zoom stays enabled. */
  themeColor: '#050505',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      /* The script below adds `js` to this element before React hydrates, so
         the client's class list is deliberately one entry longer than the
         server's. Without this, React reports it as a mismatch it "won't patch
         up" — which is true and intended: the class must land before paint,
         which is earlier than React can run. */
      suppressHydrationWarning
    >
      <head>
        {/*
          Stamps `js` on <html> before the first paint.

          Every hidden-until-revealed rule in globals.css is scoped to `.js`, so
          this one line is what decides whether the page has entrances or simply
          shows its content. Without JavaScript the class never lands, the rules
          never match, and everything is visible — which is the correct fallback
          and needs no `<noscript>` patch to reach it.

          It has to be here, inline and blocking, rather than in a component: a
          class added after hydration would let the browser paint the revealed
          state first and then hide it, which is a visible flash.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        {/* First stop for keyboard users, before the navigation. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[var(--z-skip)] focus:bg-amber-400 focus:px-5 focus:py-3 focus:text-ink-950 focus:u-label"
        >
          Skip to content
        </a>
        {children}

        {/* Google Analytics GA4 – active */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-99P3F76R3D"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-99P3F76R3D');
            `,
          }}
        />
      </body>
    </html>
  );
}
