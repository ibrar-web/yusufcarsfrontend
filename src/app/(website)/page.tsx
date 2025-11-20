"use client";

import { HomePage } from "./HomePage";
import { useAppState } from "@/hooks/use-app-state";

export default function Home() {
  const {
    handleNavigate,
    isAuthenticated,
    handleSignOut,
    openProfileDialog,
    openNotificationDialog,
    openTrackOrderDialog,
    quoteNotifications,
    clearQuoteNotifications,
  } = useAppState();

  return (
    <HomePage
      onNavigate={handleNavigate}
      isAuthenticated={isAuthenticated}
      onSignOut={handleSignOut}
      onProfileClick={openProfileDialog}
      onNotificationClick={openNotificationDialog}
      onTrackOrderClick={openTrackOrderDialog}
      quoteNotifications={quoteNotifications ?? undefined}
      onDismissNotifications={clearQuoteNotifications}
    />
  );
}
