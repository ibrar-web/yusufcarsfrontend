"use client";

import { SupplierProfilePage } from "@/page-components/supplier-profile";
import { useAppState } from "../providers/app-state";

export default function SupplierProfile() {
  const { handleNavigate, openSignupDialog, selectedSupplierId } =
    useAppState();

  return (
    <SupplierProfilePage
      onNavigate={handleNavigate}
      supplierId={selectedSupplierId ?? undefined}
      onSignupClick={openSignupDialog}
    />
  );
}
