"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminPendingSuppliers } from "@/page-components/admin-dashboard/data";
import {
  Building2,
  Calendar,
  CheckCircle,
  FileText,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { apiGet } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import { TablePagination } from "@/components/table-pagination";

type SupplierRecord = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  postCode?: string | null;
};

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierStatusFilter, setSupplierStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalSuccessDialogOpen, setApprovalSuccessDialogOpen] =
    useState(false);
  const [selectedPendingSupplier, setSelectedPendingSupplier] =
    useState<PendingSupplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord | null>(
    null
  );
  const [supplierDetailsDialogOpen, setSupplierDetailsDialogOpen] =
    useState(false);
  const normalizeSuppliers = (payload: unknown): SupplierRecord[] => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload as SupplierRecord[];
    if (
      typeof payload === "object" &&
      payload !== null &&
      "data" in payload &&
      Array.isArray((payload as Record<string, unknown>).data)
    ) {
      return (payload as { data: SupplierRecord[] }).data;
    }
    if (
      typeof payload === "object" &&
      payload !== null &&
      "items" in payload &&
      Array.isArray((payload as Record<string, unknown>).items)
    ) {
      return (payload as { items: SupplierRecord[] }).items;
    }
    if (
      typeof payload === "object" &&
      payload !== null &&
      "data" in payload &&
      typeof (payload as Record<string, unknown>).data === "object"
    ) {
      const inner = (payload as { data: unknown }).data;
      if (Array.isArray(inner)) return inner as SupplierRecord[];
      if (
        inner &&
        typeof inner === "object" &&
        "data" in (inner as Record<string, unknown>) &&
        Array.isArray((inner as { data: SupplierRecord[] }).data)
      ) {
        return (inner as { data: SupplierRecord[] }).data;
      }
    }
    return [];
  };

  const fetchSuppliers = useCallback(
    async ({
      page: requestedPage = 1,
      pageSize: requestedPageSize = 20,
    } = {}) => {
      setIsLoading(true);
      try {
        const params = {
          page: requestedPage,
          limit: requestedPageSize,
          query: supplierSearch || undefined,
          status:
            supplierStatusFilter !== "all" ? supplierStatusFilter : undefined,
        };

        const response: any = await apiGet(apiRoutes.admin.supplier.list, {
          params,
        });
        const payload = response?.data ?? response;
        const container = payload?.data ?? payload;
        const data = normalizeSuppliers(container?.data ?? container);
        const meta = container?.meta ?? payload?.meta ?? response?.meta ?? {};

        setSuppliers(data);
        setTotalSuppliers(meta?.total ?? data.length);
        setPage(meta?.page ?? requestedPage);
        setPageSize(meta?.limit ?? requestedPageSize);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch suppliers", error);
      } finally {
        setIsLoading(false);
      }
    },
    [supplierSearch, supplierStatusFilter]
  );

  useEffect(() => {
    fetchSuppliers({ page: 1, pageSize });
  }, [fetchSuppliers, pageSize]);

  const handlePageChange = (nextPage: number) => {
    fetchSuppliers({ page: nextPage, pageSize });
  };

  const handlePageSizeChange = (nextSize: number) => {
    fetchSuppliers({ page: 1, pageSize: nextSize });
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEF3C7] via-[#FEF9C3] to-white border-2 border-[#F59E0B]/20 p-6 shadow-[0_0_24px_rgba(245,158,11,0.12)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">
              Supplier Management
            </h1>
            <p className="text-base md:text-lg text-[#475569] font-['Roboto']">
              {adminPendingSuppliers.length} pending approvals •{" "}
              {(totalSuppliers || suppliers.length) ?? 0} active suppliers
            </p>
          </div>
        </div>

        <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
          <CardHeader className="pb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <CardTitle className="font-['Inter'] text-[#0F172A]">
                Pending Approvals
              </CardTitle>
              <Badge className="bg-[#FEF3C7] text-[#92400E] border-[#F59E0B] px-3 py-1 font-['Roboto']">
                {adminPendingSuppliers.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {adminPendingSuppliers.map((supplier, index) => (
              <div
                key={supplier.id}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-[#F1F5F9] transition-all ${
                  index !== adminPendingSuppliers.length - 1
                    ? "border-b border-[#E5E7EB]"
                    : ""
                }`}
              >
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-['Inter'] text-[#0F172A]">
                    {supplier.name}
                  </h3>
                  <p className="text-sm text-[#475569] font-['Roboto']">
                    ID: {supplier.id}
                  </p>
                </div>
                <div className="flex items-center gap-2 min-w-[140px]">
                  <MapPin className="h-4 w-4 text-[#475569]" />
                  <span className="text-sm text-[#475569] font-['Roboto']">
                    {supplier.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Calendar className="h-4 w-4 text-[#475569]" />
                  <span className="text-sm text-[#475569] font-['Roboto']">
                    {supplier.appliedDate}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-9 px-4"
                  onClick={() => {
                    setSelectedPendingSupplier(supplier);
                    setReviewDialogOpen(true);
                  }}
                >
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  Review
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
          <CardHeader className="pb-4 border-b border-[#E5E7EB] bg-gradient-to-br from-[#DCFCE7] via-[#F0FDF4] to-white">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-[#22C55E] flex items-center justify-center shadow-sm">
                <CheckCircle className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <CardTitle className="font-['Inter'] text-[#0F172A]">
                  Active Suppliers
                </CardTitle>
                <CardDescription className="font-['Roboto'] text-[#475569]">
                  Approved suppliers on the platform
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  type="text"
                  placeholder="Search suppliers by name, city or ID..."
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  className="pl-12 h-12 border-[#E5E7EB] focus:border-[#F02801] focus:ring-[#F02801] rounded-xl font-['Roboto'] text-[#0F172A] placeholder:text-[#94A3B8]"
                />
                {supplierSearch && (
                  <button
                    onClick={() => setSupplierSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#F02801]"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl">
                {[
                  { id: "all", label: "All" },
                  { id: "active", label: "Active" },
                  { id: "inactive", label: "Inactive" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() =>
                      setSupplierStatusFilter(filter.id as typeof supplierStatusFilter)
                    }
                    className={`px-4 py-2 rounded-lg font-['Roboto'] transition-all ${
                      supplierStatusFilter === filter.id
                        ? "bg-white text-[#0F172A] shadow-sm"
                        : "text-[#475569] hover:text-[#0F172A]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading && (
              <div className="px-6 py-2 text-sm text-muted-foreground">
                Loading suppliers...
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E5E7EB]">
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    Business
                  </TableHead>
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    Contact
                  </TableHead>
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    City
                  </TableHead>
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    Joined
                  </TableHead>
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    Status
                  </TableHead>
                  <TableHead className="text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]"
                    >
                      <TableCell className="font-['Inter'] text-[#0F172A]">
                        <div className="flex flex-col">
                          <span>{supplier.fullName}</span>
                          <span className="text-xs text-[#94A3B8] font-['Roboto']">
                            ID: {supplier.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        <div className="flex flex-col">
                          <span>{supplier.email}</span>
                          <span className="text-xs text-[#94A3B8]">
                            {supplier.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {supplier.postCode || "—"}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {formatDate(supplier.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-['Roboto'] ${
                            supplier.isActive
                              ? "bg-[#DCFCE7] text-[#166534] border-0"
                              : "bg-[#FEE2E2] text-[#7F1D1D] border-0"
                          }`}
                        >
                          {supplier.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setSupplierDetailsDialogOpen(true);
                          }}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 text-[#CBD5E1]" />
                        <p className="text-[#475569] font-['Roboto']">
                          No suppliers found matching "{supplierSearch}"
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSupplierSearch("")}
                          className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full"
                        >
                          Clear Search
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-end mt-4">
              <TablePagination
                page={page}
                pageSize={pageSize}
                totalItems={totalSuppliers}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl border-[#E5E7EB] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">
              Supplier Application Review
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              Review supplier details and documentation before approval
            </DialogDescription>
          </DialogHeader>
          {selectedPendingSupplier && (
            <div className="space-y-6 mt-2">
              <div className="bg-gradient-to-br from-[#FEE2E2] via-[#FEF3F2] to-white p-6 rounded-xl border-2 border-[#F02801]/20">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-['Inter'] text-[#0F172A] mb-1">
                      {selectedPendingSupplier.name}
                    </h3>
                    <p className="text-sm text-[#475569] font-['Roboto']">
                      {selectedPendingSupplier.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedPendingSupplier.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="font-['Roboto'] border-[#F02801] text-[#F02801] bg-[#FEF3F2]"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="h-4 w-4 text-[#F02801]" />
                    <div>
                      <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                        Business Address
                      </p>
                      <p className="font-['Roboto'] text-[#0F172A]">
                        {selectedPendingSupplier.businessAddress}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-start gap-3 mb-3">
                    <Mail className="h-4 w-4 text-[#F02801]" />
                    <div>
                      <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                        Email
                      </p>
                      <p className="font-['Roboto'] text-[#0F172A]">
                        {selectedPendingSupplier.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-start gap-3 mb-3">
                    <Phone className="h-4 w-4 text-[#F02801]" />
                    <div>
                      <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                        Phone
                      </p>
                      <p className="font-['Roboto'] text-[#0F172A]">
                        {selectedPendingSupplier.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-start gap-3 mb-3">
                    <Users className="h-4 w-4 text-[#F02801]" />
                    <div>
                      <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                        Years in Business
                      </p>
                      <p className="font-['Roboto'] text-[#0F172A]">
                        {selectedPendingSupplier.yearsInBusiness}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#DC2626] font-['Roboto'] rounded-full h-11"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto'] rounded-full h-11"
                  onClick={() => {
                    setReviewDialogOpen(false);
                    setApprovalDialogOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="max-w-md border-[#E5E7EB] bg-white">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">
              Confirm Supplier Approval
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              Are you sure you want to approve this supplier?
            </DialogDescription>
          </DialogHeader>
          {selectedPendingSupplier && (
            <>
              <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB] mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-['Inter'] text-[#0F172A]">
                      {selectedPendingSupplier.name}
                    </p>
                    <p className="text-sm text-[#475569] font-['Roboto']">
                      {selectedPendingSupplier.location}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setApprovalDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
                  onClick={() => {
                    setApprovalDialogOpen(false);
                    setApprovalSuccessDialogOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Approval
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={approvalSuccessDialogOpen}
        onOpenChange={setApprovalSuccessDialogOpen}
      >
        <DialogContent className="max-w-md border-[#E5E7EB] bg-white">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#DCFCE7] border-2 border-[#22C55E] flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="h-8 w-8 text-[#22C55E]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-['Inter'] text-[#0F172A] mb-2">
                Supplier Approved
              </h3>
              <p className="text-sm text-[#475569] font-['Roboto']">
                {selectedPendingSupplier?.name} has been successfully approved
                and notified via email.
              </p>
            </div>
            <Button
              className="w-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
              onClick={() => setApprovalSuccessDialogOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={supplierDetailsDialogOpen}
        onOpenChange={setSupplierDetailsDialogOpen}
      >
        <DialogContent className="max-w-2xl border border-[#334155] bg-[#1E293B] max-h-[90vh] overflow-y-auto pt-8">
          <DialogHeader className="mb-2">
            <DialogTitle className="font-['Inter'] text-white">
              Supplier Details
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#CBD5E1]">
              Complete information about this supplier
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-4 mt-4">
              <div className="bg-gradient-to-br from-[#7F1D1D]/20 via-[#7F1D1D]/10 to-transparent p-6 rounded-xl border border-[#F02801]/30">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-['Inter'] text-white">
                        {selectedSupplier.fullName}
                      </h3>
                      <Badge
                        className={`font-['Roboto'] ${
                          selectedSupplier.isActive
                            ? "bg-[#166534]/30 text-[#86EFAC] border-[#22C55E]"
                            : "bg-[#7F1D1D]/30 text-[#FCA5A5] border-[#F02801]"
                        }`}
                      >
                        {selectedSupplier.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#CBD5E1] font-['Roboto']">
                      {selectedSupplier.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-['Roboto']">Email</span>
                  </div>
                  <p className="font-['Inter'] text-white">{selectedSupplier.email}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-['Roboto']">Role</span>
                  </div>
                  <p className="font-['Inter'] text-white">
                    {selectedSupplier.role}
                  </p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <FileText className="h-4 w-4 text-[#F59E0B]" />
                    <span className="text-sm font-['Roboto']">Supplier ID</span>
                  </div>
                  <p className="font-['Inter'] text-white">{selectedSupplier.id}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <MapPin className="h-4 w-4 text-[#3B82F6]" />
                    <span className="text-sm font-['Roboto']">Postcode</span>
                  </div>
                  <p className="font-['Inter'] text-white">
                    {selectedSupplier.postCode || "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    <span className="text-sm font-['Roboto']">Verification</span>
                  </div>
                  <p className="font-['Inter'] text-white">
                    {selectedSupplier.isVerified ? "Verified" : "Pending"}
                  </p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <Calendar className="h-4 w-4 text-[#3B82F6]" />
                    <span className="text-sm font-['Roboto']">Joined</span>
                  </div>
                  <p className="font-['Inter'] text-white">
                    {formatDate(selectedSupplier.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[#475569] bg-transparent text-[#CBD5E1] hover:bg-[#334155] hover:text-white font-['Roboto']"
                  onClick={() => setSupplierDetailsDialogOpen(false)}
                >
                  Close
                </Button>
                <Link href={`/admin/suppliers/profile?id=${selectedSupplier.id}`}>
                  <Button
                    className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']"
                    onClick={() => {
                      setSupplierDetailsDialogOpen(false);
                    }}
                  >
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
