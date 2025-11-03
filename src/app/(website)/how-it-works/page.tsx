'use client';

import { HowItWorksPage } from '@/pages/how-it-works';
import { useRouter } from 'next/navigation';

export default function HowItWorks() {
  const router = useRouter();

  return (
    <HowItWorksPage
      onNavigate={(page) => router.push(page === 'home' ? '/' : `/${page}`)}
      onSignupClick={() => {}}
    />
  );
}
