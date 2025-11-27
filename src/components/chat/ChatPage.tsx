import { useCallback, useEffect, useMemo, useState } from "react";
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

interface ConversationSummary {
  id: string;
  chatId?: string;
  supplierName: string;
  online?: boolean;
  rating?: number;
}

interface ChatPageProps {
  onNavigate: (page: string, supplierId?: string) => void;
  conversation?: ConversationSummary | null;
  enableChatApi?: boolean;
}

type ApiMessage = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead?: boolean;
};

type ChatMessagesResponse = {
  data?: {
    data?: ApiMessage[];
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

const FALLBACK_CONVERSATION: ConversationSummary = {
  id: "",
  supplierName: "Supplier",
  online: false,
  rating: 0,
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

export function ChatPage({
  onNavigate,
  conversation,
  enableChatApi = false,
}: ChatPageProps) {
  const [message, setMessage] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);

  const currentConversation = conversation ?? FALLBACK_CONVERSATION;
  const displayName = currentConversation.supplierName?.trim() || "Supplier";
  const supplierIdentifier = currentConversation.id;
  const chatIdentifier = currentConversation.chatId ?? supplierIdentifier;
  const shouldUseChatApi = enableChatApi && Boolean(chatIdentifier);

  const normalizedMessages = useMemo<RenderMessage[]>(() => {
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content ?? "",
      timestamp: new Date(msg.createdAt ?? Date.now()),
      sent: supplierIdentifier ? msg.senderId !== supplierIdentifier : false,
      read: msg.isRead ?? false,
    }));
  }, [messages, supplierIdentifier]);

  const fetchMessages = useCallback(async () => {
    if (!shouldUseChatApi || !chatIdentifier) {
      setMessages([]);
      setMessageError(null);
      setLoadingMessages(false);
      return;
    }

    try {
      setLoadingMessages(true);
      setMessageError(null);
      const endpoint = `${ensureEndpoint(
        apiRoutes.user.chat.chatmessage
      )}?supplierId=${encodeURIComponent(chatIdentifier)}`;
      const response = await apiGet<ChatMessagesResponse>(endpoint);
      const raw =
        (Array.isArray(response?.data?.data)
          ? response?.data?.data
          : Array.isArray(response?.data?.messages)
          ? response?.data?.messages
          : Array.isArray(response?.data)
          ? (response?.data as ApiMessage[])
          : []) ?? [];
      setMessages(raw);
    } catch (error) {
      setMessageError(
        error instanceof Error ? error.message : "Failed to load messages"
      );
    } finally {
      setLoadingMessages(false);
    }
  }, [chatIdentifier, shouldUseChatApi]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!shouldUseChatApi || !chatIdentifier) {
      setMessage("");
      return;
    }
    try {
      setSendingMessage(true);
      const payload = {
        supplierId: chatIdentifier,
        message: message.trim(),
      };
      await apiPost(ensureEndpoint(apiRoutes.user.chat.chatmessage), payload);
      const optimisticMessage: ApiMessage = {
        id: crypto.randomUUID(),
        content: payload.message,
        senderId: supplierIdentifier ? `${supplierIdentifier}-user` : "user",
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setMessages((prev) => [...prev, optimisticMessage]);
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
  const showSelectPrompt = enableChatApi && !chatIdentifier;

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
            {currentConversation.online && (
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-background" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{displayName}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span>{currentConversation.rating}</span>
              <span>•</span>
              <span>{currentConversation.online ? "Online" : "Offline"}</span>
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

      <div className="flex-1 overflow-y-auto overscroll-y-contain p-6 bg-muted/10 min-h-0">
        <div className="max-w-[900px] mx-auto">
          {enableChatApi && (
            <>
              {loadingMessages && (
                <p className="text-sm text-muted-foreground mb-3">
                  Loading messages...
                </p>
              )}
              {messageError && (
                <p className="text-sm text-destructive mb-3">{messageError}</p>
              )}
              {showSelectPrompt && !loadingMessages && !messageError && (
                <p className="text-sm text-muted-foreground mb-3">
                  Select a conversation to view messages.
                </p>
              )}
            </>
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
              disabled={
                shouldUseChatApi && (!chatIdentifier || sendingMessage)
              }
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={
              !message.trim() ||
              (shouldUseChatApi && (!chatIdentifier || sendingMessage))
            }
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
