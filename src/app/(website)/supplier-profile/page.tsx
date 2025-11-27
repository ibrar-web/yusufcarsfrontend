"use client";

import { SupplierProfilePage } from "@/page-components/supplier-profile";
import { useAppState } from "@/hooks/use-app-state";
import { useSearchParams } from "next/navigation";

export default function SupplierProfile() {
  const { handleNavigate, openSignupDialog } = useAppState();
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("supplier") ?? undefined;

  return (
    <SupplierProfilePage
      onNavigate={handleNavigate}
      supplierId={supplierId}
      onSignupClick={openSignupDialog}
    />
  );
}
