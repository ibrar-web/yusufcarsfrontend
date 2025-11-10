"use client";

import { ChatPage } from "@/page-components/chat";
import { useAppState } from "@/app/providers/app-state";

export default function Chat() {
  const {
    handleNavigate,
    handleBack,
    openSignupDialog,
    selectedSupplierId,
    selectedQuoteId,
  } = useAppState();

  return (
    <ChatPage
      onNavigate={handleNavigate}
      onBack={handleBack}
      supplierId={selectedSupplierId ?? undefined}
      quoteId={selectedQuoteId ?? undefined}
      onSignupClick={openSignupDialog}
    />
  );
}
