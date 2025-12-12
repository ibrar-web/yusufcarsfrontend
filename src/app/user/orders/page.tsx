"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Badge } from "@/components/ui/badge";
import { Calendar, CircleX, CheckCircle2, Clock3, MapPin, Package, SlidersHorizontal, Star } from "lucide-react";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "@/components/debouncedSearch/debouncedSearch";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/hooks/use-app-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface OrderPageProps {
  onNavigate: (page: string) => void;
}

type UserOrder = {
  id: string;
  requestId?: string;
  part?: string;
  brand?: string;
  amount: number;
  status: string;
  sentAt?: string;
};

type UserOrderApi = {
  data: {};
  meta: {};
  id: string;
  expiresAt?: string | null;
  status?: string | null;
  createdAt?: string | null;
  buyer? : {
    fullName: string
  } | null;
  acceptedQuote: {
    partName: string;
    price? : string | number | null;
    brand: string;
  };
  request: {
    id: string,
    services: string[];
  }
};

type OrdersApiResponse = {
  data: UserOrderApi[];
  meta: {
    total: number;
  };
};


const normalizeOrder = (order: UserOrderApi): UserOrder => {
  const priceValue =
    typeof order?.acceptedQuote?.price === "string"
      ? parseFloat(order?.acceptedQuote?.price)
      : order?.acceptedQuote?.price ?? 0;
  return {
    id: order.id,
    requestId: order?.request?.id,
    part: order.acceptedQuote?.partName,
    brand: order?.acceptedQuote?.brand,
    amount: Number.isFinite(priceValue) ? priceValue : 0,
    status: (order.status || "in_transit").toLowerCase(),
    sentAt: order.createdAt || undefined,
  };
};

type OrderStatusConfig = {
  label: string;
  pillClass: string;
  progress: number;
  stepLabel: string;
  barClass: string;
};

const statusDisplayConfig: Record<string, OrderStatusConfig> = {
  in_transit: {
    label: "In Transit",
    pillClass: "bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]",
    progress: 65,
    stepLabel: "In Transit",
    barClass: "bg-[#3B82F6]",
  },
  completed: {
    label: "Delivered",
    pillClass: "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]",
    progress: 100,
    stepLabel: "Delivered",
    barClass: "bg-[#22C55E]",
  },
  cancelled: {
    label: "Cancelled",
    pillClass: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
    progress: 5,
    stepLabel: "Cancelled",
    barClass: "bg-[#94A3B8]",
  },
};

const getStatusConfig = (status?: string) => {
  if (!status) return statusDisplayConfig.in_transit;
  return statusDisplayConfig[status.toLowerCase()] ?? statusDisplayConfig.in_transit;
};

const statusTabs = [
  { key: "all", label: "All" },
  { key: "in_transit", label: "In Transit" },
  { key: "completed", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

type StatusFilterKey = (typeof statusTabs)[number]["key"];

const statusTabMap: Record<Exclude<StatusFilterKey, "all">, string[]> = {
  in_transit: ["in_transit"],
  completed: ["completed"],
  cancelled: ["cancelled"],
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCurrencyParts = (amount?: number) => {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return { whole: "£0", fraction: ".00" };
  }
  const [whole, fraction] = amount.toFixed(2).split(".");
  return {
    whole: `£${whole}`,
    fraction: `.${fraction ?? "00"}`,
  };
};

type FetchOptions = {
  page?: number;
  pageSize?: number;
  append?: boolean;
};

export default function Orders(props?: OrderPageProps) {
  const { handleNavigate } = useAppState();
  const navigate = props?.onNavigate ?? handleNavigate;
  const [selectedOrderToView, setSelectedOrderToView] = useState<UserOrder | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const debouncedSearch = useDebounce(userSearch, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeStatus, setActiveStatus] = useState<StatusFilterKey>("all");
  const [sortOrder, setSortOrder] = useState<"recent" | "amount_desc" | "amount_asc">("recent");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTargetOrder, setReviewTargetOrder] = useState<UserOrder | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelText, setCancelText] = useState("");


  const fetchOrders = useCallback(
    async ({
      page: requestedPage = 1,
      pageSize: requestedPageSize = 20,
      append = false,
    }: FetchOptions = {}) => {
      setIsLoading(true);
      try {
        const params = {
          page: requestedPage,
          pageSize: requestedPageSize,
          search: debouncedSearch || undefined,
        };
        const response = await apiGet<{ data?: OrdersApiResponse }>(apiRoutes?.user?.orders?.listorders, { params });
        const payload = response?.data?.data ?? [];
        const normalized = payload.map(normalizeOrder);
        setOrders((prev) => (append ? [...prev, ...normalized] : normalized));
        setPage(requestedPage);
        setPageSize(requestedPageSize);
        setTotalOrders(response?.data?.meta?.total ?? normalized.length);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load orders"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    fetchOrders({ page: 1, pageSize });
  }, [fetchOrders, pageSize]);

  const handleSubmitCancelOrder = async(orderId: string) => {
    try{
      const params = {
        reason: cancelText,
      }
      const response = await apiPost(apiRoutes?.user?.orders?.cancelorder(orderId), { params });
      console.log({response});
      if ((response as any)?.statusCode === 201) {
        toast.success("Thanks for sharing your experience!");
      }
      closeCancelModal();
    } catch(err) {
      console.log("err is as: ", err);
    }
  }
  const hasMore = orders.length < totalOrders;
  const isInitialLoading = isLoading && orders.length === 0;

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilterKey, number> = {
      all: orders.length,
      in_transit: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const orderStatus = order.status?.toLowerCase() ?? "";
      (Object.entries(statusTabMap) as Array<[Exclude<StatusFilterKey, "all">, string[]]>).forEach(
        ([key, statuses]) => {
          if (statuses.includes(orderStatus)) {
            counts[key] = (counts[key] ?? 0) + 1;
          }
        }
      );
    });

    return counts;
  }, [orders]);

  const handleFinishOrder = (order: UserOrder) => {
    setReviewTargetOrder(order);
    setReviewRating(0);
    setReviewText("");
    setReviewModalOpen(true);
  };

  const handleCancelOrder = () => {
    setCancelModalOpen(true);
  }

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setReviewTargetOrder(null);
    setReviewRating(0);
    setReviewText("");
    setSelectedOrderToView(null);
    fetchOrders();
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setSelectedOrderToView(null);
    setCancelText("");
    fetchOrders();
  }

  const handleSubmitReview = async(orderId: string) => {
    try {
      const params = {
        rating: reviewRating,
        comment: reviewText,
      }
      const response = await apiPost(apiRoutes?.user?.orders?.completeorder(orderId), {params});
      if ((response as any)?.statusCode === 201) {
        toast.success("Thanks for sharing your experience!");
      }
      closeReviewModal();
    } catch(err) {
      console.log("err is as: ", err);      
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeStatus === "all") return orders;
    const statuses = statusTabMap[activeStatus as Exclude<StatusFilterKey, "all">] || [];
    return orders.filter((order) => statuses.includes(order.status ?? ""));
  }, [orders, activeStatus]);

  const displayedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
    if (sortOrder === "amount_desc") {
      sorted.sort((a, b) => b.amount - a.amount);
    } else if (sortOrder === "amount_asc") {
      sorted.sort((a, b) => a.amount - b.amount);
    } else {
      sorted.sort((a, b) => {
        const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
        const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
        return dateB - dateA;
      });
    }
    return sorted;
  }, [filteredOrders, sortOrder]);

  const loadingPlaceholders = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => (
        <div
          key={`order-skeleton-${index}`}
          className="animate-pulse rounded-2xl border border-[#F1F5F9] bg-white p-6 space-y-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="h-5 w-32 rounded bg-[#F1F5F9]" />
            <div className="h-6 w-20 rounded-full bg-[#FDE68A]" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded bg-[#F1F5F9]" />
            <div className="h-4 w-1/2 rounded bg-[#F1F5F9]" />
            <div className="h-4 w-2/3 rounded bg-[#F1F5F9]" />
          </div>
          <div className="h-2 w-full rounded-full bg-[#F1F5F9]" />
          <div className="h-10 w-full rounded bg-[#F1F5F9]" />
        </div>
      )),
    []
  );

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    fetchOrders({ page: page + 1, pageSize, append: true });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#FEF2F2] pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div 
          // className="bg-gradient-to-br from-[#F02801] to-[#D22301] rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-['Inter'] font-bold text-4xl text-black">My Orders</h1>
                <p className="font-['Roboto'] text-black/90 mt-1">
                  View and manage your orders
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-8">
                <div className="flex-1 min-w-[260px]">
                  <SearchBar
                    value={userSearch}
                    onChange={setUserSearch}
                    placeholder="Search by order number, part name, or brand..."
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Select
                    value={sortOrder}
                    onValueChange={(value) =>
                      setSortOrder(value as "recent" | "amount_desc" | "amount_asc")
                    }
                  >
                    <SelectTrigger className="h-12 min-w-[190px] rounded-2xl border-[#E5E7EB] text-[#0F172A] font-['Roboto'] gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-[#F02801]" />
                      <SelectValue placeholder="Most Recent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="amount_desc">Amount: High to Low</SelectItem>
                      <SelectItem value="amount_asc">Amount: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="rounded-3xl border border-[#F1F5F9] bg-white shadow-sm">
            <div className="p-6 space-y-6">
              

              <div className="flex flex-wrap gap-3 border-b border-[#F1F5F9] pb-4">
                {statusTabs.map((tab) => {
                  const isActive = activeStatus === tab.key;
                  const count =
                    tab.key === "all"
                      ? orders.length
                      : statusCounts[tab.key] ?? 0;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveStatus(tab.key)}
                      className={`rounded-full cursor-pointer border px-5 py-2 text-sm font-['Roboto'] transition focus-visible:ring-2 focus-visible:ring-[#F02801] ${
                        isActive
                          ? "border-[#F02801] bg-[#F02801] text-white shadow-md"
                          : "border-transparent bg-[#F8FAFC] text-[#475569] hover:border-[#F28A7A]/40"
                      }`}
                    >
                      {tab.label} ({count})
                    </button>
                  );
                })}
              </div>

              {isInitialLoading ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {loadingPlaceholders}
                </div>
              ) : displayedOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-10 text-center">
                  <p className="font-['Inter'] text-xl text-[#0F172A] mb-2">No orders found</p>
                  <p className="font-['Roboto'] text-[#64748B]">
                    Try adjusting your search or filter selections to see more results.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {displayedOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-xs flex flex-col gap-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-[#FFF7ED] border border-[#FFE4D6] flex items-center justify-center">
                              <Package className="h-6 w-6 text-[#F97316]" />
                            </div>
                            <div>
                              <p className="font-['Roboto'] text-xs uppercase tracking-[0.18em] text-[#94A3B8]">
                                Order
                              </p>
                              <p className="font-['Inter'] text-lg text-[#0F172A]">{order.id}</p>
                            </div>
                          </div>
                          <Badge className={`px-3 py-1 text-xs font-medium cursor-pointer ${statusConfig.pillClass}`}>
                            {statusConfig.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 font-['Roboto'] text-sm text-[#475569]">
                          {order.part && (
                            <div>
                              <p className="text-xs uppercase text-[#94A3B8] mb-1">Part</p>
                              <p className="text-[#0F172A] font-medium">{order.part}</p>
                            </div>
                          )}
                          {order.brand && (
                            <div>
                              <p className="text-xs uppercase text-[#94A3B8] mb-1">Brand</p>
                              <p className="text-[#0F172A] font-medium">{order.brand}</p>
                            </div>
                          )}
                          {order.sentAt && (
                            <div>
                              <p className="text-xs uppercase text-[#94A3B8] mb-1">Placed</p>
                              <p className="text-[#0F172A] font-medium">{new Date(order.sentAt)?.toLocaleDateString()} {new Date(order.sentAt)?.toLocaleTimeString()}</p>
                            </div>
                          )}
                          {order.requestId && (
                            <div>
                              <p className="text-xs uppercase text-[#94A3B8] mb-1">Request ID</p>
                              <p className="text-[#0F172A] font-medium">{order.requestId}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4">
                          <div>
                            <p className="text-xs font-['Roboto'] uppercase text-[#94A3B8]">Total Amount</p>
                            <p className="text-2xl font-['Inter'] text-[#0F172A]">£{order.amount.toFixed(2)}</p>
                          </div>
                          <Button
                            className="rounded-full bg-[#F02801] px-6 py-5 font-['Roboto'] text-white hover:bg-[#D22301] cursor-pointer"
                            onClick={() => setSelectedOrderToView(order)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {hasMore && (
                <div className="text-center pt-4">
                  <Button
                    className="rounded-full bg-[#F02801] px-6 py-5 font-['Roboto'] text-white hover:bg-[#D22301] cursor-pointer"
                    onClick={() => handleLoadMore()}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Show More"}
                  </Button>
                </div>
              )}

              {isLoading && !isInitialLoading && !hasMore && (
                <p className="text-center text-sm font-['Roboto'] text-[#94A3B8]">Loading orders...</p>
              )}
            </div>
            <Dialog open={!!selectedOrderToView} onOpenChange={(open) => !open && setSelectedOrderToView(null)}>
              <DialogContent className="w-[600px]">
                {selectedOrderToView && (() => {
                  const addDays = (dateValue: Date | string, days: number): any => {
                    const date = new Date(dateValue); 
                    date.setDate(date.getDate() + days);
                    return date; 
                  };


                  const statusDetails = getStatusConfig(selectedOrderToView.status);
                  const placedOn = formatDate(selectedOrderToView.sentAt);
                  const { whole, fraction } = getCurrencyParts(selectedOrderToView.amount);
                  const statusIconClass = `${statusDetails.pillClass} px-4 py-1.5 text-xs flex items-center gap-2 font-medium`;

                  const expectedDelivery = formatDate(
                    addDays(placedOn, 7)
                  );
                  return (
                    <div className="space-y-4">
                      <DialogHeader className="p-0">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1ED]">
                            <Package className="h-6 w-6 text-[#F02801]" />
                          </div>
                          <div>
                            <DialogTitle className="font-['Inter'] text-2xl text-[#0F172A]">Order Details</DialogTitle>
                            {selectedOrderToView.id && (
                              <DialogDescription className="font-['Roboto'] text-sm text-[#94A3B8]">
                                {selectedOrderToView.id}
                              </DialogDescription>
                            )}
                          </div>
                        </div>
                      </DialogHeader>

                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-['Roboto'] text-[#94A3B8]">Status</p>
                        </div>
                        <Badge className={statusIconClass}>
                          <Clock3 className="h-4 w-4" />
                          {statusDetails.label}
                        </Badge>
                      </div>

                      <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
                        <p className="mb-6 text-sm font-['Roboto'] font-medium text-[#94A3B8]">Part Information</p>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm font-['Roboto']">
                            <span className="text-[#94A3B8]">Part Name</span>
                            <span className="text-[#0F172A] font-medium">{selectedOrderToView.part ?? "Not specified"}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm font-['Roboto']">
                            <span className="text-[#94A3B8]">Supplier</span>
                            <span className="text-[#0F172A] font-medium">{selectedOrderToView.brand ?? "Not specified"}</span>
                          </div>
                          {/* <div className="flex items-center justify-between text-sm font-['Roboto']">
                            <span className="text-[#94A3B8]">Quantity</span>
                            <span className="text-[#0F172A] font-medium">1</span>
                          </div> */}
                        </div>
                        <div className="mt-6 flex items-center justify-between rounded-2xl">
                          <span className="text-sm font-['Roboto'] text-[#94A3B8]">Total Amount</span>
                          <div className="text-[#F02801] font-['Inter'] text-2xl font-semibold">
                            {whole}
                            <span className="text-xl align-top">{fraction}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                          <div className="mb-1 flex items-center gap-2 text-sm font-['Roboto'] text-[#94A3B8]">
                            <Calendar className="h-4 w-4" />
                            <span>Placed On</span>
                          </div>
                          <p className="text-md font-['Inter'] text-[#0F172A]">{placedOn}</p>
                        </div>
                        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                          <div className="mb-1 flex items-center gap-2 text-sm font-['Roboto'] text-[#94A3B8]">
                            <MapPin className="h-4 w-4" />
                            <span>Expected Delivery</span>
                          </div>
                          <p className="text-md font-['Inter'] text-[#0F172A]">{expectedDelivery}</p>
                        </div>
                      </div>
                      {selectedOrderToView?.status === "in_transit" && 
                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                          <Button
                            variant="outline"
                            className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white text-[#0F172A] font-['Roboto'] hover:bg-[#F8FAFC] cursor-pointer"
                            onClick={() => selectedOrderToView && handleCancelOrder()}
                          >
                            <CircleX className="mr-2 h-4 w-4" />
                            Cancel Order
                          </Button>
                          <Button
                            className="flex-1 rounded-2xl bg-[#F02801] text-white font-['Roboto'] hover:bg-[#D22301] cursor-pointer"
                            onClick={() => selectedOrderToView && handleFinishOrder(selectedOrderToView)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Finish Order
                          </Button>
                        </div>
                      }
                    </div>
                  );
                })()}
              </DialogContent>
            </Dialog>
            <Dialog open={reviewModalOpen} onOpenChange={(open) => (open ? setReviewModalOpen(true) : closeReviewModal())}>
              <DialogContent className="max-w-xl rounded-3xl border border-[#E5E7EB] shadow-2xl p-0">
                <div className="space-y-8 p-8">
                  <DialogHeader className="p-0 text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF7ED]">
                        <Star className="h-8 w-8 text-[#F59E0B]" />
                      </div>
                      <div>
                        <DialogTitle className="font-['Inter'] text-2xl text-[#0F172A]">Rate Your Experience</DialogTitle>
                        <DialogDescription className="font-['Roboto'] text-sm text-[#475569]">
                          How was your experience with {reviewTargetOrder?.brand ?? "this supplier"}?
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="text-center">
                    <p className="mb-4 text-sm font-['Roboto'] text-[#94A3B8]">Tap to rate</p>
                    <div className="flex items-center justify-center gap-4">
                      {[1, 2, 3, 4, 5].map((value) => {
                        const isActive = value <= reviewRating;
                        return (
                          <button
                            key={value}
                            type="button"
                            className="transition-transform hover:scale-105"
                            onClick={() => setReviewRating(value)}
                            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                          >
                            <Star
                              className={`h-10 w-10 ${isActive ? "text-[#F97316]" : "text-[#E2E8F0]"}`}
                              fill={isActive ? "#F97316" : "none"}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3 w-full max-w-xl mx-auto">
                    <p className="text-sm font-['Roboto'] font-medium text-[#0F172A]">Add a review (optional)</p>
                    <Textarea
                      placeholder="Share your thoughts about the product and service..."
                      className="w-full rounded-3xl border border-[#E2E8F0] bg-[#FDFEFE] placeholder:text-[#94A3B8] text-left leading-relaxed break-words overflow-auto min-h-[100px] max-h-[50vh] p-3 md:text-sm"
                      maxLength={500}
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                    />
                    <div className="text-right text-xs font-['Roboto'] text-[#94A3B8]">{reviewText.length}/500 characters</div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white text-[#0F172A] font-['Roboto'] hover:bg-[#F8FAFC] cursor-pointer"
                      onClick={() => closeReviewModal()}
                    >
                      Skip
                    </Button>
                    <Button
                      // className="flex-1 rounded-2xl bg-[#FDA08B] text-white font-['Roboto'] hover:bg-[#F97316]"
                      className="flex-1 rounded-2xl bg-[#F02801] text-white font-['Roboto'] hover:bg-[#D22301] cursor-pointer"
                      onClick={() => handleSubmitReview(selectedOrderToView!.id)}
                      disabled={reviewRating === 0}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={cancelModalOpen} onOpenChange={(open) => (open ? setCancelModalOpen(true) : closeCancelModal())}>
              <DialogContent className="max-w-xl rounded-3xl border border-[#E5E7EB] shadow-2xl p-0">
                <div className="space-y-8 p-8">
                  <DialogHeader className="p-0 text-left">
                    <div className="flex items-start gap-3">
                      <div>
                        <DialogTitle className="font-['Inter'] text-2xl text-[#0F172A]">Reason To Cancel</DialogTitle>
                        <DialogDescription className="font-['Roboto'] text-sm text-[#475569]">
                          Mention the reason you want to cancel this order.
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-3 w-full max-w-xl mx-auto">
                    <p className="text-sm font-['Roboto'] font-medium text-[#0F172A]">Type the reason here</p>
                    <Textarea
                      placeholder="Share your reason to cancel the order..."
                      className="w-full rounded-3xl border border-[#E2E8F0] bg-[#FDFEFE] placeholder:text-[#94A3B8] text-left leading-relaxed break-words overflow-auto min-h-[100px] max-h-[50vh] p-3 md:text-sm"
                      maxLength={500}
                      value={cancelText}
                      onChange={(event) => setCancelText(event.target.value)}
                    />
                    <div className="text-right text-xs font-['Roboto'] text-[#94A3B8]">{cancelText?.length}/500 characters</div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white text-[#0F172A] font-['Roboto'] hover:bg-[#F8FAFC] cursor-pointer"
                      onClick={() => closeCancelModal()}
                    >
                      Skip
                    </Button>
                    <Button
                      // className="flex-1 rounded-2xl bg-[#FDA08B] text-white font-['Roboto'] hover:bg-[#F97316]"
                      className="flex-1 rounded-2xl bg-[#F02801] text-white font-['Roboto'] hover:bg-[#D22301] cursor-pointer"
                      onClick={() => handleSubmitCancelOrder(selectedOrderToView!.id)}
                      disabled={cancelText === ""}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
      </div>

      <Footer onNavigate={navigate} />

      
    </div>
  );
}
