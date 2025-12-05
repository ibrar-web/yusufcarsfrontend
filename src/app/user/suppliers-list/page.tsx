"use client";

import { SuppliersListPage } from "./SuppliersListPage";
import { useAppState } from "@/hooks/use-app-state";

export default function SuppliersList() {
  const {
    handleNavigate,
    selectedPartData,
  } = useAppState();

  return (
    <SuppliersListPage
      onNavigate={handleNavigate}
      partData={selectedPartData ?? undefined}
    />
  );
}
