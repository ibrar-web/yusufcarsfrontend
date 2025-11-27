"use client";

import { useEffect, useMemo, useState } from "react";
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
import { apiRoutes } from "@/utils/apiroutes";
import { apiGet } from "@/utils/apiconfig/http";

type UserConversation = {
  id: string;
  chatId: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestampLabel: string;
  unread: number;
  online: boolean;
  rating: number;
};

type ChatListResponse = {
  data?: {
    data?: Array<{
      chat: {
        id: string;
        createdAt?: string;
        supplier?: {
          id: string;
          businessName?: string;
          firstName?: string;
        };
      };
      latestMessage?: {
        id: string;
        content: string;
        senderId: string;
        createdAt: string;
        isRead: boolean;
      } | null;
    }>;
  };
};

const ensureEndpoint = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

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
  const {
    handleNavigate,
    handleBack,
    openSignupDialog,
    selectedSupplierId,
    userRole,
    userId,
  } = useAppState();
  const { setSelectedSupplierId } = useAppStore();
  const searchParams = useSearchParams();
  const supplierParam = searchParams.get("supplier");
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    if (supplierParam) {
      setSelectedSupplierId(supplierParam);
    }
  }, [supplierParam, setSelectedSupplierId]);

  useEffect(() => {
    let ignore = false;
    const fetchChats = async () => {
      try {
        setLoadingChats(true);
        setChatError(null);
        const endpoint = ensureEndpoint(apiRoutes.user.chat.listchats);
        const response = await apiGet<ChatListResponse>(endpoint);
        const payload = response?.data?.data ?? [];
        const normalized: UserConversation[] = payload
          .map((item) => {
            const supplierName =
              item.chat?.supplier?.businessName ||
              item.chat?.supplier?.firstName ||
              "Supplier";
            const supplierId = item.chat?.supplier?.id || item.chat?.id;
            if (!supplierId) {
              return null;
            }
            const latest = item.latestMessage;
            return {
              id: supplierId,
              chatId: item.chat?.id ?? supplierId,
              name: supplierName,
              avatar: supplierName.charAt(0),
              lastMessage: latest?.content ?? "No messages yet",
              timestampLabel:
                latest?.createdAt ??
                item.chat?.createdAt ??
                new Date().toISOString(),
              unread: latest && !latest.isRead ? 1 : 0,
              online: false,
              rating: 0,
            };
          })
          .filter((conv): conv is UserConversation => Boolean(conv));
        if (!ignore) {
          setConversations(normalized);
        }
      } catch (error) {
        if (!ignore) {
          setChatError(
            error instanceof Error ? error.message : "Failed to load chats"
          );
        }
      } finally {
        if (!ignore) {
          setLoadingChats(false);
        }
      }
    };

    fetchChats();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedSupplierId && conversations.length) {
      setSelectedSupplierId(conversations[0].id);
    }
  }, [selectedSupplierId, conversations, setSelectedSupplierId]);

  const currentConversation = useMemo(() => {
    if (!conversations.length) return null;
    const targetId = selectedSupplierId ?? conversations[0]?.id;
    return conversations.find((c) => c.id === targetId) ?? conversations[0];
  }, [selectedSupplierId, conversations]);
  const chatSupplierId =
    supplierParam ??
    currentConversation?.chatId ??
    currentConversation?.id ??
    undefined;

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
            {loadingChats ? (
              <div className="p-4 text-sm text-muted-foreground">
                Loading chats...
              </div>
            ) : chatError ? (
              <div className="p-4 text-sm text-destructive">{chatError}</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No conversations yet.
              </div>
            ) : (
              conversations.map((conv) => {
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
              })
            )}
          </div>
        </div>

        <ChatPage
          onNavigate={handleNavigate}
          enableChatApi
          supplierId={chatSupplierId}
          userId={userId ?? undefined}
          role={userRole ?? "user"}
        />
      </div>
    </div>
  );
}
