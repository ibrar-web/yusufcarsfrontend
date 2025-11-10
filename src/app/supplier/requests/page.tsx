"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supplierRequests, supplierStats, type SupplierRequest } from "@/page-components/supplier-dashboard/data";
import { AlertCircle, Bell, Calendar, Car, CheckCircle, Clock, MapPin, Package, Send, TrendingUp, User, Wrench } from "lucide-react";
import { toast } from "sonner";

const requestStatusConfig: Record<SupplierRequest["status"], { label: string; className: string }> = {
  new: {
    label: "New",
    className: "bg-[#3B82F6] text-white border-0 shadow-sm font-['Roboto']",
  },
  quoted: {
    label: "Quoted",
    className: "bg-[#F59E0B] text-white border-0 shadow-sm font-['Roboto']",
  },
};

export default function SupplierRequestsPage() {
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("1-2");
  const [requestsToShow, setRequestsToShow] = useState(2);
  const [showQuoteSentDialog, setShowQuoteSentDialog] = useState(false);
  const [partCondition, setPartCondition] = useState<"new" | "used">("new");

  const newRequests = supplierRequests.filter((request) => request.status === "new");

  const handleSendQuote = () => {
    if (!quoteAmount || parseFloat(quoteAmount) <= 0) {
      toast.error("Please enter a valid quote amount");
      return;
    }

    setShowQuoteSentDialog(true);
    setQuoteAmount("");
    setQuoteNotes("");
    setDeliveryTime("1-2");
    setPartCondition("new");
  };

  const renderRequestStatusBadge = (status: SupplierRequest["status"]) => {
    const config = requestStatusConfig[status] ?? requestStatusConfig.new;
    return (
      <Badge className={`${config.className} px-4 py-1.5`}>{config.label}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEE2E2] to-[#FFFFFF]">
        <CardContent className="p-6">
          <p className="text-sm text-[#475569] font-['Roboto']">Track your performance and manage incoming requests</p>
          <h1 className="mt-2 font-['Inter'] text-[#0F172A] text-3xl font-bold">Dashboard Overview</h1>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-[#2563EB]" strokeWidth={2} />
              </div>
              <Badge className="bg-[#F1F5F9] text-[#475569] border-0 font-['Roboto'] px-2.5 py-1">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                +18%
              </Badge>
            </div>
            <p className="text-[#475569] font-['Roboto'] mb-1.5">New Requests</p>
            <p className="text-2xl font-['Inter'] text-[#0F172A]">{supplierStats.newRequests}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-[#22C55E]/15 flex items-center justify-center">
                <Send className="h-8 w-8 text-[#16A34A]" strokeWidth={2} />
              </div>
              <Badge className="bg-[#F1F5F9] text-[#475569] border-0 font-['Roboto'] px-2.5 py-1">This month</Badge>
            </div>
            <p className="text-[#475569] font-['Roboto'] mb-1.5">Quotes Sent</p>
            <p className="text-2xl font-['Inter'] text-[#0F172A]">{supplierStats.quotesSent}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-[#D97706]" strokeWidth={2} />
              </div>
              <Badge className="bg-[#DCFCE7] text-[#166534] border-0 font-['Roboto'] px-2.5 py-1">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                +4%
              </Badge>
            </div>
            <p className="text-[#475569] font-['Roboto'] mb-1.5">Conversion Rate</p>
            <p className="text-2xl font-['Inter'] text-[#0F172A]">{supplierStats.conversionRate}%</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-[#F02801]/15 flex items-center justify-center">
                <Clock className="h-8 w-8 text-[#F02801]" strokeWidth={2} />
              </div>
              <Badge className="bg-[#FEF3C7] text-[#92400E] border-0 font-['Roboto'] px-2.5 py-1">Below target</Badge>
            </div>
            <p className="text-[#475569] font-['Roboto'] mb-1.5">Avg. Response</p>
            <p className="text-2xl font-['Inter'] text-[#0F172A]">{supplierStats.avgResponseTime}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <CardTitle className="font-['Inter'] text-[#0F172A]">New Requests</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">
            {newRequests.length} new part requests from customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newRequests.slice(0, requestsToShow).map((request) => (
              <Card key={request.id} className="border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white">
                <CardContent className="p-4 space-y-4">
                  <div
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      request.timeRemaining !== undefined && request.timeRemaining <= 0
                        ? "bg-[#FEE2E2] border-[#F02801]/30"
                        : request.timeRemaining !== undefined && request.timeRemaining <= 10
                          ? "bg-[#FEF3C7] border-[#F59E0B]/30"
                          : "bg-[#DCFCE7] border-[#22C55E]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`h-4 w-4 ${
                          request.timeRemaining !== undefined && request.timeRemaining <= 0
                            ? "text-[#F02801]"
                            : request.timeRemaining !== undefined && request.timeRemaining <= 10
                              ? "text-[#F59E0B]"
                              : "text-[#22C55E]"
                        }`}
                      />
                      <span
                        className={`text-xs font-['Roboto'] ${
                          request.timeRemaining !== undefined && request.timeRemaining <= 0
                            ? "text-[#7F1D1D]"
                            : request.timeRemaining !== undefined && request.timeRemaining <= 10
                              ? "text-[#92400E]"
                              : "text-[#166534]"
                        }`}
                      >
                        {request.timeRemaining !== undefined && request.timeRemaining <= 0
                          ? `Expired ${Math.abs(request.timeRemaining)} mins ago`
                          : `${request.timeRemaining ?? 0} mins left`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    {renderRequestStatusBadge(request.status)}
                    <div className="text-right">
                      <p className="text-xs text-[#475569] font-['Roboto'] mb-0.5">Request ID</p>
                      <p className="text-sm font-['Inter'] text-[#0F172A]">{request.id}</p>
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
                      <p className="text-sm font-['Roboto'] text-[#0F172A] pl-9">{request.part}</p>
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
                          <p className="text-sm font-['Roboto'] text-[#0F172A]">{request.vehicle}</p>
                          <p className="text-xs text-[#475569] font-['Roboto'] mt-0.5">{request.registration}</p>
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
                        <p className="text-xs text-[#92400E] font-['Roboto'] mb-0.5">Customer</p>
                        <p className="font-['Roboto'] text-[#0F172A] text-xs truncate">{request.customer}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2.5 bg-[#DCFCE7]/30 rounded-lg border border-[#DCFCE7]">
                        <div className="h-7 w-7 rounded-lg bg-[#22C55E] flex items-center justify-center shadow-sm flex-shrink-0">
                          <MapPin className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#166534] font-['Roboto'] mb-0.5">Distance</p>
                          <p className="font-['Roboto'] text-[#0F172A] text-xs">{request.distance} mi</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 bg-[#E0E7FF]/30 rounded-lg border border-[#E0E7FF]">
                        <div className="h-7 w-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center shadow-sm flex-shrink-0">
                          <Calendar className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#5B21B6] font-['Roboto'] mb-0.5">Posted</p>
                          <p className="font-['Roboto'] text-[#0F172A] text-xs">{request.posted}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full py-5">
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
                            <Label className="text-[#475569] font-['Roboto']">Customer</Label>
                            <p className="font-['Roboto'] text-[#0F172A]">{request.customer}</p>
                          </div>
                          <div>
                            <Label className="text-[#475569] font-['Roboto']">Distance</Label>
                            <p className="font-['Roboto'] text-[#0F172A]">{request.distance} miles</p>
                          </div>
                          <div>
                            <Label className="text-[#475569] font-['Roboto']">Vehicle</Label>
                            <p className="font-['Roboto'] text-[#0F172A]">{request.vehicle}</p>
                          </div>
                          <div>
                            <Label className="text-[#475569] font-['Roboto']">Registration</Label>
                            <p className="font-['Roboto'] text-[#0F172A]">{request.registration}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-[#475569] font-['Roboto']">Part Needed</Label>
                          <p className="font-['Roboto'] text-[#0F172A]">{request.part}</p>
                        </div>

                        <div>
                          <Label className="text-[#475569] font-['Roboto']">Additional Details</Label>
                          <p className="font-['Roboto'] text-[#0F172A] text-sm">{request.details}</p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="font-['Inter'] text-[#0F172A]">Submit Your Quote</h4>

                          <div className="space-y-1.5">
                            <Label htmlFor={`quoteAmount-${request.id}`} className="font-['Roboto'] text-[#475569]">
                              Quote Amount (£) <span className="text-[#F02801]">*</span>
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
                              Part Condition <span className="text-[#F02801]">*</span>
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
                                <span className="font-['Roboto'] text-[#0F172A]">New</span>
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
                                <span className="font-['Roboto'] text-[#0F172A]">Used</span>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor={`deliveryTime-${request.id}`} className="font-['Roboto'] text-[#475569]">
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
                            <Label htmlFor={`quoteNotes-${request.id}`} className="font-['Roboto'] text-[#475569]">
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
                          <Button variant="outline" className="font-['Roboto'] rounded-full">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button onClick={handleSendQuote} className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full">
                          <Send className="h-4 w-4 mr-2" />
                          Send Quote
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
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

      <AlertDialog open={showQuoteSentDialog} onOpenChange={setShowQuoteSentDialog}>
        <AlertDialogContent className="border border-[#E5E7EB] shadow-lg max-w-md">
          <AlertDialogHeader>
            <div className="relative mx-auto mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] flex items-center justify-center shadow-lg">
                <CheckCircle className="h-10 w-10 text-[#22C55E]" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 h-20 w-20 rounded-full bg-[#22C55E] opacity-20 animate-ping"></div>
            </div>
            <AlertDialogTitle className="font-['Inter'] text-[#0F172A] text-center text-2xl mb-3">
              Quote Sent Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="font-['Roboto'] text-[#475569] text-center leading-relaxed">
              Your quote has been sent to the customer. You'll receive a notification when they respond or accept your quote.
            </AlertDialogDescription>
            <div className="mt-6 p-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-[#F02801] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Roboto'] text-[#0F172A] mb-1">Stay Updated</p>
                  <p className="text-sm text-[#475569] font-['Roboto']">
                    Track this quote in the "My Quotes" section and check your notifications for updates.
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
