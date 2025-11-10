import { Children, useState } from "react";
import { Header } from "../components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

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

export function SupplierLayout({ onNavigate }: SupplierDashboardPageProps) {
  const [activeTab, setActiveTab] = useState("requests");

  const navItems = [
    {
      id: "requests",
      label: "New Requests",
      icon: AlertCircle,
      badge: requests.filter((r) => r.status === "new").length,
    },
    { id: "quotes", label: "My Quotes", icon: Send, badge: sentQuotes.length },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profile & Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header */}
      <Header
        onNavigate={onNavigate}
        currentPage="supplier-dashboard"
        isAuthenticated={true}
      />

      <div className="flex pt-20">
        {/* Left Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? "w-20" : "w-72"
          } bg-[#FFFFFF] min-h-[calc(100vh-5rem)] fixed left-0 top-20 transition-all duration-300 flex flex-col`}
        >
          {/* Logo & Brand */}
          <div className="p-6 border-b border-[#E5E7EB] bg-[#FEF2F2]">
            {!sidebarCollapsed ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div>
                    <h1 className="font-['Inter'] text-[#0F172A]">
                      PartsQuote
                    </h1>
                    <p className="text-xs text-[#475569] font-['Roboto']">
                      Supplier Portal
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center"></div>
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
        <main
          className={`flex-1 ${
            sidebarCollapsed ? "ml-20" : "ml-72"
          } transition-all duration-300`}
        >
          {/* Page Content */}
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default SupplierLayout;
