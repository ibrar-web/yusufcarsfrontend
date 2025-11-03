'use client';

import { SupplierDashboardPage } from '@/pages/supplier-dashboard';
import { useRouter } from 'next/navigation';

export default function SupplierDashboard() {
  const router = useRouter();

  return (
    <SupplierDashboardPage
      onNavigate={(page) => router.push(`/${page}`)}
      onSignupClick={() => {}}
    />
  );
}
