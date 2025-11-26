import { useState } from "react";
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

export function ChatPage({ onNavigate, conversation }: ChatPageProps) {
  const [message, setMessage] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  const currentConversation = conversation ?? FALLBACK_CONVERSATION;

  const messages = [
    {
      id: "1",
      content:
        "Hello! I've received your quote request for front brake pads. I have the part in stock.",
      timestamp: new Date(2025, 8, 30, 10, 0),
      sent: false,
    },
    {
      id: "2",
      content: "Great! How much would it cost including fitting?",
      timestamp: new Date(2025, 8, 30, 10, 5),
      sent: true,
      read: true,
    },
    {
      id: "3",
      content:
        "The brake pads are £125.99 and fitting would be an additional £45. Total £170.99. I can do it tomorrow if that works for you?",
      timestamp: new Date(2025, 8, 30, 10, 8),
      sent: false,
    },
    {
      id: "4",
      content: "That sounds good. What time tomorrow?",
      timestamp: new Date(2025, 8, 30, 10, 12),
      sent: true,
      read: true,
    },
    {
      id: "5",
      content: "I have availability at 9am, 11am, or 2pm. Which works best for you?",
      timestamp: new Date(2025, 8, 30, 10, 15),
      sent: false,
    },
    {
      id: "6",
      content: "11am would be perfect, thanks!",
      timestamp: new Date(2025, 8, 30, 10, 18),
      sent: true,
      read: true,
    },
    {
      id: "7",
      content:
        "Excellent! I've booked you in for 11am tomorrow. Here's our address and what to bring:",
      timestamp: new Date(2025, 8, 30, 10, 20),
      sent: false,
      attachments: [
        {
          type: "document" as const,
          name: "booking-confirmation.pdf",
          url: "#",
        },
      ],
    },
    {
      id: "8",
      content: "The part is ready for collection",
      timestamp: new Date(2025, 8, 30, 14, 30),
      sent: false,
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
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
                {currentConversation.supplierName[0]}
              </AvatarFallback>
            </Avatar>
            {currentConversation.online && (
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-background" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{currentConversation.supplierName}</h2>
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

      <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
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
          name: currentConversation.supplierName,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentConversation.supplierName)}&background=F02801&color=fff&size=128`,
          phone: "+44 20 7946 0958",
          email: `contact@${currentConversation.supplierName
            .toLowerCase()
            .replace(/\s+/g, "")}.co.uk`,
          location: "Birmingham, West Midlands",
          address: "Unit 12, Industrial Estate, Birmingham B5 7RG",
        }}
      />

      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        supplierName={currentConversation.supplierName}
        onSubmit={(rating, feedback) => {
          console.log("Rating submitted:", rating, feedback);
        }}
      />
    </div>
  );
}
