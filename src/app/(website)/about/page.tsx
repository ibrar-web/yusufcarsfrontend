'use client';

import { AboutPage } from '@/pages/about';
import { useRouter } from 'next/navigation';

export default function About() {
  const router = useRouter();

  return (
    <AboutPage
      onNavigate={(page) => router.push(page === 'home' ? '/' : `/${page}`)}
      onSignupClick={() => {}}
    />
  );
}
