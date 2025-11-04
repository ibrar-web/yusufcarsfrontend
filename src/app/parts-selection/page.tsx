"use client";

import { PartsSelectionPage } from "@/page-components/parts-selection";
import { useAppState } from "../providers/app-state";

export default function PartsSelection() {
  const { handleNavigate, openSignupDialog, vehicleData } = useAppState();

  return (
    <PartsSelectionPage
      onNavigate={handleNavigate}
      vehicleData={vehicleData ?? undefined}
      onSignupClick={openSignupDialog}
    />
  );
}
