"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/table-pagination";
import { apiGet } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import { cn } from "@/components/ui/utils";
import { toast } from "sonner";
import {
  FileText,
  Link as LinkIcon,
  Loader2,
  Mail,
  MessageCircle,
  RefreshCcw,
  Search,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type InquiryStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "closed"
  | "archived";
type UrgencyLevel = "low" | "normal" | "high" | "critical";

type InquiryRecord = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  urgency: UrgencyLevel;
  content: string;
  fileName?: string | null;
  fileKey?: string | null;
  fileSignedUrl?: string | null;
  contact: boolean;
  status: InquiryStatus;
  createdAt: string;
};

type InquiryListResponse = {
  data: {
    data: InquiryRecord[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  };
};

type InquiryDetailResponse = {
  data: InquiryRecord;
};

const statusFilters: Array<{ value: "all" | InquiryStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

const urgencyFilters: Array<{ value: "all" | UrgencyLevel; label: string }> = [
  { value: "all", label: "All urgency" },
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

const statusBadgeStyles: Record<InquiryStatus, string> = {
  pending: "bg-[#EFF6FF] text-[#1D4ED8]",
  in_progress: "bg-[#FEF3C7] text-[#B45309]",
  completed: "bg-[#F0FDF4] text-[#15803D]",
  closed: "bg-[#F8FAFC] text-[#0F172A]",
  archived: "bg-[#F1F5F9] text-[#475569]",
};

const urgencyBadgeStyles: Record<UrgencyLevel, string> = {
  low: "bg-[#F0FDF4] text-[#15803D]",
  normal: "bg-[#EFF6FF] text-[#1D4ED8]",
  high: "bg-[#FEF3C7] text-[#B45309]",
  critical: "bg-[#FEF2F2] text-[#B91C1C]",
};

const ADMIN_INQUIRIES_BASE = apiRoutes.admin.inquiries.list;

const buildFileUrl = (key?: string | null) => {
  if (!key) return null;
  if (/^https?:\/\//i.test(key)) return key;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const origin = base.replace(/\/api\/.*$/i, "");
  return `${origin}/${key}`;
};

export default function AdminInquiriesPage() {
  const [records, setRecords] = useState<InquiryRecord[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<"all" | InquiryStatus>(
    "all"
  );
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | UrgencyLevel>(
    "all"
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(pageSize));
    params.set("sortDir", "DESC");
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (urgencyFilter !== "all") params.set("urgency", urgencyFilter);
    if (searchTerm.trim()) params.set("search", searchTerm.trim());

    try {
      const response = await apiGet<InquiryListResponse>(
        `${ADMIN_INQUIRIES_BASE}?${params.toString()}`
      );
      const payload = response.data;
      setRecords(payload.data);
      setMeta(
        payload.meta ?? {
          total: payload.data.length,
          page,
          limit: pageSize,
        }
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load inquiries. Please try again.";
      setError(message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, urgencyFilter, searchTerm]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput);
  };

  const openDetails = async (record: InquiryRecord) => {
    setSelectedInquiry(record);
    setDetailsOpen(true);
    setDetailLoading(true);
    try {
      const response = await apiGet<InquiryDetailResponse>(
        apiRoutes.admin.inquiries.detail(record.id)
      );
      setSelectedInquiry(response.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load inquiry details.";
      toast.error(message);
    } finally {
      setDetailLoading(false);
    }
  };

  const formattedDate = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="space-y-8">
      <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
        <CardHeader className="gap-4 border-b border-[#E5E7EB]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="font-['Inter'] text-[#0F172A]">
                All inquiries
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-[#CBD5F5] text-[#1D4ED8]"
                onClick={() => fetchInquiries()}
                disabled={loading}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2"
            >
              <Search className="h-4 w-4 text-[#94A3B8]" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by name, email or subject"
                className="h-8 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
              />
              <Button type="submit" size="sm" variant="secondary">
                Search
              </Button>
            </form>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as "all" | InquiryStatus);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl border border-[#E5E7EB] font-['Roboto']">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={urgencyFilter}
              onValueChange={(value) => {
                setUrgencyFilter(value as "all" | UrgencyLevel);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl border border-[#E5E7EB] font-['Roboto']">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {urgencyFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="hidden lg:flex flex-col items-end justify-center text-sm text-[#64748B]">
              <div>Total inquiries</div>
              <div className="font-['Inter'] text-xl text-[#0F172A]">
                {meta.total.toLocaleString()}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {error && (
            <div className="border-b border-[#E5E7EB] px-6 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12 text-[#475569]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading inquiries…
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-[#94A3B8]">
              <MessageCircle className="mb-3 h-10 w-10" />
              <p>No inquiries match your filters.</p>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="font-['Inter'] text-[#0F172A]">
                          {inquiry.subject}
                        </div>
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#0F172A]">
                        {inquiry.fullName}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {inquiry.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            statusBadgeStyles[inquiry.status] ??
                              "bg-[#EEF2FF] text-[#4C1D95]"
                          )}
                        >
                          {inquiry.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            urgencyBadgeStyles[inquiry.urgency]
                          )}
                        >
                          {inquiry.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#475569] font-['Roboto']">
                        {formattedDate(inquiry.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="text-[#F02801] hover:text-[#D22301] font-['Roboto']"
                          onClick={() => openDetails(inquiry)}
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {records.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="font-['Inter'] text-[#0F172A]">
                          {inquiry.subject}
                        </div>
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#0F172A]">
                        {inquiry.fullName}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {inquiry.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            statusBadgeStyles[inquiry.status] ??
                              "bg-[#EEF2FF] text-[#4C1D95]"
                          )}
                        >
                          {inquiry.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            urgencyBadgeStyles[inquiry.urgency]
                          )}
                        >
                          {inquiry.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#475569] font-['Roboto']">
                        {formattedDate(inquiry.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="text-[#F02801] hover:text-[#D22301] font-['Roboto']"
                          onClick={() => openDetails(inquiry)}
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {records.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="font-['Inter'] text-[#0F172A]">
                          {inquiry.subject}
                        </div>
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#0F172A]">
                        {inquiry.fullName}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {inquiry.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            statusBadgeStyles[inquiry.status] ??
                              "bg-[#EEF2FF] text-[#4C1D95]"
                          )}
                        >
                          {inquiry.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            urgencyBadgeStyles[inquiry.urgency]
                          )}
                        >
                          {inquiry.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#475569] font-['Roboto']">
                        {formattedDate(inquiry.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="text-[#F02801] hover:text-[#D22301] font-['Roboto']"
                          onClick={() => openDetails(inquiry)}
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {records.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="font-['Inter'] text-[#0F172A]">
                          {inquiry.subject}
                        </div>
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#0F172A]">
                        {inquiry.fullName}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {inquiry.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            statusBadgeStyles[inquiry.status] ??
                              "bg-[#EEF2FF] text-[#4C1D95]"
                          )}
                        >
                          {inquiry.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            urgencyBadgeStyles[inquiry.urgency]
                          )}
                        >
                          {inquiry.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#475569] font-['Roboto']">
                        {formattedDate(inquiry.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="text-[#F02801] hover:text-[#D22301] font-['Roboto']"
                          onClick={() => openDetails(inquiry)}
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {records.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="font-['Inter'] text-[#0F172A]">
                          {inquiry.subject}
                        </div>
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#0F172A]">
                        {inquiry.fullName}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {inquiry.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            statusBadgeStyles[inquiry.status] ??
                              "bg-[#EEF2FF] text-[#4C1D95]"
                          )}
                        >
                          {inquiry.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            urgencyBadgeStyles[inquiry.urgency]
                          )}
                        >
                          {inquiry.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#475569] font-['Roboto']">
                        {formattedDate(inquiry.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="text-[#F02801] hover:text-[#D22301] font-['Roboto']"
                          onClick={() => openDetails(inquiry)}
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {records.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="font-['Inter'] text-[#0F172A]">
                          {inquiry.subject}
                        </div>
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#0F172A]">
                        {inquiry.fullName}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {inquiry.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            statusBadgeStyles[inquiry.status] ??
                              "bg-[#EEF2FF] text-[#4C1D95]"
                          )}
                        >
                          {inquiry.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3 py-1.5 font-['Roboto'] border-0 capitalize",
                            urgencyBadgeStyles[inquiry.urgency]
                          )}
                        >
                          {inquiry.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#475569] font-['Roboto']">
                        {formattedDate(inquiry.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="text-[#F02801] hover:text-[#D22301] font-['Roboto']"
                          onClick={() => openDetails(inquiry)}
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="sticky bottom-0 border-t border-[#E5E7EB] bg-white/95 backdrop-blur px-6 py-4">
            <TablePagination
              page={page}
              pageSize={pageSize}
              totalItems={meta.total}
              onPageChange={(next) => setPage(next)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl border border-[#E5E7EB] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">
              Inquiry details
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View and respond to customer inquiry
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-6 mt-2">
              {detailLoading && (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-3 text-sm text-[#475569]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading latest details…
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "px-4 py-1.5 font-['Roboto'] border-0 capitalize",
                    statusBadgeStyles[selectedInquiry.status]
                  )}
                >
                  {selectedInquiry.status.replace("_", " ")}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-1.5 border-[#E5E7EB] text-[#475569] font-['Roboto'] capitalize"
                >
                  {selectedInquiry.urgency} urgency
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                    Inquiry ID
                  </p>
                  <p className="font-['Inter'] text-[#0F172A]">
                    {selectedInquiry.id}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                    Received
                  </p>
                  <p className="font-['Roboto'] text-[#0F172A]">
                    {formattedDate(selectedInquiry.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-['Inter'] text-[#0F172A]">
                  Customer information
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-[#F02801]" />
                      <div>
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                          Name
                        </p>
                        <p className="font-['Roboto'] text-[#0F172A]">
                          {selectedInquiry.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-[#F02801]" />
                      <div>
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                          Email
                        </p>
                        <p className="font-['Roboto'] text-[#0F172A] break-all">
                          {selectedInquiry.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-['Inter'] text-[#0F172A]">Message</h4>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <p className="whitespace-pre-wrap font-['Roboto'] text-[#0F172A] leading-relaxed">
                    {selectedInquiry.content}
                  </p>
                </div>
              </div>

              {(selectedInquiry.fileKey || selectedInquiry.fileSignedUrl) && (
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 space-y-3">
                  <h4 className="font-['Inter'] text-[#0F172A] flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#F02801]" />
                    Attachment
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-['Roboto'] text-[#475569]">
                      {selectedInquiry.fileName ?? "Attachment"}
                    </span>
                    <Button
                      asChild
                      variant="outline"
                      className="border-[#E5E7EB] text-[#0F172A]"
                    >
                      <a
                        href={
                          selectedInquiry.fileSignedUrl ??
                          buildFileUrl(selectedInquiry.fileKey) ??
                          "#"
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        View file
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
