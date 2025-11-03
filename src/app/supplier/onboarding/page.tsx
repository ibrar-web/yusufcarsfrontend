'use client';

import { SupplierOnboardingPage } from '@/pages/supplier-onboarding';
import { useRouter } from 'next/navigation';

export default function SupplierOnboarding() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <SupplierOnboardingPage
        onNavigate={(page) => router.push(`/${page}`)}
        onSignupClick={() => {}}
      />
    </div>
  );
}
