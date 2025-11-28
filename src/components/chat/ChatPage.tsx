import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatBubble, TypingIndicator } from "@/components/chat-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Paperclip,
  MapPin,
  Star,
  ArrowLeft,
  MoreVertical,
  Info,
} from "lucide-react";
import { SupplierContactDialog } from "@/components/supplier-contact-dialog";
import { RatingDialog } from "@/components/rating-dialog";
import { apiGet, apiPost } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import { toast } from "sonner";
import type { UserRole } from "@/utils/api";
import { CHAT_MESSAGE_EVENT } from "@/utils/socket/chatSocket";

type ParticipantProfile = {
  name: string;
  online?: boolean;
  rating?: number;
};

interface ChatPageProps {
  onNavigate: (page: string, supplierId?: string) => void;
  supplierId?: string;
  userId?: string;
  role?: UserRole | null;
  chatId?: string;
}

type ApiMessage = {
  id: string;
  content: string;
  sender?: {
    id: string;
    role?: string | null;
  };
  createdAt: string;
  isRead?: boolean;
};

type ParticipantApiPayload = {
  id?: string;
  businessName?: string | null;
  tradingAs?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  name?: string | null;
  rating?: number | null;
  averageRating?: number | null;
  online?: boolean | null;
};

type ChatMessagesResponse = {
  statusCode?: number;
  message?: string;
  data?: {
    chat?: {
      id?: string;
    };
    chatId?: string;
    supplier?: ParticipantApiPayload | null;
    user?: ParticipantApiPayload | null;
    messages?: ApiMessage[];
  };
};

type RenderMessage = {
  id: string;
  content: string;
  timestamp: Date;
  sent: boolean;
  read?: boolean;
};

type SocketChatMessagePayload = {
  id?: string;
  chatId?: string;
  content?: string;
  createdAt?: string;
  isRead?: boolean;
  sender?: {
    id?: string;
    role?: string | null;
  };
};

const FALLBACK_PARTICIPANT: Record<"user" | "supplier", ParticipantProfile> = {
  user: {
    name: "Supplier",
    online: false,
    rating: 0,
  },
  supplier: {
    name: "Customer",
    online: false,
    rating: 0,
  },
};

const getInitials = (value?: string) => {
  if (!value) return "S";
  const parts = value.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "S";
};

const ensureEndpoint = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

const toNonEmptyString = (value?: string | null) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const buildParticipantProfile = (
  payload: ParticipantApiPayload | null | undefined,
  current: ParticipantProfile,
  fallback: ParticipantProfile
): ParticipantProfile => {
  if (!payload) {
    return fallback;
  }

  const resolvedName =
    toNonEmptyString(payload.businessName) ??
    toNonEmptyString(payload.tradingAs) ??
    toNonEmptyString(payload.fullName) ??
    toNonEmptyString(payload.name) ??
    (() => {
      const first = toNonEmptyString(payload.firstName);
      const last = toNonEmptyString(payload.lastName);
      const composed = [first, last].filter(Boolean).join(" ").trim();
      return composed || first;
    })() ??
    current.name ??
    fallback.name;

  const rating =
    typeof payload.rating === "number"
      ? payload.rating
      : typeof payload.averageRating === "number"
      ? payload.averageRating
      : current.rating ?? fallback.rating;

  const onlineStatus =
    typeof payload.online === "boolean"
      ? payload.online
      : current.online ?? fallback.online;

  return {
    name: resolvedName,
    online: onlineStatus,
    rating,
  };
};

const sortMessagesByDate = (list: ApiMessage[]): ApiMessage[] =>
  [...list].sort((a, b) => {
    const aTime = new Date(a.createdAt ?? 0).getTime();
    const bTime = new Date(b.createdAt ?? 0).getTime();
    return aTime - bTime;
  });

export function ChatPage({
  onNavigate,
  supplierId,
  userId,
  role,
  chatId,
}: ChatPageProps) {
  const normalizedRole: "user" | "supplier" =
    role === "supplier" ? "supplier" : "user";
  const [message, setMessage] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [participant, setParticipant] = useState<ParticipantProfile>(
    FALLBACK_PARTICIPANT[normalizedRole]
  );
  const isSupplierPerspective = normalizedRole === "supplier";
  const normalizedSupplierId = supplierId?.trim() || undefined;
  const normalizedUserId = userId?.trim() || undefined;
  const [resolvedChatId, setResolvedChatId] = useState<string | undefined>(
    chatId?.trim() || undefined
  );
  const counterpartId = isSupplierPerspective
    ? normalizedUserId
    : normalizedSupplierId;
  const hasCounterpart = Boolean(counterpartId);
  const hasChatIdentifier = Boolean(resolvedChatId);
  const lacksSendContext = !counterpartId || !resolvedChatId;
  const displayName =
    participant.name?.trim() ??
    FALLBACK_PARTICIPANT[normalizedRole].name ??
    (isSupplierPerspective ? "Customer" : "Supplier");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleSocketMessage = (event: Event) => {
      const detail = (event as CustomEvent<SocketChatMessagePayload>).detail;
      if (!detail) {
        return;
      }

      if (detail.chatId && resolvedChatId && detail.chatId !== resolvedChatId) {
        return;
      }

      const messageId =
        detail.id ??
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`);

      setMessages((prev) => {
        if (prev.some((entry) => entry.id === messageId)) {
          return prev;
        }

        const nextMessage: ApiMessage = {
          id: messageId,
          content: detail.content ?? "",
          createdAt: detail.createdAt ?? new Date().toISOString(),
          isRead: detail.isRead,
          sender: detail.sender?.id
            ? {
                id: detail.sender.id,
                role: detail.sender.role ?? null,
              }
            : undefined,
        };

        return [...prev, nextMessage];
      });
    };

    window.addEventListener(
      CHAT_MESSAGE_EVENT,
      handleSocketMessage as EventListener,
    );

    return () => {
      window.removeEventListener(
        CHAT_MESSAGE_EVENT,
        handleSocketMessage as EventListener,
      );
    };
  }, [resolvedChatId]);

  const normalizedMessages = useMemo<RenderMessage[]>(() => {
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content ?? "",
      timestamp: new Date(msg.createdAt ?? Date.now()),
      sent: msg.sender?.role?.toLowerCase() === normalizedRole,
      read: msg.isRead ?? false,
    }));
  }, [messages, normalizedRole]);

  useEffect(() => {
    setParticipant(FALLBACK_PARTICIPANT[normalizedRole]);
  }, [normalizedRole, counterpartId]);
  useEffect(() => {
    setResolvedChatId(chatId?.trim() || undefined);
  }, [chatId]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!hasCounterpart && !hasChatIdentifier) {
      setMessages([]);
      setMessageError(null);
      setLoadingMessages(false);
      return;
    }

    try {
      setLoadingMessages(true);
      setMessageError(null);
      const route = isSupplierPerspective
        ? apiRoutes.supplier.chat.chatmessage
        : apiRoutes.user.chat.chatmessage;
      const queryKey = isSupplierPerspective ? "userId" : "supplierId";
      const identifier = counterpartId
        ? `${queryKey}=${encodeURIComponent(counterpartId)}`
        : "";
      const endpoint = `${ensureEndpoint(route)}${
        identifier ? `?${identifier}` : ""
      }`;
      const response = await apiGet<ChatMessagesResponse>(endpoint);
      const payload = response?.data;
      const messageList = payload?.messages;
      const fetchedChatId =
        payload?.chat?.id ?? payload?.chatId ?? resolvedChatId ?? undefined;
      if (fetchedChatId) {
        setResolvedChatId(fetchedChatId);
      }
      const normalizedList = Array.isArray(messageList) ? messageList : [];
      setMessages(sortMessagesByDate(normalizedList));
      const participantPayload = isSupplierPerspective
        ? payload?.user
        : payload?.supplier;
      if (participantPayload) {
        setParticipant((prev) =>
          buildParticipantProfile(
            participantPayload,
            prev,
            FALLBACK_PARTICIPANT[normalizedRole]
          )
        );
      }
    } catch (error) {
      setMessageError(
        error instanceof Error ? error.message : "Failed to load messages"
      );
    } finally {
      setLoadingMessages(false);
    }
  }, [
    counterpartId,
    hasCounterpart,
    hasChatIdentifier,
    isSupplierPerspective,
    normalizedRole,
    resolvedChatId,
  ]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!counterpartId || !resolvedChatId) {
      setMessage("");
      return;
    }
    try {
      setSendingMessage(true);
      const trimmed = message.trim();
      const route = isSupplierPerspective
        ? apiRoutes.supplier.chat.chatmessage
        : apiRoutes.user.chat.chatmessage;
      const payload: Record<string, string> = {
        message: trimmed,
        chatId: resolvedChatId,
      };
      const res = await apiPost(ensureEndpoint(route), payload);
      console.log(res)
      const optimisticMessage: ApiMessage = {
        id: crypto.randomUUID(),
        content: trimmed,
        sender: {
          id:
            (isSupplierPerspective ? normalizedSupplierId : normalizedUserId) ??
            normalizedRole,
          role: normalizedRole,
        },
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setMessages((prev) => sortMessagesByDate([...prev, optimisticMessage]));
      setMessage("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const displayedMessages = normalizedMessages;
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [displayedMessages.length]);

  const isSendDisabled = !message.trim() || lacksSendContext || sendingMessage;
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => onNavigate("quotes")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-white text-lg">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            {participant.online && (
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-background" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{displayName}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span>{participant.rating ?? 0}</span>
              <span>•</span>
              <span>{participant.online ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowContactDialog(true)}
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <MapPin className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto overscroll-y-contain p-6 bg-muted/10 min-h-0"
        ref={scrollContainerRef}
      >
        <div className="max-w-[900px] mx-auto">
          {loadingMessages && (
            <p className="text-sm text-muted-foreground mb-3">
              Loading messages...
            </p>
          )}
          {messageError && (
            <p className="text-sm text-destructive mb-3">{messageError}</p>
          )}
          {!loadingMessages &&
            !messageError &&
            displayedMessages.length === 0 && (
              <p className="text-sm text-muted-foreground mb-3">
                No messages yet.
              </p>
            )}
          {displayedMessages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {showTyping && <TypingIndicator />}
        </div>
      </div>
      <div className="p-4 border-t border-border bg-card">
        <div className="max-w-[900px] mx-auto flex items-end gap-3">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="resize-none"
              disabled={lacksSendContext || sendingMessage}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={isSendDisabled}
            className="shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <SupplierContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        supplier={{
          name: displayName,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            displayName
          )}&background=F02801&color=fff&size=128`,
          phone: "+44 20 7946 0958",
          email: `contact@${displayName
            .toLowerCase()
            .replace(/\s+/g, "")}.co.uk`,
          location: "Birmingham, West Midlands",
          address: "Unit 12, Industrial Estate, Birmingham B5 7RG",
        }}
      />

      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        supplierName={displayName}
        onSubmit={(rating, feedback) => {
          console.log("Rating submitted:", rating, feedback);
        }}
      />
    </div>
  );
}
