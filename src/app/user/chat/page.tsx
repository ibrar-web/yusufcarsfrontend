"use client";

import { useEffect, useMemo } from "react";
import { ChatPage } from "@/components/chat/ChatPage";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { useAppState } from "@/hooks/use-app-state";
import { useAppStore } from "@/stores/app-store";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { supplierMessages } from "@/page-components/supplier-dashboard/data";

type UserConversation = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestampLabel: string;
  unread: number;
  online: boolean;
  rating: number;
};

const formatTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return parsed.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export default function Chat() {
  const { handleNavigate, handleBack, openSignupDialog, selectedSupplierId } =
    useAppState();
  const { setSelectedSupplierId } = useAppStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supplierParam = searchParams.get("supplier");
    if (supplierParam) {
      setSelectedSupplierId(supplierParam);
    }
  }, [searchParams, setSelectedSupplierId]);

  const conversations = useMemo<UserConversation[]>(
    () =>
      supplierMessages.map((message, index) => ({
        id: message.id,
        name: message.customer,
        avatar: message.avatar,
        lastMessage: message.lastMessage,
        timestampLabel: message.timestamp,
        unread: message.unread,
        online: index % 2 === 0,
        rating: 4.5,
      })),
    []
  );

  const currentConversation = useMemo(() => {
    if (!conversations.length) return null;
    const targetId = selectedSupplierId ?? conversations[0]?.id;
    return conversations.find((c) => c.id === targetId) ?? conversations[0];
  }, [selectedSupplierId, conversations]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <div className="bg-white border-b border-[#E5E7EB] py-3 px-6">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2">
          <BackButton
            onBack={handleBack || (() => handleNavigate("quotes"))}
            label="Back to Quotes"
          />
          <ChevronRight className="h-4 w-4 text-[#94A3B8]" />
          <span
            className="font-['Inter'] font-medium text-[#0F172A]"
            style={{ fontSize: "14px" }}
          >
            Messages
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block w-80 border-r border-border bg-muted/20">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          <div className="h-full overflow-y-auto">
            {conversations.map((conv) => {
              const avatarLabel = conv.avatar ?? conv.name.charAt(0);
              return (
                <button
                  key={conv.id}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border",
                    currentConversation?.id === conv.id && "bg-muted"
                  )}
                  onClick={() => setSelectedSupplierId(conv.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
                        {avatarLabel}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{conv.name}</h3>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatTime(conv.timestampLabel)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <Badge className="h-5 min-w-5 px-1.5 bg-primary text-white">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <ChatPage
          onNavigate={handleNavigate}
          conversation={
            currentConversation
              ? {
                  id: currentConversation.id,
                  supplierName: currentConversation.name,
                  online: currentConversation.online,
                  rating: currentConversation.rating,
                }
              : null
          }
        />
      </div>
    </div>
  );
}
