"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppState } from "@/hooks/use-app-state";
import { supplierQuotes, type SupplierQuote } from "@/page-components/supplier-dashboard/data";
import { Calendar, CheckCircle, Clock, DollarSign, Hash, MessageSquare, User, Wrench, XCircle } from "lucide-react";
import { toast } from "sonner";

const quoteStatusConfig: Record<
  SupplierQuote["status"],
  { className: string; label: string }
> = {
  pending: {
    className: "bg-[#F59E0B] text-white border-0 shadow-sm font-['Roboto']",
    label: "Pending",
  },
  accepted: {
    className: "bg-[#22C55E] text-white border-0 shadow-sm font-['Roboto']",
    label: "Accepted",
  },
  declined: {
    className: "bg-[#F02801] text-white border-0 shadow-sm font-['Roboto']",
    label: "Declined",
  },
  new: {
    className: "bg-[#3B82F6] text-white border-0 shadow-sm font-['Roboto']",
    label: "New",
  },
  quoted: {
    className: "bg-[#F59E0B] text-white border-0 shadow-sm font-['Roboto']",
    label: "Quoted",
  },
};

function renderQuoteStatusBadge(quote: SupplierQuote) {
  const config = quoteStatusConfig[quote.status] ?? quoteStatusConfig.pending;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F02801] focus-visible:ring-offset-2 rounded-lg">
          <Badge className={`${config.className} px-4 py-1.5 cursor-pointer hover:opacity-90`}>
            {config.label}
          </Badge>
        </button>
      </DialogTrigger>
      <DialogContent className="border border-[#E5E7EB] shadow-lg max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-['Inter'] text-[#0F172A]">Quote Details</DialogTitle>
          <DialogDescription className="font-['Roboto'] text-[#475569]">
            Complete information about this quote
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Status</p>
              <Badge className={`${config.className} px-4 py-1.5`}>{config.label}</Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Quote ID</p>
              <p className="font-['Inter'] text-[#0F172A]">{quote.id}</p>
            </div>
          </div>

          <Separator className="bg-[#E5E7EB]" />

          <div className="grid md:grid-cols-2 gap-6">
            {quote.customer && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-[#F02801]" />
                  <p className="text-sm text-[#475569] font-['Roboto']">Customer</p>
                </div>
                <p className="font-['Roboto'] text-[#0F172A]">{quote.customer}</p>
              </div>
            )}

            {quote.part && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-4 w-4 text-[#F02801]" />
                  <p className="text-sm text-[#475569] font-['Roboto']">Part Requested</p>
                </div>
                <p className="font-['Roboto'] text-[#0F172A]">{quote.part}</p>
              </div>
            )}

            {quote.amount && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-[#F02801]" />
                  <p className="text-sm text-[#475569] font-['Roboto']">Quote Amount</p>
                </div>
                <p className="font-['Inter'] text-[#0F172A]">£{quote.amount.toFixed(2)}</p>
              </div>
            )}

            {quote.sentAt && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#F02801]" />
                  <p className="text-sm text-[#475569] font-['Roboto']">Sent</p>
                </div>
                <p className="font-['Roboto'] text-[#0F172A]">{quote.sentAt}</p>
              </div>
            )}

            {quote.requestId && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-[#F02801]" />
                  <p className="text-sm text-[#475569] font-['Roboto']">Request ID</p>
                </div>
                <p className="font-['Roboto'] text-[#0F172A]">{quote.requestId}</p>
              </div>
            )}
          </div>

          <Separator className="bg-[#E5E7EB]" />

          <div>
            <p className="text-sm text-[#475569] font-['Roboto'] mb-3">Update Quote Status</p>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto'] rounded-xl shadow-sm"
                onClick={() => toast.success("Quote marked as Accepted")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accepted
              </Button>
              <Button
                className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-white font-['Roboto'] rounded-xl shadow-sm"
                onClick={() => toast.success("Quote marked as Pending")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Pending
              </Button>
              <Button
                className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-xl shadow-sm"
                onClick={() => toast.success("Quote marked as Declined")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Declined
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SupplierQuotesPage() {
  const { handleNavigate } = useAppState();
  const [selectedQuoteToView, setSelectedQuoteToView] = useState<SupplierQuote | null>(null);

  return (
    <div className="space-y-6">
      <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]">
        <CardContent className="p-6">
          <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">My Quotes</h1>
          <p className="text-[#475569] font-['Roboto']">Track your submitted quotes and their status</p>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <CardTitle className="font-['Inter'] text-[#0F172A]">Quotes</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Status of every quote you've sent</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E5E7EB] hover:bg-transparent">
                <TableHead className="font-['Inter'] text-[#0F172A]">Sent</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Quote ID</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Customer</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Part</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Amount</TableHead>
                <TableHead className="font-['Inter'] text-[#0F172A]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierQuotes.map((quote) => (
                <TableRow
                  key={quote.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer"
                  onClick={() => setSelectedQuoteToView(quote)}
                >
                  <TableCell className="font-['Roboto'] text-[#475569]">{quote.sentAt}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">{quote.id}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">{quote.customer}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">{quote.part}</TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">£{quote.amount.toFixed(2)}</TableCell>
                  <TableCell>{renderQuoteStatusBadge(quote)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuoteToView} onOpenChange={(open) => !open && setSelectedQuoteToView(null)}>
        <DialogContent className="border border-[#E5E7EB] shadow-lg max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Quote Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View complete information about this quote
            </DialogDescription>
          </DialogHeader>

          {selectedQuoteToView && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Status</p>
                  <Badge className={`${(quoteStatusConfig[selectedQuoteToView.status] ?? quoteStatusConfig.pending).className} px-4 py-1.5`}>
                    {(quoteStatusConfig[selectedQuoteToView.status] ?? quoteStatusConfig.pending).label}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Quote ID</p>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedQuoteToView.id}</p>
                </div>
              </div>

              <Separator className="bg-[#E5E7EB]" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Customer</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedQuoteToView.customer}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Part Requested</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedQuoteToView.part}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Quote Amount</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">£{selectedQuoteToView.amount.toFixed(2)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Sent</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedQuoteToView.sentAt}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Request ID</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedQuoteToView.requestId}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-xl shadow-sm"
                  onClick={() => {
                    handleNavigate("chat");
                    setSelectedQuoteToView(null);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Customer
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#0F172A] font-['Roboto'] rounded-xl hover:bg-[#F8FAFC]"
                  onClick={() => setSelectedQuoteToView(null)}
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
