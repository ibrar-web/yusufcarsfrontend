"use client";

import { RequestFlowPage } from "@/page-components/request-flow";
import { useAppState } from "@/hooks/use-app-state";

export default function RequestFlow() {
  const { handleNavigate } = useAppState();

  return (
    <RequestFlowPage
      onNavigate={handleNavigate}
    />
  );
}
