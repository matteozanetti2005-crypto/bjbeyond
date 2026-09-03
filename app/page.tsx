import { IntroProvider } from '@/components/chrome/Intro';
import { Navigation } from '@/components/chrome/Navigation';
import { Cursor } from '@/components/chrome/Cursor';
import { ScrollSync } from '@/components/chrome/ScrollSync';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Dispatch } from '@/components/sections/Dispatch';
import { Writing } from '@/components/sections/Writing';
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
 * Three blocks sit inside the flow but outside the 01–07 numbering, for two
 * different reasons. Authentia recommends someone else's platform and In Motion
 * carries someone else's channel, so neither can hold a number that means 'a
 * chapter of BJ Beyond's own story'. The Long Read is the owner's own writing
 * and could have held one — but the numbers are already assigned and already
 * read, and renumbering five headings to insert an eighth buys an index and
 * costs every visitor their bearings. All three keep their place in the reading
 * order and give up their number.
 *
 * Dispatch follows About directly — the introduction says what the voice is,
 * and the shelf of posts is the fastest way to hear it. The Long Read follows
 * Dispatch by the same logic one step on: the posts are that voice in 280
 * characters, the essays are the same voice at length.
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
        <Writing />
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
