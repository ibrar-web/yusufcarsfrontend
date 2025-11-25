"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { apiRoutes } from "@/utils/apiroutes";
import { apiGet, apiPost } from "@/utils/apiconfig/http";
import {
  Bell,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Send,
  User,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

type SupplierQuoteRequestApi = {
  id: string;
  user?: {
    id: string;
    email?: string;
    fullName?: string;
    postCode?: string | null;
  } | null;
  model?: string | null;
  make?: string | null;
  registrationNumber?: string | null;
  taxStatus?: string | null;
  taxDueDate?: string | null;
  motStatus?: string | null;
  yearOfManufacture?: string | null;
  fuelType?: string | null;
  engineSize?: string | null;
  engineCapacity?: number | null;
  services?: string[] | null;
  postcode?: string | null;
  requestType?: string | null;
  status?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
  monthOfFirstRegistration?: string | null;
  colour?: string | null;
};

type SupplierQuoteRequest = {
  id: string;
  customerName: string;
  customerEmail?: string;
  vehicleDisplay?: string;
  registrationNumber?: string;
  partDescription: string;
  detailSummary: string;
  status: string;
  requestType?: string;
  postcode?: string;
  createdAt?: string;
  createdRelative?: string;
  expiresAt?: string;
  timeRemaining?: number;
};

type SupplierQuoteResponse = {
  statusCode?: number;
  message?: string;
  data?: {
    data?: SupplierQuoteRequestApi[];
    meta?: {
      total?: number;
      page?: number;
      limit?: number;
    };
  };
};

const requestStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-[#3B82F6] text-white border-0 shadow-sm font-['Roboto']",
  },
  quoted: {
    label: "Quoted",
    className: "bg-[#F59E0B] text-white border-0 shadow-sm font-['Roboto']",
  },
  expired: {
    label: "Expired",
    className: "bg-[#EF4444] text-white border-0 shadow-sm font-['Roboto']",
  },
};

const formatRelativeTime = (isoDate?: string | null) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const toDisplayLabel = (value?: string | null) => {
  if (!value) return "";
  return value
    .split(/[\s_-]+/)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

const normalizeQuoteRequest = (
  payload: SupplierQuoteRequestApi
): SupplierQuoteRequest => {
  const serviceNames = payload.services?.map(toDisplayLabel).filter(Boolean) ?? [];
  const partDescription = serviceNames.length
    ? serviceNames.join(", ")
    : "General service request";
  const vehicleDisplay = [
    payload.yearOfManufacture,
    payload.make,
    payload.model,
  ]
    .filter(Boolean)
    .join(" ");
  const expiresAtDate = payload.expiresAt ? new Date(payload.expiresAt) : null;
  const timeRemaining = expiresAtDate
    ? Math.round((expiresAtDate.getTime() - Date.now()) / 60000)
    : undefined;

  const detailSummaryParts = [
    payload.requestType ? `Request type: ${toDisplayLabel(payload.requestType)}` : null,
    payload.colour ? `Colour: ${payload.colour}` : null,
    payload.monthOfFirstRegistration
      ? `Registered: ${payload.monthOfFirstRegistration}`
      : null,
  ].filter(Boolean);

  return {
    id: payload.id,
    customerName:
      payload.user?.fullName || payload.user?.email || "Unknown customer",
    customerEmail: payload.user?.email || undefined,
    vehicleDisplay: vehicleDisplay || undefined,
    registrationNumber: payload.registrationNumber || undefined,
    partDescription,
    detailSummary:
      detailSummaryParts.join(" • ") ||
      "No additional details provided",
    status: (payload.status || "pending").toLowerCase(),
    requestType: payload.requestType || undefined,
    postcode: payload.postcode || payload.user?.postCode || undefined,
    createdAt: payload.createdAt || undefined,
    createdRelative: formatRelativeTime(payload.createdAt),
    expiresAt: payload.expiresAt || undefined,
    timeRemaining,
  };
};

export default function SupplierRequestsPage() {
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("1-2");
  const [requestsToShow, setRequestsToShow] = useState(2);
  const [showQuoteSentDialog, setShowQuoteSentDialog] = useState(false);
  const [partCondition, setPartCondition] = useState<"new" | "used">("new");
  const [requests, setRequests] = useState<SupplierQuoteRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [openRequestId, setOpenRequestId] = useState<string | null>(null);
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const newRequestsEndpoint = apiRoutes.supplier.quote.newrequests.startsWith("/")
    ? apiRoutes.supplier.quote.newrequests
    : `/${apiRoutes.supplier.quote.newrequests}`;
  const sendOfferEndpoint = apiRoutes.supplier.quote.sendoffer.startsWith("/")
    ? apiRoutes.supplier.quote.sendoffer
    : `/${apiRoutes.supplier.quote.sendoffer}`;

  const loadRequests = useCallback(async () => {
    try {
      setIsLoadingRequests(true);
      const response = await apiGet<SupplierQuoteResponse>(newRequestsEndpoint);
      const payloads = response?.data?.data ?? [];
      setRequests(payloads.map(normalizeQuoteRequest));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load supplier requests");
      }
    } finally {
      setIsLoadingRequests(false);
    }
  }, [newRequestsEndpoint]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const newRequests = requests.filter(
    (request) => request.status === "pending" || request.status === "new"
  );

  const deliveryTimeMap: Record<string, string> = {
    "same-day": "Same day",
    "1-2": "1-2 business days",
    "3-5": "3-5 business days",
    "1-week": "1 week",
  };

  const handleSendQuote = async (request: SupplierQuoteRequest) => {
    const priceValue = parseFloat(quoteAmount);
    if (!quoteAmount || Number.isNaN(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid quote amount");
      return;
    }

    const estimatedTime = deliveryTimeMap[deliveryTime] ?? deliveryTime;
    const expiresAt = request.expiresAt
      ? request.expiresAt
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const trimmedNotes = quoteNotes.trim();

    try {
      setSubmittingQuote(true);
      await apiPost(sendOfferEndpoint, {
        quoteRequestId: request.id,
        price: priceValue,
        estimatedTime,
        partCondition: partCondition === "new" ? "New" : "Used",
        notes: trimmedNotes ? trimmedNotes : undefined,
        expiresAt,
      });
      toast.success("Quote sent successfully");
      setShowQuoteSentDialog(true);
      setOpenRequestId(null);
      setQuoteAmount("");
      setQuoteNotes("");
      setDeliveryTime("1-2");
      setPartCondition("new");
      await loadRequests();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send quote");
      }
    } finally {
      setSubmittingQuote(false);
    }
  };

  const renderRequestStatusBadge = (status: string) => {
    const normalized = status?.toLowerCase?.() ?? "pending";
    const config = requestStatusConfig[normalized] ?? requestStatusConfig.pending;
    return (
      <Badge className={`${config.className} px-4 py-1.5`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEE2E2] to-[#FFFFFF]">
        <CardContent className="p-6">
          <p className="text-sm text-[#475569] font-['Roboto']">
            Track your performance and manage incoming requests
          </p>
          <h1 className="mt-2 font-['Inter'] text-[#0F172A] text-3xl font-bold">
            Dashboard Overview
          </h1>
        </CardContent>
      </Card>
      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <CardTitle className="font-['Inter'] text-[#0F172A]">
            New Requests
          </CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">
            {isLoadingRequests
              ? "Loading latest requests..."
              : `${newRequests.length} new part requests from customers`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newRequests.slice(0, requestsToShow).map((request) => (
              <Card
                key={request.id}
                className="border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white"
              >
                <CardContent className="p-4 space-y-4">
                  <div
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      request.timeRemaining !== undefined &&
                      request.timeRemaining <= 0
                        ? "bg-[#FEE2E2] border-[#F02801]/30"
                        : request.timeRemaining !== undefined &&
                          request.timeRemaining <= 10
                        ? "bg-[#FEF3C7] border-[#F59E0B]/30"
                        : "bg-[#DCFCE7] border-[#22C55E]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`h-4 w-4 ${
                          request.timeRemaining !== undefined &&
                          request.timeRemaining <= 0
                            ? "text-[#F02801]"
                            : request.timeRemaining !== undefined &&
                              request.timeRemaining <= 10
                            ? "text-[#F59E0B]"
                            : "text-[#22C55E]"
                        }`}
                      />
                      <span
                        className={`text-xs font-['Roboto'] ${
                          request.timeRemaining !== undefined &&
                          request.timeRemaining <= 0
                            ? "text-[#7F1D1D]"
                            : request.timeRemaining !== undefined &&
                              request.timeRemaining <= 10
                            ? "text-[#92400E]"
                            : "text-[#166534]"
                        }`}
                      >
                        {request.timeRemaining !== undefined &&
                        request.timeRemaining <= 0
                          ? `Expired ${Math.abs(
                              request.timeRemaining
                            )} mins ago`
                          : request.timeRemaining !== undefined
                            ? `${request.timeRemaining} mins left`
                            : "No expiry"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    {renderRequestStatusBadge(request.status)}
                    <div className="text-right">
                      <p className="text-xs text-[#475569] font-['Roboto'] mb-0.5">
                        Request ID
                      </p>
                      <p className="text-sm font-['Inter'] text-[#0F172A]">
                        {request.id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 p-3 bg-[#FEE2E2] rounded-lg border border-[#F02801]/20">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="h-7 w-7 rounded-lg bg-[#F02801] flex items-center justify-center shadow-sm">
                          <Wrench className="h-3.5 w-3.5 text-white" />
                        </div>
                        <p className="text-xs text-[#7F1D1D] font-['Roboto'] uppercase tracking-wide">
                          Part Requested
                        </p>
                      </div>
                      <p className="text-sm font-['Roboto'] text-[#0F172A] pl-9">
                        {request.partDescription}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-start gap-2">
                        <div className="h-7 w-7 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-sm flex-shrink-0">
                          <Car className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[#475569] font-['Roboto'] mb-1 uppercase tracking-wide">
                            For Vehicle
                          </p>
                          <p className="text-sm font-['Roboto'] text-[#0F172A]">
                            {request.vehicleDisplay || "Vehicle details not provided"}
                          </p>
                          <p className="text-xs text-[#475569] font-['Roboto'] mt-0.5">
                            {request.registrationNumber || "No registration"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2.5 bg-[#FEF3C7]/30 rounded-lg border border-[#FEF3C7]">
                      <div className="h-7 w-7 rounded-lg bg-[#F59E0B] flex items-center justify-center shadow-sm flex-shrink-0">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#92400E] font-['Roboto'] mb-0.5">
                          Customer
                        </p>
                        <p className="font-['Roboto'] text-[#0F172A] text-xs truncate">
                          {request.customerName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2.5 bg-[#DCFCE7]/30 rounded-lg border border-[#DCFCE7]">
                        <div className="h-7 w-7 rounded-lg bg-[#22C55E] flex items-center justify-center shadow-sm flex-shrink-0">
                          <MapPin className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#166534] font-['Roboto'] mb-0.5">
                            Postcode
                          </p>
                          <p className="font-['Roboto'] text-[#0F172A] text-xs">
                            {request.postcode || "Unknown"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 bg-[#E0E7FF]/30 rounded-lg border border-[#E0E7FF]">
                        <div className="h-7 w-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center shadow-sm flex-shrink-0">
                          <Calendar className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#5B21B6] font-['Roboto'] mb-0.5">
                            Created
                          </p>
                          <p className="font-['Roboto'] text-[#0F172A] text-xs">
                            {request.createdRelative || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Dialog
                    open={openRequestId === request.id}
                    onOpenChange={(open) =>
                      setOpenRequestId(open ? request.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full py-5"
                        onClick={() => setOpenRequestId(request.id)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Quote
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg border border-[#E5E7EB]">
                      <DialogHeader>
                        <DialogTitle className="font-['Inter'] text-[#0F172A] text-2xl">
                          Request Details - {request.id}
                        </DialogTitle>
                        <DialogDescription className="font-['Roboto'] text-[#475569]">
                          Review details and submit your quote
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-3 py-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-[#475569] font-['Roboto']">
                              Customer
                            </Label>
                            <p className="font-['Roboto'] text-[#0F172A]">
                              {request.customerName}
                          </p>
                        </div>
                          <div>
                            <Label className="text-[#475569] font-['Roboto']">
                              Postcode
                          </Label>
                          <p className="font-['Roboto'] text-[#0F172A]">
                            {request.postcode || "Unknown"}
                          </p>
                          </div>
                          <div>
                            <Label className="text-[#475569] font-['Roboto']">
                              Vehicle
                            </Label>
                            <p className="font-['Roboto'] text-[#0F172A]">
                              {request.vehicleDisplay || "Not provided"}
                          </p>
                          </div>
                          <div>
                            <Label className="text-[#475569] font-['Roboto']">
                              Registration
                            </Label>
                            <p className="font-['Roboto'] text-[#0F172A]">
                              {request.registrationNumber || "Not provided"}
                          </p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-[#475569] font-['Roboto']">
                            Requested Services
                          </Label>
                          <p className="font-['Roboto'] text-[#0F172A]">
                            {request.partDescription}
                          </p>
                        </div>

                        <div>
                          <Label className="text-[#475569] font-['Roboto']">
                            Additional Details
                          </Label>
                          <p className="font-['Roboto'] text-[#0F172A] text-sm">
                            {request.detailSummary}
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="font-['Inter'] text-[#0F172A]">
                            Submit Your Quote
                          </h4>

                          <div className="space-y-1.5">
                            <Label
                              htmlFor={`quoteAmount-${request.id}`}
                              className="font-['Roboto'] text-[#475569]"
                            >
                              Quote Amount (£){" "}
                              <span className="text-[#F02801]">*</span>
                            </Label>
                            <Input
                              id={`quoteAmount-${request.id}`}
                              type="number"
                              placeholder="0.00"
                              value={quoteAmount}
                              onChange={(e) => setQuoteAmount(e.target.value)}
                              className="font-['Roboto']"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="font-['Roboto'] text-[#475569]">
                              Part Condition{" "}
                              <span className="text-[#F02801]">*</span>
                            </Label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`partCondition-${request.id}`}
                                  value="new"
                                  checked={partCondition === "new"}
                                  onChange={() => setPartCondition("new")}
                                  className="w-4 h-4 text-[#F02801] border-[#E5E7EB] focus:ring-[#F02801] focus:ring-2"
                                />
                                <span className="font-['Roboto'] text-[#0F172A]">
                                  New
                                </span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`partCondition-${request.id}`}
                                  value="used"
                                  checked={partCondition === "used"}
                                  onChange={() => setPartCondition("used")}
                                  className="w-4 h-4 text-[#F02801] border-[#E5E7EB] focus:ring-[#F02801] focus:ring-2"
                                />
                                <span className="font-['Roboto'] text-[#0F172A]">
                                  Used
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label
                              htmlFor={`deliveryTime-${request.id}`}
                              className="font-['Roboto'] text-[#475569]"
                            >
                              Estimated Delivery
                            </Label>
                            <select
                              id={`deliveryTime-${request.id}`}
                              className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] bg-white font-['Roboto'] text-[#0F172A]"
                              value={deliveryTime}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                            >
                              <option value="same-day">Same day</option>
                              <option value="1-2">1-2 days</option>
                              <option value="3-5">3-5 days</option>
                              <option value="1-week">1 week</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label
                              htmlFor={`quoteNotes-${request.id}`}
                              className="font-['Roboto'] text-[#475569]"
                            >
                              Additional Notes
                            </Label>
                            <Textarea
                              id={`quoteNotes-${request.id}`}
                              placeholder="Include warranty details, delivery options, etc."
                              rows={2}
                              value={quoteNotes}
                              onChange={(e) => setQuoteNotes(e.target.value)}
                              className="font-['Roboto']"
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="font-['Roboto'] rounded-full"
                            onClick={() => setOpenRequestId(null)}
                            disabled={submittingQuote}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={() => handleSendQuote(request)}
                          className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full"
                          disabled={submittingQuote}
                        >
                          {submittingQuote ? (
                            "Sending..."
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Quote
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
            {!isLoadingRequests && newRequests.length === 0 && (
              <div className="col-span-full text-center py-8 text-[#475569] font-['Roboto']">
                No new requests available.
              </div>
            )}
          </div>

          {newRequests.length > requestsToShow && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setRequestsToShow((prev) => prev + 2)}
                className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-['Roboto']"
              >
                <Package className="h-5 w-5 mr-2" />
                Show More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={showQuoteSentDialog}
        onOpenChange={setShowQuoteSentDialog}
      >
        <AlertDialogContent className="border border-[#E5E7EB] shadow-lg max-w-md">
          <AlertDialogHeader>
            <div className="relative mx-auto mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] flex items-center justify-center shadow-lg">
                <CheckCircle
                  className="h-10 w-10 text-[#22C55E]"
                  strokeWidth={2.5}
                />
              </div>
              <div className="absolute inset-0 h-20 w-20 rounded-full bg-[#22C55E] opacity-20 animate-ping"></div>
            </div>
            <AlertDialogTitle className="font-['Inter'] text-[#0F172A] text-center text-2xl mb-3">
              Quote Sent Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="font-['Roboto'] text-[#475569] text-center leading-relaxed">
              Your quote has been sent to the customer. You'll receive a
              notification when they respond or accept your quote.
            </AlertDialogDescription>
            <div className="mt-6 p-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-[#F02801] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Roboto'] text-[#0F172A] mb-1">
                    Stay Updated
                  </p>
                  <p className="text-sm text-[#475569] font-['Roboto']">
                    Track this quote in the "My Quotes" section and check your
                    notifications for updates.
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] w-full py-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
