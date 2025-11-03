'use client';

import { PartsSelectionPage } from '@/pages/parts-selection';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PartsSelection() {
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState<any>(undefined);

  useEffect(() => {
    const stored = sessionStorage.getItem('vehicleData');
    if (stored) {
      setVehicleData(JSON.parse(stored));
    }
  }, []);

  return (
    <PartsSelectionPage
      onNavigate={(page) => router.push(`/${page}`)}
      vehicleData={vehicleData}
      onSignupClick={() => {}}
    />
  );
}
