"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { apiGet } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";

type SupplierProfile = {
  id: string;
  businessName: string;
  tradingAs?: string | null;
  businessType?: string | null;
  vatNumber?: string | null;
  description?: string | null;
  serviceRadius?: string | null;
  categories?: string[];
  companyRegDoc?: string | null;
  insuranceDoc?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  postCode?: string | null;
  phone?: string | null;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
  };
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
};

type ApiResponse = {
  data?: SupplierProfile | { data?: SupplierProfile };
} & SupplierProfile;

export default function AdminSupplierProfilePage() {
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("id");
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supplierId) {
      setError("Missing supplier id.");
      return;
    }

    let isMounted = true;
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: ApiResponse = await apiGet(
          apiRoutes.admin.supplier.read(supplierId),
        );
        const payload =
          response?.data && "data" in response.data
            ? response.data.data
            : response?.data || response;

        if (!payload || typeof payload !== "object") {
          throw new Error("Supplier not found.");
        }

        if (isMounted) {
          setProfile(payload as SupplierProfile);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load profile.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [supplierId]);

  const contactEmail = profile?.user?.email ?? "N/A";
  const phoneNumber = profile?.phone ?? "N/A";
  const derivedStatus =
    profile && (profile.isActive ?? profile.user?.isActive) ? "Active" : "Inactive";
  const derivedVerification =
    profile && (profile.isVerified ?? profile.user?.isVerified) ? "Verified" : "Verification Pending";
  const formattedAddress = useMemo(() => {
    if (!profile) return "N/A";
    const segments = [
      profile.addressLine1,
      profile.addressLine2,
      profile.city,
      profile.postCode,
    ].filter(Boolean);
    return segments.length ? segments.join(", ") : "N/A";
  }, [profile]);
  const documents = useMemo(() => {
    const list: { label: string; url: string }[] = [];
    if (profile?.companyRegDoc) {
      list.push({ label: "Company Registration", url: profile.companyRegDoc });
    }
    if (profile?.insuranceDoc) {
      list.push({ label: "Insurance Certificate", url: profile.insuranceDoc });
    }
    return list;
  }, [profile]);
  const categories = profile?.categories ?? [];

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
              No supplier id was provided. Please open this page from the suppliers table.
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
                    Supplier ID • {profile.id}
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
                  {derivedVerification}
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
                  <p className="font-['Inter'] text-[#0F172A]">
                    {phoneNumber}
                  </p>
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
                          Uploaded document
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
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
            <Button variant="outline" className="sm:w-auto">
              Request Update
            </Button>
            <Button className="bg-[#EF4444] hover:bg-[#DC2626] text-white sm:w-auto">
              Suspend Supplier
            </Button>
            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white sm:w-auto">
              Approve Changes
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
