'use client';

import { AdminDashboardPage } from '@/pages/admin-dashboard';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <AdminDashboardPage
      onNavigate={(page) => router.push(`/${page}`)}
      onSignupClick={() => {}}
    />
  );
}
