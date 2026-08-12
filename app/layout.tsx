import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { SITE } from '@/lib/content';
import './globals.css';

/**
 * Self-hosted by next/font at build time: no request to a third-party origin,
 * no layout shift from a late swap, files fingerprinted and immutably cached.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/*
          Scroll reveals render their hidden state as an inline style during
          static export, so without JavaScript they stay invisible forever. The
          `!important` is load-bearing — an important stylesheet declaration
          outranks a plain inline style, which is the only way to reach them.
        */}
        <noscript>
          <style>{`.js-reveal{opacity:1!important;transform:none!important;visibility:visible!important}`}</style>
        </noscript>
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

        {/* Microsoft Clarity – replace YOUR_CLARITY_PROJECT_ID when ready */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");
            `,
          }}
        />

        {/* Google Analytics GA4 – active */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7SRD8PNPXL"
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
              gtag('config', 'G-7SRD8PNPXL');
            `,
          }}
        />
      </body>
    </html>
  );
}
