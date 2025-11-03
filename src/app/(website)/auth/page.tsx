'use client';

import { AuthPage } from '@/pages/auth';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const router = useRouter();

  return (
    <AuthPage
      onNavigate={(page) => router.push(page === 'home' ? '/' : `/${page}`)}
      onSignupClick={() => {}}
    />
  );
}
