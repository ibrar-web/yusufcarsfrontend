"use client";

import { RequestFlowPage } from "@/page-components/request-flow";
import { useAppState } from "../providers/app-state";

export default function RequestFlow() {
  const { handleNavigate, openSignupDialog } = useAppState();

  return (
    <RequestFlowPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
    />
  );
}
