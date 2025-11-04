"use client";

import { SupplierOnboardingPage } from "@/page-components/supplier-onboarding";
import { useAppState } from "../providers/app-state";

export default function SupplierOnboarding() {
  const { handleNavigate, openSignupDialog } = useAppState();

  return (
    <SupplierOnboardingPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
    />
  );
}
