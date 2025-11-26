"use client";

import { useMemo, useState } from "react";
import { ChatPage } from "@/components/chat/ChatPage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { useAppState } from "@/hooks/use-app-state";
import { supplierMessages } from "@/page-components/supplier-dashboard/data";
const formatTime = (value: string) => value;

export default function SupplierChatPage() {
  const { handleNavigate, handleBack } = useAppState();
  const [activeConversationId, setActiveConversationId] = useState(
    supplierMessages[0]?.id ?? null
  );

  const conversations = supplierMessages;

  const currentConversation = useMemo(() => {
    if (!conversations.length) return null;
    const targetId = activeConversationId ?? conversations[0].id;
    const match =
      conversations.find((conv) => conv.id === targetId) ?? conversations[0];
    return {
      id: match.id,
      supplierName: match.customer,
      online: true,
      rating: 5,
    };
  }, [activeConversationId, conversations]);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block w-80 border-r border-border bg-muted/20">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Conversations</h2>
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border",
                  conv.id === currentConversation?.id && "bg-muted"
                )}
                onClick={() => setActiveConversationId(conv.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {conv.customer[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium truncate">{conv.customer}</h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {formatTime(conv.timestamp)}
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
            ))}
          </div>
        </div>

        <ChatPage
          onNavigate={handleNavigate}
          conversation={currentConversation}
        />
      </div>
    </div>
  );
}
