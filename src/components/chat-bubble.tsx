import { cn } from "./ui/utils";
import { Check, CheckCheck, File, Image as ImageIcon } from "lucide-react";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sent: boolean;
  read?: boolean;
  attachments?: Array<{
    type: "image" | "document";
    name: string;
    url: string;
  }>;
}

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={cn("flex gap-2 mb-4", message.sent && "flex-row-reverse")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2.5",
          message.sent
            ? "bg-primary text-white rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}
      >
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-2 mb-2">
            {message.attachments.map((attachment, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  message.sent ? "bg-primary-ink" : "bg-background"
                )}
              >
                {attachment.type === "image" ? (
                  <ImageIcon className="h-4 w-4" />
                ) : (
                  <File className="h-4 w-4" />
                )}
                <span className="text-sm truncate">{attachment.name}</span>
              </div>
            ))}
          </div>
        )}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div
          className={cn(
            "flex items-center gap-1 mt-1 text-xs",
            message.sent ? "text-white/70" : "text-muted-foreground"
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
          {message.sent && (
            <>
              {message.read ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-4">
      <div className="bg-muted text-foreground rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}