"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatPage } from "@/components/chat/ChatPage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { useAppState } from "@/hooks/use-app-state";
import { apiRoutes } from "@/utils/apiroutes";
import { apiGet } from "@/utils/apiconfig/http";

type SupplierConversation = {
  id: string;
  chatId: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestampValue: string;
  unread: number;
};

type SupplierChatListResponse = {
  data?: {
    data?: Array<{
      chat: {
        id: string;
        createdAt?: string;
        user?: {
          id: string;
          fullName?: string;
          firstName?: string;
          email?: string;
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
  const { handleNavigate } = useAppState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationParam = searchParams.get("conversation");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<SupplierConversation[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conversationParam) {
      setSelectedConversationId(conversationParam);
    }
  }, [conversationParam]);

  useEffect(() => {
    let ignore = false;
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        const endpoint = ensureEndpoint(apiRoutes.supplier.chat.listchats);
        const response = await apiGet<SupplierChatListResponse>(endpoint);
        const payload = response?.data?.data ?? [];
        const normalized: SupplierConversation[] = payload
          .map((item) => {
            const userName =
              item.chat?.user?.fullName ||
              item.chat?.user?.firstName ||
              item.chat?.user?.email ||
              "Customer";
            const userId = item.chat?.user?.id;
            if (!userId) {
              return null;
            }
            const latest = item.latestMessage;
            const timestampValue =
              latest?.createdAt ??
              item.chat?.createdAt ??
              new Date().toISOString();
            return {
              id: userId,
              chatId: item.chat?.id ?? userId,
              name: userName,
              avatar: userName.charAt(0),
              lastMessage: latest?.content ?? "No messages yet",
              timestampValue,
              unread: latest && !latest.isRead ? 1 : 0,
            };
          })
          .filter((conv): conv is SupplierConversation => Boolean(conv));
        if (!ignore) {
          setConversations(normalized);
          setSelectedConversationId(
            (prev) => prev ?? normalized[0]?.id ?? null
          );
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load chats");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchConversations();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedConversationId && conversations.length) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [selectedConversationId, conversations]);

  const currentConversation = useMemo(() => {
    if (!conversations.length) return null;
    const targetId = selectedConversationId ?? conversations[0]?.id;
    return conversations.find((c) => c.id === targetId) ?? conversations[0];
  }, [selectedConversationId, conversations]);
  console.log("currentConversation", currentConversation);
  return (
    <div
      className="flex bg-background min-h-0 overflow-hidden"
      style={{ height: "calc(100vh - 120px)" }}
    >
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:flex w-80 border-r border-border bg-muted/20 flex-col min-h-0">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Loading conversations...
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-destructive">{error}</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No conversations yet.
              </div>
            ) : (
              conversations.map((conv) => {
                const avatarLabel = conv.avatar ?? conv.name.charAt(0);
                const isActive = currentConversation?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    className={cn(
                      "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border",
                      isActive && "bg-muted"
                    )}
                    onClick={() => {
                      setSelectedConversationId(conv.id);
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("conversation", conv.id);
                      router.replace(`?${params.toString()}`, {
                        scroll: false,
                      });
                    }}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-white">
                          {avatarLabel}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">{conv.name}</h3>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {formatTime(conv.timestampValue)}
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

        <div className="flex-1 flex overflow-hidden min-h-0">
          <ChatPage
            onNavigate={handleNavigate}
            userId={currentConversation?.id}
            chatId={currentConversation?.chatId}
            role="supplier"
          />
        </div>
      </div>
    </div>
  );
}
