import { useState } from "react";
import { BackButton } from "@/components/back-button";
import { ChatBubble, TypingIndicator } from "@/components/chat-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Paperclip,
  Phone,
  MapPin,
  Star,
  ArrowLeft,
  MoreVertical,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { SupplierContactDialog } from "@/components/supplier-contact-dialog";
import { RatingDialog } from "@/components/rating-dialog";

interface ChatPageProps {
  onNavigate: (page: string, supplierId?: string) => void;
  onBack?: () => void;
  supplierId: string | null;
  quoteId?: string | null;
}

export function ChatPage({ onNavigate, onBack, supplierId }: ChatPageProps) {
  const [message, setMessage] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  // Mock conversations
  const conversations = [
    {
      id: "1",
      supplierName: "AutoParts Direct",
      lastMessage: "The part is ready for collection",
      timestamp: new Date(2025, 8, 30, 14, 30),
      unread: 2,
      online: true,
      rating: 4.8,
    },
    {
      id: "2",
      supplierName: "Midlands Motor Parts",
      lastMessage: "I can deliver tomorrow morning",
      timestamp: new Date(2025, 8, 30, 12, 15),
      unread: 0,
      online: false,
      rating: 4.9,
    },
    {
      id: "3",
      supplierName: "Quick Fix Parts",
      lastMessage: "What's your preferred delivery time?",
      timestamp: new Date(2025, 8, 29, 16, 45),
      unread: 0,
      online: true,
      rating: 4.7,
    },
  ];

  const currentConversation = conversations.find((c) => c.id === supplierId) || conversations[0];

  // Mock messages
  const messages = [
    {
      id: "1",
      content: "Hello! I've received your quote request for front brake pads. I have the part in stock.",
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
      content: "The brake pads are £125.99 and fitting would be an additional £45. Total £170.99. I can do it tomorrow if that works for you?",
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
      content: "Excellent! I've booked you in for 11am tomorrow. Here's our address and what to bring:",
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
      // Handle send message
      setMessage("");
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Breadcrumb / Back Button Section */}
      <div className="bg-white border-b border-[#E5E7EB] py-3 px-6">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2">
          <BackButton 
            onBack={onBack || (() => onNavigate("quotes"))} 
            label="Back to Quotes"
          />
          <ChevronRight className="h-4 w-4 text-[#94A3B8]" />
          <span className="font-['Inter'] font-medium text-[#0F172A]" style={{ fontSize: "14px" }}>
            Messages
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List - Desktop */}
        <div className="hidden lg:block w-80 border-r border-border bg-muted/20">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border",
                  conv.id === supplierId && "bg-muted"
                )}
                onClick={() => onNavigate("chat", conv.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {conv.supplierName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium truncate">{conv.supplierName}</h3>
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

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
            <div className="max-w-[900px] mx-auto">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {showTyping && <TypingIndicator />}
            </div>
          </div>

          {/* Message Input */}
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
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                className="shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Contact Dialog */}
      <SupplierContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        supplier={{
          name: currentConversation.supplierName,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentConversation.supplierName)}&background=F02801&color=fff&size=128`,
          phone: "+44 20 7946 0958",
          email: `contact@${currentConversation.supplierName.toLowerCase().replace(/\s+/g, "")}.co.uk`,
          location: "Birmingham, West Midlands",
          address: "Unit 12, Industrial Estate, Birmingham B5 7RG",
        }}
      />

      {/* Rating Dialog */}
      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        supplierName={currentConversation.supplierName}
        onSubmit={(rating, feedback) => {
          console.log("Rating submitted:", rating, feedback);
          // Handle rating submission (e.g., send to API)
        }}
      />
    </div>
  );
}
