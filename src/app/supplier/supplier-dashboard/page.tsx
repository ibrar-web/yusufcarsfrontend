"use client";

import { SupplierDashboardPage } from "@/page-components/supplier-dashboard";
import { useAppState } from "@/app/providers/app-state";

export default function SupplierDashboard() {
  const { handleNavigate, openSignupDialog } = useAppState();

  return (
    <SupplierDashboardPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
    />
  );
}
