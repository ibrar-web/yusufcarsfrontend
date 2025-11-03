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
import { Search, Eye, Mail } from 'lucide-react';

// Mock data
const mockCustomers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    totalEnquiries: 12,
    activeEnquiries: 3,
    completedOrders: 8,
    totalSpent: 2450.50,
    memberSince: '2024-01-15',
    lastActive: '2024-11-01',
  },
  {
    id: '2',
    name: 'Mike Wilson',
    email: 'mike.w@gmail.com',
    totalEnquiries: 5,
    activeEnquiries: 1,
    completedOrders: 3,
    totalSpent: 890.00,
    memberSince: '2024-03-10',
    lastActive: '2024-10-28',
  },
  {
    id: '3',
    name: 'Tom Brown',
    email: 'tom.brown@example.com',
    totalEnquiries: 18,
    activeEnquiries: 2,
    completedOrders: 15,
    totalSpent: 4275.25,
    memberSince: '2024-01-05',
    lastActive: '2024-11-03',
  },
  {
    id: '4',
    name: 'James Taylor',
    email: 'james.t@example.com',
    totalEnquiries: 3,
    activeEnquiries: 0,
    completedOrders: 2,
    totalSpent: 450.00,
    memberSince: '2024-09-12',
    lastActive: '2024-10-20',
  },
  {
    id: '5',
    name: 'David Clark',
    email: 'david.clark@example.com',
    totalEnquiries: 9,
    activeEnquiries: 4,
    completedOrders: 4,
    totalSpent: 1680.75,
    memberSince: '2024-02-28',
    lastActive: '2024-11-02',
  },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCustomers = mockCustomers.length;
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const activeEnquiries = mockCustomers.reduce((sum, c) => sum + c.activeEnquiries, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-['Inter'] text-[#0F172A]">Customers</h1>
        <p className="font-['Roboto'] text-[#475569] mt-1">
          Manage and view customer activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Total Customers</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{totalCustomers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#F02801]/10 flex items-center justify-center">
                <span className="text-[#F02801]">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Active Enquiries</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{activeEnquiries}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <span className="text-[#F59E0B]">📋</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Total Revenue</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">
                  £{totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                <span className="text-[#22C55E]">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#475569]" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-['Roboto']"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-['Inter']">
            All Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-['Roboto']">Customer</TableHead>
                <TableHead className="font-['Roboto']">Enquiries</TableHead>
                <TableHead className="font-['Roboto']">Completed Orders</TableHead>
                <TableHead className="font-['Roboto']">Total Spent</TableHead>
                <TableHead className="font-['Roboto']">Member Since</TableHead>
                <TableHead className="font-['Roboto']">Last Active</TableHead>
                <TableHead className="font-['Roboto'] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-['Roboto'] font-medium text-[#0F172A]">
                        {customer.name}
                      </p>
                      <p className="font-['Roboto'] text-[#475569]">
                        {customer.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-['Roboto'] text-[#0F172A]">
                        {customer.totalEnquiries}
                      </span>
                      {customer.activeEnquiries > 0 && (
                        <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20">
                          {customer.activeEnquiries} active
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">
                    {customer.completedOrders}
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">
                    £{customer.totalSpent.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">
                    {new Date(customer.memberSince).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">
                    {new Date(customer.lastActive).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
