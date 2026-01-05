"use client";

import { RequestFlowPage } from "@/page-components/request-flow";
import { useAppState } from "@/hooks/use-app-state";

export function RequestFlowPageClient() {
  const { handleNavigate } = useAppState();

  return (
    <RequestFlowPage
      onNavigate={handleNavigate}
    />
  );
}
