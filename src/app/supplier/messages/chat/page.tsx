"use client";

import { useMemo } from "react";
import { ChatPage } from "@/components/chat/ChatPage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { useAppState } from "@/hooks/use-app-state";
import { useAppStore } from "@/stores/app-store";
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
  const { handleNavigate, selectedSupplierId } = useAppState();
  const { setSelectedSupplierId } = useAppStore();

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
    <div className="flex bg-background min-h-0 overflow-hidden" style={{height:'calc(100vh - 120px)'}}>
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:flex w-80 border-r border-border bg-muted/20 flex-col min-h-0">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
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

        <div className="flex-1 flex overflow-hidden min-h-0">
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
    </div>
  );
}
