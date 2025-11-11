import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toast } from "sonner";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  MapPin, 
  Phone, 
  MessageSquare,
  FileText,
  Shield,
  ChevronDown,
  Store,
  Flag,
  AlertCircle,
  X
} from "lucide-react";

interface TrackOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderDetails?: {
    orderNumber: string;
    supplierName: string;
    partName: string;
    price: number;
    eta: string;
  } | null;
  onNavigate: (page: string) => void;
}

type StepStatus = 'done' | 'current' | 'next';

interface Step {
  id: number;
  label: string;
  status: StepStatus;
  icon: any;
}

interface EventItem {
  id: string;
  title: string;
  timestamp: string;
  note?: string;
  icon: any;
  iconColor: string;
  isNew?: boolean;
}

export function TrackOrderDialog({
  open,
  onOpenChange,
  orderDetails,
  onNavigate,
}: TrackOrderDialogProps) {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showReportSentDialog, setShowReportSentDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  // Mock order details if not provided
  const order = orderDetails || {
    orderNumber: "ORD-12345678",
    supplierName: "AutoParts UK",
    partName: "Front Brake Disc & Pad Set",
    price: 125.99,
    eta: "2-3 days"
  };

  // Steps configuration
  const steps: Step[] = [
    { id: 1, label: "Placed", status: "done", icon: CheckCircle },
    { id: 2, label: "Processing", status: "current", icon: Package },
    { id: 3, label: "Shipped", status: "next", icon: Truck },
    { id: 4, label: "Delivered", status: "next", icon: MapPin },
  ];

  // Event log
  const allEvents: EventItem[] = [
    {
      id: "1",
      title: "Order confirmed",
      timestamp: "Today, 10:30 AM",
      note: "Payment received",
      icon: CheckCircle,
      iconColor: "text-[#22C55E]",
      isNew: true
    },
    {
      id: "2",
      title: "Processing started",
      timestamp: "Today, 11:00 AM",
      note: "Supplier preparing your order",
      icon: Package,
      iconColor: "text-[#EF4444]"
    },
    {
      id: "3",
      title: "Quality check passed",
      timestamp: "Today, 11:30 AM",
      note: "Part verified and ready",
      icon: Shield,
      iconColor: "text-[#22C55E]"
    },
    {
      id: "4",
      title: "Order created",
      timestamp: "Today, 10:00 AM",
      note: "Request submitted successfully",
      icon: FileText,
      iconColor: "text-[#64748B]"
    }
  ];

  const visibleEvents = showAllEvents ? allEvents : allEvents.slice(0, 2);

  const handleReportSubmit = () => {
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }
    
    // Handle report submission
    setShowReportDialog(false);
    setShowReportSentDialog(true);
  };

  const reportReasons = [
    { value: "wrong-item", label: "Wrong item received" },
    { value: "damaged", label: "Item damaged or defective" },
    { value: "not-delivered", label: "Item not delivered" },
    { value: "late-delivery", label: "Late delivery" },
    { value: "poor-quality", label: "Poor quality" },
    { value: "other", label: "Other issue" },
  ];

  return (
    <>
      {/* Report Sent Success Dialog */}
      <Dialog open={showReportSentDialog} onOpenChange={setShowReportSentDialog}>
        <DialogContent className="sm:max-w-[450px] bg-white border-[#E5E7EB]">
          <div className="py-6 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-[#22C55E]" />
              </div>
            </div>

            {/* Title */}
            <DialogTitle className="font-['Inter'] text-[#0F172A] mb-3" style={{ fontSize: "24px" }}>
              Report Sent Successfully
            </DialogTitle>

            {/* Description */}
            <DialogDescription className="font-['Roboto'] text-[#475569] mb-6 px-4" style={{ fontSize: "15px", lineHeight: "1.5" }}>
              Thank you for reporting this issue. Our team will review your report and get back to you within 24-48 hours.
            </DialogDescription>

            {/* Report Details Summary */}
            <div className="bg-[#F1F5F9] rounded-xl p-4 mb-6 mx-4 text-left border border-[#E5E7EB]">
              <p className="font-['Roboto'] text-[#475569] mb-2" style={{ fontSize: "12px" }}>
                Report Reference
              </p>
              <p className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: "16px" }}>
                REP-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="font-['Roboto'] text-[#475569]" style={{ fontSize: "12px" }}>
                We've sent a confirmation to your email with the report details.
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => {
                setShowReportSentDialog(false);
                setReportReason("");
                setReportDetails("");
              }}
              className="w-full mx-4 h-12 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold shadow-lg shadow-[#F02801]/30"
              style={{ fontSize: "15px", maxWidth: "calc(100% - 32px)" }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white border-[#E5E7EB]">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A] flex items-center gap-2" style={{ fontSize: "20px" }}>
              <Flag className="h-5 w-5 text-[#F02801]" />
              Report Order Issue
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]" style={{ fontSize: "14px" }}>
              Order #{order.orderNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Order Details Summary */}
            <div className="bg-[#F1F5F9] rounded-xl p-4 border border-[#E5E7EB]">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-[#E5E7EB]">
                  <Package className="h-5 w-5 text-[#F02801]" />
                </div>
                <div className="flex-1">
                  <p className="font-['Inter'] font-medium text-[#0F172A]" style={{ fontSize: "14px" }}>
                    {order.partName}
                  </p>
                  <p className="font-['Roboto'] text-[#475569]" style={{ fontSize: "12px" }}>
                    Supplier: {order.supplierName}
                  </p>
                  <p className="font-['Roboto'] text-[#475569]" style={{ fontSize: "12px" }}>
                    Price: £{order.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Report Reason */}
            <div className="space-y-2">
              <Label className="font-['Roboto'] font-medium text-[#0F172A]" style={{ fontSize: "14px" }}>
                What's the issue? <span className="text-[#F02801]">*</span>
              </Label>
              <RadioGroup value={reportReason} onValueChange={setReportReason}>
                <div className="space-y-2">
                  {reportReasons.map((reason) => (
                    <div key={reason.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={reason.value} 
                        id={reason.value}
                        className="border-[#E5E7EB] text-[#F02801]"
                      />
                      <Label
                        htmlFor={reason.value}
                        className="font-['Roboto'] text-[#0F172A] cursor-pointer"
                        style={{ fontSize: "14px" }}
                      >
                        {reason.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <Label htmlFor="report-details" className="font-['Roboto'] font-medium text-[#0F172A]" style={{ fontSize: "14px" }}>
                Additional details (optional)
              </Label>
              <Textarea
                id="report-details"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Please provide any additional information that might help us resolve this issue..."
                className="min-h-[100px] font-['Roboto'] text-[#0F172A] border-[#E5E7EB] focus:border-[#F02801] focus:ring-[#F02801] rounded-xl"
                style={{ fontSize: "14px" }}
              />
            </div>

            {/* Info Notice */}
            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-3 flex gap-2">
              <AlertCircle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-['Roboto'] font-medium text-[#92400E]" style={{ fontSize: "13px" }}>
                  Our team will review your report
                </p>
                <p className="font-['Roboto'] text-[#92400E]" style={{ fontSize: "12px" }}>
                  We'll investigate this issue and get back to you within 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowReportDialog(false);
                setReportReason("");
                setReportDetails("");
              }}
              className="flex-1 h-11 rounded-xl border-2 border-[#E5E7EB] hover:border-[#94A3B8] font-['Roboto'] font-medium"
              style={{ fontSize: "14px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReportSubmit}
              className="flex-1 h-11 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold shadow-lg shadow-[#F02801]/30"
              style={{ fontSize: "14px" }}
            >
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Track Order Dialog */}
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 bg-white border-[#E5E7EB]">
        <div className="p-5 pb-3">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]" style={{ fontSize: "20px" }}>
              Track Order
            </DialogTitle>
            <DialogDescription className="font-['Inter'] text-[#475569]" style={{ fontSize: "13px" }}>
              Order {order.orderNumber}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-5 pb-5">
          <div className="space-y-3">
            {/* Horizontal Stepper */}
            <div className="bg-white rounded-2xl p-4 border-2 border-[#E5E7EB]">
              <div className="relative">
                {/* Steps Container */}
                <div className="flex items-start justify-between relative">
                  {/* Connecting Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E5E7EB]"
                    style={{ 
                      marginLeft: "20px",
                      marginRight: "20px"
                    }}
                  >
                    {/* Progress Line */}
                    <div 
                      className="absolute left-0 top-0 h-full bg-[#22C55E] transition-all duration-300"
                      style={{ 
                        width: `${(steps.findIndex(s => s.status === 'current') / (steps.length - 1)) * 100}%`
                      }}
                    />
                  </div>

                  {/* Steps */}
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isDone = step.status === 'done';
                    const isCurrent = step.status === 'current';
                    const isNext = step.status === 'next';

                    return (
                      <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
                        {/* Icon Circle */}
                        <div className="relative mb-2">
                          <div 
                            className={`
                              h-10 w-10 rounded-full flex items-center justify-center
                              transition-all duration-180
                              ${isDone ? 'bg-[#22C55E]' : ''}
                              ${isCurrent ? 'bg-white border-2 border-[#F02801]' : ''}
                              ${isNext ? 'bg-[#E5E7EB]' : ''}
                            `}
                          >
                            <Icon 
                              className={`
                                h-4 w-4 transition-all duration-180
                                ${isDone ? 'text-white' : ''}
                                ${isCurrent ? 'text-[#F02801]' : ''}
                                ${isNext ? 'text-[#475569]' : ''}
                              `}
                            />
                          </div>
                          
                          {/* Pulse Animation for Current Step */}
                          {isCurrent && (
                            <div className="absolute inset-0 rounded-full border-2 border-[#F02801] animate-ping opacity-75" />
                          )}
                        </div>

                        {/* Label */}
                        <span 
                          className={`
                            font-['Inter'] font-medium text-center
                            transition-all duration-180
                            ${isDone ? 'text-[#0F172A]' : ''}
                            ${isCurrent ? 'text-[#F02801]' : ''}
                            ${isNext ? 'text-[#475569]' : ''}
                          `}
                          style={{ fontSize: "12px" }}
                        >
                          {step.label}
                        </span>

                        {/* ETA Chip on Current Step */}
                        {isCurrent && (
                          <div className="mt-1.5 px-2 py-0.5 bg-[#F02801]/10 rounded-full">
                            <span className="font-['Inter'] text-[#F02801]" style={{ fontSize: "10px" }}>
                              {order.eta}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {/* Left - Updates */}
              <div className="bg-white rounded-xl p-3 border-2 border-[#E5E7EB]">
                <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: "14px" }}>
                  Updates
                </h3>

                <div className="space-y-2">
                  {visibleEvents.map((event) => {
                    const Icon = event.icon;
                    return (
                      <div 
                        key={event.id}
                        className={`
                          flex gap-2 p-2 rounded-lg border border-[#E5E7EB] transition-all duration-300
                          ${event.isNew ? 'bg-[#F02801]/5' : 'bg-white'}
                        `}
                      >
                        {/* Icon */}
                        <div className="h-7 w-7 rounded-full bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                          <Icon className={`h-3.5 w-3.5 ${event.iconColor}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-['Inter'] font-medium text-[#0F172A]" style={{ fontSize: "12px" }}>
                            {event.title}
                            {event.isNew && (
                              <Badge className="ml-1 bg-[#F02801] text-white border-none px-1 py-0" style={{ fontSize: "8px" }}>
                                New
                              </Badge>
                            )}
                          </h4>
                          {event.note && (
                            <p className="font-['Inter'] text-[#475569]" style={{ fontSize: "10px" }}>
                              {event.note}
                            </p>
                          )}
                          <p className="font-['Inter'] text-[#475569]" style={{ fontSize: "9px" }}>
                            {event.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!showAllEvents && allEvents.length > 2 && (
                  <button
                    onClick={() => setShowAllEvents(true)}
                    className="w-full mt-2 flex items-center justify-center gap-1 py-1 text-[#F02801] hover:text-[#D22301] transition-colors font-['Inter'] font-medium"
                    style={{ fontSize: "11px" }}
                  >
                    Show more
                    <ChevronDown className="h-3 w-3" />
                  </button>
                )}

                {/* Report Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowReportDialog(true)}
                  className="w-full mt-2 h-8 rounded-xl border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#F02801]/5 hover:text-[#F02801] font-['Inter'] font-medium transition-all duration-180"
                  style={{ fontSize: "11px" }}
                >
                  <Flag className="h-3 w-3 mr-1.5" />
                  Report Issue
                </Button>
              </div>

              {/* Right - Order Summary & Supplier */}
              <div className="space-y-3">
                {/* Order Summary */}
                <div className="bg-white rounded-xl p-3 border-2 border-[#E5E7EB]">
                  <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: "14px" }}>
                    Order Summary
                  </h3>

                  <div className="space-y-2 mb-3 pb-3 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <span className="font-['Inter'] text-[#475569]" style={{ fontSize: "11px" }}>Total</span>
                      <span className="font-['Inter'] font-bold text-[#F02801]" style={{ fontSize: "20px" }}>
                        £{order.price.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <p className="font-['Inter'] text-[#475569] mb-0.5" style={{ fontSize: "11px" }}>Part</p>
                      <p className="font-['Inter'] font-medium text-[#0F172A]" style={{ fontSize: "12px" }}>
                        {order.partName}
                      </p>
                    </div>

                    <div>
                      <p className="font-['Inter'] text-[#475569] mb-0.5" style={{ fontSize: "11px" }}>Delivery</p>
                      <p className="font-['Inter'] font-medium text-[#0F172A]" style={{ fontSize: "12px" }}>
                        {order.eta}
                      </p>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-9 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Inter'] font-semibold shadow-lg shadow-[#F02801]/30 transition-all duration-180"
                    style={{ fontSize: "12px" }}
                  >
                    <Truck className="h-3.5 w-3.5 mr-1.5" />
                    Track Parcel
                  </Button>
                </div>

                {/* Supplier Contact */}
                <div className="bg-white rounded-xl p-3 border-2 border-[#E5E7EB]">
                  <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: "13px" }}>
                    Supplier
                  </h3>

                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E5E7EB]">
                    <div className="h-9 w-9 rounded-full bg-[#F02801]/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-['Inter'] font-semibold text-[#F02801]" style={{ fontSize: "13px" }}>
                        {order.supplierName[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Inter'] font-medium text-[#0F172A]" style={{ fontSize: "13px" }}>
                        {order.supplierName}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Shield className="h-2.5 w-2.5 text-[#22C55E]" />
                        <span className="font-['Inter'] text-[#22C55E]" style={{ fontSize: "10px" }}>
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        onOpenChange(false);
                        onNavigate("chat");
                      }}
                      variant="outline"
                      className="w-full h-8 rounded-xl border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#F02801]/5 hover:text-[#F02801] font-['Inter'] font-medium transition-all duration-180"
                      style={{ fontSize: "12px" }}
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                      Message
                    </Button>
                    <Button
                      onClick={() => {
                        onOpenChange(false);
                        onNavigate("supplier-profile");
                      }}
                      variant="outline"
                      className="w-full h-8 rounded-xl border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#F02801]/5 hover:text-[#F02801] font-['Inter'] font-medium transition-all duration-180"
                      style={{ fontSize: "12px" }}
                    >
                      <Store className="h-3.5 w-3.5 mr-1.5" />
                      Visit Store
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
