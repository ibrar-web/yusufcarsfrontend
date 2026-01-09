"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useAppState } from "@/hooks/use-app-state";
import { apiRoutes } from "@/utils/apiroutes";
import { apiGet } from "@/utils/apiconfig/http";
import { MessageSquare, User, Wrench, XCircle } from "lucide-react";

type SupplierReportApi = {
    id: string,
    requestId: string,
    supplierId: string,
    acceptedQuote: {
      id: string,
      partName: string | null,
    },
    acceptedQuoteId: string,
    buyer: {
      id: string,
      email: string | null,
      firstName: string | null,
      lastName: string | null
    },
    buyerId: string,
    status: string | null,
    deliveryDate: string | null,
    trackingInfo: string | null,
    cancellationReason: string | null,
    reviewSubmitted: string | null,
    createdAt: string,
    updatedAt: string,
}

type supplierReport = {
    id: string;
    status: string | null;
    partName: string | null;
    partId: string | null;
    buyerName: string | null;
    buyerEmail: string | null;
    buyerId: string | null;
    reason: string | null;
}

const normalizeReport = (report: SupplierReportApi): supplierReport => {
  return {
    id: report.id,
    status: (report.status || "reported").toLowerCase(),
    partName: report.acceptedQuote?.partName ?? null,
    partId: report.acceptedQuote?.id ?? null,
    buyerName: report.buyer
      ? `${report.buyer.firstName ?? ""} ${report.buyer.lastName ?? ""}`.trim() || null
      : null,
    buyerEmail: report.buyer?.email ?? null,
    buyerId: report.buyer?.id ?? null,
    reason: report.cancellationReason ?? null,
  };
};

export default function SupplierQuotesPage() {
//   const { handleNavigate } = useAppState();
  const [reports, setReports] = useState<supplierReport[]>([]);
  const [selectedReportToView, setSelectedReportToView] = useState<supplierReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const getData = async() => {
        setIsLoading(true);
        const endpoint = apiRoutes.supplier.report.list.startsWith("/")
            ? apiRoutes.supplier.report.list
            : `/${apiRoutes.supplier.report.list}`;

        try {
            const data = await apiGet<{ data?: SupplierReportApi[] }>(endpoint);
            console.log({data});
            const payload = data?.data ?? [];
            setReports(payload.map(normalizeReport));
            
        }
        catch(err: any) {
            // toast.error(err.toString());
            console.log("err is as: ", err);
        }
        finally {
            setIsLoading(false);
        }
    }
    getData()
  }, []);

  console.log({reports});
  

  return (
    <div className="space-y-6">
      <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]">
        <CardContent className="p-6">
          <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">Reports</h1>
          <p className="text-[#475569] font-['Roboto']">Check your reports and their status</p>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <CardTitle className="font-['Inter'] text-[#0F172A]">Reports</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Status of every report received</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            {/* <TableHeader>
              <TableRow className="border-b border-[#E5E7EB] hover:bg-transparent">
                <TableHead className="font-['Inter'] text-[#0F172A]">Sent</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Quote ID</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Customer</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Part</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Amount</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Status</TableHead>
              </TableRow>
            </TableHeader> */}
            <TableHeader>
                <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Customer Email</TableHead>
                    <TableHead>Part</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            {/* <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-[#475569] font-['Roboto']">
                    Loading quotes...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-[#475569] font-['Roboto']">
                    No Reports available yet.
                  </TableCell>
                </TableRow>
              )}
              {reports.map((report) => (
                <TableRow
                  key={report.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer"
                //   onClick={() => setSelectedReportToView(report)}
                >
                  <TableCell className="font-['Roboto'] text-[#475569]">{report.sentAt}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">{report.id}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">{report.customer}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">{report.part}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">£{report.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody> */}
            <TableBody>
                {!isLoading && reports.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-[#475569]">
                        No reports available yet.
                    </TableCell>
                    </TableRow>
                )}

                {reports.map((report) => (
                    <TableRow
                    key={report.id}
                    className="border-b hover:bg-[#F8FAFC] cursor-pointer"
                    onClick={() => setSelectedReportToView(report)}
                    >
                    <TableCell className="text-[#0F172A]">
                        {report.id}
                    </TableCell>

                    <TableCell className="text-[#475569]">
                        {report.buyerName ?? "—"}
                    </TableCell>

                    <TableCell className="text-[#475569]">
                        {report.buyerEmail ?? "—"}
                    </TableCell>

                    <TableCell className="text-[#475569]">
                        {report.partName ?? "—"}
                    </TableCell>

                    <TableCell>
                        <Badge variant="outline">
                        {report.status}
                        </Badge>
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedReportToView} onOpenChange={(open) => !open && setSelectedReportToView(null)}>
        <DialogContent className="border border-[#E5E7EB] shadow-lg max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Report Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View complete information about this report
            </DialogDescription>
          </DialogHeader>

          {selectedReportToView && (
            <div className="space-y-6 mt-4">

                {/* Header Row */}
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-[#475569] mb-1">Status</p>
                    <Badge variant="outline">
                    {selectedReportToView.status}
                    </Badge>
                </div>

                <div className="text-right">
                    <p className="text-sm text-[#475569] mb-1">Report ID</p>
                    <p className="font-['Inter'] text-[#0F172A]">
                    {selectedReportToView.id}
                    </p>
                </div>
                </div>

                <Separator />

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">

                {/* Customer */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569]">Customer</p>
                    </div>
                    <p className="text-[#0F172A]">
                    {selectedReportToView.buyerName ?? "—"}
                    </p>
                </div>

                {/* Customer Email */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569]">Customer Email</p>
                    </div>
                    <p className="text-[#0F172A]">
                    {selectedReportToView.buyerEmail ?? "—"}
                    </p>
                </div>

                {/* Part Name */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569]">Part</p>
                    </div>
                    <p className="text-[#0F172A]">
                    {selectedReportToView.partName ?? "—"}
                    </p>
                </div>

                {/* Part ID */}
                {/* <div>
                    <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569]">Part ID</p>
                    </div>
                    <p className="text-[#0F172A] break-all">
                    {selectedReportToView.partId ?? "—"}
                    </p>
                </div> */}
                {/* Reason */}


                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-[#F02801]" />
                        <p className="text-sm text-[#475569]">Reason</p>
                    </div>

                    <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155] max-h-[80px] overflow-y-auto" style={{maxHeight: "200px", overflowY: "scroll"}}>
                        <p className="text-[#E2E8F0] leading-relaxed text-sm">
                        {selectedReportToView.reason ?? "—"}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    {/* <Button
                        className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white"
                        onClick={() => {
                        handleNavigate("chat");
                        setSelectedReportToView(null);
                        }}
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Customer
                    </Button> */}

                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedReportToView(null)}
                    >
                        Close
                    </Button>
                </div>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
}
