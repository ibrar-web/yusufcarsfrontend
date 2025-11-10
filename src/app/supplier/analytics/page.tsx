"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupplierAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#64748B]">Performance</p>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Analytics</h1>
      </div>
      <Card className="border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-lg">Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="text-[#475569]">
          This dashboard will highlight conversion rate, accepted quotes, and
          request response time. Connect your NestJS analytics endpoint here.
        </CardContent>
      </Card>
    </div>
  );
}
