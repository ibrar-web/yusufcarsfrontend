"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupplierMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#64748B]">Communications</p>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Messages</h1>
      </div>
      <Card className="border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-lg">Inbox</CardTitle>
        </CardHeader>
        <CardContent className="text-[#475569]">
          Customer conversations will appear here once the messaging API is
          wired up. Integrate your NestJS chat service or reuse the existing
          quote chat UI.
        </CardContent>
      </Card>
    </div>
  );
}
