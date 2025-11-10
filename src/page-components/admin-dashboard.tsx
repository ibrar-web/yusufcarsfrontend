import { useState } from "react";
import { Header } from "../components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import {
  Users,
  Building2,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileText,
  Award,
  Activity,
  ShoppingCart,
  LayoutDashboard,
  FileWarning,
  Search,
  MessageSquare,
  Eye,
  Trash2,
} from "lucide-react";
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
import {
  adminAbuseReports,
  adminCategoryData,
  adminInquiries,
  adminPendingSuppliers,
  adminRevenueData,
  adminStats,
  adminSuppliers,
  adminUsers,
  adminWeeklyData,
} from "@/page-components/admin-dashboard-data";

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalSuccessDialogOpen, setApprovalSuccessDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [userDetailsDialogOpen, setUserDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [reportReviewDialogOpen, setReportReviewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showAllSuppliers, setShowAllSuppliers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [supplierDetailsDialogOpen, setSupplierDetailsDialogOpen] = useState(false);
  const [selectedActiveSupplier, setSelectedActiveSupplier] = useState<any>(null);
  const [confirmUserActionDialogOpen, setConfirmUserActionDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [inquiryDetailsDialogOpen, setInquiryDetailsDialogOpen] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "unread" | "read">("all");
  const [emailSentDialogOpen, setEmailSentDialogOpen] = useState(false);

  const stats = adminStats;

  const [allUsers, setAllUsers] = useState(adminUsers);

  const [allSuppliers] = useState(adminSuppliers);

  const pendingSuppliers = adminPendingSuppliers;

  const abuseReports = adminAbuseReports;

  const weeklyData = adminWeeklyData;

  const categoryData = adminCategoryData;

  const revenueData = adminRevenueData;

  const handleToggleUserStatus = (userId: string) => {
    setAllUsers(users => 
      users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" }
          : user
      )
    );
  };

  // Filter users based on search query and status
  const filteredUsers = allUsers.filter(user => {
    // Filter by search query
    const matchesSearch = !userSearch || (() => {
      const searchLower = userSearch.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.location.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower)
      );
    })();
    
    // Filter by status
    const matchesStatus = 
      userStatusFilter === "all" ||
      (userStatusFilter === "active" && user.status === "Active") ||
      (userStatusFilter === "suspended" && user.status === "Suspended");
    
    return matchesSearch && matchesStatus;
  });

  const inquiries = adminInquiries;

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "suppliers", label: "Suppliers", icon: Building2 },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare },
    { id: "reports", label: "Reports", icon: FileWarning },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF3F2] via-white to-[#FEF3F2]">
      <Header onNavigate={onNavigate} currentPage="admin-dashboard" />

      <div className="flex mt-[72px]">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-[#E5E7EB] min-h-[calc(100vh-72px)] bg-gradient-to-b from-[#FEF3F2] to-[#FEE2E2]/50 sticky top-[72px] h-[calc(100vh-72px)]">
          <div className="p-6">
            <h2 className="font-['Inter'] text-[#0F172A] mb-1">Admin Dashboard</h2>
            <p className="text-sm text-[#475569] font-['Roboto']">Platform management</p>
          </div>
          
          <nav className="px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full mb-1 transition-all font-['Roboto'] ${
                    isActive
                      ? "bg-[#F02801] text-white"
                      : "text-[#475569] hover:bg-white/60"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span>{item.label}</span>
                  {item.id === "suppliers" && pendingSuppliers.length > 0 && (
                    <Badge className="ml-auto bg-[#F02801] text-white hover:bg-[#F02801] border-0 h-5 w-5 p-0 flex items-center justify-center font-['Roboto']">
                      {pendingSuppliers.length}
                    </Badge>
                  )}
                  {item.id === "inquiries" && inquiries.filter(i => i.status === "New").length > 0 && (
                    <Badge className="ml-auto border-0 h-5 w-5 p-0 flex items-center justify-center font-['Roboto']">
                      {inquiries.filter(i => i.status === "New").length}
                    </Badge>
                  )}
                  {item.id === "reports" && abuseReports.filter(r => r.status === "Under Review").length > 0 && (
                    <Badge className="ml-auto border-0 h-5 w-5 p-0 flex items-center justify-center font-['Roboto']">
                      {abuseReports.filter(r => r.status === "Under Review").length}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-8 pt-12">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEE2E2] via-[#FEF3F2] to-white border-2 border-[#F02801]/20 p-4 md:p-5 shadow-[0_0_24px_rgba(240,40,1,0.12)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F02801]/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">Overview</h1>
                    <p className="text-base md:text-lg text-[#475569] font-['Roboto']">Platform performance and key metrics</p>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[#FEE2E2] to-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F02801]/10 rounded-full -mr-16 -mt-16" />
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#7F1D1D] mb-1 font-['Roboto'] font-medium">Active Suppliers</p>
                          <p className="text-3xl font-['Inter'] font-bold text-[#0F172A]">{stats.activeSuppliers}</p>
                        </div>
                        <div className="h-14 w-14 rounded-xl bg-[#F02801] flex items-center justify-center shadow-lg shadow-[#F02801]/30">
                          <Building2 className="h-7 w-7 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-sm text-[#22C55E] font-['Roboto'] font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>+12 this month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[#DBEAFE] to-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full -mr-16 -mt-16" />
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#1E40AF] mb-1 font-['Roboto'] font-medium">Total Users</p>
                          <p className="text-3xl font-['Inter'] font-bold text-[#0F172A]">{stats.totalUsers.toLocaleString()}</p>
                        </div>
                        <div className="h-14 w-14 rounded-xl bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
                          <Users className="h-7 w-7 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-sm text-[#22C55E] font-['Roboto'] font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>+234 this month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[#FEF3C7] to-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full -mr-16 -mt-16" />
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#92400E] mb-1 font-['Roboto'] font-medium">Total Quotes</p>
                          <p className="text-3xl font-['Inter'] font-bold text-[#0F172A]">{stats.totalQuotes.toLocaleString()}</p>
                        </div>
                        <div className="h-14 w-14 rounded-xl bg-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#F59E0B]/30">
                          <ShoppingCart className="h-7 w-7 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-sm text-[#22C55E] font-['Roboto'] font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>+89 this month</span>
                      </div>
                    </CardContent>
                  </Card>


                </div>

                {/* Analytics Charts */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-6">
                    <CardTitle className="font-['Inter'] text-[#0F172A]">Platform Activity</CardTitle>
                    <CardDescription className="font-['Roboto'] text-[#475569]">Weekly user and supplier growth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="week" 
                          stroke="#475569" 
                          style={{ fontFamily: 'Roboto', fontSize: '12px' }}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#475569" 
                          style={{ fontFamily: 'Roboto', fontSize: '12px' }}
                          tickLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '12px',
                            fontFamily: 'Roboto',
                            boxShadow: '0 4px 24px rgba(15,23,42,0.08)'
                          }} 
                        />
                        <Legend wrapperStyle={{ fontFamily: 'Roboto', fontSize: '14px', paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="users" stroke="#F02801" strokeWidth={3} name="Users" dot={{ fill: '#F02801', r: 4 }} />
                        <Line type="monotone" dataKey="suppliers" stroke="#22C55E" strokeWidth={3} name="Suppliers" dot={{ fill: '#22C55E', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Performance */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-6">
                    <CardTitle className="font-['Inter'] text-[#0F172A]">Category Performance</CardTitle>
                    <CardDescription className="font-['Roboto'] text-[#475569]">Most requested parts by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {categoryData.map((cat) => {
                        const maxRequests = Math.max(...categoryData.map(c => c.requests));
                        const percentage = (cat.requests / maxRequests) * 100;
                        return (
                          <div key={cat.category}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-['Roboto'] text-[#0F172A]">{cat.category}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-[#475569] font-['Roboto']">{cat.requests} requests</span>
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

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white border-2 border-[#3B82F6]/20 p-6 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
                          <Users className="h-7 w-7 text-white" strokeWidth={2} />
                        </div>
                        <div>
                          <h2 className="text-2xl mb-1 text-[#0F172A] font-['Inter'] font-bold">All Users</h2>
                          <p className="text-base text-[#475569] font-['Roboto']">{allUsers.length} total users registered</p>
                        </div>
                      </div>
                      <Button className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] shadow-md rounded-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>

                  {/* Search Bar and Filters */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#475569]" />
                      <Input
                        type="text"
                        placeholder="Search users by name, email, location or ID..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-12 h-12 border-[#E5E7EB] focus:border-[#F02801] focus:ring-[#F02801] rounded-xl font-['Roboto'] text-[#0F172A] placeholder:text-[#94A3B8] w-full"
                      />
                      {userSearch && (
                        <button
                          onClick={() => setUserSearch("")}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#475569] hover:text-[#F02801] transition-colors"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="inline-flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-full border border-[#E5E7EB]">
                      <button
                        onClick={() => setUserStatusFilter("all")}
                        className={`px-5 py-2.5 rounded-full font-['Roboto'] transition-all duration-200 ${
                          userStatusFilter === "all"
                            ? "bg-white text-[#0F172A] shadow-sm"
                            : "text-[#475569] hover:text-[#0F172A]"
                        }`}
                      >
                        All Users
                      </button>
                      <button
                        onClick={() => setUserStatusFilter("active")}
                        className={`px-5 py-2.5 rounded-full font-['Roboto'] transition-all duration-200 flex items-center gap-2 ${
                          userStatusFilter === "active"
                            ? "bg-white text-[#0F172A] shadow-sm"
                            : "text-[#475569] hover:text-[#0F172A]"
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full ${
                          userStatusFilter === "active" ? "bg-[#22C55E]" : "bg-[#94A3B8]"
                        }`} />
                        Active
                      </button>
                      <button
                        onClick={() => setUserStatusFilter("suspended")}
                        className={`px-5 py-2.5 rounded-full font-['Roboto'] transition-all duration-200 flex items-center gap-2 ${
                          userStatusFilter === "suspended"
                            ? "bg-white text-[#0F172A] shadow-sm"
                            : "text-[#475569] hover:text-[#0F172A]"
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full ${
                          userStatusFilter === "suspended" ? "bg-[#F02801]" : "bg-[#94A3B8]"
                        }`} />
                        Suspended
                      </button>
                    </div>
                  </div>

                  {/* User Table */}
                  <>
                    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-[#F1F5F9] hover:bg-[#F1F5F9] border-b border-[#E5E7EB]">
                            <TableHead className="font-['Inter'] text-[#0F172A]">User</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A]">Email</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A]">Location</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A]">Joined</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A]">Status</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A] text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.length > 0 ? (
                            (showAllUsers ? filteredUsers : filteredUsers.slice(0, 4)).map((user) => {
                              return (
                                <TableRow 
                                  key={user.id}
                                  className="hover:bg-[#FEF2F2] transition-colors border-b border-[#F1F5F9] last:border-0"
                                >
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-white font-['Inter'] text-sm">{user.name.split(' ').map(n => n[0]).join('')}</span>
                                      </div>
                                      <div>
                                        <p className="font-['Inter'] text-[#0F172A]">{user.name}</p>
                                        <p className="text-xs text-[#475569] font-['Roboto']">{user.id}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-['Roboto'] text-[#0F172A]">{user.email}</TableCell>
                                  <TableCell className="font-['Roboto'] text-[#0F172A]">{user.location}</TableCell>
                                  <TableCell className="font-['Roboto'] text-[#0F172A]">{user.joinedDate}</TableCell>
                                  <TableCell>
                                    <Badge 
                                      className={`font-['Roboto'] px-2 py-0.5 ${
                                        user.status === "Active" 
                                          ? "bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] border-[#22C55E]" 
                                          : user.status === "Suspended"
                                          ? "bg-[#FEE2E2] text-[#7F1D1D] hover:bg-[#FEE2E2] border-[#F02801]"
                                          : "bg-[#F1F5F9] text-[#475569] hover:bg-[#F1F5F9] border-[#CBD5E1]"
                                      }`}
                                    >
                                      {user.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="font-['Roboto'] rounded-full border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801]"
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setUserDetailsDialogOpen(true);
                                        }}
                                      >
                                        Details
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                  <Search className="h-12 w-12 text-[#CBD5E1]" />
                                  <p className="text-[#475569] font-['Roboto']">No users found matching "{userSearch}"</p>
                                  <Button
                                    variant="outline"
                                    onClick={() => setUserSearch("")}
                                    className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full"
                                  >
                                    Clear Search
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {!showAllUsers && filteredUsers.length > 4 && (
                      <div className="flex justify-center pt-2">
                        <Button 
                          variant="outline"
                          onClick={() => setShowAllUsers(true)}
                          className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full"
                        >
                          View All Users ({filteredUsers.length - 4} more)
                        </Button>
                      </div>
                    )}
                  </>
                </div>
              </div>
            )}

            {/* Suppliers Tab */}
            {activeTab === "suppliers" && (
              <div className="space-y-8">
                {/* Section Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEF3C7] via-[#FEF9C3] to-white border-2 border-[#F59E0B]/20 p-6 shadow-[0_0_24px_rgba(245,158,11,0.12)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">Supplier Management</h1>
                    <p className="text-base md:text-lg text-[#475569] font-['Roboto']">{pendingSuppliers.length} pending approvals • {allSuppliers.length} active suppliers</p>
                  </div>
                </div>

                {/* Pending Suppliers Section */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-['Inter'] text-[#0F172A]">Pending Approvals</CardTitle>
                      <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-[#F59E0B] px-3 py-1 font-['Roboto']">
                        {pendingSuppliers.length} pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div>
                      {pendingSuppliers.map((supplier, index) => (
                        <div 
                          key={supplier.id} 
                          className={`flex items-center gap-4 px-6 py-4 hover:bg-[#F1F5F9] transition-all ${index !== pendingSuppliers.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
                        >
                          {/* Name & ID */}
                          <div className="flex-1 min-w-[200px]">
                            <h3 className="font-['Inter'] text-[#0F172A]">{supplier.name}</h3>
                            <p className="text-sm text-[#475569] font-['Roboto']">ID: {supplier.id}</p>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 min-w-[140px]">
                            <MapPin className="h-4 w-4 text-[#475569]" />
                            <span className="text-sm text-[#475569] font-['Roboto']">{supplier.location}</span>
                          </div>

                          {/* Applied Date */}
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <Calendar className="h-4 w-4 text-[#475569]" />
                            <span className="text-sm text-[#475569] font-['Roboto']">{supplier.appliedDate}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-9 px-4"
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setReviewDialogOpen(true);
                              }}
                            >
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Active Suppliers Table */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-4 border-b border-[#E5E7EB] bg-gradient-to-br from-[#DCFCE7] via-[#F0FDF4] to-white">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-[#22C55E] flex items-center justify-center shadow-sm">
                        <CheckCircle className="h-6 w-6 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <CardTitle className="font-['Inter'] text-[#0F172A]">Active Suppliers</CardTitle>
                        <CardDescription className="font-['Roboto'] text-[#475569]">Approved suppliers on the platform</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                      <Input
                        type="text"
                        placeholder="Search suppliers by name, location or ID..."
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        className="pl-12 h-12 border-[#E5E7EB] focus:border-[#F02801] focus:ring-[#F02801] rounded-xl font-['Roboto'] text-[#0F172A] placeholder:text-[#94A3B8] max-w-md"
                      />
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-[#E5E7EB]">
                          <TableHead className="font-['Inter'] text-[#0F172A]">Supplier</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Location</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Rating</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Quotes</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Joined</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(showAllSuppliers 
                          ? allSuppliers.filter((supplier) => 
                              supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                              supplier.location.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                              supplier.id.toLowerCase().includes(supplierSearch.toLowerCase())
                            )
                          : allSuppliers
                              .filter((supplier) => 
                                supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                                supplier.location.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                                supplier.id.toLowerCase().includes(supplierSearch.toLowerCase())
                              )
                              .slice(0, 10)
                        ).map((supplier) => (
                          <TableRow key={supplier.id} className="border-b border-[#E5E7EB]/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0">
                                  <Building2 className="h-5 w-5 text-white" strokeWidth={2} />
                                </div>
                                <div>
                                  <p className="font-['Inter'] font-medium text-[#0F172A]">{supplier.name}</p>
                                  <p className="text-sm text-[#475569] font-['Roboto']">{supplier.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-[#475569] font-['Roboto']">{supplier.location}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4 text-[#F59E0B]" />
                                <span className="font-['Roboto'] text-[#0F172A]">{supplier.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-[#475569] font-['Roboto']">{supplier.quotes}</TableCell>
                            <TableCell className="text-[#475569] font-['Roboto']">{supplier.joined}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-9 px-4"
                                onClick={() => {
                                  setSelectedActiveSupplier(supplier);
                                  setSupplierDetailsDialogOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {!showAllSuppliers && allSuppliers.filter((supplier) => 
                      supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                      supplier.location.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                      supplier.id.toLowerCase().includes(supplierSearch.toLowerCase())
                    ).length > 10 && (
                      <div className="flex justify-center pt-6 border-t border-[#E5E7EB] mt-6">
                        <Button
                          onClick={() => setShowAllSuppliers(true)}
                          className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11 px-8"
                        >
                          View More Suppliers ({allSuppliers.filter((supplier) => 
                            supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                            supplier.location.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                            supplier.id.toLowerCase().includes(supplierSearch.toLowerCase())
                          ).length - 10} more)
                        </Button>
                      </div>
                    )}
                    {showAllSuppliers && (
                      <div className="flex justify-center pt-6 border-t border-[#E5E7EB] mt-6">
                        <Button
                          onClick={() => setShowAllSuppliers(false)}
                          variant="outline"
                          className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full h-11 px-8"
                        >
                          Show Less
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Inquiries Tab */}
            {activeTab === "inquiries" && (
              <div className="space-y-8">
                {/* Section Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white border-2 border-[#3B82F6]/20 p-6 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">Customer Inquiries</h1>
                    <p className="text-base md:text-lg text-[#475569] font-['Roboto']">{inquiries.filter(i => i.status === "New").length} new inquiries awaiting response</p>
                  </div>
                </div>

                {/* Inquiries List */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-['Inter'] text-[#0F172A]">All Inquiries</CardTitle>
                        <CardDescription className="font-['Roboto'] text-[#475569]">Messages from customers and potential partners</CardDescription>
                      </div>
                      {/* Filter Tabs */}
                      <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl">
                        <button
                          onClick={() => setInquiryFilter("all")}
                          className={`relative px-6 py-2.5 rounded-lg font-['Roboto'] transition-all duration-200 ${
                            inquiryFilter === "all"
                              ? "bg-white text-[#0F172A] shadow-sm"
                              : "text-[#475569] hover:text-[#0F172A]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            All
                            <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md font-['Roboto'] transition-all duration-200 ${
                              inquiryFilter === "all"
                                ? "bg-[#F02801] text-white"
                                : "bg-[#E5E7EB] text-[#475569]"
                            }`}>
                              {inquiries.length}
                            </span>
                          </span>
                        </button>
                        <button
                          onClick={() => setInquiryFilter("unread")}
                          className={`relative px-6 py-2.5 rounded-lg font-['Roboto'] transition-all duration-200 ${
                            inquiryFilter === "unread"
                              ? "bg-white text-[#0F172A] shadow-sm"
                              : "text-[#475569] hover:text-[#0F172A]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            Unread
                            <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md font-['Roboto'] transition-all duration-200 ${
                              inquiryFilter === "unread"
                                ? "bg-[#F02801] text-white"
                                : "bg-[#E5E7EB] text-[#475569]"
                            }`}>
                              {inquiries.filter(i => i.status === "New").length}
                            </span>
                          </span>
                        </button>
                        <button
                          onClick={() => setInquiryFilter("read")}
                          className={`relative px-6 py-2.5 rounded-lg font-['Roboto'] transition-all duration-200 ${
                            inquiryFilter === "read"
                              ? "bg-white text-[#0F172A] shadow-sm"
                              : "text-[#475569] hover:text-[#0F172A]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            Read
                            <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md font-['Roboto'] transition-all duration-200 ${
                              inquiryFilter === "read"
                                ? "bg-[#F02801] text-white"
                                : "bg-[#E5E7EB] text-[#475569]"
                            }`}>
                              {inquiries.filter(i => i.status === "Responded").length}
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div>
                      {(() => {
                        const filteredInquiries = inquiries.filter(inquiry => {
                          if (inquiryFilter === "all") return true;
                          if (inquiryFilter === "unread") return inquiry.status === "New";
                          if (inquiryFilter === "read") return inquiry.status === "Responded";
                          return true;
                        });
                        return filteredInquiries.map((inquiry, index) => (
                        <div 
                          key={inquiry.id} 
                          className={`grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6 px-5 py-3.5 hover:bg-[#F9FAFB] transition-colors cursor-pointer ${index !== filteredInquiries.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setInquiryDetailsDialogOpen(true);
                          }}
                        >
                          {/* Status Indicator */}
                          <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${
                              inquiry.status === "New" ? "bg-[#3B82F6]" : "bg-[#22C55E]"
                            }`} />
                            <Badge 
                              className={`border-0 font-['Roboto'] ${
                                inquiry.status === "New"
                                  ? "bg-[#EFF6FF] text-[#3B82F6] hover:bg-[#EFF6FF]"
                                  : "bg-[#F0FDF4] text-[#22C55E] hover:bg-[#F0FDF4]"
                              }`}
                            >
                              {inquiry.status}
                            </Badge>
                          </div>

                          {/* Inquiry Details */}
                          <div className="min-w-0">
                            <p className="font-['Inter'] text-[#0F172A] truncate mb-0.5">{inquiry.subject}</p>
                            <div className="flex items-center gap-2 text-sm text-[#475569] font-['Roboto']">
                              <span className="truncate">{inquiry.name}</span>
                              <span className="text-[#CBD5E1]">•</span>
                              <span className="truncate">{inquiry.email}</span>
                            </div>
                          </div>

                          {/* Category */}
                          <Badge variant="outline" className="border-[#E5E7EB] text-[#475569] font-['Roboto'] whitespace-nowrap">
                            {inquiry.category}
                          </Badge>

                          {/* Date & Time */}
                          <div className="flex flex-col items-end gap-0.5 text-sm text-[#475569] font-['Roboto'] whitespace-nowrap">
                            <span>{inquiry.date}</span>
                            <span className="text-xs">{inquiry.time}</span>
                          </div>

                          {/* Action */}

                        </div>
                      ));
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="space-y-8">
                {/* Section Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEE2E2] via-[#FEF3F2] to-white border-2 border-[#F02801]/20 p-6 shadow-[0_0_24px_rgba(240,40,1,0.12)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F02801]/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">Abuse Reports</h1>
                    <p className="text-base md:text-lg text-[#475569] font-['Roboto']">{abuseReports.filter(r => r.status === "Under Review").length} reports under review</p>
                  </div>
                </div>

                {/* Reports Grid */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-4 border-b border-[#E5E7EB]">
                    <CardTitle className="font-['Inter'] text-[#0F172A]">All Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div>
                      {abuseReports.map((report, index) => (
                        <div 
                          key={report.id} 
                          className={`flex items-center gap-4 px-5 py-4 hover:bg-[#F1F5F9] transition-all ${index !== abuseReports.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
                        >
                          {/* Alert Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F1F5F9]">
                              <AlertTriangle className="h-5 w-5 text-[#64748B]" />
                            </div>
                          </div>

                          {/* Report Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-['Inter'] text-[#0F172A]">Report {report.id}</h3>
                              <span className="text-[#94A3B8] font-['Roboto']">•</span>
                              <span className="text-[#475569] font-['Roboto']">{report.reportedUser}</span>
                            </div>
                            <p className="text-sm text-[#475569] font-['Roboto'] mb-1">{report.reason}</p>
                            <div className="flex items-center gap-4 text-xs text-[#94A3B8] font-['Roboto']">
                              <span>Reported by {report.reportedBy}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {report.date}
                              </span>
                            </div>
                          </div>

                          {/* Severity Badge */}
                          <div className="flex-shrink-0">
                            <Badge 
                              className={`font-['Roboto'] px-3 py-1.5 ${
                                report.severity === "High" 
                                  ? "bg-[#FEE2E2] text-[#7F1D1D] hover:bg-[#FEE2E2] border-[#F02801]"
                                  : report.severity === "Medium"
                                  ? "bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-[#F59E0B]"
                                  : "bg-[#DBEAFE] text-[#1E3A8A] hover:bg-[#DBEAFE] border-[#3B82F6]"
                              }`}
                            >
                              {report.severity}
                            </Badge>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {report.status === "Under Review" ? (
                              <Button
                                size="sm"
                                className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto'] rounded-full h-9 px-4"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setReportReviewDialogOpen(true);
                                }}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                Resolved
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1.5 h-9 px-4 bg-[#22C55E] text-white font-['Roboto'] rounded-full">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Resolved</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Supplier Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl border-[#E5E7EB] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Supplier Application Review</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              Review supplier details and documentation before approval
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-6 mt-2">
              {/* Supplier Header */}
              <div className="bg-gradient-to-br from-[#FEE2E2] via-[#FEF3F2] to-white p-6 rounded-xl border-2 border-[#F02801]/20">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#F02801]/30">
                    <Building2 className="h-8 w-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-['Inter'] text-[#0F172A] mb-1">{selectedSupplier.name}</h3>
                    <p className="text-sm text-[#475569] font-['Roboto'] mb-3">{selectedSupplier.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplier.categories.map((cat: string) => (
                        <Badge key={cat} variant="outline" className="font-['Roboto'] border-[#F02801] text-[#F02801] bg-[#FEF3F2]">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h4 className="font-['Inter'] text-[#0F172A]">Business Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Business Address</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.businessAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <Mail className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Email</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <Phone className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Phone</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Registration Number</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.registrationNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">VAT Number</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.vatNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <Calendar className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Years in Business</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.yearsInBusiness} years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Status */}
              <div className={`p-4 rounded-xl border-2 ${
                selectedSupplier.docsComplete 
                  ? 'bg-[#DCFCE7] border-[#22C55E]/30' 
                  : 'bg-[#FEF3F2] border-[#F02801]/30'
              }`}>
                <p className="text-sm text-[#475569] font-['Roboto'] mb-2">Documentation Status</p>
                <div className="flex items-center gap-2">
                  {selectedSupplier.docsComplete ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                      <span className="font-['Roboto'] text-[#0F172A]">All documents verified</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-[#F02801]" />
                      <span className="font-['Roboto'] text-[#0F172A]">Missing documents - please review</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#DC2626] font-['Roboto'] rounded-full h-11"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto'] rounded-full h-11"
                  onClick={() => {
                    setReviewDialogOpen(false);
                    setApprovalDialogOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="max-w-md border-[#E5E7EB] bg-white">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Confirm Supplier Approval</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              Are you sure you want to approve this supplier?
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-4">
              <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-['Inter'] text-[#0F172A] mb-1">{selectedSupplier.name}</p>
                    <p className="text-sm text-[#475569] font-['Roboto']">{selectedSupplier.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setApprovalDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
                  onClick={() => {
                    setApprovalDialogOpen(false);
                    setApprovalSuccessDialogOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Approval
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Success Dialog */}
      <Dialog open={approvalSuccessDialogOpen} onOpenChange={setApprovalSuccessDialogOpen}>
        <DialogContent className="max-w-md border-[#E5E7EB] bg-white">
          <DialogHeader className="sr-only">
            <DialogTitle>Supplier Approved</DialogTitle>
            <DialogDescription>
              The supplier has been successfully approved
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#DCFCE7] border-2 border-[#22C55E] flex items-center justify-center mx-auto shadow-lg shadow-[#22C55E]/20">
              <CheckCircle className="h-8 w-8 text-[#22C55E]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-['Inter'] text-[#0F172A] mb-2">Supplier Approved</h3>
              <p className="text-sm text-[#475569] font-['Roboto']">
                {selectedSupplier?.name} has been successfully approved and notified via email.
              </p>
            </div>
            <Button 
              className="w-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
              onClick={() => setApprovalSuccessDialogOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={userDetailsDialogOpen} onOpenChange={setUserDetailsDialogOpen}>
        <DialogContent className="max-w-lg border border-[#334155] bg-[#1E293B]">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-white">User Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#CBD5E1]">
              View user information and account status
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 mt-2">
              {/* User Header */}
              <div className="bg-gradient-to-br from-[#1E40AF]/20 via-[#1E40AF]/10 to-transparent p-6 rounded-xl border border-[#3B82F6]/30">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-['Inter'] text-xl">
                      {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-['Inter'] text-white">{selectedUser.name}</h3>
                      <Badge 
                        className={`font-['Roboto'] ${
                          selectedUser.status === "Active" 
                            ? "bg-[#166534]/30 text-[#86EFAC] hover:bg-[#166534]/30 border-[#22C55E]" 
                            : "bg-[#7F1D1D]/30 text-[#FCA5A5] hover:bg-[#7F1D1D]/30 border-[#F02801]"
                        }`}
                      >
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#CBD5E1] font-['Roboto']">{selectedUser.id}</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Email Address</p>
                  <p className="font-['Roboto'] text-[#E2E8F0]">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Location</p>
                  <p className="font-['Roboto'] text-[#E2E8F0]">{selectedUser.location}</p>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Role</p>
                  <p className="font-['Roboto'] text-[#E2E8F0]">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Member Since</p>
                  <p className="font-['Roboto'] text-[#E2E8F0]">{selectedUser.joinedDate}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#475569] bg-transparent text-[#CBD5E1] hover:bg-[#334155] hover:text-white font-['Roboto']"
                  onClick={() => setUserDetailsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  className={`flex-1 font-['Roboto'] ${
                    selectedUser.status === "Active"
                      ? "bg-[#EF4444] hover:bg-[#DC2626] text-white"
                      : "bg-[#22C55E] hover:bg-[#16A34A] text-white"
                  }`}
                  onClick={() => {
                    handleToggleUserStatus(selectedUser.id);
                    setUserDetailsDialogOpen(false);
                  }}
                >
                  {selectedUser.status === "Active" ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Suspend User
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate User
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Active Supplier Details Dialog - Dark Theme */}
      <Dialog open={supplierDetailsDialogOpen} onOpenChange={setSupplierDetailsDialogOpen}>
        <DialogContent className="max-w-2xl border border-[#334155] bg-[#1E293B] max-h-[90vh] overflow-y-auto pt-8">
          <DialogHeader className="mb-2">
            <DialogTitle className="font-['Inter'] text-white">Supplier Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#CBD5E1]">
              Complete information about this supplier
            </DialogDescription>
          </DialogHeader>

          {selectedActiveSupplier && (
            <div className="space-y-4 mt-4">
              {/* Supplier Header */}
              <div className="bg-gradient-to-br from-[#7F1D1D]/20 via-[#7F1D1D]/10 to-transparent p-6 rounded-xl border border-[#F02801]/30">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Building2 className="h-8 w-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-['Inter'] text-white">{selectedActiveSupplier.name}</h3>
                      <Badge className="bg-[#166534]/30 text-[#86EFAC] hover:bg-[#166534]/30 border-[#22C55E] font-['Roboto']">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-[#CBD5E1] font-['Roboto'] mb-2">{selectedActiveSupplier.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedActiveSupplier.categories.map((cat: string) => (
                        <Badge key={cat} variant="outline" className="font-['Roboto'] border-[#F02801] text-[#FCA5A5] bg-[#7F1D1D]/20">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-[#F59E0B]" />
                    <span className="text-sm text-[#94A3B8] font-['Roboto']">Rating</span>
                  </div>
                  <p className="font-['Inter'] text-white">{selectedActiveSupplier.rating}/5.0</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-[#22C55E]" />
                    <span className="text-sm text-[#94A3B8] font-['Roboto']">Quotes</span>
                  </div>
                  <p className="font-['Inter'] text-white">{selectedActiveSupplier.quotes}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-[#3B82F6]" />
                    <span className="text-sm text-[#94A3B8] font-['Roboto']">Joined</span>
                  </div>
                  <p className="font-['Inter'] text-white">{selectedActiveSupplier.joined}</p>
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-[#0F172A] p-5 rounded-xl border border-[#334155]">
                <h4 className="font-['Inter'] text-white mb-4">Business Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Business Address</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.businessAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Email</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Phone</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Registration Number</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">VAT Number</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.vatNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Years in Business</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.yearsInBusiness} years</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Status */}
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-2">Documentation Status</p>
                <div className="flex items-center gap-2">
                  {selectedActiveSupplier.docsComplete ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-[#86EFAC]" />
                      <span className="font-['Roboto'] text-[#86EFAC]">All documents verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-[#FCA5A5]" />
                      <span className="font-['Roboto'] text-[#FCA5A5]">Missing documents</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#475569] bg-transparent text-[#CBD5E1] hover:bg-[#334155] hover:text-white font-['Roboto']"
                  onClick={() => setSupplierDetailsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']"
                  onClick={() => {
                    onNavigate('supplier-profile');
                    setSupplierDetailsDialogOpen(false);
                  }}
                >
                  View Full Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Review Dialog - Dark Theme */}
      <Dialog open={reportReviewDialogOpen} onOpenChange={setReportReviewDialogOpen}>
        <DialogContent className="max-w-lg border border-[#334155] bg-[#1E293B]">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-white">Report Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#CBD5E1]">
              Review abuse report and take appropriate action
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 mt-2">
              {/* Report Header */}
              <div className="bg-gradient-to-br from-[#92400E]/20 via-[#92400E]/10 to-transparent p-4 rounded-xl border border-[#F59E0B]/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg">
                      <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-['Inter'] font-medium text-white">{selectedReport.id}</h3>
                      <p className="text-sm text-[#CBD5E1] font-['Roboto']">{selectedReport.date}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`font-['Roboto'] px-2 py-0.5 ${
                      selectedReport.status === "Under Review"
                        ? "bg-[#92400E]/30 text-[#FCD34D] hover:bg-[#92400E]/30 border-[#F59E0B]" 
                        : "bg-[#166534]/30 text-[#86EFAC] hover:bg-[#166534]/30 border-[#22C55E]"
                    }`}
                  >
                    {selectedReport.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-['Roboto'] text-[#CBD5E1]">Severity:</span>
                  <Badge 
                    className={`font-['Roboto'] ${
                      selectedReport.severity === "High" 
                        ? "bg-[#7F1D1D]/30 text-[#FCA5A5] hover:bg-[#7F1D1D]/30 border-[#F02801]"
                        : selectedReport.severity === "Medium"
                        ? "bg-[#92400E]/30 text-[#FCD34D] hover:bg-[#92400E]/30 border-[#F59E0B]"
                        : "bg-[#1E40AF]/30 text-[#93C5FD] hover:bg-[#1E40AF]/30 border-[#3B82F6]"
                    }`}
                  >
                    {selectedReport.severity}
                  </Badge>
                </div>
              </div>

              {/* Report Information */}
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] space-y-3">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1.5">Reported User</p>
                  <div className="flex items-center gap-2 p-2.5 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                    <p className="font-['Inter'] text-white">{selectedReport.reportedUser}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1.5">Reported By</p>
                  <div className="flex items-center gap-2 p-2.5 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                    <p className="font-['Inter'] text-white">{selectedReport.reportedBy}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1.5">Reason for Report</p>
                  <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <p className="font-['Roboto'] text-[#E2E8F0] leading-relaxed">{selectedReport.reason}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 border-[#475569] bg-transparent text-[#CBD5E1] hover:bg-[#334155] hover:text-white font-['Roboto']"
                  onClick={() => setReportReviewDialogOpen(false)}
                >
                  Close
                </Button>
                {selectedReport.status === "Under Review" && (
                  <Button 
                    size="sm"
                    className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto']"
                    onClick={() => {
                      // Handle resolve action
                      setReportReviewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={userDetailsDialogOpen} onOpenChange={setUserDetailsDialogOpen}>
        <DialogContent className="max-w-2xl border-[#E5E7EB] bg-white">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">User Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View and manage user information
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 mt-2">
              {/* User Header */}
              <div className="bg-gradient-to-br from-[#FEF3F2] via-[#FEF3F2] to-white p-6 rounded-xl border-2 border-[#F02801]/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-['Inter'] text-xl">{selectedUser.name.split(' ').map((n: string) => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="font-['Inter'] text-[#0F172A] mb-1">{selectedUser.name}</h3>
                      <p className="text-sm text-[#475569] font-['Roboto']">{selectedUser.id}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`font-['Roboto'] px-3 py-1 ${
                      selectedUser.status === "Active" 
                        ? "bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] border-[#22C55E]" 
                        : selectedUser.status === "Suspended"
                        ? "bg-[#FEE2E2] text-[#7F1D1D] hover:bg-[#FEE2E2] border-[#F02801]"
                        : "bg-[#F1F5F9] text-[#475569] hover:bg-[#F1F5F9] border-[#CBD5E1]"
                    }`}
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-[#475569]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Email Address</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedUser.email}</p>
                </div>

                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-[#475569]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Location</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedUser.location}</p>
                </div>

                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-[#475569]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Joined Date</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedUser.joinedDate}</p>
                </div>

                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-[#475569]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Role</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedUser.role}</p>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <h4 className="font-['Inter'] text-[#0F172A] mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#F02801]" />
                  Activity Summary
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-[#F1F5F9] rounded-lg">
                    <p className="text-2xl font-['Inter'] text-[#F02801] mb-1">12</p>
                    <p className="text-xs text-[#475569] font-['Roboto']">Total Requests</p>
                  </div>
                  <div className="text-center p-3 bg-[#F1F5F9] rounded-lg">
                    <p className="text-2xl font-['Inter'] text-[#F02801] mb-1">8</p>
                    <p className="text-xs text-[#475569] font-['Roboto']">Quotes Received</p>
                  </div>
                  <div className="text-center p-3 bg-[#F1F5F9] rounded-lg">
                    <p className="text-2xl font-['Inter'] text-[#F02801] mb-1">5</p>
                    <p className="text-xs text-[#475569] font-['Roboto']">Orders Placed</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setUserDetailsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  className={`flex-1 font-['Roboto'] rounded-full h-11 ${
                    selectedUser.status === "Active"
                      ? "bg-[#EF4444] hover:bg-[#DC2626] text-white"
                      : "bg-[#22C55E] hover:bg-[#16A34A] text-white"
                  }`}
                  onClick={() => {
                    setConfirmUserActionDialogOpen(true);
                  }}
                >
                  {selectedUser.status === "Active" ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Suspend User
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate User
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Inquiry Details Dialog */}
      <Dialog open={inquiryDetailsDialogOpen} onOpenChange={setInquiryDetailsDialogOpen}>
        <DialogContent className="max-w-3xl border border-[#E5E7EB] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Inquiry Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View and respond to customer inquiry
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-6 mt-2">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <Badge 
                  className={`px-4 py-1.5 font-['Roboto'] border-0 ${
                    selectedInquiry.status === "New"
                      ? "bg-[#EFF6FF] text-[#3B82F6] hover:bg-[#EFF6FF]"
                      : "bg-[#F0FDF4] text-[#22C55E] hover:bg-[#F0FDF4]"
                  }`}
                >
                  {selectedInquiry.status}
                </Badge>
                <Badge variant="outline" className="px-4 py-1.5 border-[#E5E7EB] text-[#475569] font-['Roboto']">
                  {selectedInquiry.category}
                </Badge>
              </div>

              {/* Inquiry ID and Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Inquiry ID</p>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedInquiry.id}</p>
                </div>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Received</p>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedInquiry.date} at {selectedInquiry.time}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="font-['Inter'] text-[#0F172A]">Customer Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Name</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedInquiry.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Email</p>
                        <p className="font-['Roboto'] text-[#0F172A] break-all">{selectedInquiry.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <h4 className="font-['Inter'] text-[#0F172A]">Subject</h4>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedInquiry.subject}</p>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h4 className="font-['Inter'] text-[#0F172A]">Message</h4>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="font-['Roboto'] text-[#0F172A] leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-['Roboto'] rounded-full h-11"
                  onClick={() => {
                    setEmailSentDialogOpen(true);
                    window.location.href = `mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`;
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
                {selectedInquiry.status === "New" && (
                  <Button 
                    className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
                    onClick={() => {
                      setInquiryDetailsDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Responded
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Sent Confirmation Dialog */}
      <Dialog open={emailSentDialogOpen} onOpenChange={setEmailSentDialogOpen}>
        <DialogContent className="max-w-md border-[#334155] bg-[#0F172A]">
          <DialogHeader className="sr-only">
            <DialogTitle>Email Client Opened</DialogTitle>
            <DialogDescription>
              Your email client has been opened to send a reply
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-[#1E293B] border-2 border-[#3B82F6] flex items-center justify-center mx-auto shadow-lg shadow-[#3B82F6]/30">
              <Mail className="h-12 w-12 text-[#3B82F6]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-['Inter'] text-white mb-2">Email Client Opened</h3>
              <p className="text-sm text-[#94A3B8] font-['Roboto']">
                Your default email client has been opened to send a reply to {selectedInquiry?.name}.
              </p>
            </div>
            <Button 
              className="w-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
              onClick={() => setEmailSentDialogOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm User Action Dialog */}
      <Dialog open={confirmUserActionDialogOpen} onOpenChange={setConfirmUserActionDialogOpen}>
        <DialogContent className="max-w-md border-[#E5E7EB] bg-white">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">
              {selectedUser?.status === "Active" ? "Suspend User" : "Activate User"}
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              {selectedUser?.status === "Active" 
                ? "Are you sure you want to suspend this user? They will no longer be able to access the platform."
                : "Are you sure you want to activate this user? They will be able to access the platform again."
              }
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 mt-2">
              {/* User Info */}
              <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-white font-['Inter'] text-sm">{selectedUser.name.split(' ').map((n: string) => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-['Inter'] text-[#0F172A]">{selectedUser.name}</p>
                    <p className="text-sm text-[#475569] font-['Roboto']">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              {selectedUser.status === "Active" && (
                <div className="bg-[#FEF3F2] p-4 rounded-xl border-2 border-[#F02801]/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-[#F02801] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-['Inter'] text-[#7F1D1D] mb-1">Warning</p>
                      <p className="text-sm text-[#475569] font-['Roboto']">
                        Suspending this user will immediately revoke their access. Any active quotes or requests will remain visible but they won't be able to create new ones.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setConfirmUserActionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className={`flex-1 font-['Roboto'] rounded-full h-11 ${
                    selectedUser.status === "Active"
                      ? "bg-[#EF4444] hover:bg-[#DC2626] text-white"
                      : "bg-[#22C55E] hover:bg-[#16A34A] text-white"
                  }`}
                  onClick={() => {
                    handleToggleUserStatus(selectedUser.id);
                    setConfirmUserActionDialogOpen(false);
                    setUserDetailsDialogOpen(false);
                  }}
                >
                  {selectedUser.status === "Active" ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Confirm Suspend
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboardPage;
