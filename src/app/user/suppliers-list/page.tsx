"use client";

import { SuppliersListPage } from "./SuppliersListPage";
import { useAppState } from "@/hooks/use-app-state";

export default function SuppliersList() {
  const {
    handleNavigate,
    openSignupDialog,
    isAuthenticated,
    handleSignOut,
    openProfileDialog,
    openNotificationDialog,
    openTrackOrderDialog,
    selectedPartData,
  } = useAppState();

  return (
    <SuppliersListPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
      isAuthenticated={isAuthenticated}
      onSignOut={handleSignOut}
      onProfileClick={openProfileDialog}
      onNotificationClick={openNotificationDialog}
      onTrackOrderClick={openTrackOrderDialog}
      partData={selectedPartData ?? undefined}
    />
  );
}
