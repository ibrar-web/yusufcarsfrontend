"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiRoutes } from "@/utils/apiroutes";
import { apiGet } from "@/utils/apiconfig/http";
import { MessageSquare } from "lucide-react";

type SupplierConversation = {
  id: string;
  chatId: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestampLabel: string;
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

export default function SupplierMessagesPage() {
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [conversations, setConversations] = useState<SupplierConversation[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              timestampLabel: formatTime(timestampValue),
              unread: latest && !latest.isRead ? 1 : 0,
            };
          })
          .filter((conv): conv is SupplierConversation => Boolean(conv));
        if (!ignore) {
          setConversations(normalized);
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

  const visibleMessages = useMemo(() => {
    return showAllMessages ? conversations : conversations.slice(0, 8);
  }, [conversations, showAllMessages]);

  return (
    <div className="space-y-6">
      <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FFFFFF]">
        <CardContent className="p-6">
          <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">Messages</h1>
          <p className="text-[#475569] font-['Roboto']">
            Communicate with your customers
          </p>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <CardTitle className="font-['Inter'] text-[#0F172A]">
            Inbox
          </CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">
            Recent conversations from customers who requested quotes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-sm text-[#475569] font-['Roboto']">
              Loading conversations...
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-[#DC2626] font-['Roboto']">
              {error}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-[#475569]" />
              </div>
              <h3 className="font-['Inter'] text-[#0F172A] mb-2">
                No messages yet
              </h3>
              <p className="text-[#475569] font-['Roboto']">
                You'll see customer messages here once you start quoting
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-[#E5E7EB]">
                {visibleMessages.map((message) => (
                  <Link
                    key={message.id}
                    href={`/supplier/messages/chat?conversation=${message.id}`}
                    className="block w-full text-left p-4 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-['Inter'] text-sm">
                          {message.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-['Inter'] text-[#0F172A]">
                            {message.name}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {message.unread > 0 && (
                              <Badge className="bg-[#F02801] text-white border-0 shadow-sm font-['Roboto'] px-1.5 py-0 text-xs">
                                {message.unread}
                              </Badge>
                            )}
                            <span className="text-xs text-[#475569] font-['Roboto'] whitespace-nowrap">
                              {message.timestampLabel}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-[#475569] font-['Roboto'] line-clamp-1">
                          {message.lastMessage}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {conversations.length > 8 && (
                <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC]">
                  <Button
                    onClick={() => setShowAllMessages((prev) => !prev)}
                    variant="ghost"
                    className="w-full text-[#F02801] hover:text-[#D22301] hover:bg-white font-['Roboto']"
                  >
                    {showAllMessages
                      ? "Show Less"
                      : `Show More (${conversations.length - 8} more)`}
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
