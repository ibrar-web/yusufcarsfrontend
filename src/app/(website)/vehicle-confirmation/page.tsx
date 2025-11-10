"use client";

import { VehicleConfirmationPage } from "@/page-components/vehicle-confirmation";
import { useAppState } from "@/app/providers/app-state";

export default function VehicleConfirmation() {
  const { handleNavigate, openSignupDialog, vehicleData } = useAppState();

  return (
    <VehicleConfirmationPage
      onNavigate={handleNavigate}
      vehicleData={vehicleData ?? undefined}
      onSignupClick={openSignupDialog}
    />
  );
}
