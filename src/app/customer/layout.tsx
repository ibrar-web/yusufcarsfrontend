'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();

  const handleSignOut = () => {
    setIsAuthenticated(false);
    document.cookie = 'is_authenticated=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';
    router.push('/');
  };

  return (
    <>
      <Header
        onSignupClick={() => {}}
        onSignInClick={() => {}}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        onProfileClick={() => {}}
        onNotificationClick={() => router.push('/customer/notifications')}
        onTrackOrderClick={() => {}}
      />
      
      {children}
      
      <Footer />
    </>
  );
}
