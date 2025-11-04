import { useState } from "react";
import { Header } from "../components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  TrendingUp,
  Clock,
  MessageSquare,
  DollarSign,
  Send,
  CheckCircle,
  AlertCircle,
  Package,
  Star,
  Car,
  User,
  MapPin,
  Calendar,
  Wrench,
  Hash,
  Bell,
  LogOut,
  Menu,
  Search,
  Settings,
  BarChart3,
  FileText,
  Award,
  XCircle,
  RotateCcw,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SupplierDashboardPageProps {
  onNavigate: (page: string) => void;
}

export function SupplierDashboardPage({ onNavigate }: SupplierDashboardPageProps) {
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("1-2");
  const [showQuoteSentDialog, setShowQuoteSentDialog] = useState(false);
  const [requestsToShow, setRequestsToShow] = useState(2);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedQuoteToView, setSelectedQuoteToView] = useState<any>(null);
  const [showAllMessages, setShowAllMessages] = useState(false);
  
  // Profile form state
  const [businessName, setBusinessName] = useState("AutoParts Direct Ltd");
  const [contactEmail, setContactEmail] = useState("supplier@autoparts.uk");
  const [phoneNumber, setPhoneNumber] = useState("020 1234 5678");
  const [businessAddress, setBusinessAddress] = useState("45 High Street, London, E1 6AN");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  
  // Temporary edit state
  const [editBusinessName, setEditBusinessName] = useState(businessName);
  const [editContactEmail, setEditContactEmail] = useState(contactEmail);
  const [editPhoneNumber, setEditPhoneNumber] = useState(phoneNumber);
  const [editBusinessAddress, setEditBusinessAddress] = useState(businessAddress);
  
  const handleSaveProfile = () => {
    setBusinessName(editBusinessName);
    setContactEmail(editContactEmail);
    setPhoneNumber(editPhoneNumber);
    setBusinessAddress(editBusinessAddress);
    setEditProfileOpen(false);
    toast.success("Profile updated successfully");
  };
  
  const handleOpenEditProfile = () => {
    setEditBusinessName(businessName);
    setEditContactEmail(contactEmail);
    setEditPhoneNumber(phoneNumber);
    setEditBusinessAddress(businessAddress);
    setEditProfileOpen(true);
  };

  // Mock data
  const stats = {
    newRequests: 12,
    quotesSent: 48,
    conversionRate: 32,
    avgResponseTime: "2.4 hours",
  };

  const requests = [
    {
      id: "REQ-001",
      customer: "John Smith",
      vehicle: "2018 Ford Focus 1.0 EcoBoost",
      registration: "AB18 CDE",
      part: "Front Brake Pads",
      details: "Need replacement front brake pads, OEM or equivalent quality",
      distance: 2.3,
      status: "new",
      posted: "25 mins ago",
      timeRemaining: 20,
    },
    {
      id: "REQ-002",
      customer: "Sarah Johnson",
      vehicle: "2020 VW Golf 2.0 TDI",
      registration: "CD20 FGH",
      part: "Alternator",
      details: "Car not charging battery properly, suspect alternator failure",
      distance: 5.1,
      status: "new",
      posted: "1 hour ago",
      timeRemaining: -15,
    },
    {
      id: "REQ-006",
      customer: "James Patterson",
      vehicle: "2019 Honda Civic 1.6 i-DTEC",
      registration: "KL19 RST",
      part: "Timing Belt Kit",
      details: "Due for timing belt replacement, need complete kit with water pump",
      distance: 4.7,
      status: "new",
      posted: "35 mins ago",
      timeRemaining: 10,
    },
    {
      id: "REQ-003",
      customer: "Mike Williams",
      vehicle: "2016 BMW 3 Series 320d",
      registration: "EF16 IJK",
      part: "Engine Mount",
      details: "Excessive vibration, likely engine mount issue",
      distance: 3.8,
      status: "quoted",
      posted: "3 hours ago",
    },
    {
      id: "REQ-004",
      customer: "Emily Thompson",
      vehicle: "2019 Audi A4 2.0 TFSI",
      registration: "GH19 LMN",
      part: "Rear Shock Absorbers",
      details: "Bouncy ride and noise from rear suspension",
      distance: 4.2,
      status: "quoted",
      posted: "45 mins ago",
    },
    {
      id: "REQ-005",
      customer: "David Clark",
      vehicle: "2017 Mercedes C-Class 220d",
      registration: "IJ17 OPQ",
      part: "Starter Motor",
      details: "Car struggles to start, clicking noise when turning key",
      distance: 6.5,
      status: "quoted",
      posted: "2 hours ago",
    },
  ];

  const sentQuotes = [
    {
      id: "Q-001",
      requestId: "REQ-003",
      customer: "Mike Williams",
      part: "Engine Mount",
      amount: 145.0,
      status: "pending",
      sentAt: "2 hours ago",
    },
    {
      id: "Q-002",
      requestId: "REQ-004",
      customer: "Emma Davis",
      part: "Fuel Pump",
      amount: 225.0,
      status: "accepted",
      sentAt: "1 day ago",
    },
    {
      id: "Q-003",
      requestId: "REQ-005",
      customer: "Tom Brown",
      part: "Timing Belt Kit",
      amount: 189.0,
      status: "declined",
      sentAt: "2 days ago",
    },
    {
      id: "Q-004",
      requestId: "REQ-007",
      customer: "Sarah Mitchell",
      part: "Radiator",
      amount: 312.0,
      status: "accepted",
      sentAt: "3 days ago",
    },
    {
      id: "Q-005",
      requestId: "REQ-008",
      customer: "James Cooper",
      part: "Clutch Kit",
      amount: 428.0,
      status: "pending",
      sentAt: "4 hours ago",
    },
    {
      id: "Q-006",
      requestId: "REQ-009",
      customer: "Lucy Bennett",
      part: "Headlight Assembly",
      amount: 167.0,
      status: "accepted",
      sentAt: "5 days ago",
    },
    {
      id: "Q-007",
      requestId: "REQ-010",
      customer: "Oliver Harris",
      part: "Turbocharger",
      amount: 895.0,
      status: "pending",
      sentAt: "6 hours ago",
    },
    {
      id: "Q-008",
      requestId: "REQ-011",
      customer: "Hannah Price",
      part: "Suspension Springs",
      amount: 256.0,
      status: "declined",
      sentAt: "1 week ago",
    },
  ];

  // Messages data
  const messages = [
    {
      id: "MSG-001",
      customer: "Emma Wilson",
      customerId: "CUST-001",
      avatar: "EW",
      lastMessage: "Thanks for the quote! When can you deliver the brake pads?",
      timestamp: "2 hours ago",
      unread: 2,
      quoteId: "Q-001",
      part: "Front Brake Pads",
    },
    {
      id: "MSG-002",
      customer: "Sarah Mitchell",
      customerId: "CUST-004",
      avatar: "SM",
      lastMessage: "I've accepted your quote. What's the next step?",
      timestamp: "5 hours ago",
      unread: 1,
      quoteId: "Q-004",
      part: "Radiator",
    },
    {
      id: "MSG-003",
      customer: "James Cooper",
      customerId: "CUST-005",
      avatar: "JC",
      lastMessage: "Can you provide more details about the warranty?",
      timestamp: "Yesterday",
      unread: 0,
      quoteId: "Q-005",
      part: "Clutch Kit",
    },
    {
      id: "MSG-004",
      customer: "Lucy Bennett",
      customerId: "CUST-006",
      avatar: "LB",
      lastMessage: "Order received! Thank you for the quick delivery.",
      timestamp: "2 days ago",
      unread: 0,
      quoteId: "Q-006",
      part: "Headlight Assembly",
    },
    {
      id: "MSG-005",
      customer: "Oliver Harris",
      customerId: "CUST-007",
      avatar: "OH",
      lastMessage: "Is this a genuine or aftermarket turbocharger?",
      timestamp: "3 days ago",
      unread: 3,
      quoteId: "Q-007",
      part: "Turbocharger",
    },
    {
      id: "MSG-006",
      customer: "Tom Brown",
      customerId: "CUST-003",
      avatar: "TB",
      lastMessage: "Sorry, I found a better price elsewhere. Thanks anyway.",
      timestamp: "1 week ago",
      unread: 0,
      quoteId: "Q-003",
      part: "Timing Belt Kit",
    },
    {
      id: "MSG-007",
      customer: "Daniel Roberts",
      customerId: "CUST-008",
      avatar: "DR",
      lastMessage: "Do you offer fitting services or just supply the parts?",
      timestamp: "30 mins ago",
      unread: 1,
      quoteId: "Q-002",
      part: "Exhaust System",
    },
    {
      id: "MSG-008",
      customer: "Sophie Anderson",
      customerId: "CUST-009",
      avatar: "SA",
      lastMessage: "The shock absorbers arrived in perfect condition. Brilliant service!",
      timestamp: "4 days ago",
      unread: 0,
      quoteId: "Q-009",
      part: "Shock Absorbers",
    },
    {
      id: "MSG-009",
      customer: "Michael Davies",
      customerId: "CUST-010",
      avatar: "MD",
      lastMessage: "Could you confirm the part number for the oil filter?",
      timestamp: "1 hour ago",
      unread: 2,
      quoteId: "Q-010",
      part: "Oil Filter",
    },
    {
      id: "MSG-010",
      customer: "Rachel Green",
      customerId: "CUST-011",
      avatar: "RG",
      lastMessage: "Your quote is reasonable. I'll accept it shortly.",
      timestamp: "3 hours ago",
      unread: 1,
      quoteId: "Q-011",
      part: "Windscreen Wipers",
    },
    {
      id: "MSG-011",
      customer: "Peter Jones",
      customerId: "CUST-012",
      avatar: "PJ",
      lastMessage: "Do you have the alternator in stock right now?",
      timestamp: "6 hours ago",
      unread: 0,
      quoteId: "Q-012",
      part: "Alternator",
    },
    {
      id: "MSG-012",
      customer: "Katie Williams",
      customerId: "CUST-013",
      avatar: "KW",
      lastMessage: "Thanks! The spark plugs work perfectly.",
      timestamp: "Yesterday",
      unread: 0,
      quoteId: "Q-013",
      part: "Spark Plugs",
    },
    {
      id: "MSG-013",
      customer: "Andrew Taylor",
      customerId: "CUST-014",
      avatar: "AT",
      lastMessage: "Can you match a competitor's price for the same battery?",
      timestamp: "2 days ago",
      unread: 1,
      quoteId: "Q-014",
      part: "Car Battery",
    },
    {
      id: "MSG-014",
      customer: "Jennifer Clark",
      customerId: "CUST-015",
      avatar: "JC",
      lastMessage: "I need this urgently. How fast can you deliver?",
      timestamp: "3 days ago",
      unread: 3,
      quoteId: "Q-015",
      part: "Fuel Pump",
    },
    {
      id: "MSG-015",
      customer: "Robert Smith",
      customerId: "CUST-016",
      avatar: "RS",
      lastMessage: "The air filter quality exceeded my expectations!",
      timestamp: "5 days ago",
      unread: 0,
      quoteId: "Q-016",
      part: "Air Filter",
    },
    {
      id: "MSG-016",
      customer: "Helen Parker",
      customerId: "CUST-017",
      avatar: "HP",
      lastMessage: "Is installation included in the quoted price?",
      timestamp: "1 week ago",
      unread: 0,
      quoteId: "Q-017",
      part: "Serpentine Belt",
    },
    {
      id: "MSG-017",
      customer: "George Miller",
      customerId: "CUST-018",
      avatar: "GM",
      lastMessage: "Could you send photos of the actual part before I commit?",
      timestamp: "1 week ago",
      unread: 2,
      quoteId: "Q-018",
      part: "Catalytic Converter",
    },
    {
      id: "MSG-018",
      customer: "Amanda Hughes",
      customerId: "CUST-019",
      avatar: "AH",
      lastMessage: "Brilliant communication throughout. Highly recommend!",
      timestamp: "2 weeks ago",
      unread: 0,
      quoteId: "Q-019",
      part: "Wheel Bearings",
    },
    {
      id: "MSG-019",
      customer: "Christopher Lee",
      customerId: "CUST-020",
      avatar: "CL",
      lastMessage: "Are these brake discs compatible with my 2018 model?",
      timestamp: "2 weeks ago",
      unread: 1,
      quoteId: "Q-020",
      part: "Brake Discs",
    },
    {
      id: "MSG-020",
      customer: "Victoria White",
      customerId: "CUST-021",
      avatar: "VW",
      lastMessage: "The steering rack was perfect. Thank you so much!",
      timestamp: "3 weeks ago",
      unread: 0,
      quoteId: "Q-021",
      part: "Steering Rack",
    },
    {
      id: "MSG-021",
      customer: "Benjamin Scott",
      customerId: "CUST-022",
      avatar: "BS",
      lastMessage: "I've changed my mind. Can I cancel my order?",
      timestamp: "3 weeks ago",
      unread: 0,
      quoteId: "Q-022",
      part: "Engine Mount",
    },
    {
      id: "MSG-022",
      customer: "Charlotte Evans",
      customerId: "CUST-023",
      avatar: "CE",
      lastMessage: "Your prices are very competitive. I'll be ordering soon.",
      timestamp: "1 month ago",
      unread: 0,
      quoteId: "Q-023",
      part: "Thermostat",
    },
  ];

  // Chart data
  const quotePerformance = [
    { month: "Jan", sent: 35, accepted: 22, revenue: 3420 },
    { month: "Feb", sent: 42, accepted: 28, revenue: 4150 },
    { month: "Mar", sent: 38, accepted: 24, revenue: 3890 },
    { month: "Apr", sent: 45, accepted: 31, revenue: 4620 },
    { month: "May", sent: 52, accepted: 35, revenue: 5240 },
    { month: "Jun", sent: 48, accepted: 32, revenue: 4980 },
  ];

  const categoryBreakdown = [
    { category: "Engine", quotes: 24, avgPrice: 485 },
    { category: "Brakes", quotes: 18, avgPrice: 215 },
    { category: "Suspension", quotes: 15, avgPrice: 345 },
    { category: "Electrical", quotes: 12, avgPrice: 178 },
    { category: "Bodywork", quotes: 9, avgPrice: 520 },
  ];

  const handleSendQuote = () => {
    if (!quoteAmount || parseFloat(quoteAmount) <= 0) {
      toast.error("Please enter a valid quote amount");
      return;
    }

    setShowQuoteSentDialog(true);
    setSelectedRequest(null);
    setQuoteAmount("");
    setQuoteNotes("");
    setDeliveryTime("1-2");
  };

  const getStatusBadge = (quote: any) => {
    const status = quote.status;
    const variants: Record<string, { className: string; label: string }> = {
      new: { className: "bg-[#3B82F6] text-white border-0 shadow-sm font-['Roboto']", label: "New" },
      quoted: { className: "bg-[#F59E0B] text-white border-0 shadow-sm font-['Roboto']", label: "Quoted" },
      pending: { className: "bg-[#F59E0B] text-white border-0 shadow-sm font-['Roboto']", label: "Pending" },
      accepted: { className: "bg-[#22C55E] text-white border-0 shadow-sm font-['Roboto']", label: "Accepted" },
      declined: { className: "bg-[#F02801] text-white border-0 shadow-sm font-['Roboto']", label: "Declined" },
    };

    const config = variants[status] || variants.new;
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F02801] focus-visible:ring-offset-2 rounded-lg">
            <Badge className={`${config.className} px-4 py-1.5 cursor-pointer hover:opacity-90`}>
              {config.label}
            </Badge>
          </button>
        </DialogTrigger>
        <DialogContent className="border border-[#E5E7EB] shadow-lg max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Quote Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              Complete information about this quote
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Status and ID */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Status</p>
                <Badge className={`${config.className} px-4 py-1.5`}>
                  {config.label}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Quote ID</p>
                <p className="font-['Inter'] text-[#0F172A]">{quote.id}</p>
              </div>
            </div>

            <Separator className="bg-[#E5E7EB]" />

            {/* Quote Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {quote.customer && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Customer</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{quote.customer}</p>
                </div>
              )}

              {quote.part && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Part Requested</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{quote.part}</p>
                </div>
              )}

              {quote.amount && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Quote Amount</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">£{quote.amount.toFixed(2)}</p>
                </div>
              )}

              {quote.sentAt && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Sent</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{quote.sentAt}</p>
                </div>
              )}

              {quote.requestId && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Request ID</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{quote.requestId}</p>
                </div>
              )}
            </div>

            <Separator className="bg-[#E5E7EB]" />

            {/* Status Change Buttons */}
            <div>
              <p className="text-sm text-[#475569] font-['Roboto'] mb-3">Update Quote Status</p>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto'] rounded-xl shadow-sm"
                  onClick={() => {
                    toast.success('Quote marked as Accepted');
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accepted
                </Button>
                
                <Button
                  className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-white font-['Roboto'] rounded-xl shadow-sm"
                  onClick={() => {
                    toast.success('Quote marked as Pending');
                  }}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </Button>

                <Button
                  className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-xl shadow-sm"
                  onClick={() => {
                    toast.success('Quote marked as Declined');
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Declined
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const navItems = [
    { id: "requests", label: "New Requests", icon: AlertCircle, badge: requests.filter(r => r.status === "new").length },
    { id: "quotes", label: "My Quotes", icon: Send, badge: sentQuotes.length },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profile & Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header */}
      <Header onNavigate={onNavigate} currentPage="supplier-dashboard" isAuthenticated={true} />
      
      <div className="flex pt-20">
        {/* Left Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-[#FFFFFF] min-h-[calc(100vh-5rem)] fixed left-0 top-20 transition-all duration-300 flex flex-col`}>
        {/* Logo & Brand */}
        <div className="p-6 border-b border-[#E5E7EB] bg-[#FEF2F2]">
          {!sidebarCollapsed ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div>
                  <h1 className="font-['Inter'] text-[#0F172A]">PartsQuote</h1>
                  <p className="text-xs text-[#475569] font-['Roboto']">Supplier Portal</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 bg-[#FEF2F2]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-['Roboto'] ${
                  isActive
                    ? "bg-[#F02801] text-white shadow-md"
                    : "text-[#475569] hover:bg-[#F1F5F9]"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge className="bg-[#F59E0B] text-white hover:bg-[#F59E0B] border-0 h-5 min-w-[20px] px-1.5 flex items-center justify-center font-['Roboto'] text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

        {/* Main Content Area */}
        <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-72'} transition-all duration-300`}>
          {/* Page Content */}
          <div className="p-6">
          {/* New Requests Tab */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              {/* Page Title */}
              <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEE2E2] to-[#FFFFFF]">
                <CardContent className="p-6">
                  <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl font-bold">Dashboard Overview</h1>
                  <p className="text-[#475569] font-['Roboto']">Track your performance and manage incoming requests</p>
                </CardContent>
              </Card>

              {/* KPI Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-10 w-10 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-[#2563EB]" strokeWidth={2} />
                      </div>
                      <Badge className="bg-[#F1F5F9] text-[#475569] hover:bg-[#F1F5F9] border-0 font-['Roboto'] px-2.5 py-1">
                        <TrendingUp className="h-3.5 w-3.5 mr-1" />
                        +18%
                      </Badge>
                    </div>
                    <p className="text-[#475569] font-['Roboto'] mb-1.5">New Requests</p>
                    <p className="text-2xl font-['Inter'] text-[#0F172A]">{stats.newRequests}</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-10 w-10 rounded-xl bg-[#22C55E]/15 flex items-center justify-center">
                        <Send className="h-8 w-8 text-[#16A34A]" strokeWidth={2} />
                      </div>
                      <Badge className="bg-[#F1F5F9] text-[#475569] hover:bg-[#F1F5F9] border-0 font-['Roboto'] px-2.5 py-1">
                        This month
                      </Badge>
                    </div>
                    <p className="text-[#475569] font-['Roboto'] mb-1.5">Quotes Sent</p>
                    <p className="text-2xl font-['Inter'] text-[#0F172A]">{stats.quotesSent}</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-10 w-10 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-[#D97706]" strokeWidth={2} />
                      </div>
                      <Badge className="bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] border-0 font-['Roboto'] px-2.5 py-1">
                        <TrendingUp className="h-3.5 w-3.5 mr-1" />
                        +4%
                      </Badge>
                    </div>
                    <p className="text-[#475569] font-['Roboto'] mb-1.5">Conversion Rate</p>
                    <p className="text-2xl font-['Inter'] text-[#0F172A]">{stats.conversionRate}%</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-10 w-10 rounded-xl bg-[#F02801]/15 flex items-center justify-center">
                        <Clock className="h-8 w-8 text-[#F02801]" strokeWidth={2} />
                      </div>
                      <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-0 font-['Roboto'] px-2.5 py-1">
                        Below target
                      </Badge>
                    </div>
                    <p className="text-[#475569] font-['Roboto'] mb-1.5">Avg. Response</p>
                    <p className="text-2xl font-['Inter'] text-[#0F172A]">{stats.avgResponseTime}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Request Cards Grid */}
              <Card className="border border-[#E5E7EB] shadow-sm">
                <CardHeader>
                  <CardTitle className="font-['Inter'] text-[#0F172A]">New Requests</CardTitle>
                  <CardDescription className="font-['Roboto'] text-[#475569]">
                    {requests.filter(r => r.status === "new").length} new part requests from customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.filter(request => request.status === "new").slice(0, requestsToShow).map((request) => (
                  <Card key={request.id} className="border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white">
                    <CardContent className="p-4">
                      {/* Time Remaining Alert */}
                      <div className={`mb-4 flex items-center justify-between p-2 rounded-lg border ${
                        request.timeRemaining <= 0 
                          ? 'bg-[#FEE2E2] border-[#F02801]/30' 
                          : request.timeRemaining <= 10 
                          ? 'bg-[#FEF3C7] border-[#F59E0B]/30' 
                          : 'bg-[#DCFCE7] border-[#22C55E]/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Clock className={`h-4 w-4 ${
                            request.timeRemaining <= 0 
                              ? 'text-[#F02801]' 
                              : request.timeRemaining <= 10 
                              ? 'text-[#F59E0B]' 
                              : 'text-[#22C55E]'
                          }`} />
                          <span className={`text-xs font-['Roboto'] ${
                            request.timeRemaining <= 0 
                              ? 'text-[#7F1D1D]' 
                              : request.timeRemaining <= 10 
                              ? 'text-[#92400E]' 
                              : 'text-[#166534]'
                          }`}>
                            {request.timeRemaining <= 0 
                              ? `Expired ${Math.abs(request.timeRemaining)} mins ago` 
                              : `${request.timeRemaining} mins left`}
                          </span>
                        </div>
                      </div>

                      {/* Header with Status and ID */}
                      <div className="flex items-start justify-between mb-4">
                        {getStatusBadge(request.status)}
                        <div className="text-right">
                          <p className="text-xs text-[#475569] font-['Roboto'] mb-0.5">Request ID</p>
                          <p className="text-sm font-['Inter'] text-[#0F172A]">{request.id}</p>
                        </div>
                      </div>

                      {/* Part Details */}
                      <div className="mb-4">
                        <div className="mb-3 p-3 bg-[#FEE2E2] rounded-lg border border-[#F02801]/20">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="h-7 w-7 rounded-lg bg-[#F02801] flex items-center justify-center shadow-sm">
                              <Wrench className="h-3.5 w-3.5 text-white" />
                            </div>
                            <p className="text-xs text-[#7F1D1D] font-['Roboto'] uppercase tracking-wide">
                              Part Requested
                            </p>
                          </div>
                          <p className="text-sm font-['Roboto'] text-[#0F172A] pl-9">{request.part}</p>
                        </div>
                        
                        {/* Vehicle Info */}
                        <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                          <div className="flex items-start gap-2">
                            <div className="h-7 w-7 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-sm flex-shrink-0">
                              <Car className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-[#475569] font-['Roboto'] mb-1 uppercase tracking-wide">For Vehicle</p>
                              <p className="text-sm font-['Roboto'] text-[#0F172A]">{request.vehicle}</p>
                              <p className="text-xs text-[#475569] font-['Roboto'] mt-0.5">{request.registration}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Secondary Details Grid */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 p-2.5 bg-[#FEF3C7]/30 rounded-lg border border-[#FEF3C7]">
                          <div className="h-7 w-7 rounded-lg bg-[#F59E0B] flex items-center justify-center shadow-sm flex-shrink-0">
                            <User className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#92400E] font-['Roboto'] mb-0.5">Customer</p>
                            <p className="font-['Roboto'] text-[#0F172A] text-xs truncate">{request.customer}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 p-2.5 bg-[#DCFCE7]/30 rounded-lg border border-[#DCFCE7]">
                            <div className="h-7 w-7 rounded-lg bg-[#22C55E] flex items-center justify-center shadow-sm flex-shrink-0">
                              <MapPin className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[#166534] font-['Roboto'] mb-0.5">Distance</p>
                              <p className="font-['Roboto'] text-[#0F172A] text-xs">{request.distance} mi</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-2.5 bg-[#E0E7FF]/30 rounded-lg border border-[#E0E7FF]">
                            <div className="h-7 w-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center shadow-sm flex-shrink-0">
                              <Calendar className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[#5B21B6] font-['Roboto'] mb-0.5">Posted</p>
                              <p className="font-['Roboto'] text-[#0F172A] text-xs">{request.posted}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full py-5" onClick={() => setSelectedRequest(request)}>
                              <Send className="h-4 w-4 mr-1" />
                              Quote
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg border border-[#E5E7EB]">
                            <DialogHeader>
                              <DialogTitle className="font-['Inter'] text-[#0F172A] text-2xl">Request Details - {request.id}</DialogTitle>
                              <DialogDescription className="font-['Roboto'] text-[#475569]">
                                Review details and submit your quote
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3 py-2">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-[#475569] font-['Roboto']">Customer</Label>
                                  <p className="font-['Roboto'] text-[#0F172A]">{request.customer}</p>
                                </div>
                                <div>
                                  <Label className="text-[#475569] font-['Roboto']">Distance</Label>
                                  <p className="font-['Roboto'] text-[#0F172A]">{request.distance} miles</p>
                                </div>
                                <div>
                                  <Label className="text-[#475569] font-['Roboto']">Vehicle</Label>
                                  <p className="font-['Roboto'] text-[#0F172A]">{request.vehicle}</p>
                                </div>
                                <div>
                                  <Label className="text-[#475569] font-['Roboto']">Registration</Label>
                                  <p className="font-['Roboto'] text-[#0F172A]">{request.registration}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-[#475569] font-['Roboto']">Part Needed</Label>
                                <p className="font-['Roboto'] text-[#0F172A]">{request.part}</p>
                              </div>

                              <div>
                                <Label className="text-[#475569] font-['Roboto']">Additional Details</Label>
                                <p className="font-['Roboto'] text-[#0F172A] text-sm">{request.details}</p>
                              </div>

                              <Separator />

                              <div className="space-y-3">
                                <h4 className="font-['Inter'] text-[#0F172A]">Submit Your Quote</h4>

                                <div className="space-y-1.5">
                                  <Label htmlFor="quoteAmount" className="font-['Roboto'] text-[#475569]">
                                    Quote Amount (£) <span className="text-[#F02801]">*</span>
                                  </Label>
                                  <Input
                                    id="quoteAmount"
                                    type="number"
                                    placeholder="0.00"
                                    value={quoteAmount}
                                    onChange={(e) => setQuoteAmount(e.target.value)}
                                    className="font-['Roboto']"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <Label className="font-['Roboto'] text-[#475569]">
                                    Part Condition <span className="text-[#F02801]">*</span>
                                  </Label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="partCondition"
                                        value="new"
                                        className="w-4 h-4 text-[#F02801] border-[#E5E7EB] focus:ring-[#F02801] focus:ring-2"
                                      />
                                      <span className="font-['Roboto'] text-[#0F172A]">New</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="partCondition"
                                        value="used"
                                        className="w-4 h-4 text-[#F02801] border-[#E5E7EB] focus:ring-[#F02801] focus:ring-2"
                                      />
                                      <span className="font-['Roboto'] text-[#0F172A]">Used</span>
                                    </label>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <Label htmlFor="deliveryTime" className="font-['Roboto'] text-[#475569]">Estimated Delivery</Label>
                                  <select
                                    id="deliveryTime"
                                    className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] bg-white font-['Roboto'] text-[#0F172A]"
                                    value={deliveryTime}
                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                  >
                                    <option value="same-day">Same day</option>
                                    <option value="1-2">1-2 days</option>
                                    <option value="3-5">3-5 days</option>
                                    <option value="1-week">1 week</option>
                                  </select>
                                </div>

                                <div className="space-y-1.5">
                                  <Label htmlFor="quoteNotes" className="font-['Roboto'] text-[#475569]">Additional Notes</Label>
                                  <Textarea
                                    id="quoteNotes"
                                    placeholder="Include warranty details, delivery options, etc."
                                    rows={2}
                                    value={quoteNotes}
                                    onChange={(e) => setQuoteNotes(e.target.value)}
                                    className="font-['Roboto']"
                                  />
                                </div>
                              </div>
                            </div>

                            <DialogFooter>
                              <Button variant="outline" onClick={() => { setSelectedRequest(null); }} className="font-['Roboto'] rounded-full">
                                Cancel
                              </Button>
                              <Button onClick={handleSendQuote} className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full">
                                <Send className="h-4 w-4 mr-2" />
                                Send Quote
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Load More Button */}
              {requests.filter(request => request.status === "new").length > requestsToShow && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => setRequestsToShow(prev => prev + 2)}
                    className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-['Roboto']"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Show More
                  </Button>
                </div>
              )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* My Quotes Tab */}
          {activeTab === "quotes" && (
            <div className="space-y-6">
              {/* Page Title */}
              <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]">
                <CardContent className="p-6">
                  <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">My Quotes</h1>
                  <p className="text-[#475569] font-['Roboto']">Track your submitted quotes and their status</p>
                </CardContent>
              </Card>

              {/* Quotes Table */}
              <Card className="border border-[#E5E7EB] shadow-sm">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#E5E7EB] hover:bg-transparent">
                        <TableHead className="font-['Inter'] text-[#0F172A]">Sent</TableHead>
                        <TableHead className="font-['Inter'] text-[#0F172A]">Quote ID</TableHead>
                        <TableHead className="font-['Inter'] text-[#0F172A]">Customer</TableHead>
                        <TableHead className="font-['Inter'] text-[#0F172A]">Part</TableHead>
                        <TableHead className="font-['Inter'] text-[#0F172A]">Amount</TableHead>
                        <TableHead className="font-['Inter'] text-[#0F172A]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sentQuotes.map((quote) => (
                        <TableRow 
                          key={quote.id} 
                          className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer"
                          onClick={() => setSelectedQuoteToView(quote)}
                        >
                          <TableCell className="font-['Roboto'] text-[#475569]">{quote.sentAt}</TableCell>
                          <TableCell className="font-['Roboto'] text-[#0F172A]">{quote.id}</TableCell>
                          <TableCell className="font-['Roboto'] text-[#475569]">{quote.customer}</TableCell>
                          <TableCell className="font-['Roboto'] text-[#475569]">{quote.part}</TableCell>
                          <TableCell className="font-['Roboto'] text-[#0F172A]">£{quote.amount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(quote)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Page Title */}
              <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FFFFFF]">
                <CardContent className="p-6">
                  <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">Analytics</h1>
                  <p className="text-[#475569] font-['Roboto']">Track your performance and business metrics</p>
                </CardContent>
              </Card>

              {/* Charts Row */}
              <Card className="border border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="font-['Inter'] text-[#0F172A]">Quote Performance</CardTitle>
                  <CardDescription className="font-['Roboto'] text-[#475569]">Monthly quotes and acceptance rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={quotePerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#94A3B8" 
                        style={{ fontFamily: 'Roboto', fontSize: '12px' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#94A3B8" 
                        style={{ fontFamily: 'Roboto', fontSize: '12px' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E5E7EB', 
                          borderRadius: '12px',
                          fontFamily: 'Roboto',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }} 
                      />
                      <Legend wrapperStyle={{ fontFamily: 'Roboto', fontSize: '14px', paddingTop: '16px' }} />
                      <Line type="monotone" dataKey="sent" stroke="#F02801" strokeWidth={3} name="Quotes Sent" dot={{ fill: '#F02801', r: 4 }} />
                      <Line type="monotone" dataKey="accepted" stroke="#22C55E" strokeWidth={3} name="Accepted" dot={{ fill: '#22C55E', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card className="border border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="font-['Inter'] text-[#0F172A]">Category Performance</CardTitle>
                  <CardDescription className="font-['Roboto'] text-[#475569]">Your quotes by part category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {categoryBreakdown.map((cat) => {
                      const maxQuotes = Math.max(...categoryBreakdown.map(c => c.quotes));
                      const percentage = (cat.quotes / maxQuotes) * 100;
                      return (
                        <div key={cat.category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-['Roboto'] text-[#0F172A]">{cat.category}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-[#475569] font-['Roboto']">{cat.quotes} quotes</span>
                              <span className="text-sm text-[#0F172A] font-['Roboto'] min-w-[60px] text-right">£{cat.avgPrice} avg</span>
                            </div>
                          </div>
                          <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#F02801] rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              {/* Page Title */}
              <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FFFFFF]">
                <CardContent className="p-6">
                  <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">Messages</h1>
                  <p className="text-[#475569] font-['Roboto']">Communicate with your customers</p>
                </CardContent>
              </Card>

              <Card className="border border-[#E5E7EB] shadow-sm">
                <CardContent className="p-0">
                  {messages.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="h-16 w-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-[#475569]" />
                      </div>
                      <h3 className="font-['Inter'] text-[#0F172A] mb-2">No messages yet</h3>
                      <p className="text-[#475569] font-['Roboto']">You'll see customer messages here once you start quoting</p>
                    </div>
                  ) : (
                    <>
                      <div className="divide-y divide-[#E5E7EB]">
                        {(showAllMessages ? messages : messages.slice(0, 8)).map((message) => (
                          <div
                            key={message.id}
                            onClick={() => onNavigate('chat')}
                            className="p-2 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {/* Avatar */}
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-sm">
                                <span className="text-white font-['Inter'] text-xs">{message.avatar}</span>
                              </div>

                              {/* Message Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="font-['Inter'] text-[#0F172A]">{message.customer}</h4>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {message.unread > 0 && (
                                      <Badge className="bg-[#F02801] text-white border-0 shadow-sm font-['Roboto'] px-1.5 py-0 text-xs">
                                        {message.unread}
                                      </Badge>
                                    )}
                                    <span className="text-xs text-[#475569] font-['Roboto'] whitespace-nowrap">{message.timestamp}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-[#475569] font-['Roboto'] line-clamp-1">{message.lastMessage}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {messages.length > 8 && (
                        <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC]">
                          <Button
                            onClick={() => setShowAllMessages(!showAllMessages)}
                            variant="ghost"
                            className="w-full text-[#F02801] hover:text-[#D22301] hover:bg-white font-['Roboto']"
                          >
                            {showAllMessages ? 'Show Less' : `Show More (${messages.length - 8} more)`}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile & Settings Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Page Title */}
              <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FFFFFF]">
                <CardContent className="p-6">
                  <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">Profile & Settings</h1>
                  <p className="text-[#475569] font-['Roboto']">Manage your business profile and preferences</p>
                </CardContent>
              </Card>

              <Card className="border border-[#E5E7EB] shadow-sm">
                <CardHeader className="border-b border-[#E5E7EB]">
                  <CardTitle className="font-['Inter'] text-[#0F172A]">Business Information</CardTitle>
                  <CardDescription className="font-['Roboto'] text-[#475569]">Update your supplier profile details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-['Roboto'] text-[#475569]">Business Name</Label>
                        <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="font-['Roboto']" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-['Roboto'] text-[#475569]">Contact Email</Label>
                        <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="font-['Roboto']" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-['Roboto'] text-[#475569]">Phone Number</Label>
                        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="font-['Roboto']" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-['Roboto'] text-[#475569]">Business Address</Label>
                        <Input value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} className="font-['Roboto']" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']"
                            onClick={handleOpenEditProfile}
                          >
                            Save Changes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="font-['Inter'] text-[#0F172A]">Edit Business Information</DialogTitle>
                            <DialogDescription className="font-['Roboto'] text-[#475569]">
                              Update your supplier profile details. Click save when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-business-name" className="font-['Roboto'] text-[#475569]">Business Name</Label>
                                <Input 
                                  id="edit-business-name"
                                  value={editBusinessName} 
                                  onChange={(e) => setEditBusinessName(e.target.value)} 
                                  className="font-['Roboto']" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-email" className="font-['Roboto'] text-[#475569]">Contact Email</Label>
                                <Input 
                                  id="edit-email"
                                  type="email"
                                  value={editContactEmail} 
                                  onChange={(e) => setEditContactEmail(e.target.value)} 
                                  className="font-['Roboto']" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-phone" className="font-['Roboto'] text-[#475569]">Phone Number</Label>
                                <Input 
                                  id="edit-phone"
                                  type="tel"
                                  value={editPhoneNumber} 
                                  onChange={(e) => setEditPhoneNumber(e.target.value)} 
                                  className="font-['Roboto']" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-address" className="font-['Roboto'] text-[#475569]">Business Address</Label>
                                <Input 
                                  id="edit-address"
                                  value={editBusinessAddress} 
                                  onChange={(e) => setEditBusinessAddress(e.target.value)} 
                                  className="font-['Roboto']" 
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditProfileOpen(false)}
                              className="font-['Roboto'] border-[#E5E7EB] hover:bg-[#F1F5F9]"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSaveProfile}
                              className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']"
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#E5E7EB] shadow-sm">
                <CardHeader className="border-b border-[#E5E7EB]">
                  <CardTitle className="font-['Inter'] text-[#0F172A]">Performance Stats</CardTitle>
                  <CardDescription className="font-['Roboto'] text-[#475569]">Your supplier ratings and metrics</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-[#1E293B] rounded-xl border border-[#334155]">
                      <div className="h-12 w-12 rounded-full bg-[#92400E] flex items-center justify-center mx-auto mb-3">
                        <Star className="h-6 w-6 text-[#FCD34D]" />
                      </div>
                      <p className="font-['Inter'] text-[#F8FAFC] mb-1">4.8</p>
                      <p className="text-sm text-[#94A3B8] font-['Roboto']">Average Rating</p>
                    </div>
                    <div className="text-center p-6 bg-[#1E293B] rounded-xl border border-[#334155]">
                      <div className="h-12 w-12 rounded-full bg-[#065F46] flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-6 w-6 text-[#34D399]" />
                      </div>
                      <p className="font-['Inter'] text-[#F8FAFC] mb-1">234</p>
                      <p className="text-sm text-[#94A3B8] font-['Roboto']">Total Quotes</p>
                    </div>
                    <div className="text-center p-6 bg-[#1E293B] rounded-xl border border-[#334155]">
                      <div className="h-12 w-12 rounded-full bg-[#7F1D1D] flex items-center justify-center mx-auto mb-3">
                        <Award className="h-6 w-6 text-[#FCA5A5]" />
                      </div>
                      <p className="font-['Inter'] text-[#F8FAFC] mb-1">Active</p>
                      <p className="text-sm text-[#94A3B8] font-['Roboto']">Account Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        </main>
      </div>

      {/* Quote Sent Success Dialog */}
      <AlertDialog open={showQuoteSentDialog} onOpenChange={setShowQuoteSentDialog}>
        <AlertDialogContent className="border border-[#E5E7EB] shadow-lg max-w-md">
          <AlertDialogHeader>
            {/* Success Icon with Animation */}
            <div className="relative mx-auto mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] flex items-center justify-center shadow-lg">
                <CheckCircle className="h-10 w-10 text-[#22C55E]" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 h-20 w-20 rounded-full bg-[#22C55E] opacity-20 animate-ping"></div>
            </div>
            
            {/* Title */}
            <AlertDialogTitle className="font-['Inter'] text-[#0F172A] text-center text-2xl mb-3">
              Quote Sent Successfully!
            </AlertDialogTitle>
            
            {/* Description */}
            <AlertDialogDescription className="font-['Roboto'] text-[#475569] text-center leading-relaxed">
              Your quote has been sent to the customer. You'll receive a notification when they respond or accept your quote.
            </AlertDialogDescription>

            {/* Additional Info Card */}
            <div className="mt-6 p-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-[#F02801] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Roboto'] text-[#0F172A] mb-1">Stay Updated</p>
                  <p className="text-sm text-[#475569] font-['Roboto']">
                    Track this quote in the "My Quotes" section and check your notifications for updates.
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] w-full py-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quote Details Dialog */}
      <Dialog open={!!selectedQuoteToView} onOpenChange={(open) => !open && setSelectedQuoteToView(null)}>
        <DialogContent className="border border-[#E5E7EB] shadow-lg max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Quote Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View complete information about this quote
            </DialogDescription>
          </DialogHeader>

          {selectedQuoteToView && (
            <div className="space-y-6 mt-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Status</p>
                  {getStatusBadge(selectedQuoteToView)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Quote ID</p>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedQuoteToView.id}</p>
                </div>
              </div>

              <Separator className="bg-[#E5E7EB]" />

              {/* Quote Information Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Customer</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedQuoteToView.customer}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Part Requested</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedQuoteToView.part}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Quote Amount</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">£{selectedQuoteToView.amount.toFixed(2)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Sent</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedQuoteToView.sentAt}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-[#F02801]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Request ID</p>
                  </div>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedQuoteToView.requestId}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-xl shadow-sm"
                  onClick={() => {
                    onNavigate('chat');
                    setSelectedQuoteToView(null);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Customer
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#0F172A] font-['Roboto'] rounded-xl hover:bg-[#F8FAFC]"
                  onClick={() => setSelectedQuoteToView(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupplierDashboardPage;
