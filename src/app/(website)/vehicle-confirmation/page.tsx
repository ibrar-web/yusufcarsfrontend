'use client';

import { VehicleConfirmationPage } from '@/pages/vehicle-confirmation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VehicleConfirmation() {
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState<any>(undefined);

  useEffect(() => {
    const stored = sessionStorage.getItem('vehicleData');
    if (stored) {
      setVehicleData(JSON.parse(stored));
    }
  }, []);

  return (
    <VehicleConfirmationPage
      onNavigate={(page, id, vehicleInfo) => {
        if (vehicleInfo) {
          sessionStorage.setItem('vehicleData', JSON.stringify(vehicleInfo));
        }
        router.push(`/${page}`);
      }}
      vehicleData={vehicleData}
      onSignupClick={() => {}}
    />
  );
}
