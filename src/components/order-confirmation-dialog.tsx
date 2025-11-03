import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, Truck, Calendar, ArrowRight } from "lucide-react";

interface OrderConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderDetails: {
    orderNumber: string;
    supplierName: string;
    partName: string;
    price: number;
    eta: string;
  } | null;
  onNavigate: (page: string) => void;
  onTrackOrder?: () => void;
}

export function OrderConfirmationDialog({
  open,
  onOpenChange,
  orderDetails,
  onNavigate,
  onTrackOrder,
}: OrderConfirmationDialogProps) {
  if (!orderDetails) {
    return null;
  }

  // Calculate estimated delivery date based on ETA
  const getDeliveryDate = (eta: string) => {
    const today = new Date();
    let daysToAdd = 3; // default
    
    if (eta.includes("Next day") || eta.includes("1-2")) {
      daysToAdd = 2;
    } else if (eta.includes("2-3")) {
      daysToAdd = 3;
    } else if (eta.includes("3-4")) {
      daysToAdd = 4;
    }
    
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);
    
    return deliveryDate.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex flex-col items-center text-center mb-1">
            <div className="h-14 w-14 rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-3 animate-scale-in">
              <CheckCircle className="h-8 w-8 text-[#22C55E]" />
            </div>
            <DialogTitle className="font-['Inter'] text-[#0F172A] mb-1" style={{ fontSize: "22px" }}>
              Order Confirmed!
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "13px" }}>
              Your order is being processed
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {/* Tracking Number - Large Display */}
          <div className="bg-gradient-to-br from-[#F02801]/5 via-[#F02801]/10 to-[#F02801]/5 border-2 border-[#F02801]/20 rounded-xl p-3 text-center">
            <p className="font-['Roboto'] text-[#64748B] mb-1" style={{ fontSize: "11px" }}>
              Tracking Number
            </p>
            <p className="font-['Inter'] font-bold text-[#F02801] tracking-wider" style={{ fontSize: "18px", letterSpacing: "0.05em" }}>
              {orderDetails.orderNumber}
            </p>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 bg-[#F8FAFC] rounded-lg p-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E7EB]">
              <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "12px" }}>
                Part Ordered
              </span>
              <span className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "12px" }}>
                {orderDetails.partName}
              </span>
            </div>
            
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E7EB]">
              <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "12px" }}>
                Supplier
              </span>
              <span className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "12px" }}>
                {orderDetails.supplierName}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "12px" }}>
                Total Amount
              </span>
              <span className="font-['Inter'] font-bold text-[#F02801]" style={{ fontSize: "16px" }}>
                £{orderDetails.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 p-2 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
              <div className="h-7 w-7 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 text-[#3B82F6]" />
              </div>
              <div className="flex-1">
                <p className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "12px" }}>
                  Estimated Delivery
                </p>
                <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "11px" }}>
                  {getDeliveryDate(orderDetails.eta)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg">
              <div className="h-7 w-7 rounded-lg bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4 text-[#22C55E]" />
              </div>
              <div className="flex-1">
                <p className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "12px" }}>
                  Processing
                </p>
                <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "11px" }}>
                  Ready within {orderDetails.eta}
                </p>
              </div>
            </div>
          </div>

          {/* Success Badge */}
          <div className="flex justify-center pt-1">
            <Badge className="bg-[#22C55E] text-white border-none px-3 py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span style={{ fontSize: "11px" }}>Payment Confirmed</span>
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onNavigate("home");
              }}
              className="flex-1 h-9 rounded-full border-2 border-[#E5E7EB] hover:border-[#94A3B8] font-['Roboto'] font-medium"
              style={{ fontSize: "12px" }}
            >
              Back to Home
            </Button>
            <Button
              onClick={() => {
                if (onTrackOrder) {
                  onTrackOrder();
                } else {
                  onOpenChange(false);
                  onNavigate("track-order");
                }
              }}
              className="flex-1 h-9 rounded-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
              style={{ fontSize: "12px" }}
            >
              Track Order
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
