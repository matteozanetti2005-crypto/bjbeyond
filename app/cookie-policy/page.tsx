import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { COOKIES } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Come BJ Beyond utilizza i cookie sul sito bjbeyond.it.',
  alternates: { canonical: '/cookie-policy/' },
};

export default function CookiePolicyPage() {
  return <LegalPage doc={COOKIES} />;
}
