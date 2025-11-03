import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { OrderPlacedDialog } from "./order-placed-dialog";
import { useState } from "react";
import {
  Package,
  Calendar,
  TruckIcon,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    orderId: string;
    orderNumber: string;
    date: string;
    status: "delivered" | "in-transit" | "processing" | "cancelled";
    partName: string;
    partCategory: string;
    partCondition?: string;
    warranty?: string;
    supplierName: string;
    supplierRating?: number;
    supplierLocation?: string;
    supplierPhone?: string;
    supplierEmail?: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear?: string;
    vehicleReg: string;
    price: number;
    deliveryDate?: string;
    deliveryAddress?: string;
    trackingNumber?: string;
    notes?: string;
  } | null;
  onOrderAgain?: () => void;
  onNavigate?: (page: string) => void;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
  onOrderAgain,
  onNavigate = () => {},
}: OrderDetailsDialogProps) {
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);
  
  if (!order) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-[#22C55E]" />;
      case "in-transit":
        return <TruckIcon className="h-5 w-5 text-[#F59E0B]" />;
      case "processing":
        return <Clock className="h-5 w-5 text-[#F59E0B]" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-[#F02801]" />;
      default:
        return <Package className="h-5 w-5 text-[#475569]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; label: string }> = {
      delivered: { bg: "bg-[#22C55E]/10", text: "text-[#22C55E]", label: "Delivered" },
      "in-transit": { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", label: "In Transit" },
      processing: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", label: "Processing" },
      cancelled: { bg: "bg-[#F02801]/10", text: "text-[#F02801]", label: "Cancelled" },
    };

    const variant = variants[status] || variants.processing;
    
    return (
      <Badge className={`${variant.bg} ${variant.text} border-0 font-['Roboto']`}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-['Inter'] text-[#0F172A] flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F02801]/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-[#F02801]" />
            </div>
            <div>
              <div>{order.orderNumber}</div>
              <div className="font-['Roboto'] text-sm text-[#475569] mt-1">
                Order Details
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="font-['Roboto'] text-[#475569]">
            View complete details of your order including part information, vehicle details, supplier contact, and delivery information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-[#F1F5F9] rounded-xl">
            <div className="flex items-center gap-3">
              {getStatusIcon(order.status)}
              <div>
                <p className="font-['Roboto'] text-[#0F172A]">Order Status</p>
                <p className="font-['Roboto'] text-sm text-[#475569]">
                  Placed on {formatDate(order.date)}
                </p>
              </div>
            </div>
            {getStatusBadge(order.status)}
          </div>

          {/* Part Information */}
          <div>
            <h3 className="font-['Inter'] text-[#0F172A] mb-3">Part Information</h3>
            <div className="space-y-4">
              {/* Part Condition - New or Used */}
              {order.partCondition && (
                <div className="p-4 bg-gradient-to-r from-[#F02801]/5 to-[#F02801]/10 rounded-xl border-2 border-[#F02801]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-['Roboto'] text-sm text-[#475569] mb-1">Part Condition</p>
                      <p className="font-['Inter'] text-[#0F172A]">{order.partCondition}</p>
                    </div>
                    <Badge className={`${
                      order.partCondition.toLowerCase() === 'new' 
                        ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30' 
                        : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                    } font-['Roboto'] px-4 py-1.5`}>
                      {order.partCondition}
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F1F5F9] rounded-xl">
                <div>
                  <p className="font-['Roboto'] text-sm text-[#475569] mb-1">Part Name</p>
                  <p className="font-['Roboto'] text-[#0F172A]">{order.partName}</p>
                </div>
                <div>
                  <p className="font-['Roboto'] text-sm text-[#475569] mb-1">Category</p>
                  <p className="font-['Roboto'] text-[#0F172A]">{order.partCategory}</p>
                </div>
                {order.warranty && (
                  <div>
                    <p className="font-['Roboto'] text-sm text-[#475569] mb-1">Warranty</p>
                    <p className="font-['Roboto'] text-[#0F172A]">{order.warranty}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="font-['Inter'] text-[#0F172A] mb-3">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#F1F5F9] rounded-xl">
              <div>
                <p className="font-['Roboto'] text-sm text-[#475569] mb-1">Make & Model</p>
                <p className="font-['Roboto'] text-[#0F172A]">
                  {order.vehicleMake} {order.vehicleModel}
                </p>
              </div>
              <div>
                <p className="font-['Roboto'] text-sm text-[#475569] mb-1">Registration</p>
                <p className="font-['Roboto'] text-[#0F172A]">{order.vehicleReg}</p>
              </div>
              {order.vehicleYear && (
                <div>
                  <p className="font-['Roboto'] text-sm text-[#475569] mb-1">Year</p>
                  <p className="font-['Roboto'] text-[#0F172A]">{order.vehicleYear}</p>
                </div>
              )}
            </div>
          </div>

          {/* Supplier Information */}
          <div>
            <h3 className="font-['Inter'] text-[#0F172A] mb-3">Supplier Information</h3>
            <div className="p-4 bg-[#F1F5F9] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Roboto'] text-[#0F172A]">{order.supplierName}</p>
                  {order.supplierRating && (
                    <p className="font-['Roboto'] text-sm text-[#475569]">
                      Rating: {order.supplierRating}/5
                    </p>
                  )}
                </div>
              </div>
              {order.supplierLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#475569]" />
                  <p className="font-['Roboto'] text-sm text-[#475569]">
                    {order.supplierLocation}
                  </p>
                </div>
              )}
              {order.supplierPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#475569]" />
                  <p className="font-['Roboto'] text-sm text-[#475569]">
                    {order.supplierPhone}
                  </p>
                </div>
              )}
              {order.supplierEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#475569]" />
                  <p className="font-['Roboto'] text-sm text-[#475569]">
                    {order.supplierEmail}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Information */}
          {(order.deliveryDate || order.deliveryAddress || order.trackingNumber) && (
            <div>
              <h3 className="font-['Inter'] text-[#0F172A] mb-3">Delivery Information</h3>
              <div className="p-4 bg-[#F1F5F9] rounded-xl space-y-3">
                {order.deliveryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#475569]" />
                    <div>
                      <p className="font-['Roboto'] text-sm text-[#475569]">Delivery Date</p>
                      <p className="font-['Roboto'] text-[#0F172A]">
                        {formatDate(order.deliveryDate)}
                      </p>
                    </div>
                  </div>
                )}
                {order.deliveryAddress && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#475569]" />
                    <div>
                      <p className="font-['Roboto'] text-sm text-[#475569]">Delivery Address</p>
                      <p className="font-['Roboto'] text-[#0F172A]">{order.deliveryAddress}</p>
                    </div>
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="flex items-center gap-2">
                    <TruckIcon className="h-4 w-4 text-[#475569]" />
                    <div>
                      <p className="font-['Roboto'] text-sm text-[#475569]">Tracking Number</p>
                      <p className="font-['Roboto'] text-[#0F172A]">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div>
            <h3 className="font-['Inter'] text-[#0F172A] mb-3">Price Summary</h3>
            <div className="p-4 bg-[#F1F5F9] rounded-xl">
              <div className="flex justify-between items-center">
                <p className="font-['Roboto'] text-[#475569]">Total Amount</p>
                <p className="font-['Inter'] text-[#0F172A] text-2xl">
                  £{order.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-['Inter'] text-[#0F172A] mb-3">Additional Notes</h3>
              <div className="p-4 bg-[#F1F5F9] rounded-xl">
                <p className="font-['Roboto'] text-[#475569]">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl font-['Roboto'] border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]"
            >
              Close
            </Button>
            {order.status === "delivered" && (
              <Button
                onClick={() => {
                  // Generate new order number
                  const newOrderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
                  
                  // Calculate ETA (3-5 business days from now)
                  const daysToAdd = Math.floor(Math.random() * 3) + 3;
                  const etaDate = new Date();
                  etaDate.setDate(etaDate.getDate() + daysToAdd);
                  const eta = etaDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  
                  // Close the details dialog
                  onOpenChange(false);
                  
                  // Show order placed dialog
                  setShowOrderPlaced(true);
                  
                  // Call original handler if provided
                  if (onOrderAgain) {
                    onOrderAgain();
                  }
                }}
                className="flex-1 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']"
              >
                Order Again
              </Button>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Order Placed Dialog */}
      <OrderPlacedDialog
        open={showOrderPlaced}
        onOpenChange={setShowOrderPlaced}
        orderDetails={
          order
            ? {
                supplierName: order.supplierName,
                partName: order.partName,
                price: order.price,
                eta: order.deliveryDate
                  ? formatDate(order.deliveryDate)
                  : "3-5 business days",
                orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`,
              }
            : null
        }
        onNavigate={onNavigate}
      />
    </Dialog>
  );
}
