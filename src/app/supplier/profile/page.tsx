"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/app/providers/app-state";

export default function SupplierProfilePage() {
  const { openProfileDialog } = useAppState();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#64748B]">Account</p>
        <h1 className="text-2xl font-semibold text-[#0F172A]">
          Profile & Settings
        </h1>
      </div>
      <Card className="border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-lg">Business profile</CardTitle>
        </CardHeader>
        <CardContent className="text-[#475569]">
          Manage company info, payouts, and notification preferences. Until the
          dedicated form ships, you can open the global profile dialog.
          <div className="mt-4">
            <button
              className="rounded-full border border-[#0F172A] px-4 py-2 text-sm font-medium text-[#0F172A]"
              onClick={openProfileDialog}
            >
              Open profile dialog
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
