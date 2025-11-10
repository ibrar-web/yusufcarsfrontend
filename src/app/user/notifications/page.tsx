"use client";

import { NotificationsPage } from "./NotificationsPage";
import { useAppState } from "@/app/providers/app-state";

export default function Notifications() {
  const {
    handleNavigate,
    openSignupDialog,
    isAuthenticated,
    handleSignOut,
    openProfileDialog,
    openNotificationDialog,
  } = useAppState();

  return (
    <NotificationsPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
      isAuthenticated={isAuthenticated}
      onSignOut={handleSignOut}
      onProfileClick={openProfileDialog}
      onNotificationClick={openNotificationDialog}
    />
  );
}
