"use client";

import { HomePage } from "@/page-components/home";
import { useAppState } from "@/app/providers/app-state";

export default function Home() {
  const {
    handleNavigate,
    openSignupDialog,
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
      onSignupClick={openSignupDialog}
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
