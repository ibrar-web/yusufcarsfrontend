"use client";

import { useMemo } from "react";
import { ChatPage } from "@/components/chat/ChatPage";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { useAppState } from "@/hooks/use-app-state";
import { ChevronRight } from "lucide-react";

const mockConversations = [
  {
    id: "1",
    supplierName: "AutoParts Direct",
    lastMessage: "The part is ready for collection",
    timestamp: new Date(2025, 8, 30, 14, 30),
    unread: 2,
    online: true,
    rating: 4.8,
  },
  {
    id: "2",
    supplierName: "Midlands Motor Parts",
    lastMessage: "I can deliver tomorrow morning",
    timestamp: new Date(2025, 8, 30, 12, 15),
    unread: 0,
    online: false,
    rating: 4.9,
  },
  {
    id: "3",
    supplierName: "Quick Fix Parts",
    lastMessage: "What's your preferred delivery time?",
    timestamp: new Date(2025, 8, 29, 16, 45),
    unread: 0,
    online: true,
    rating: 4.7,
  },
];

const formatTime = (date: Date) => {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export default function Chat() {
  const {
    handleNavigate,
    handleBack,
    openSignupDialog,
    selectedSupplierId,
  } = useAppState();

  const conversations = mockConversations;

  const currentConversation = useMemo(() => {
    if (!conversations.length) return null;
    const targetId = selectedSupplierId ?? conversations[0].id;
    return conversations.find((c) => c.id === targetId) ?? conversations[0];
  }, [selectedSupplierId, conversations]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        onNavigate={handleNavigate}
        currentPage="chat"
        sticky={false}
        onSignupClick={openSignupDialog}
      />

      <div className="bg-white border-b border-[#E5E7EB] py-3 px-6">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2">
          <BackButton onBack={handleBack || (() => handleNavigate("quotes"))} label="Back to Quotes" />
          <ChevronRight className="h-4 w-4 text-[#94A3B8]" />
          <span className="font-['Inter'] font-medium text-[#0F172A]" style={{ fontSize: "14px" }}>
            Messages
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block w-80 border-r border-border bg-muted/20">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border",
                  currentConversation?.id === conv.id && "bg-muted",
                )}
                onClick={() => handleNavigate("chat", conv.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {conv.supplierName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium truncate">{conv.supplierName}</h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {formatTime(conv.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground truncate flex-1">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <Badge className="h-5 min-w-5 px-1.5 bg-primary text-white">{conv.unread}</Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <ChatPage onNavigate={handleNavigate} conversation={currentConversation} />
      </div>
    </div>
  );
}
