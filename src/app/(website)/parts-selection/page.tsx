"use client";

import { PartsSelectionPage } from "@/page-components/parts-selection";
import { useAppState } from "@/hooks/use-app-state";

export default function PartsSelection() {
  const { handleNavigate, openSignupDialog } = useAppState();

  return (
    <PartsSelectionPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
    />
  );
}
