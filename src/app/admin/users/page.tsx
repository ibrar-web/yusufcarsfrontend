'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, UserPlus, MoreVertical, Mail, Ban, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'customer',
    status: 'active',
    joined: '2024-01-15',
    lastActive: '2024-11-01',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@autoparts.co.uk',
    role: 'supplier',
    status: 'active',
    joined: '2024-02-20',
    lastActive: '2024-11-02',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.w@gmail.com',
    role: 'customer',
    status: 'suspended',
    joined: '2024-03-10',
    lastActive: '2024-10-15',
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@partsexpress.co.uk',
    role: 'supplier',
    status: 'pending',
    joined: '2024-11-01',
    lastActive: '2024-11-01',
  },
  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom.brown@example.com',
    role: 'customer',
    status: 'active',
    joined: '2024-01-05',
    lastActive: '2024-11-03',
  },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<'suspend' | 'activate' | null>(null);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'suspended':
        return 'bg-[#F02801]/10 text-[#F02801] border-[#F02801]/20';
      case 'pending':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      default:
        return 'bg-[#475569]/10 text-[#475569] border-[#475569]/20';
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'supplier' ? 'text-[#3B82F6]' : 'text-[#475569]';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-['Inter'] text-[#0F172A]">Users Management</h1>
          <p className="font-['Roboto'] text-[#475569] mt-1">
            Manage all platform users, customers, and suppliers
          </p>
        </div>
        <Button className="bg-[#F02801] hover:bg-[#D22301] text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#475569]" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-['Roboto']"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="font-['Roboto']">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
                <SelectItem value="supplier">Suppliers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="font-['Roboto']">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-['Inter']">
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-['Roboto']">Name</TableHead>
                <TableHead className="font-['Roboto']">Email</TableHead>
                <TableHead className="font-['Roboto']">Role</TableHead>
                <TableHead className="font-['Roboto']">Status</TableHead>
                <TableHead className="font-['Roboto']">Joined</TableHead>
                <TableHead className="font-['Roboto']">Last Active</TableHead>
                <TableHead className="font-['Roboto'] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-['Roboto'] font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span className={`font-['Roboto'] capitalize ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">
                    {new Date(user.joined).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">
                    {new Date(user.lastActive).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        {user.status === 'active' ? (
                          <DropdownMenuItem
                            className="text-[#F02801]"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionDialog('suspend');
                            }}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-[#22C55E]"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionDialog('activate');
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      <Dialog open={actionDialog !== null} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Inter']">
              {actionDialog === 'suspend' ? 'Suspend User' : 'Activate User'}
            </DialogTitle>
            <DialogDescription className="font-['Roboto']">
              {actionDialog === 'suspend'
                ? `Are you sure you want to suspend ${selectedUser?.name}? They will lose access to their account.`
                : `Are you sure you want to activate ${selectedUser?.name}? They will regain full access to their account.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              className={
                actionDialog === 'suspend'
                  ? 'bg-[#F02801] hover:bg-[#D22301]'
                  : 'bg-[#22C55E] hover:bg-[#16A34A]'
              }
              onClick={() => {
                // Handle action
                setActionDialog(null);
                setSelectedUser(null);
              }}
            >
              {actionDialog === 'suspend' ? 'Suspend' : 'Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
