"use client";

import { NotificationsPage } from "@/page-components/notifications";
import { useAppState } from "../providers/app-state";

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
