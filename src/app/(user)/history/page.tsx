"use client";

import { HistoryPage } from "@/page-components/history";
import { useAppState } from "@/app/providers/app-state";

export default function History() {
  const {
    handleNavigate,
    openSignupDialog,
    isAuthenticated,
    handleSignOut,
    openProfileDialog,
    openNotificationDialog,
    openTrackOrderDialog,
  } = useAppState();

  return (
    <HistoryPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
      isAuthenticated={isAuthenticated}
      onSignOut={handleSignOut}
      onProfileClick={openProfileDialog}
      onNotificationClick={openNotificationDialog}
      onTrackOrderClick={openTrackOrderDialog}
    />
  );
}
