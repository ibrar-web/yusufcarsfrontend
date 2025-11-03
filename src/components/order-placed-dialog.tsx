import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, Package, Clock, MapPin, FileText } from "lucide-react";
import { TrackOrderDialog } from "./track-order-dialog";

interface OrderPlacedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderDetails: {
    supplierName: string;
    partName: string;
    price: number;
    eta: string;
    orderNumber: string;
  } | null;
  onNavigate: (page: string) => void;
  onOrderConfirmed?: (orderDetails: {
    orderNumber: string;
    supplierName: string;
    partName: string;
    price: number;
    eta: string;
  }) => void;
}

export function OrderPlacedDialog({
  open,
  onOpenChange,
  orderDetails,
  onNavigate,
  onOrderConfirmed,
}: OrderPlacedDialogProps) {
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);

  if (!orderDetails) {
    return null;
  }

  const handleDoneClick = () => {
    // Close success dialog
    onOpenChange(false);
    
    // Call onOrderConfirmed callback if provided
    if (onOrderConfirmed && orderDetails) {
      onOrderConfirmed({
        orderNumber: orderDetails.orderNumber,
        supplierName: orderDetails.supplierName,
        partName: orderDetails.partName,
        price: orderDetails.price,
        eta: orderDetails.eta,
      });
    }
    
    // Open tracking dialog after a short delay
    setTimeout(() => {
      setShowTrackingDialog(true);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-[#E5E7EB]">
        <DialogHeader>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="h-16 w-16 rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-4 animate-scale-in">
              <CheckCircle className="h-8 w-8 text-[#22C55E]" />
            </div>
            <DialogTitle className="font-['Inter'] text-[#0F172A]" style={{ fontSize: "24px" }}>
              Order Placed Successfully!
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569] mt-2" style={{ fontSize: "15px" }}>
              Your order has been confirmed and sent to the supplier
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Number */}
          <div className="bg-[#F1F5F9] border-2 border-[#E5E7EB] rounded-xl p-4 text-center">
            <p className="font-['Roboto'] text-[#475569] mb-1" style={{ fontSize: "13px" }}>
              Order Number
            </p>
            <p className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: "20px" }}>
              {orderDetails.orderNumber}
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-[#F02801]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Roboto'] text-[#475569]" style={{ fontSize: "13px" }}>
                  Part Ordered
                </p>
                <p className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "15px" }}>
                  {orderDetails.partName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-[#F02801]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Roboto'] text-[#475569]" style={{ fontSize: "13px" }}>
                  Supplier
                </p>
                <p className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "15px" }}>
                  {orderDetails.supplierName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-[#F02801]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Roboto'] text-[#475569]" style={{ fontSize: "13px" }}>
                  Estimated Delivery
                </p>
                <p className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "15px" }}>
                  {orderDetails.eta}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-[#F02801]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Roboto'] text-[#475569]" style={{ fontSize: "13px" }}>
                  Total Amount
                </p>
                <p className="font-['Inter'] font-bold text-[#F02801]" style={{ fontSize: "20px" }}>
                  £{orderDetails.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center pt-2">
            <Badge className="bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 px-4 py-1.5">
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Order Confirmed
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E5E7EB]">
            <Button
              onClick={handleDoneClick}
              className="w-full h-11 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
              style={{ fontSize: "14px" }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Done
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Track Order Dialog */}
      <TrackOrderDialog
        open={showTrackingDialog}
        onOpenChange={setShowTrackingDialog}
        orderDetails={orderDetails}
        onNavigate={onNavigate}
      />
    </Dialog>
  );
}
