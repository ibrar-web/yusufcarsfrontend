"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  FileText,
  Mail,
  MapPin,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { adminUsers } from "@/page-components/admin-dashboard/data";
import { apiGet } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";

type AdminUser = (typeof adminUsers)[number];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(adminUsers);
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<
    "all" | "active" | "suspended"
  >("all");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userDetailsDialogOpen, setUserDetailsDialogOpen] = useState(false);
  const [confirmUserActionDialogOpen, setConfirmUserActionDialogOpen] =
    useState(false);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await apiGet(apiRoutes.admin.users.list, {
        params: { page: 1, pageSize: 20 },
      });
      console.log("users list", response);
    } catch (error) {}
  };
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "Active" ? "Suspended" : "Active",
            }
          : user
      )
    );
  };

  const filteredUsers = useMemo(() => {
    const matchesSearch = (user: AdminUser) => {
      if (!userSearch) return true;
      const term = userSearch.toLowerCase();
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.location.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term)
      );
    };

    const matchesStatus = (user: AdminUser) => {
      if (userStatusFilter === "all") return true;
      if (userStatusFilter === "active") return user.status === "Active";
      return user.status === "Suspended";
    };

    return users.filter((user) => matchesSearch(user) && matchesStatus(user));
  }, [users, userSearch, userStatusFilter]);

  const visibleUsers = showAllUsers ? filteredUsers : filteredUsers.slice(0, 4);

  return (
    <>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white border-2 border-[#3B82F6]/20 p-6 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
                <Users className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl mb-1 text-[#0F172A] font-['Inter'] font-bold">
                  All Users
                </h2>
                <p className="text-base text-[#475569] font-['Roboto']">
                  {users.length} total users registered
                </p>
              </div>
            </div>
            <Button className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] shadow-md rounded-full">
              <FileText className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#475569] hover:text-[#F02801]"
              >
                ×
              </button>
            )}
          </div>

          <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl">
            {[
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "suspended", label: "Suspended" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() =>
                  setUserStatusFilter(filter.id as typeof userStatusFilter)
                }
                className={`px-4 py-2 rounded-lg font-['Roboto'] transition-all ${
                  userStatusFilter === filter.id
                    ? "bg-white text-[#0F172A] shadow-sm"
                    : "text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
          <CardHeader className="pb-4 border-b border-[#E5E7EB]">
            <CardTitle className="font-['Inter'] text-[#0F172A]">
              Recent Users
            </CardTitle>
            <CardDescription className="font-['Roboto'] text-[#475569]">
              Manage customers and platform access
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E5E7EB]">
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    Name
                  </TableHead>
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    Email
                  </TableHead>
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    Location
                  </TableHead>
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    Joined
                  </TableHead>
                  <TableHead className="font-['Inter'] text-[#0F172A]">
                    Status
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleUsers.length > 0 ? (
                  visibleUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center text-white font-['Inter']">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-['Inter'] text-[#0F172A]">
                              {user.name}
                            </p>
                            <p className="text-sm text-[#475569] font-['Roboto']">
                              {user.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {user.email}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {user.location}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#475569]">
                        {user.joinedDate}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`px-3 py-1 font-['Roboto'] ${
                            user.status === "Active"
                              ? "bg-[#DCFCE7] text-[#166534] border-0"
                              : "bg-[#FEE2E2] text-[#7F1D1D] border-0"
                          }`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full"
                          onClick={() => {
                            setSelectedUser(user);
                            setUserDetailsDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 text-[#CBD5E1]" />
                        <p className="text-[#475569] font-['Roboto']">
                          No users found matching "{userSearch}"
                        </p>
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
            {!showAllUsers && filteredUsers.length > 4 && (
              <div className="flex justify-center pt-2 pb-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAllUsers(true)}
                  className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full"
                >
                  View All Users ({filteredUsers.length - 4} more)
                </Button>
              </div>
            )}
            {showAllUsers && filteredUsers.length > 4 && (
              <div className="flex justify-center pt-2 pb-6 border-t border-[#E5E7EB] mt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAllUsers(false)}
                  className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full"
                >
                  Show Less
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={userDetailsDialogOpen}
        onOpenChange={setUserDetailsDialogOpen}
      >
        <DialogContent className="max-w-lg border border-[#334155] bg-[#1E293B]">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-white">
              User Details
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#CBD5E1]">
              View user information and account status
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 mt-2">
              <div className="bg-gradient-to-br from-[#1E40AF]/20 via-[#1E40AF]/10 to-transparent p-6 rounded-xl border border-[#3B82F6]/30">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-['Inter'] text-xl">
                      {selectedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-['Inter'] text-white">
                        {selectedUser.name}
                      </h3>
                      <Badge
                        className={`font-['Roboto'] ${
                          selectedUser.status === "Active"
                            ? "bg-[#166534]/30 text-[#86EFAC] border-[#22C55E]"
                            : "bg-[#7F1D1D]/30 text-[#FCA5A5] border-[#F02801]"
                        }`}
                      >
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#94A3B8] font-['Roboto']">
                      {selectedUser.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-['Roboto']">Email</span>
                  </div>
                  <p className="font-['Inter'] text-white">
                    {selectedUser.email}
                  </p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-['Roboto']">Location</span>
                  </div>
                  <p className="font-['Inter'] text-white">
                    {selectedUser.location}
                  </p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-['Roboto']">Joined</span>
                  </div>
                  <p className="font-['Inter'] text-white">
                    {selectedUser.joinedDate}
                  </p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1 text-[#CBD5E1]">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-['Roboto']">Role</span>
                  </div>
                  <p className="font-['Inter'] text-white">
                    {selectedUser.role}
                  </p>
                </div>
              </div>

              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                <h4 className="font-['Inter'] text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#F02801]" />
                  Activity Summary
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Requests", value: "12" },
                    { label: "Quotes Received", value: "8" },
                    { label: "Orders Placed", value: "5" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-3 bg-[#1E293B] rounded-lg border border-[#334155]"
                    >
                      <p className="text-2xl font-['Inter'] text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-[#94A3B8] font-['Roboto']">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

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
                  onClick={() => setConfirmUserActionDialogOpen(true)}
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

      <Dialog
        open={confirmUserActionDialogOpen}
        onOpenChange={setConfirmUserActionDialogOpen}
      >
        <DialogContent className="max-w-md border-[#E5E7EB] bg-white">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">
              {selectedUser?.status === "Active"
                ? "Suspend User"
                : "Activate User"}
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              {selectedUser?.status === "Active"
                ? "Are you sure you want to suspend this user? They will no longer be able to access the platform."
                : "Are you sure you want to activate this user? They will regain access to the platform."}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 mt-2">
              <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center text-white font-['Inter']">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-['Inter'] text-[#0F172A]">
                      {selectedUser.name}
                    </p>
                    <p className="text-sm text-[#475569] font-['Roboto']">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>
              {selectedUser.status === "Active" && (
                <div className="bg-[#FEF3F2] p-4 rounded-xl border-2 border-[#F02801]/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-[#F02801]" />
                    <div>
                      <p className="font-['Inter'] text-[#7F1D1D] mb-1">
                        Warning
                      </p>
                      <p className="text-sm text-[#475569] font-['Roboto']">
                        Suspending this user will immediately revoke their
                        access. Any active quotes or requests remain visible but
                        they cannot create new ones.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
    </>
  );
}
