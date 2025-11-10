"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/app/providers/app-state";

export default function SupplierQuotesPage() {
  const { handleNavigate } = useAppState();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#64748B]">Overview</p>
        <h1 className="text-2xl font-semibold text-[#0F172A]">
          Quotes you've prepared
        </h1>
      </div>
      <Card className="border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-lg">Quote management</CardTitle>
        </CardHeader>
        <CardContent className="text-[#475569]">
          Prepare, send, and track customer quotes from this workspace. Use the
          request list to jump back into any conversation.
          <div className="mt-4">
            <button
              className="rounded-full bg-[#0F172A] px-4 py-2 text-sm text-white"
              onClick={() => handleNavigate("supplier-dashboard")}
            >
              Review new requests
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
