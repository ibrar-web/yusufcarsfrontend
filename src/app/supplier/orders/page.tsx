"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppState } from "@/hooks/use-app-state";
import { apiRoutes } from "@/utils/apiroutes";
import { apiGet } from "@/utils/apiconfig/http";
import { Calendar, DollarSign, Hash, MessageSquare, Search, User, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type SupplierOrderApi = {
  id: string;
  expiresAt?: string | null;
  status?: string | null;
  createdAt?: string | null;
  buyer? : {
    fullName: string
  } | null;
  acceptedQuote: {
    price? : string | number | null;
  };
  request: {
    id: string,
    services: string[];
  }
};

type SupplierOrder = {
  id: string;
  requestId?: string;
  customer?: string;
  part?: string;
  amount: number;
  status: string;
  sentAt?: string;
};

const orderStatusConfig: Record<
  string,
  { className: string; label: string }
> = {
  completed: {
    className: "bg-[#22C55E] text-white border-0 shadow-sm font-['Roboto']",
    label: "Completed",
  },
  cancelled: {
    className: "bg-[#F02801] text-white border-0 shadow-sm font-['Roboto']",
    label: "Cancelled",
  },
  in_transit: {
    className: "bg-[#22C55E] text-white border-0 shadow-sm font-['Roboto']",
    label: "In Transit",
  }
};

const normalizeOrder = (order: SupplierOrderApi): SupplierOrder => {
  const priceValue =
    typeof order?.acceptedQuote?.price === "string"
      ? parseFloat(order?.acceptedQuote?.price)
      : order?.acceptedQuote?.price ?? 0;
  const services = order.request?.services ?? [];
  const partDescription = services.length
    ? services
        .map((service) =>
          service
            .split(/[\s_-]+/)
            .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
            .join(" ")
        )
        .join(", ")
    : undefined;

  return {
    id: order.id,
    requestId: order?.request?.id,
    customer:
      order?.buyer?.fullName,
    part: partDescription,
    amount: Number.isFinite(priceValue) ? priceValue : 0,
    status: (order.status || "pending").toLowerCase(),
    sentAt: order.createdAt || undefined,
  };
};

function renderOrderStatusBadge(order: SupplierOrder) {
  const config = orderStatusConfig[order.status] ?? orderStatusConfig.in_transit;

  return (
    <Badge className={`${config.className} px-4 py-1.5`}>
      {config.label}
    </Badge>
  );
}


export default function SupplierOrdersPage() {
  const { handleNavigate } = useAppState();
  const [selectedOrderToView, setSelectedOrderToView] = useState<SupplierOrder | null>(null);
  const [orders, setOrder] = useState<SupplierOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    const endpoint = apiRoutes?.supplier?.orders?.listorders;

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ data?: SupplierOrderApi[] }>(endpoint);
        const payload = response?.data?.data ?? [];
        setOrder(payload?.map(normalizeOrder));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load orders"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]">
        <CardContent className="p-6">
          <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">My Orders</h1>
          <p className="text-[#475569] font-['Roboto']">Track your submitted orders and their status</p>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader className="flex justify-between">
            <div>
                <CardTitle className="font-['Inter'] text-[#0F172A]">Orders</CardTitle>
                <CardDescription className="font-['Roboto'] text-[#475569]">Status of every order you've received</CardDescription>
            </div>
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#475569]" />
                <Input
                type="text"
                placeholder="Search users by name, email, location or ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-12 h-12 border-[#E5E7EB] focus:border-[#F02801] focus:ring-[#F02801] rounded-xl font-['Roboto'] text-[#0F172A] placeholder:text-[#94A3B8] w-full"
                />
                {userSearch && (
                <button
                    onClick={() => setUserSearch("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#475569] hover:text-[#F02801]"
                >
                    ×
                </button>
                )}
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E5E7EB] hover:bg-transparent">
                <TableHead className="font-['Inter'] text-[#0F172A]">Sent</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Order ID</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Customer</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Part</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Amount</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-[#475569] font-['Roboto']">
                    Loading orders...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-[#475569] font-['Roboto']">
                    No orders available yet.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer"
                  onClick={() => setSelectedOrderToView(order)}
                >
                  <TableCell className="font-['Roboto'] text-[#475569]">{order.sentAt}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">{order.id}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">{order.customer}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">{order.part}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">£{order.amount.toFixed(2)}</TableCell>
                  <TableCell>{renderOrderStatusBadge(order)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrderToView} onOpenChange={(open) => !open && setSelectedOrderToView(null)}>
        <DialogContent className="border border-[#E5E7EB] shadow-lg max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Order Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View complete information about this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrderToView && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Status</p>
                  <Badge className={`${(orderStatusConfig[selectedOrderToView.status] ?? orderStatusConfig.pending).className} px-4 py-1.5`}>
                    {(orderStatusConfig[selectedOrderToView.status] ?? orderStatusConfig.pending).label}
                  </Badge>
                </div>
                {
                    selectedOrderToView.id &&
                    <div className="text-right">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Order ID</p>
                        <p className="font-['Inter'] text-[#0F172A]">{selectedOrderToView.id}</p>
                    </div>
                }
              </div>

              <Separator className="bg-[#E5E7EB]" />

              <div className="grid md:grid-cols-2 gap-6">
                {selectedOrderToView.customer &&
                    <div>
                    <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-[#F02801]" />
                        <p className="text-sm text-[#475569] font-['Roboto']">Customer</p>
                    </div>
                    <p className="font-['Roboto'] text-[#0F172A]">{selectedOrderToView.customer}</p>
                    </div> 
                }
                { selectedOrderToView.part && 
                    <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Wrench className="h-4 w-4 text-[#F02801]" />
                        <p className="text-sm text-[#475569] font-['Roboto']">Part Requested</p>
                    </div>
                    <p className="font-['Roboto'] text-[#0F172A]">{selectedOrderToView.part}</p>
                    </div> 
                }
                {selectedOrderToView.amount && 
                    <div>
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-[#F02801]" />
                        <p className="text-sm text-[#475569] font-['Roboto']">Order Amount</p>
                    </div>
                    <p className="font-['Inter'] text-[#0F172A]">£{selectedOrderToView.amount.toFixed(2)}</p>
                    </div>
                }   
                {selectedOrderToView.sentAt && 
                    <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-[#F02801]" />
                        <p className="text-sm text-[#475569] font-['Roboto']">Sent</p>
                    </div>
                    <p className="font-['Roboto'] text-[#0F172A]">{selectedOrderToView.sentAt}</p>
                    </div>
                }
                {selectedOrderToView.requestId && 
                    <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Hash className="h-4 w-4 text-[#F02801]" />
                        <p className="text-sm text-[#475569] font-['Roboto']">Request ID</p>
                    </div>
                    <p className="font-['Roboto'] text-[#0F172A]">{selectedOrderToView.requestId}</p>
                    </div>
                }
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-xl shadow-sm"
                  onClick={() => {
                    handleNavigate("chat");
                    setSelectedOrderToView(null);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Customer
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
