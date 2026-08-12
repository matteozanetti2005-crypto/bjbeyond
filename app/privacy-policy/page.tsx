import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { PRIVACY } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Informativa privacy di BJ Beyond ai sensi del Regolamento UE 2016/679 (GDPR).',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <LegalPage doc={PRIVACY} />;
}
