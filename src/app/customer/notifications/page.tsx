'use client';

import { NotificationsPage } from '@/pages/notifications';
import { useRouter } from 'next/navigation';

export default function CustomerNotifications() {
  const router = useRouter();

  return (
    <NotificationsPage
      onNavigate={(page) => router.push(`/${page}`)}
      onSignupClick={() => {}}
      isAuthenticated={true}
      onSignOut={() => {}}
      onProfileClick={() => {}}
      onNotificationClick={() => {}}
      onTrackOrderClick={() => {}}
    />
  );
}
