"use client";

import { ChatPage } from "@/components/chat/ChatPage";
import { useAppState } from "@/hooks/use-app-state";

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
      supplierId={selectedSupplierId ?? null}
      quoteId={selectedQuoteId ?? null}
      onSignupClick={openSignupDialog}
    />
  );
}
