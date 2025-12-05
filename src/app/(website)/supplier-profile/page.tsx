"use client";

import { SupplierProfilePage } from "@/page-components/supplier-profile";
import { useAppState } from "@/hooks/use-app-state";
import { useSearchParams } from "next/navigation";

export default function SupplierProfile() {
  const { handleNavigate } = useAppState();
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("supplier");

  return (
    <SupplierProfilePage
      onNavigate={handleNavigate}
      supplierId={supplierId}
    />
  );
}
