'use client';

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminInquiries } from "@/page-components/admin-dashboard/data";
import { CheckCircle, Mail, Users } from "lucide-react";

type InquiryStatus = "all" | "unread" | "read";
type Inquiry = (typeof adminInquiries)[number];

export default function AdminInquiriesPage() {
  const [inquiryFilter, setInquiryFilter] = useState<InquiryStatus>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [inquiryDetailsDialogOpen, setInquiryDetailsDialogOpen] = useState(false);
  const [emailSentDialogOpen, setEmailSentDialogOpen] = useState(false);

  const filteredInquiries = useMemo(() => {
    if (inquiryFilter === "all") return adminInquiries;
    if (inquiryFilter === "unread") return adminInquiries.filter((i) => i.status === "New");
    return adminInquiries.filter((i) => i.status !== "New");
  }, [inquiryFilter]);

  return (
    <>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white border-2 border-[#3B82F6]/20 p-6 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">
              Customer Inquiries
            </h1>
            <p className="text-base md:text-lg text-[#475569] font-['Roboto']">
              {adminInquiries.filter((i) => i.status === "New").length} new inquiries awaiting response
            </p>
          </div>
        </div>

        <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
          <CardHeader className="pb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-['Inter'] text-[#0F172A]">All Inquiries</CardTitle>
                <CardDescription className="font-['Roboto'] text-[#475569]">
                  Messages from customers and potential partners
                </CardDescription>
              </div>
              <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl">
                {[
                  { id: "all", label: "All", count: adminInquiries.length },
                  { id: "unread", label: "New", count: adminInquiries.filter((i) => i.status === "New").length },
                  { id: "read", label: "Responded", count: adminInquiries.filter((i) => i.status !== "New").length },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setInquiryFilter(filter.id as InquiryStatus)}
                    className={`relative px-6 py-2.5 rounded-lg font-['Roboto'] transition-all duration-200 ${
                      inquiryFilter === filter.id
                        ? "bg-white text-[#0F172A] shadow-sm"
                        : "text-[#475569] hover:text-[#0F172A]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {filter.label}
                      <span
                        className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md font-['Roboto'] transition-all duration-200 ${
                          inquiryFilter === filter.id
                            ? "bg-[#F02801] text-white"
                            : "bg-[#E5E7EB] text-[#475569]"
                        }`}
                      >
                        {filter.count}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredInquiries.map((inquiry, index) => (
              <div
                key={inquiry.id}
                className={`flex flex-col gap-3 px-5 py-4 hover:bg-[#F8FAFC] transition-all ${
                  index !== filteredInquiries.length - 1 ? "border-b border-[#E5E7EB]" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-['Inter'] text-[#0F172A]">{inquiry.subject}</h4>
                    <div className="flex items-center gap-2 text-sm text-[#475569] font-['Roboto']">
                      <span>{inquiry.name}</span>
                      <span className="text-[#CBD5E1]">•</span>
                      <span className="truncate">{inquiry.email}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-[#E5E7EB] text-[#475569] font-['Roboto'] whitespace-nowrap">
                    {inquiry.category}
                  </Badge>
                  <div className="text-right text-sm text-[#475569] font-['Roboto'] whitespace-nowrap">
                    <div>{inquiry.date}</div>
                    <div className="text-xs">{inquiry.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`px-3 py-1.5 font-['Roboto'] border-0 ${
                      inquiry.status === "New"
                        ? "bg-[#EFF6FF] text-[#3B82F6]"
                        : "bg-[#F0FDF4] text-[#22C55E]"
                    }`}
                  >
                    {inquiry.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    className="ml-auto text-[#F02801] hover:text-[#D22301] font-['Roboto']"
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setInquiryDetailsDialogOpen(true);
                    }}
                  >
                    View details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={inquiryDetailsDialogOpen} onOpenChange={setInquiryDetailsDialogOpen}>
        <DialogContent className="max-w-3xl border border-[#E5E7EB] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Inquiry Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View and respond to customer inquiry
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-6 mt-2">
              <div className="flex items-center gap-3">
                <Badge
                  className={`px-4 py-1.5 font-['Roboto'] border-0 ${
                    selectedInquiry.status === "New" ? "bg-[#EFF6FF] text-[#3B82F6]" : "bg-[#F0FDF4] text-[#22C55E]"
                  }`}
                >
                  {selectedInquiry.status}
                </Badge>
                <Badge variant="outline" className="px-4 py-1.5 border-[#E5E7EB] text-[#475569] font-['Roboto']">
                  {selectedInquiry.category}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Inquiry ID</p>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedInquiry.id}</p>
                </div>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Received</p>
                  <p className="font-['Roboto'] text-[#0F172A]">
                    {selectedInquiry.date} at {selectedInquiry.time}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-['Inter'] text-[#0F172A]">Customer Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-[#F02801]" />
                      <div>
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Name</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedInquiry.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-[#F02801]" />
                      <div>
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Email</p>
                        <p className="font-['Roboto'] text-[#0F172A] break-all">{selectedInquiry.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-['Inter'] text-[#0F172A]">Subject</h4>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedInquiry.subject}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-['Inter'] text-[#0F172A]">Message</h4>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="font-['Roboto'] text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 pt-2">
                <Button
                  className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-['Roboto'] rounded-full h-11"
                  onClick={() => {
                    setEmailSentDialogOpen(true);
                    window.location.href = `mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`;
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
                {selectedInquiry.status === "New" && (
                  <Button
                    className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
                    onClick={() => setInquiryDetailsDialogOpen(false)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Responded
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={emailSentDialogOpen} onOpenChange={setEmailSentDialogOpen}>
        <DialogContent className="max-w-md border-[#334155] bg-[#0F172A]">
          <div className="text-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-[#1E293B] border-2 border-[#3B82F6] flex items-center justify-center mx-auto shadow-lg shadow-[#3B82F6]/30">
              <Mail className="h-12 w-12 text-[#3B82F6]" />
            </div>
            <div>
              <h3 className="font-['Inter'] text-white mb-2">Email Client Opened</h3>
              <p className="text-sm text-[#94A3B8] font-['Roboto']">
                Your default email client has been opened to send a reply to {selectedInquiry?.name}.
              </p>
            </div>
            <Button
              className="w-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
              onClick={() => setEmailSentDialogOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
