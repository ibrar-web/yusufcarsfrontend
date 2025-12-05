"use client";

import { HistoryPage } from "./HistoryPage";
import { useAppState } from "@/hooks/use-app-state";

export default function History() {
  const { handleNavigate } = useAppState();

  return (
    <HistoryPage
      onNavigate={handleNavigate}
    />
  );
}
