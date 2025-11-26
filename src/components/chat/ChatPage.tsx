import { useMemo, useState } from "react";
import { ChatBubble, TypingIndicator } from "@/components/chat-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Paperclip,
  Phone,
  MapPin,
  Star,
  ArrowLeft,
  MoreVertical,
  Info,
} from "lucide-react";
import { SupplierContactDialog } from "@/components/supplier-contact-dialog";
import { RatingDialog } from "@/components/rating-dialog";

interface ConversationSummary {
  id: string;
  supplierName: string;
  online?: boolean;
  rating?: number;
}

interface ChatPageProps {
  onNavigate: (page: string, supplierId?: string) => void;
  conversation?: ConversationSummary | null;
}

const FALLBACK_CONVERSATION: ConversationSummary = {
  id: "",
  supplierName: "Supplier",
  online: false,
  rating: 0,
};

const getInitials = (value?: string) => {
  if (!value) return "S";
  const parts = value.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
  return initials || "S";
};

export function ChatPage({ onNavigate, conversation }: ChatPageProps) {
  const [message, setMessage] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  const currentConversation = conversation ?? FALLBACK_CONVERSATION;
  const displayName = currentConversation.supplierName?.trim() || "Supplier";

  const messages = useMemo(
    () =>
      new Array(100).fill(null).map((_, index) => ({
        id: `${index + 1}`,
        content:
          index % 2 === 0
            ? "Hello! I've received your quote request for front brake pads. I have the part in stock."
            : "Great! How much would it cost including fitting?",
        timestamp: new Date(
          2025,
          8,
          30,
          10,
          Math.min(index * 2, 59)
        ),
        sent: index % 2 === 1,
        read: index % 3 === 0,
      })),
    []
  );

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

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
          <Button variant="outline" size="icon" onClick={() => setShowContactDialog(true)}>
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
          {messages.map((msg) => (
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
            />
          </div>
          <Button onClick={handleSend} disabled={!message.trim()} className="shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <SupplierContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        supplier={{
          name: displayName,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=F02801&color=fff&size=128`,
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
