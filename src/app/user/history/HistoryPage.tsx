import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OrderDetailsDialog } from "@/components/order-details-dialog";
import { 
  Search, 
  Filter, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TruckIcon,
  Calendar,
  Download,
  Eye,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HistoryPageProps {
  onNavigate: (page: string) => void;
  onSignupClick?: () => void;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onTrackOrderClick?: () => void;
}

type OrderStatus = "completed" | "in-progress" | "cancelled" | "delivered";

interface OrderHistoryItem {
  orderId: string;
  orderNumber: string;
  date: string;
  supplierName: string;
  supplierLogo?: string;
  partName: string;
  partCategory: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  deliveryDate?: string;
  vehicleReg: string;
  vehicleMake: string;
  vehicleModel: string;
}

const mockOrderHistory: OrderHistoryItem[] = [
  {
    orderId: "1",
    orderNumber: "ORD-2024-001234",
    date: "2024-10-20",
    supplierName: "AutoParts UK",
    partName: "Front Brake Pads Set",
    partCategory: "Brakes",
    quantity: 1,
    price: 89.99,
    status: "delivered",
    deliveryDate: "2024-10-22",
    vehicleReg: "AB12 CDE",
    vehicleMake: "Ford",
    vehicleModel: "Focus"
  },
  {
    orderId: "2",
    orderNumber: "ORD-2024-001189",
    date: "2024-10-18",
    supplierName: "Premium Parts Ltd",
    partName: "Engine Oil Filter",
    partCategory: "Engine",
    quantity: 2,
    price: 24.50,
    status: "delivered",
    deliveryDate: "2024-10-20",
    vehicleReg: "XY98 ZAB",
    vehicleMake: "Volkswagen",
    vehicleModel: "Golf"
  },
  {
    orderId: "3",
    orderNumber: "ORD-2024-001145",
    date: "2024-10-15",
    supplierName: "QuickParts Direct",
    partName: "Headlight Assembly (Driver Side)",
    partCategory: "Electrical",
    quantity: 1,
    price: 156.00,
    status: "in-progress",
    deliveryDate: "2024-10-28",
    vehicleReg: "CD34 EFG",
    vehicleMake: "BMW",
    vehicleModel: "3 Series"
  },
  {
    orderId: "4",
    orderNumber: "ORD-2024-001098",
    date: "2024-10-10",
    supplierName: "AutoParts UK",
    partName: "Windscreen Wiper Blades (Pair)",
    partCategory: "Bodywork",
    quantity: 1,
    price: 32.99,
    status: "completed",
    deliveryDate: "2024-10-12",
    vehicleReg: "AB12 CDE",
    vehicleMake: "Ford",
    vehicleModel: "Focus"
  },
  {
    orderId: "5",
    orderNumber: "ORD-2024-000976",
    date: "2024-09-28",
    supplierName: "Motor Parts Pro",
    partName: "Air Conditioning Compressor",
    partCategory: "Interior",
    quantity: 1,
    price: 345.00,
    status: "cancelled",
    vehicleReg: "LM56 NOP",
    vehicleMake: "Audi",
    vehicleModel: "A4"
  },
  {
    orderId: "6",
    orderNumber: "ORD-2024-000834",
    date: "2024-09-15",
    supplierName: "Premium Parts Ltd",
    partName: "Rear Shock Absorbers (Pair)",
    partCategory: "Suspension",
    quantity: 1,
    price: 189.99,
    status: "delivered",
    deliveryDate: "2024-09-18",
    vehicleReg: "XY98 ZAB",
    vehicleMake: "Volkswagen",
    vehicleModel: "Golf"
  },
];

export function HistoryPage({
  onNavigate,
  onSignupClick,
  isAuthenticated = true,
  onSignOut,
  onProfileClick,
  onNotificationClick,
  onTrackOrderClick
}: HistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      delivered: { label: "Delivered", className: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20", icon: CheckCircle },
      "in-progress": { label: "In Progress", className: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20", icon: TruckIcon },
      completed: { label: "Completed", className: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20", icon: CheckCircle },
      cancelled: { label: "Cancelled", className: "bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20", icon: XCircle }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`${config.className} gap-1.5`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = mockOrderHistory.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "7days" && diffDays > 7) matchesDate = false;
      if (dateFilter === "30days" && diffDays > 30) matchesDate = false;
      if (dateFilter === "90days" && diffDays > 90) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        onNavigate={onNavigate}
        currentPage="history"
        sticky
        onSignupClick={onSignupClick}
        isAuthenticated={isAuthenticated}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
        onNotificationClick={onNotificationClick}
        onTrackOrderClick={onTrackOrderClick}
      />

      {/* Hero Section */}
      <div className="bg-[#F1F5F9] pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-gradient-to-br from-[#F02801] to-[#D22301] rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="font-['Inter'] font-bold text-4xl text-white">Order History</h1>
                <p className="font-['Roboto'] text-white/90 mt-1">
                  View and manage your past orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  placeholder="Search orders, parts, suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-['Roboto']"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="font-['Roboto']">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="font-['Roboto']">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <p className="font-['Roboto'] text-[#64748B]">
                Showing <span className="text-[#0F172A]">{filteredOrders.length}</span> of <span className="text-[#0F172A]">{mockOrderHistory.length}</span> orders
              </p>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center shadow-sm">
              <Package className="h-12 w-12 text-[#64748B] mx-auto mb-4" />
              <h3 className="font-['Inter'] text-[#0F172A] mb-2">No orders found</h3>
              <p className="font-['Roboto'] text-[#64748B]">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-[#0F172A] rounded-xl border border-[#1E293B] p-4 hover:shadow-lg transition-all duration-300 hover:border-[#F02801]/50 hover:shadow-[#F02801]/10"
                >
                  {/* Compact Header with Status */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#F02801]/20 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-[#F02801]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-['Inter'] text-white text-sm truncate">
                          {order.orderNumber}
                        </h3>
                        <p className="font-['Roboto'] text-[#94A3B8] text-xs">
                          {formatDate(order.date)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Compact Order Details - Two Columns */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-3 py-3 border-y border-[#1E293B]">
                    <div>
                      <p className="font-['Roboto'] text-[#94A3B8] text-xs mb-0.5">Part</p>
                      <p className="font-['Roboto'] text-white text-sm truncate">{order.partName}</p>
                      <p className="font-['Roboto'] text-[#64748B] text-xs">{order.partCategory}</p>
                    </div>
                    
                    <div>
                      <p className="font-['Roboto'] text-[#94A3B8] text-xs mb-0.5">Total</p>
                      <p className="font-['Inter'] text-white">£{order.price.toFixed(2)}</p>
                      {order.deliveryDate && (
                        <p className="font-['Roboto'] text-[#64748B] text-xs">
                          Delivered {formatDate(order.deliveryDate)}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-['Roboto'] text-[#94A3B8] text-xs mb-0.5">Supplier</p>
                      <p className="font-['Roboto'] text-white text-sm truncate">{order.supplierName}</p>
                    </div>
                    
                    <div>
                      <p className="font-['Roboto'] text-[#94A3B8] text-xs mb-0.5">Vehicle</p>
                      <p className="font-['Roboto'] text-white text-sm truncate">
                        {order.vehicleMake} {order.vehicleModel}
                      </p>
                      <p className="font-['Roboto'] text-[#64748B] text-xs">{order.vehicleReg}</p>
                    </div>
                  </div>

                  {/* Compact Actions */}
                  <div className="flex justify-end pt-3 border-t border-[#1E293B]">
                    <Button 
                      className="rounded-full gap-2 bg-[#F02801] hover:bg-[#D22301] text-white border-0 font-['Roboto'] text-sm h-10 px-6"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsOrderDetailsOpen(true);
                      }}
                    >
                      Order Again
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer onNavigate={onNavigate} />

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={isOrderDetailsOpen}
        onOpenChange={setIsOrderDetailsOpen}
        order={selectedOrder}
        onNavigate={onNavigate}
        onOrderAgain={() => {
          // Handle order again logic
          console.log("Reordering:", selectedOrder?.orderNumber);
        }}
      />
    </div>
  );
}
