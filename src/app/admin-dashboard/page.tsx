"use client";

import { AdminDashboardPage } from "@/page-components/admin-dashboard";
import { useAppState } from "@/app/providers/app-state";

export default function AdminDashboard() {
  const { handleNavigate, openSignupDialog } = useAppState();

  return (
    <AdminDashboardPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
    />
  );
}
