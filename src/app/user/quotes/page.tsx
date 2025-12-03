"use client";

import type { ComponentProps } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { QuoteCard } from "@/components/quote-card";
import { SupplierDetailsDialog } from "@/components/supplier-details-dialog";
import { OrderPlacedDialog } from "@/components/order/order-placed-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Grid,
  List,
  Search,
  X,
  Check,
  Star,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { useAppState } from "@/hooks/use-app-state";
import { apiRoutes } from "@/utils/apiroutes";
import { apiGet } from "@/utils/apiconfig/http";

const FALLBACK_SUPPLIER_IMAGE =
  "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop";

const PART_IMAGE_MAP: Record<string, string> = {
  "front-brake-disc-pad-set":
    "https://images.unsplash.com/photo-1595444276957-9efea46598d7?auto=format&fit=crop&w=600&q=80",
  "engine-oil-filter-kit":
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
  "coil-spring-set":
    "https://images.unsplash.com/photo-1669136048337-5daa3adef7b2?auto=format&fit=crop&w=600&q=80",
  "headlight-assembly":
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80",
  "timing-belt-kit":
    "https://images.unsplash.com/photo-1527363050776-918ace6b3296?auto=format&fit=crop&w=600&q=80",
  "engine-mount":
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_PART_IMAGES = [
  "https://images.unsplash.com/photo-1595444276957-9efea46598d7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1669136048337-5daa3adef7b2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80",
];

const getPartImageForServices = (
  services?: string[] | null,
  fallbackId?: string
) => {
  if (services && services.length > 0) {
    for (const service of services) {
      const key = service.toLowerCase();
      if (PART_IMAGE_MAP[key]) {
        return PART_IMAGE_MAP[key];
      }
    }
  }
  if (fallbackId) {
    const index = Math.abs(hashCode(fallbackId)) % DEFAULT_PART_IMAGES.length;
    return DEFAULT_PART_IMAGES[index];
  }
  return DEFAULT_PART_IMAGES[0];
};

function hashCode(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

const ensureEndpoint = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

const formatTitleCase = (value?: string | null) => {
  if (!value) return "";
  return value
    .split(/[\s_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const normalizePartCondition = (value?: string | null) => {
  if (!value) return "new" as const;
  const normalized = value.toLowerCase();
  if (normalized === "used" || normalized === "refurbished") {
    return normalized as "used" | "refurbished";
  }
  return "new";
};

const formatServices = (services?: string[] | null) => {
  if (!services || services.length === 0) {
    return "Vehicle parts request";
  }
  return services.map(formatTitleCase).join(", ");
};

const buildServiceLabels = (services?: string[] | null) =>
  services?.map(formatTitleCase) ?? [];

const buildSupplierDetails = (
  supplierId: string,
  supplierName: string,
  approved: boolean,
  city?: string | null,
  description?: string | null,
  categories?: string[] | null,
  eta?: string | null,
  phone?: string | null,
  email?: string | null
): ComponentProps<typeof SupplierDetailsDialog>["supplier"] => ({
  id: supplierId,
  name: supplierName,
  logo: FALLBACK_SUPPLIER_IMAGE,
  rating: 4.5,
  reviews: 0,
  location: city ?? "Unknown",
  distance: undefined,
  responseTime: "Typically responds within 24 hours",
  verified: approved,
  deliveryTime: eta ?? undefined,
  completionRate: 95,
  yearsInBusiness: 5,
  totalOrders: 0,
  description: description ?? "Supplier has not provided a description yet.",
  specialties: categories ?? [],
  certifications: [],
  contact: {
    phone: phone ?? undefined,
    email: email ?? undefined,
  },
  ratingBreakdown: {
    quality: 4.5,
    communication: 4.5,
    delivery: 4.5,
    value: 4.5,
  },
  recentReviews: [],
});

type UserQuoteOffer = {
  id: string;
  partName?: string | null;
  brand?: string | null;
  offers?: unknown;
  price?: string | number | null;
  estimatedTime?: string | null;
  partCondition?: string | null;
  notes?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  expiresAt?: string | null;
  quoteRequestId?: string | null;
  supplier?: {
    id: string;
    userId?: string | null;
    businessName?: string | null;
    tradingAs?: string | null;
    fullName?: string | null;
    email?: string | null;
    city?: string | null;
    description?: string | null;
    categories?: string[] | null;
    approvalStatus?: string | null;
    phone?: string | null;
    postCode?: string | null;
  } | null;
};

type UserQuotesResponse = {
  statusCode?: number;
  message?: string;
  data?: {
    data?: UserQuoteOffer[];
    meta?: {
      total?: number;
      page?: number;
      limit?: number;
    };
  };
};

type NormalizedQuote = ComponentProps<typeof QuoteCard>["quote"] & {
  supplierDetails: ComponentProps<typeof SupplierDetailsDialog>["supplier"];
  status: string;
  requestSummary: string;
  vehicleSummary: string;
  requestId?: string;
  sentAt?: string;
  notes?: string;
  customer?: string;
};

const normalizeOffer = (offer: UserQuoteOffer): NormalizedQuote => {
  const supplierId = offer.supplier?.id ?? offer.quoteRequestId ?? offer.id;
  const supplierChatId = offer.supplier?.userId ?? supplierId;
  const supplierName =
    offer.supplier?.businessName ||
    offer.supplier?.tradingAs ||
    offer.supplier?.fullName ||
    "Supplier";
  const supplierSummary = {
    id: supplierId,
    name: supplierName,
    email: offer.supplier?.email ?? undefined,
  };
  const priceValue =
    typeof offer.price === "string"
      ? parseFloat(offer.price)
      : offer.price ?? 0;
  const serviceTokens = offer.partName ? [offer.partName] : undefined;
  const normalizedPartName = offer.partName
    ? formatTitleCase(offer.partName)
    : undefined;
  const normalizedBrand = offer.brand
    ? formatTitleCase(offer.brand)
    : undefined;
  const servicesLabel = formatServices(serviceTokens);
  const servicesArray = buildServiceLabels(serviceTokens);
  const vehicleSummary = offer.brand ? formatTitleCase(offer.brand) : "";
  const currentStatus = (offer.status || "pending").toLowerCase();
  const cardQuote: ComponentProps<typeof QuoteCard>["quote"] = {
    id: offer.id,
    supplierId,
    supplierChatId,
    supplierName,
    supplierLogo: FALLBACK_SUPPLIER_IMAGE,
    supplier: supplierSummary,
    price: Number.isFinite(priceValue) ? Number(priceValue) : 0,
    originalPrice: undefined,
    rating: 4.6,
    reviewCount: 0,
    distance: 0,
    eta: offer.estimatedTime ?? "1-3 days",
    warranty: undefined,
    partCondition: normalizePartCondition(offer.partCondition),
    deliveryOption: offer.estimatedTime
      ? `Estimated delivery: ${offer.estimatedTime}`
      : "Standard delivery available",
    verified: offer.supplier?.approvalStatus === "approved",
    partImage: getPartImageForServices(serviceTokens, offer.id),
    serviceLabels: servicesArray,
    partName: normalizedPartName,
    brand: normalizedBrand,
    notes: offer.notes ?? undefined,
    status: currentStatus,
    expiresAt: offer.expiresAt ?? undefined,
  };

  return {
    ...cardQuote,
    requestSummary: servicesLabel,
    vehicleSummary: vehicleSummary || "",
    requestId: offer.quoteRequestId ?? undefined,
    sentAt: offer.createdAt ?? undefined,
    notes: offer.notes ?? undefined,
    customer: undefined,
    supplierDetails: buildSupplierDetails(
      supplierId,
      supplierName,
      cardQuote.verified ?? false,
      offer.supplier?.city,
      offer.supplier?.description,
      offer.supplier?.categories,
      offer.estimatedTime,
      offer.supplier?.phone,
      offer.supplier?.email ?? undefined
    ),
  };
};

export default function QuotesPage() {
  const { handleNavigate, openSignupDialog, showOrderConfirmation } =
    useAppState();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    supplierName: string;
    partName: string;
    price: number;
    eta: string;
    orderNumber: string;
  } | null>(null);
  const [quotes, setQuotes] = useState<NormalizedQuote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [selectedSupplierQuote, setSelectedSupplierQuote] =
    useState<NormalizedQuote | null>(null);
  const [supplierDetailsOpen, setSupplierDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const endpoint = ensureEndpoint(apiRoutes.user.quote.listoffers);

    const fetchQuotes = async () => {
      try {
        setLoadingQuotes(true);
        const response = await apiGet<UserQuotesResponse>(endpoint);
        const payload = response?.data?.data ?? [];
        setQuotes(payload.map(normalizeOffer));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load quotes"
        );
      } finally {
        setLoadingQuotes(false);
      }
    };

    fetchQuotes();
  }, []);

  const filteredQuotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return quotes;
    return quotes.filter(
      (quote) =>
        quote.supplierName.toLowerCase().includes(term) ||
        quote.deliveryOption.toLowerCase().includes(term)
    );
  }, [quotes, searchTerm]);

  const selectedQuoteData = quotes.filter((quote) =>
    selectedQuotes.includes(quote.id)
  );

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes((prev) => {
      if (prev.includes(quoteId)) {
        return prev.filter((id) => id !== quoteId);
      }
      if (prev.length < 3) {
        return [...prev, quoteId];
      }
      return prev;
    });
  };

  const handleSupplierClick = (supplierId: string) => {
    const quote = quotes.find((item) => item.supplierId === supplierId);
    if (!quote) return;
    setSelectedSupplierQuote(quote);
    setSupplierDetailsOpen(true);
  };

  const requestSummary = quotes[0]?.requestSummary ?? "your request";
  const pageHeading = loadingQuotes
    ? "Loading quotes..."
    : `Received ${quotes.length} quotes for ${requestSummary}`;

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Your Quotes</h1>
          <p className="text-muted-foreground">{pageHeading}</p>
        </div>

        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold">Available Quotes</h2>
              <p className="text-muted-foreground">
                {filteredQuotes.length} suppliers ready to help
              </p>
            </div>
            <div className="hidden sm:flex gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E5E7EB]">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-9 px-4 ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-[#0F172A]"
                    : "hover:bg-white/50 text-[#475569]"
                }`}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-9 px-4 ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "hover:bg-white/50"
                }`}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
              <Input
                placeholder="Search by supplier name or location..."
                className="h-12 pl-12 pr-4 bg-white border border-[#E5E7EB] focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl font-['Roboto']"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="price-low">
              <SelectTrigger className="w-full sm:w-[220px] h-12 bg-white border-[#E5E7EB] rounded-xl font-['Roboto']">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating: Highest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedQuotes.length > 0 && (
          <div className="mb-6 p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A]">
                    {selectedQuotes.length} quote
                    {selectedQuotes.length > 1 ? "s" : ""} selected
                  </p>
                  {selectedQuotes.length < 3 && (
                    <p className="text-sm text-[#64748B]">
                      Select up to 3 quotes to compare
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedQuotes([])}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            {selectedQuotes.length >= 2 && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="mt-4 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30">
                    Compare {selectedQuotes.length} Quotes
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] bg-white">
                  <div className="max-w-[1400px] mx-auto">
                    <SheetHeader className="mb-6">
                      <SheetTitle className="text-2xl font-semibold">
                        Compare Quotes
                      </SheetTitle>
                      <p className="text-muted-foreground">
                        Side-by-side comparison of selected quotes
                      </p>
                    </SheetHeader>
                    <div className="overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-40">Feature</TableHead>
                            {selectedQuoteData.map((quote) => (
                              <TableHead key={quote.id} className="text-center">
                                <div className="flex flex-col items-center gap-2 py-2">
                                  <p className="font-semibold text-[#0F172A]">
                                    {quote.supplierName}
                                  </p>
                                  {quote.verified && (
                                    <Badge className="bg-primary/10 text-primary border-primary/20">
                                      <Shield className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-[#F8FAFC]">
                            <TableCell className="font-semibold">
                              Price
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`price-${quote.id}`}
                                className="text-center text-primary font-semibold"
                              >
                                £{quote.price.toFixed(2)}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-semibold">
                              Part
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`part-${quote.id}`}
                                className="text-center"
                              >
                                {quote.partName || quote.requestSummary}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow className="bg-[#F8FAFC]">
                            <TableCell className="font-semibold">
                              Brand
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`brand-${quote.id}`}
                                className="text-center capitalize"
                              >
                                {quote.brand || "Not specified"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-semibold">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-[#F59E0B]" />
                                Rating
                              </div>
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`rating-${quote.id}`}
                                className="text-center"
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                                  <span>{quote.rating}</span>
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow className="bg-[#F8FAFC]">
                            <TableCell className="font-semibold">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#64748B]" />
                                Distance
                              </div>
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`distance-${quote.id}`}
                                className="text-center"
                              >
                                {quote.distance} mi
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-semibold">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-[#64748B]" />
                                ETA
                              </div>
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`eta-${quote.id}`}
                                className="text-center"
                              >
                                {quote.eta}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow className="bg-[#F8FAFC]">
                            <TableCell className="font-semibold">
                              Part Condition
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`condition-${quote.id}`}
                                className="text-center"
                              >
                                <Badge className="capitalize bg-white border border-[#E5E7EB]">
                                  {quote.partCondition}
                                </Badge>
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-semibold">
                              Expires
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`expires-${quote.id}`}
                                className="text-center"
                              >
                                {quote.expiresAt
                                  ? new Date(
                                      quote.expiresAt
                                    ).toLocaleDateString()
                                  : "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-semibold">
                              Verified
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`verified-${quote.id}`}
                                className="text-center"
                              >
                                {quote.verified ? "Yes" : "No"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow className="bg-[#F8FAFC]">
                            <TableCell className="font-semibold">
                              Action
                            </TableCell>
                            {selectedQuoteData.map((quote) => (
                              <TableCell
                                key={`action-${quote.id}`}
                                className="text-center"
                              >
                                <Button
                                  className="w-full bg-primary hover:bg-primary-hover"
                                  asChild
                                >
                                  <Link
                                    href={`/user/chat?supplier=${quote.supplier?.id}&quote=${quote.id}`}
                                  >
                                    Chat with Supplier
                                  </Link>
                                </Button>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingQuotes && (
            <div className="col-span-full text-center py-12 text-[#475569]">
              Loading quotes...
            </div>
          )}
          {!loadingQuotes && filteredQuotes.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#475569]">
              No quotes found.
            </div>
          )}
          {filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              variant={viewMode}
              onAccept={() => {
                const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
                setOrderDetails({
                  supplierName: quote.supplierName,
                  partName: quote.partName ?? quote.requestSummary,
                  price: quote.price,
                  eta: quote.eta,
                  orderNumber,
                });
                setOrderDialogOpen(true);
              }}
              onViewProfile={(id) => handleNavigate("supplier-profile", id)}
              selected={selectedQuotes.includes(quote.id)}
              onSelect={handleSelectQuote}
              showCompare
              onSupplierClick={handleSupplierClick}
            />
          ))}
        </div>
      </div>

      <OrderPlacedDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        orderDetails={orderDetails}
        onNavigate={handleNavigate}
        onOrderConfirmed={showOrderConfirmation}
      />

      {selectedSupplierQuote && (
        <SupplierDetailsDialog
          open={supplierDetailsOpen}
          onOpenChange={(open) => {
            setSupplierDetailsOpen(open);
            if (!open) {
              setSelectedSupplierQuote(null);
            }
          }}
          supplier={selectedSupplierQuote.supplierDetails}
        />
      )}
    </div>
  );
}
