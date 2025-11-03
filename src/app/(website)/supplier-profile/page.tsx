'use client';

import { SupplierProfilePage } from '@/pages/supplier-profile';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SupplierProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierId = searchParams.get('id');

  return (
    <SupplierProfilePage
      onNavigate={(page) => router.push(`/${page}`)}
      supplierId={supplierId}
      onSignupClick={() => {}}
    />
  );
}
