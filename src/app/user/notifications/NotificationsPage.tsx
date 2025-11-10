import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Bell, 
  CheckCircle, 
  Package, 
  MessageSquare, 
  FileText,
  Trash2,
  Check
} from "lucide-react";
import { useState } from "react";

interface NotificationsPageProps {
  onNavigate: (page: string, id?: string) => void;
  onSignupClick?: () => void;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
}

interface Notification {
  id: string;
  type: "quote" | "request" | "message" | "system";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  icon: any;
  iconColor: string;
  bgColor: string;
  actionText?: string;
  actionPage?: string;
}

export function NotificationsPage({
  onNavigate,
  onSignupClick,
  isAuthenticated = true,
  onSignOut,
  onProfileClick,
  onNotificationClick,
  onTrackOrderClick,
}: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "quote",
      title: "New Quote Received",
      description: "AutoParts UK sent you a quote for Brake Pads - £45.99",
      timestamp: "2 hours ago",
      isRead: false,
      icon: FileText,
      iconColor: "text-[#F02801]",
      bgColor: "bg-[#FEF2F2]",
      actionText: "View Quote",
      actionPage: "quotes",
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      description: "Premium Parts Ltd replied to your enquiry",
      timestamp: "5 hours ago",
      isRead: false,
      icon: MessageSquare,
      iconColor: "text-[#3B82F6]",
      bgColor: "bg-[#EFF6FF]",
      actionText: "View Message",
      actionPage: "chat",
    },
    {
      id: "3",
      type: "request",
      title: "Quote Request Confirmed",
      description: "Your request for Engine Oil has been sent to 5 suppliers",
      timestamp: "1 day ago",
      isRead: true,
      icon: CheckCircle,
      iconColor: "text-[#22C55E]",
      bgColor: "bg-[#F0FDF4]",
      actionText: "View Request",
      actionPage: "vehicle-confirmation",
    },
    {
      id: "4",
      type: "quote",
      title: "Quote Received",
      description: "CarCare Direct sent you a quote for Suspension Springs - £89.50",
      timestamp: "1 day ago",
      isRead: true,
      icon: FileText,
      iconColor: "text-[#F02801]",
      bgColor: "bg-[#FEF2F2]",
      actionText: "View Quote",
      actionPage: "quotes",
    },
    {
      id: "5",
      type: "system",
      title: "Parts Available",
      description: "The part you requested is now back in stock",
      timestamp: "2 days ago",
      isRead: true,
      icon: Package,
      iconColor: "text-[#8B5CF6]",
      bgColor: "bg-[#F5F3FF]",
      actionText: "View Products",
      actionPage: "products",
    },
    {
      id: "6",
      type: "message",
      title: "New Message",
      description: "SpeedyParts responded to your question about delivery",
      timestamp: "3 days ago",
      isRead: true,
      icon: MessageSquare,
      iconColor: "text-[#3B82F6]",
      bgColor: "bg-[#EFF6FF]",
      actionText: "View Message",
      actionPage: "chat",
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "read") return notification.isRead;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        onNavigate={onNavigate}
        currentPage="notifications"
        onSignupClick={onSignupClick}
        isAuthenticated={isAuthenticated}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
        onNotificationClick={onNotificationClick}
        onTrackOrderClick={onTrackOrderClick}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-[#F02801] flex items-center justify-center">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <h1 className="font-['Inter'] text-white" style={{ fontSize: "36px" }}>
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <Badge className="bg-[#F02801] text-white" style={{ fontSize: "12px" }}>
                    {unreadCount} New
                  </Badge>
                )}
              </div>
              <p className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: "16px" }}>
                Stay updated with your quotes, messages, and requests
              </p>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={markAllAsRead}
                  className="rounded-lg border-white/20 text-white hover:bg-white/10"
                  style={{ fontSize: "14px" }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="rounded-lg border-white/20 text-white hover:bg-white/10"
                  style={{ fontSize: "14px" }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Content */}
      <div className="flex-1 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="all" className="font-['Roboto']">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="font-['Roboto']">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="read" className="font-['Roboto']">
                Read ({notifications.length - unreadCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-16">
                  <div className="h-20 w-20 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-10 w-10 text-[#94A3B8]" />
                  </div>
                  <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: "20px" }}>
                    No Notifications
                  </h3>
                  <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "15px" }}>
                    {activeTab === "unread" 
                      ? "You're all caught up! No unread notifications."
                      : "You don't have any notifications yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        bg-white border-2 rounded-xl p-4 transition-all duration-300
                        ${notification.isRead 
                          ? 'border-[#E5E7EB] hover:border-[#CBD5E1]' 
                          : 'border-[#F02801]/20 bg-[#FEF2F2]/30 hover:border-[#F02801]/40'}
                      `}
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`h-12 w-12 rounded-lg ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <notification.icon className={`h-5 w-5 ${notification.iconColor}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <h3 className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "15px" }}>
                              {notification.title}
                              {!notification.isRead && (
                                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#F02801]"></span>
                              )}
                            </h3>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-[#94A3B8] hover:text-[#F02801] transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <p className="font-['Roboto'] text-[#64748B] mb-2" style={{ fontSize: "14px" }}>
                            {notification.description}
                          </p>
                          
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <span className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: "13px" }}>
                              {notification.timestamp}
                            </span>
                            
                            <div className="flex gap-2">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 rounded-lg font-['Roboto']"
                                  style={{ fontSize: "13px" }}
                                >
                                  <Check className="h-3.5 w-3.5 mr-1.5" />
                                  Mark as Read
                                </Button>
                              )}
                              {notification.actionText && notification.actionPage && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (!notification.isRead) {
                                      markAsRead(notification.id);
                                    }
                                    onNavigate(notification.actionPage!);
                                  }}
                                  className="h-8 rounded-lg bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']"
                                  style={{ fontSize: "13px" }}
                                >
                                  {notification.actionText}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
