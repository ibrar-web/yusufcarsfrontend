"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Building2,
  // Calendar,
  CheckCircle,
  Users,
  // XCircle,
} from "lucide-react";
import { apiGet } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import { toast } from "sonner";

type Reporter = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  status?: string | null;
  profileImageUrl?: string | null;
};

type ReportRecord = {
  id: string;
  reporter: Reporter;
  reporterId: string;
  subject: string;
  subjectId: string;
  description: string;
  status: "open" | "resolved" | string;
  resolutionNotes?: string | null;
  assignedAdminId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

type ReportsApiResponse = {
  statusCode: number;
  message: string;
  data: ReportRecord[];
};

const severityBadge = (status: ReportRecord["status"]) => {
  const base = "px-3 py-1.5 font-['Roboto']";
  if (status === "open") return `${base} bg-[#FEE2E2] text-[#7F1D1D] border-[#F02801]`;
  if (status === "resolved") return `${base} bg-[#DCFCE7] text-[#14532D] border-[#22C55E]`;
  return `${base} bg-[#DBEAFE] text-[#1E40AF] border-[#3B82F6]`;
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await apiGet<ReportsApiResponse>(
          apiRoutes.admin.reports.list
        );
        if (ignore) return;
        const payload = response?.data ?? [];
        setReports(payload);
      } catch (error) {
        console.error("Failed to load reports", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load reports. Try again."
        );
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchReports();
    return () => {
      ignore = true;
    };
  }, []);

  const openDialog = (report: ReportRecord) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const pendingCount = useMemo(
    () => reports.filter((report) => report.status === "open").length,
    [reports]
  );

  return (
    <>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEE2E2] via-[#FEF3F2] to-white border-2 border-[#F02801]/20 p-6 shadow-[0_0_24px_rgba(240,40,1,0.12)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F02801]/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full -ml-12 -mb-12" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">
              Abuse Reports
            </h1>
            <p className="text-base md:text-lg text-[#475569] font-['Roboto']">
              {loading
                ? "Loading latest reports…"
                : `${pendingCount} reports pending review`}
            </p>
          </div>
        </div>

        <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
          <CardHeader className="pb-4 border-b border-[#E5E7EB]">
            <CardTitle className="font-['Inter'] text-[#0F172A]">
              All Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center text-sm text-[#475569]">
                Loading reports…
              </div>
            ) : !reports.length ? (
              <div className="p-6 text-center text-sm text-[#475569]">
                No reports found.
              </div>
            ) : (
              reports.map((report, index) => (
                <div
                  key={report.id}
                  className={`flex flex-col gap-4 px-6 py-5 hover:bg-[#F1F5F9] transition-all ${
                    index !== reports.length - 1 ? "border-b border-[#E5E7EB]" : ""
                  } sm:flex-row sm:items-center sm:justify-between`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F1F5F9]">
                        <AlertTriangle className="h-5 w-5 text-[#64748B]" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-['Inter'] text-[#0F172A]">
                          {report.subject} #{report.subjectId.slice(0, 8)}
                        </h3>
                        <span className="text-[#94A3B8] font-['Roboto']">•</span>
                        <p className="text-xs font-['Roboto'] text-[#94A3B8]">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-[#475569] font-['Roboto'] line-clamp-2 text-ellipsis">
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[150px]">
                    <Badge className={severityBadge(report.status)}>
                      {report.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      className="text-[#F02801] hover:text-[#D22301] font-['Roboto'] cursor-pointer"
                      onClick={() => openDialog(report)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border border-[#334155] bg-[#1E293B]">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-white">
              Report Details
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#CBD5E1]">
              Review the abuse report and take action
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 mt-2">
              <div className="bg-gradient-to-br from-[#92400E]/20 via-[#92400E]/10 to-transparent p-4 rounded-xl border border-[#F59E0B]/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-['Inter'] text-white">
                        {selectedReport.subject} report
                      </h3>
                      <p className="text-sm text-[#CBD5E1] font-['Roboto']">
                        {new Date(selectedReport.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`font-['Roboto'] px-2 py-0.5 ${
                      selectedReport.status === "open"
                        ? "bg-[#92400E]/30 text-[#FCD34D] border-[#F59E0B]"
                        : "bg-[#166534]/30 text-[#86EFAC] border-[#22C55E]"
                    }`}
                  >
                    {selectedReport.status}
                  </Badge>
                </div>
                {/* <div className="flex items-center gap-2 text-sm">
                  <span className="font-['Roboto'] text-[#CBD5E1]">Severity:</span>
                  <Badge className={severityBadge(selectedReport.status)}>
                    {selectedReport.status}
                  </Badge>
                </div> */}
              </div>
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] space-y-3">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1.5">
                    Reported User
                  </p>
                  <div className="flex items-center gap-2 p-2.5 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F02801] to-[#D97701] flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <p className="font-['Inter'] text-white">
                      {selectedReport.reporter.firstName}{" "}
                      {selectedReport.reporter.lastName}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1.5">
                    Reported Email
                  </p>
                  <div className="flex items-center gap-2 p-2.5 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <p className="font-['Inter'] text-white">
                      {selectedReport.reporter.email}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1.5">
                    Reason
                  </p>
                  {/* <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155] h-[10px] overflow-y-auto">
                    <p className="font-['Roboto'] text-[#E2E8F0] leading-relaxed">
                      {selectedReport.description}
                    </p>
                  </div> */}
                  <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]" style={{maxHeight: "200px", overflowY: "scroll"}}>
                    <p className="font-['Roboto'] text-[#E2E8F0] leading-snug break-words">
                      {selectedReport.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[#475569] bg-transparent text-[#CBD5E1] hover:bg-[#334155] hover:text-white font-['Roboto']"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
                {selectedReport.status === "open" && (
                  <Button
                    className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto']"
                    onClick={() => setDialogOpen(false)}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}