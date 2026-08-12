import { IntroProvider } from '@/components/chrome/Intro';
import { Navigation } from '@/components/chrome/Navigation';
import { Cursor } from '@/components/chrome/Cursor';
import { ScrollSync } from '@/components/chrome/ScrollSync';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Method } from '@/components/sections/Method';
import { Authentia } from '@/components/sections/Authentia';
import { Labs } from '@/components/sections/Labs';
import { Work } from '@/components/sections/Work';
import { Intelligence } from '@/components/sections/Intelligence';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

/**
 * Section order is the narrative, and alternates image-led sections with
 * typographic ones. Authentia sits inside the flow but outside the 01–06
 * numbering — it is a recommendation, not one of BJ Beyond's own chapters.
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
        <Method />
        <Authentia />
        <Labs />
        <Work />
        <Intelligence />
        <Contact />
      </main>

      <Footer />
    </IntroProvider>
  );
}
