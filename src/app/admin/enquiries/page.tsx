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
import { Search, Eye, MessageSquare } from 'lucide-react';

// Mock data
const mockEnquiries = [
  {
    id: 'ENQ-001',
    customer: 'John Smith',
    partName: 'Front Brake Pads',
    category: 'Brakes',
    vehicle: 'VW Golf 2018',
    registration: 'AB12 CDE',
    quotesReceived: 5,
    status: 'quoted',
    createdAt: '2024-11-01T10:30:00',
    updatedAt: '2024-11-01T14:20:00',
  },
  {
    id: 'ENQ-002',
    customer: 'Tom Brown',
    partName: 'Alternator',
    category: 'Electrical',
    vehicle: 'Ford Focus 2019',
    registration: 'CD34 EFG',
    quotesReceived: 3,
    status: 'accepted',
    createdAt: '2024-10-30T09:15:00',
    updatedAt: '2024-10-31T11:45:00',
  },
  {
    id: 'ENQ-003',
    customer: 'Mike Wilson',
    partName: 'Engine Oil Filter',
    category: 'Engine',
    vehicle: 'BMW 3 Series 2020',
    registration: 'EF56 GHI',
    quotesReceived: 0,
    status: 'pending',
    createdAt: '2024-11-03T08:45:00',
    updatedAt: '2024-11-03T08:45:00',
  },
  {
    id: 'ENQ-004',
    customer: 'David Clark',
    partName: 'Front Headlight Assembly',
    category: 'Bodywork',
    vehicle: 'Audi A4 2017',
    registration: 'GH78 IJK',
    quotesReceived: 8,
    status: 'quoted',
    createdAt: '2024-11-02T16:20:00',
    updatedAt: '2024-11-02T18:50:00',
  },
  {
    id: 'ENQ-005',
    customer: 'John Smith',
    partName: 'Rear Shock Absorbers',
    category: 'Suspension',
    vehicle: 'VW Golf 2018',
    registration: 'AB12 CDE',
    quotesReceived: 4,
    status: 'completed',
    createdAt: '2024-10-28T11:00:00',
    updatedAt: '2024-10-29T15:30:00',
  },
  {
    id: 'ENQ-006',
    customer: 'Sarah Wilson',
    partName: 'Timing Belt Kit',
    category: 'Engine',
    vehicle: 'Toyota Corolla 2016',
    registration: 'IJ90 KLM',
    quotesReceived: 6,
    status: 'quoted',
    createdAt: '2024-11-03T14:10:00',
    updatedAt: '2024-11-03T16:25:00',
  },
];

export default function AdminEnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredEnquiries = mockEnquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.registration.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || enquiry.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalEnquiries = mockEnquiries.length;
  const pendingEnquiries = mockEnquiries.filter(e => e.status === 'pending').length;
  const quotedEnquiries = mockEnquiries.filter(e => e.status === 'quoted').length;
  const completedEnquiries = mockEnquiries.filter(e => e.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      case 'quoted':
        return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20';
      case 'accepted':
        return 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20';
      case 'completed':
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'cancelled':
        return 'bg-[#F02801]/10 text-[#F02801] border-[#F02801]/20';
      default:
        return 'bg-[#475569]/10 text-[#475569] border-[#475569]/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ' ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-['Inter'] text-[#0F172A]">Enquiries</h1>
        <p className="font-['Roboto'] text-[#475569] mt-1">
          Monitor all customer part enquiries and quotes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Total Enquiries</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{totalEnquiries}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#F02801]/10 flex items-center justify-center">
                <span className="text-[#F02801]">📝</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Pending</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{pendingEnquiries}</p>
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
                <p className="font-['Roboto'] text-[#475569]">Quoted</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{quotedEnquiries}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                <span className="text-[#3B82F6]">💬</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Completed</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{completedEnquiries}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                <span className="text-[#22C55E]">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#475569]" />
              <Input
                placeholder="Search enquiries..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="font-['Roboto']">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Engine">Engine</SelectItem>
                <SelectItem value="Brakes">Brakes</SelectItem>
                <SelectItem value="Suspension">Suspension</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Bodywork">Bodywork</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-['Inter']">
            All Enquiries ({filteredEnquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-['Roboto']">Enquiry ID</TableHead>
                <TableHead className="font-['Roboto']">Customer</TableHead>
                <TableHead className="font-['Roboto']">Part Details</TableHead>
                <TableHead className="font-['Roboto']">Vehicle</TableHead>
                <TableHead className="font-['Roboto']">Quotes</TableHead>
                <TableHead className="font-['Roboto']">Status</TableHead>
                <TableHead className="font-['Roboto']">Created</TableHead>
                <TableHead className="font-['Roboto'] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="font-['Roboto'] font-medium text-[#F02801]">
                    {enquiry.id}
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">
                    {enquiry.customer}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-['Roboto'] font-medium text-[#0F172A]">
                        {enquiry.partName}
                      </p>
                      <p className="font-['Roboto'] text-[#475569]">
                        {enquiry.category}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-['Roboto'] text-[#0F172A]">
                        {enquiry.vehicle}
                      </p>
                      <p className="font-['Roboto'] text-[#475569]">
                        {enquiry.registration}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#0F172A]">
                    {enquiry.quotesReceived > 0 ? enquiry.quotesReceived : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(enquiry.status)}>
                      {enquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-['Roboto'] text-[#475569]">
                    {formatDate(enquiry.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-4 w-4" />
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
