"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/app/providers/app-state";
import { supplierMessages } from "@/page-components/supplier-dashboard/data";
import { MessageSquare } from "lucide-react";

export default function SupplierMessagesPage() {
  const { handleNavigate } = useAppState();
  const [showAllMessages, setShowAllMessages] = useState(false);

  const visibleMessages = showAllMessages ? supplierMessages : supplierMessages.slice(0, 8);

  return (
    <div className="space-y-6">
      <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FFFFFF]">
        <CardContent className="p-6">
          <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">Messages</h1>
          <p className="text-[#475569] font-['Roboto']">Communicate with your customers</p>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <CardTitle className="font-['Inter'] text-[#0F172A]">Inbox</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">
            Recent conversations from customers who requested quotes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {supplierMessages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-[#475569]" />
              </div>
              <h3 className="font-['Inter'] text-[#0F172A] mb-2">No messages yet</h3>
              <p className="text-[#475569] font-['Roboto']">You'll see customer messages here once you start quoting</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-[#E5E7EB]">
                {visibleMessages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => handleNavigate("chat")}
                    className="w-full text-left p-4 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-['Inter'] text-sm">{message.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-['Inter'] text-[#0F172A]">{message.customer}</h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {message.unread > 0 && (
                              <Badge className="bg-[#F02801] text-white border-0 shadow-sm font-['Roboto'] px-1.5 py-0 text-xs">
                                {message.unread}
                              </Badge>
                            )}
                            <span className="text-xs text-[#475569] font-['Roboto'] whitespace-nowrap">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-[#475569] font-['Roboto'] line-clamp-1">{message.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {supplierMessages.length > 8 && (
                <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC]">
                  <Button
                    onClick={() => setShowAllMessages((prev) => !prev)}
                    variant="ghost"
                    className="w-full text-[#F02801] hover:text-[#D22301] hover:bg-white font-['Roboto']"
                  >
                    {showAllMessages ? "Show Less" : `Show More (${supplierMessages.length - 8} more)`}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
