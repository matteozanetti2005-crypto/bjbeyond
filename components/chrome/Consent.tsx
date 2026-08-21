'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CONSENT_KEY, type ConsentStatus } from '@/lib/analytics';

/**
 * The consent gate, and the banner that asks for it.
 *
 * WHY IT EXISTS NOW. The site was already running GA4 on every visit with no
 * banner and no way to refuse. That was a gap before; adding a Meta pixel to it
 * would have turned an analytics tag nobody declared into advertising
 * profiling nobody agreed to, which is the exact thing the ePrivacy directive
 * requires prior consent for.
 *
 * REFUSING IS AS EASY AS ACCEPTING. Two buttons, same size, same weight, side
 * by side. This is not a design preference — the Italian Garante's 2021 cookie
 * guidelines are explicit that a banner offering a prominent "accept" and
 * burying the refusal does not collect valid consent, and a consent that is not
 * valid is the same as no consent at all while carrying all the liability of
 * having asked.
 *
 * There is no "accept" by scrolling, no pre-ticked anything, and closing the
 * banner without choosing leaves the status 'unknown' — which loads nothing.
 */

interface ConsentValue {
  status: ConsentStatus;
  grant: () => void;
  deny: () => void;
  /** Reopens the banner so a decision can be changed. Wired to the footer. */
  reconsider: () => void;
}

const ConsentContext = createContext<ConsentValue>({
  status: 'unknown',
  grant: () => {},
  deny: () => {},
  reconsider: () => {},
});

export function useConsent() {
  return useContext(ConsentContext);
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  /*
    'unknown' on the server and on the first client render alike.

    The stored answer cannot be read during render without producing markup the
    server could not have produced, so it is read in an effect and the banner
    appears a beat later. That beat is the correct trade: the alternative is a
    hydration mismatch on every returning visitor.
  */
  const [status, setStatus] = useState<ConsentStatus>('unknown');
  const [hydrated, setHydrated] = useState(false);
  /** Set when the visitor reopens the banner to change a decision. */
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (stored === 'granted' || stored === 'denied') setStatus(stored);
    } catch {
      /* Safari in private mode throws on localStorage. A visitor who cannot be
         remembered is asked again, which is inconvenient and correct. */
    }
    setHydrated(true);
  }, []);

  const record = useCallback((choice: 'granted' | 'denied') => {
    setStatus(choice);
    setReopened(false);
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* Unstored consent still governs this page view. */
    }
  }, []);

  const value = useMemo<ConsentValue>(
    () => ({
      status,
      grant: () => record('granted'),
      deny: () => record('denied'),
      reconsider: () => setReopened(true),
    }),
    [status, record],
  );

  const visible = hydrated && (status === 'unknown' || reopened);

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {visible ? <Banner onGrant={value.grant} onDeny={value.deny} /> : null}
    </ConsentContext.Provider>
  );
}

function Banner({
  onGrant,
  onDeny,
}: {
  onGrant: () => void;
  onDeny: () => void;
}) {
  return (
    <div
      /* `role="dialog"` without `aria-modal`: it does not trap focus and does
         not block the page, because a cookie banner that cannot be ignored is
         itself a dark pattern. It is announced, reachable by keyboard, and
         entirely skippable. */
      role="dialog"
      aria-labelledby="consent-heading"
      aria-describedby="consent-body"
      className="fixed inset-x-0 bottom-0 z-[var(--z-nav)] border-t border-rule bg-ink-950/95 backdrop-blur-md"
    >
      <div className="u-gutter py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <h2 id="consent-heading" className="u-label text-paper">
              COOKIE
            </h2>
            {/*
              English, like the rest of the interface. The policies it links to
              are Italian, and stay Italian, because they are statements of an
              Italian controller's obligations — but this banner is UI, the
              document is `lang="en"`, and there is not another word of Italian
              anywhere in it. A visitor who cannot read the notice has not given
              informed consent, so matching the language they are already
              reading is the point rather than a preference.

              Flip it if the advertising is aimed at Italy specifically: it is
              this one paragraph and the two button labels.
            */}
            <p id="consent-body" className="mt-3 text-meta font-light text-mist-200">
              This site uses technical cookies, required for it to work, and —
              only with your consent — analytics and marketing cookies to measure
              visits and advertising campaigns. You can change your mind at any
              time from the link in the footer.{' '}
              {/* Plain anchor, not next/link — see Analytics.tsx. */}
              <a
                href="/cookie-policy/"
                className="text-amber-400 underline-offset-4 hover:underline"
              >
                Cookie Policy
              </a>
            </p>
          </div>

          {/*
            Same element, same size, same treatment, refusal first in the DOM so
            it is also first for a keyboard. The amber fill is the site's
            primary action and is deliberately NOT used here: giving "accept"
            the loudest object on the page is the nudge the guidelines describe.
          */}
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              onClick={onDeny}
              className="u-label inline-flex min-h-11 items-center justify-center border border-rule-strong px-6 py-3 text-paper transition-colors duration-200 hover:border-paper"
            >
              DECLINE
            </button>
            <button
              type="button"
              onClick={onGrant}
              className="u-label inline-flex min-h-11 items-center justify-center border border-rule-strong px-6 py-3 text-paper transition-colors duration-200 hover:border-paper"
            >
              ACCEPT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/**
 * The way back to a decision already made.
 *
 * Consent that cannot be withdrawn as easily as it was given is not consent,
 * and the banner tells the visitor this link exists — so it has to. A client
 * component of its own so that the footer, which has no other reason to ship
 * JavaScript, stays a server component.
 */
export function ConsentToggle({ className = '' }: { className?: string }) {
  const { reconsider } = useConsent();

  return (
    <button type="button" onClick={reconsider} className={className}>
      COOKIE PREFERENCES
    </button>
  );
}
