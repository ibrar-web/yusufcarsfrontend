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
import { Search, Eye, Mail, Star, CheckCircle2 } from 'lucide-react';

// Mock data
const mockSuppliers = [
  {
    id: '1',
    name: 'AutoParts Express',
    contactName: 'Sarah Johnson',
    email: 'sarah@autoparts.co.uk',
    phone: '020 7946 0958',
    rating: 4.8,
    totalQuotes: 145,
    activeQuotes: 12,
    wonQuotes: 98,
    responseTime: '2.5 hours',
    status: 'verified',
    memberSince: '2024-02-20',
  },
  {
    id: '2',
    name: 'Parts Express UK',
    contactName: 'Emma Davis',
    email: 'emma@partsexpress.co.uk',
    phone: '020 7946 0823',
    rating: 4.6,
    totalQuotes: 89,
    activeQuotes: 8,
    wonQuotes: 54,
    responseTime: '3.1 hours',
    status: 'pending',
    memberSince: '2024-11-01',
  },
  {
    id: '3',
    name: 'Motors Direct',
    contactName: 'Robert Lee',
    email: 'robert@motorsdirect.co.uk',
    phone: '020 7946 0745',
    rating: 4.9,
    totalQuotes: 203,
    activeQuotes: 15,
    wonQuotes: 142,
    responseTime: '1.8 hours',
    status: 'verified',
    memberSince: '2024-01-10',
  },
  {
    id: '4',
    name: 'Quick Parts Ltd',
    contactName: 'Lisa Anderson',
    email: 'lisa@quickparts.co.uk',
    phone: '020 7946 0912',
    rating: 4.3,
    totalQuotes: 67,
    activeQuotes: 5,
    wonQuotes: 38,
    responseTime: '4.2 hours',
    status: 'verified',
    memberSince: '2024-04-15',
  },
];

export default function AdminSuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSuppliers = mockSuppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalSuppliers = mockSuppliers.length;
  const verifiedSuppliers = mockSuppliers.filter(s => s.status === 'verified').length;
  const pendingSuppliers = mockSuppliers.filter(s => s.status === 'pending').length;
  const avgRating = (mockSuppliers.reduce((sum, s) => sum + s.rating, 0) / mockSuppliers.length).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'pending':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      case 'suspended':
        return 'bg-[#F02801]/10 text-[#F02801] border-[#F02801]/20';
      default:
        return 'bg-[#475569]/10 text-[#475569] border-[#475569]/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-['Inter'] text-[#0F172A]">Suppliers</h1>
        <p className="font-['Roboto'] text-[#475569] mt-1">
          Manage and verify supplier accounts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Total Suppliers</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{totalSuppliers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#F02801]/10 flex items-center justify-center">
                <span className="text-[#F02801]">🏪</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Verified</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{verifiedSuppliers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-[#22C55E]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Pending Review</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{pendingSuppliers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <span className="text-[#F59E0B]">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Avg Rating</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1 flex items-center gap-1">
                  {avgRating}
                  <Star className="h-4 w-4 text-[#F59E0B] fill-[#F59E0B]" />
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#475569]" />
              <Input
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-['Roboto']"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="font-['Roboto']">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-['Inter']">
            All Suppliers ({filteredSuppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-['Roboto']">Business Name</TableHead>
                <TableHead className="font-['Roboto']">Contact</TableHead>
                <TableHead className="font-['Roboto']">Rating</TableHead>
                <TableHead className="font-['Roboto']">Quotes</TableHead>
                <TableHead className="font-['Roboto']">Response Time</TableHead>
                <TableHead className="font-['Roboto']">Status</TableHead>
                <TableHead className="font-['Roboto']">Member Since</TableHead>
                <TableHead className="font-['Roboto'] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <p className="font-['Roboto'] font-medium text-[#0F172A]">
                      {supplier.name}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-['Roboto'] text-[#0F172A]">
                        {supplier.contactName}
                      </p>
                      <p className="font-['Roboto'] text-[#475569]">
                        {supplier.email}
                      </p>
                      <p className="font-['Roboto'] text-[#475569]">
                        {supplier.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="font-['Roboto'] text-[#0F172A]">
                        {supplier.rating}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-['Roboto'] text-[#0F172A]">
                        {supplier.wonQuotes}/{supplier.totalQuotes} won
                      </p>
                      <p className="font-['Roboto'] text-[#475569]">
                        {supplier.activeQuotes} active
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">
                    {supplier.responseTime}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(supplier.status)}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">
                    {new Date(supplier.memberSince).toLocaleDateString('en-GB')}
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
