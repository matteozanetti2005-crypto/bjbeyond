import { IntroProvider } from '@/components/chrome/Intro';
import { Navigation } from '@/components/chrome/Navigation';
import { Cursor } from '@/components/chrome/Cursor';
import { ScrollSync } from '@/components/chrome/ScrollSync';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Dispatch } from '@/components/sections/Dispatch';
import { Method } from '@/components/sections/Method';
import { Authentia } from '@/components/sections/Authentia';
import { InMotion } from '@/components/sections/InMotion';
import { Labs } from '@/components/sections/Labs';
import { Work } from '@/components/sections/Work';
import { Intelligence } from '@/components/sections/Intelligence';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

/**
 * Section order is the narrative, and alternates image-led sections with
 * typographic ones.
 *
 * Two blocks sit inside the flow but outside the 01–07 numbering, on the same
 * rule: those numbers are BJ Beyond's own chapters, and neither of these is
 * one. Authentia recommends someone else's platform, and In Motion carries
 * someone else's channel. Both keep their place in the reading order and give
 * up their number.
 *
 * Dispatch follows About directly — the introduction says what the voice is,
 * and the shelf of posts is the fastest way to hear it.
 */
export default function Home() {
  return (
    <IntroProvider>
      <ScrollSync />
      <Cursor />
      <Navigation />

      <main id="main">
        <Hero />
        <About />
        <Dispatch />
        <Method />
        <Authentia />
        <InMotion />
        <Labs />
        <Work />
        <Intelligence />
        <Contact />
      </main>

      <Footer />
    </IntroProvider>
  );
}
