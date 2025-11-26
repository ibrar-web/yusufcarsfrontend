"use client";

import { ChatPage } from "@/components/chat/ChatPage";
import { Header } from "@/components/header";
import { useAppState } from "@/hooks/use-app-state";

export default function Chat() {
  const { handleNavigate, handleBack, selectedSupplierId, selectedQuoteId } =
    useAppState();

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <ChatPage
        onNavigate={handleNavigate}
        onBack={handleBack}
        supplierId={selectedSupplierId ?? null}
        quoteId={selectedQuoteId ?? null}
      />
    </div>
  );
}
