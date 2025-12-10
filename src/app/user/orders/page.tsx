"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Badge } from "@/components/ui/badge";
import { Blocks, Calendar, DollarSign, Hash, MessageSquare, Package, SlidersHorizontal, Wrench } from "lucide-react";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "@/components/debouncedSearch/debouncedSearch";
import { toast } from "sonner";
import { apiGet } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/hooks/use-app-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderPageProps {
  onNavigate: (page: string) => void;
}

type SupplierOrder = {
  id: string;
  requestId?: string;
  part?: string;
  brand?: string;
  amount: number;
  status: string;
  sentAt?: string;
};

type SupplierOrderApi = {
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

const normalizeOrder = (order: SupplierOrderApi): SupplierOrder => {
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
    status: (order.status || "pending").toLowerCase(),
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

type FetchOptions = {
  page?: number;
  pageSize?: number;
  append?: boolean;
};

export default function Orders(props?: OrderPageProps) {
  const { handleNavigate } = useAppState();
  const navigate = props?.onNavigate ?? handleNavigate;
  const [selectedOrderToView, setSelectedOrderToView] = useState<SupplierOrder | null>(null);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const debouncedSearch = useDebounce(userSearch, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeStatus, setActiveStatus] = useState<StatusFilterKey>("all");
  const [sortOrder, setSortOrder] = useState<"recent" | "amount_desc" | "amount_asc">("recent");

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
        const response = await apiGet<{ data?: SupplierOrderApi[] }>(apiRoutes?.user?.orders?.listorders, { params });
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
                    placeholder="Search by order number, part name, or supplier..."
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
                          <Badge className={`px-3 py-1 text-xs font-medium ${statusConfig.pillClass}`}>
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
                    className="rounded-full bg-[#F02801] px-6 py-5 font-['Roboto'] text-white hover:bg-[#D22301]"
                    onClick={handleLoadMore}
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
              <DialogContent className="border border-[#E5E7EB] shadow-lg max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-['Inter'] text-[#0F172A]">Order Details</DialogTitle>
                  <DialogDescription className="font-['Roboto'] text-[#475569]">
                    View complete information about this order
                  </DialogDescription>
                </DialogHeader>

                {selectedOrderToView && (() => {
                  const statusDetails = getStatusConfig(selectedOrderToView.status);
                  return (
                    <div className="space-y-6 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Status</p>
                          <Badge className={`${statusDetails.pillClass} px-4 py-1.5`}>
                            {statusDetails.label}
                          </Badge>
                        </div>
                        {selectedOrderToView.id && (
                          <div className="text-right">
                            <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Order ID</p>
                            <p className="font-['Inter'] text-[#0F172A]">{selectedOrderToView.id}</p>
                          </div>
                        )}
                      </div>

                      <Separator className="bg-[#E5E7EB]" />

                      <div className="grid md:grid-cols-2 gap-6">
                        {selectedOrderToView.part && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Wrench className="h-4 w-4 text-[#F02801]" />
                              <p className="text-sm text-[#475569] font-['Roboto']">Part Requested</p>
                            </div>
                            <p className="font-['Roboto'] text-[#0F172A]">{selectedOrderToView.part}</p>
                          </div>
                        )}
                        {selectedOrderToView.brand && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="h-4 w-4 text-[#F02801]" />
                              <p className="text-sm text-[#475569] font-['Roboto']">Brand</p>
                            </div>
                            <p className="font-['Roboto'] text-[#0F172A]">{selectedOrderToView.brand}</p>
                          </div>
                        )}
                        {selectedOrderToView.amount && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="h-4 w-4 text-[#F02801]" />
                              <p className="text-sm text-[#475569] font-['Roboto']">Order Amount</p>
                            </div>
                            <p className="font-['Inter'] text-[#0F172A]">£{selectedOrderToView.amount.toFixed(2)}</p>
                          </div>
                        )}
                        {selectedOrderToView.sentAt && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-[#F02801]" />
                              <p className="text-sm text-[#475569] font-['Roboto']">Placed</p>
                            </div>
                            <p className="font-['Roboto'] text-[#0F172A]">{selectedOrderToView?.sentAt}</p>
                          </div>
                        )}
                        {selectedOrderToView.requestId && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Hash className="h-4 w-4 text-[#F02801]" />
                              <p className="text-sm text-[#475569] font-['Roboto']">Request ID</p>
                            </div>
                            <p className="font-['Roboto'] text-[#0F172A]">{selectedOrderToView.requestId}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-xl shadow-sm"
                          onClick={() => {
                            setSelectedOrderToView(null);
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Need Help
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-[#E5E7EB] text-[#0F172A] font-['Roboto'] rounded-xl hover:bg-[#F8FAFC]"
                          onClick={() => setSelectedOrderToView(null)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
      </div>

      <Footer onNavigate={navigate} />

      
    </div>
  );
}
