'use client';

import { HistoryPage } from '@/pages/history';
import { useRouter } from 'next/navigation';

export default function CustomerHistory() {
  const router = useRouter();

  return (
    <HistoryPage
      onNavigate={(page) => router.push(`/${page}`)}
      onSignupClick={() => {}}
      isAuthenticated={true}
      onSignOut={() => {}}
      onProfileClick={() => {}}
      onNotificationClick={() => router.push('/customer/notifications')}
      onTrackOrderClick={() => {}}
    />
  );
}
