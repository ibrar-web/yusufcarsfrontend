"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building2, FileText, Mail, MapPin, Phone } from "lucide-react";
import { apiGet, apiPost } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type DocumentFile = {
  id: string;
  type: string;
  displayName?: string;
  originalName: string;
  mimeType: string;
  size: string;
  signedUrl: string;
};

type SupplierProfile = {
  id: string;
  userId?: string;
  businessName: string;
  tradingAs?: string | null;
  businessType?: string | null;
  vatNumber?: string | null;
  description?: string | null;
  serviceRadius?: string | null;
  categories?: string[];
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  postCode?: string | null;
  phone?: string | null;
  contactPostcode?: string | null;
  approvalStatus?: string | null;
  rejectionReason?: string | null;
  approvedAt?: string | null;
  submittedAt?: string | null;
  updatedAt?: string | null;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
    suspensionReason?: string | null;
    createdAt: string;
    postCode?: string | null;
  };
  documentFiles?: {
    byType?: Record<string, DocumentFile | null>;
    latestDocuments?: DocumentFile[] | null;
  };
};

type ApiResponse = {
  statusCode?: number;
  message?: string;
  data?: SupplierProfile | { data?: SupplierProfile };
};

export default function AdminSupplierProfilePage() {
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("id");
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<
    null | "approve" | "reject" | "suspend" | "activate"
  >(null);
  const [actionReason, setActionReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const fetchSupplierProfile = useCallback(async () => {
    if (!supplierId) {
      throw new Error("Missing supplier id.");
    }
    const response: ApiResponse = await apiGet(
      apiRoutes.admin.supplier.read(supplierId)
    );
    const container = response?.data ?? response;
    const payload =
      container && typeof container === "object" && "data" in container
        ? (container as { data: SupplierProfile }).data
        : container;

    if (!payload || typeof payload !== "object") {
      throw new Error("Supplier not found.");
    }

    return payload as SupplierProfile;
  }, [supplierId]);

  useEffect(() => {
    if (!supplierId) {
      setError("Missing supplier id.");
      setProfile(null);
      return;
    }

    let isActive = true;
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSupplierProfile();
        if (isActive) {
          setProfile(data);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to load profile."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      isActive = false;
    };
  }, [supplierId, fetchSupplierProfile]);

  const contactEmail = profile?.user?.email ?? "N/A";
  const phoneNumber = profile?.phone ?? "N/A";
  const isActive = profile?.user?.isActive ?? false;
  const derivedStatus = isActive ? "Active" : "Inactive";
  const approvalStatusRaw = profile?.approvalStatus ?? "pending";
  const approvalStatusLabel = approvalStatusRaw
    .replace(/_/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase());
  const roleLabel = profile?.user?.role
    ? profile.user.role.replace(/^\w/, (char) => char.toUpperCase())
    : "Supplier";
  const formattedAddress = useMemo(() => {
    if (!profile) return "N/A";
    const segments = [
      profile.addressLine1,
      profile.addressLine2,
      profile.city,
      profile.postCode,
      profile.contactPostcode,
    ].filter(Boolean);
    return segments.length ? segments.join(", ") : "N/A";
  }, [profile]);
  const documents = useMemo(() => {
    const list: { label: string; url: string; name?: string }[] = [];
    const byType = profile?.documentFiles?.byType;
    if (byType) {
      Object.values(byType).forEach((doc) => {
        if (doc?.signedUrl) {
          list.push({
            label:
              doc.displayName ??
              doc.type.replace(/_/g, " ").replace(/^\w/, (char) => char.toUpperCase()),
            url: doc.signedUrl,
            name: doc.originalName,
          });
        }
      });
    } else if (profile?.documentFiles?.latestDocuments) {
      profile.documentFiles.latestDocuments.forEach((doc) => {
        if (doc?.signedUrl) {
          list.push({
            label:
              doc.displayName ??
              doc.type.replace(/_/g, " ").replace(/^\w/, (char) => char.toUpperCase()),
            url: doc.signedUrl,
            name: doc.originalName,
          });
        }
      });
    }
    return list;
  }, [profile]);
  const categories = profile?.categories ?? [];
  const approvalBadgeClass =
    approvalStatusRaw === "approved"
      ? "bg-[#DCFCE7] text-[#166534] border-0"
      : approvalStatusRaw === "rejected"
        ? "bg-[#FEE2E2] text-[#7F1D1D] border-0"
        : "bg-[#FEF9C3] text-[#92400E] border-0";

  const openActionModal = (
    type: "approve" | "reject" | "suspend" | "activate"
  ) => {
    setActionModal(type);
    setActionReason("");
    setActionError(null);
  };

  const closeActionModal = () => {
    if (actionSubmitting) return;
    setActionModal(null);
    setActionReason("");
    setActionError(null);
  };

  const handleActionSubmit = async () => {
    if (!profile || !actionModal) return;
    const requiresReason = actionModal === "reject" || actionModal === "suspend";
    if (requiresReason && !actionReason.trim()) {
      setActionError("Please provide a reason.");
      return;
    }

    const endpointMap = {
      approve: apiRoutes.admin.supplier.approve(profile.id),
      reject: apiRoutes.admin.supplier.reject(profile.id),
      suspend: apiRoutes.admin.supplier.suspend(profile.id),
      activate: apiRoutes.admin.supplier.active(profile.id),
    } as const;

    const payload =
      actionModal === "approve" || actionModal === "activate"
        ? undefined
        : { reason: actionReason.trim() };

    setActionSubmitting(true);
    setActionError(null);
    try {
      await apiPost(endpointMap[actionModal], payload);
      const updated = await fetchSupplierProfile();
      setProfile(updated);
      closeActionModal();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to perform action."
      );
    } finally {
      setActionSubmitting(false);
    }
  };

  if (!supplierId) {
    return (
      <div className="space-y-4">
        <Link href="/admin/suppliers">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Button>
        </Link>
        <Card>
          <CardContent className="p-6">
            <p className="text-[#475569] font-['Roboto']">
              No supplier id was provided. Please open this page from the
              suppliers table.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-['Inter'] text-[#0F172A] mb-1">
            Supplier Profile
          </h1>
          <p className="text-[#475569] font-['Roboto']">
            Review supplier details, documents, and compliance status
          </p>
        </div>
        <Link href="/admin/suppliers">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Button>
        </Link>
      </div>

      {isLoading && !profile && (
        <Card>
          <CardContent className="p-6 text-[#475569] font-['Roboto']">
            Loading supplier information...
          </CardContent>
        </Card>
      )}

      {error && !profile && (
        <Card>
          <CardContent className="p-6 text-[#B91C1C] font-['Roboto']">
            {error}
          </CardContent>
        </Card>
      )}

      {profile && (
        <>
          <Card className="border border-[#E5E7EB] bg-gradient-to-br from-[#FEF2F2] to-white">
            <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[#F02801] flex items-center justify-center text-white shadow-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-['Inter'] text-[#0F172A]">
                    {profile.businessName}
                  </h2>
                  <p className="text-sm text-[#475569] font-['Roboto']">
                    User ID • {profile.user?.id ?? profile.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  className={`px-3 py-1 font-['Roboto'] ${
                    derivedStatus === "Active"
                      ? "bg-[#DCFCE7] text-[#166534] border-0"
                      : "bg-[#FEE2E2] text-[#7F1D1D] border-0"
                  }`}
                >
                  {derivedStatus}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[#22C55E] text-[#22C55E] font-['Roboto']"
                >
                  {roleLabel}
                </Badge>
                <Badge className={`px-3 py-1 font-['Roboto'] ${approvalBadgeClass}`}>
                  {approvalStatusLabel}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E5E7EB] shadow-sm">
            <CardHeader className="border-b border-[#E5E7EB]">
              <CardTitle className="font-['Inter'] text-[#0F172A]">
                Business Information
              </CardTitle>
              <CardDescription className="font-['Roboto'] text-[#475569]">
                Key supplier details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto']">
                    Trading As
                  </p>
                  <p className="text-[#0F172A] font-['Inter']">
                    {profile.tradingAs || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto']">
                    Business Type
                  </p>
                  <p className="text-[#0F172A] font-['Inter']">
                    {profile.businessType || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto']">VAT</p>
                  <p className="text-[#0F172A] font-['Inter']">
                    {profile.vatNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto']">
                    Service Radius
                  </p>
                  <p className="text-[#0F172A] font-['Inter']">
                    {profile.serviceRadius || "N/A"}
                  </p>
                </div>
              </div>
              <Separator />
              <p className="text-[#475569] font-['Roboto'] leading-relaxed">
                {profile.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[#E5E7EB] shadow-sm">
            <CardHeader className="border-b border-[#E5E7EB]">
              <CardTitle className="font-['Inter'] text-[#0F172A]">
                Contact & Location
              </CardTitle>
              <CardDescription className="font-['Roboto'] text-[#475569]">
                Addresses and communication details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#F02801]" />
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto']">
                    Email
                  </p>
                  <p className="font-['Inter'] text-[#0F172A]">
                    {contactEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#F02801]" />
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto']">
                    Phone
                  </p>
                  <p className="font-['Inter'] text-[#0F172A]">{phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="h-5 w-5 text-[#F02801]" />
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto']">
                    Address
                  </p>
                  <p className="font-['Inter'] text-[#0F172A]">
                    {formattedAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E5E7EB] shadow-sm">
            <CardHeader className="border-b border-[#E5E7EB]">
              <CardTitle className="font-['Inter'] text-[#0F172A]">
                Compliance Documents
              </CardTitle>
              <CardDescription className="font-['Roboto'] text-[#475569]">
                Uploaded proof of registration and insurance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <div
                    key={doc.label}
                    className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#F02801]" />
                      <div>
                        <p className="font-['Inter'] text-[#0F172A]">
                          {doc.label}
                        </p>
                        <p className="text-sm text-[#94A3B8] font-['Roboto']">
                          {doc.name || "Uploaded document"}
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#94A3B8] font-['Roboto']">
                  No documents uploaded yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[#E5E7EB] shadow-sm">
            <CardHeader className="border-b border-[#E5E7EB]">
              <CardTitle className="font-['Inter'] text-[#0F172A]">
                Categories
              </CardTitle>
              <CardDescription className="font-['Roboto'] text-[#475569]">
                Parts and services offered
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex flex-wrap gap-3">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="border-[#F02801] text-[#F02801]"
                  >
                    {category}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-[#94A3B8] font-['Roboto']">
                  No categories provided.
                </span>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              className={
                isActive
                  ? "bg-[#EF4444] hover:bg-[#DC2626] text-white sm:w-auto"
                  : "bg-[#22C55E] hover:bg-[#16A34A] text-white sm:w-auto"
              }
              onClick={() => openActionModal(isActive ? "suspend" : "activate")}
            >
              {isActive ? "Suspend Supplier" : "Activate Supplier"}
            </Button>
            <Button
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white sm:w-auto"
              onClick={() => openActionModal("approve")}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              className="sm:w-auto"
              onClick={() => openActionModal("reject")}
            >
              Reject
            </Button>
          </div>
        </>
      )}

      <Dialog
        open={!!actionModal}
        onOpenChange={(open) => !open && closeActionModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">
              {actionModal === "approve"
                ? "Approve Supplier"
                : actionModal === "reject"
                  ? "Reject Supplier"
                  : actionModal === "suspend"
                    ? "Suspend Supplier"
                    : "Activate Supplier"}
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              {actionModal === "approve"
                ? "Approve this supplier to grant them access to the platform."
                : actionModal === "reject"
                  ? "Provide a reason for rejecting this supplier."
                  : actionModal === "suspend"
                    ? "Provide a reason for suspending this supplier."
                    : "Reactivate this supplier to restore access."}
            </DialogDescription>
          </DialogHeader>
          {(actionModal === "reject" || actionModal === "suspend") && (
            <div className="space-y-2">
              <p className="text-sm font-['Roboto'] text-[#0F172A]">Reason</p>
              <Textarea
                value={actionReason}
                onChange={(event) => setActionReason(event.target.value)}
                placeholder={`Enter ${
                  actionModal === "suspend" ? "suspension" : "rejection"
                } reason`}
                rows={4}
              />
            </div>
          )}
          {actionError && (
            <p className="text-sm text-[#B91C1C] font-['Roboto']">{actionError}</p>
          )}
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={closeActionModal}
              disabled={actionSubmitting}
            >
              Cancel
            </Button>
            <Button
              className={
                actionModal === "approve" || actionModal === "activate"
                  ? "bg-[#22C55E] hover:bg-[#16A34A] text-white"
                  : "bg-[#EF4444] hover:bg-[#DC2626] text-white"
              }
              onClick={handleActionSubmit}
              disabled={actionSubmitting}
            >
              {actionSubmitting ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
