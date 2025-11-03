'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { Search, Eye, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock data
const mockEnquiries = [
  {
    id: 'ENQ-001',
    customer: 'John Smith',
    partName: 'Front Brake Pads',
    category: 'Brakes',
    vehicle: 'VW Golf 2018',
    registration: 'AB12 CDE',
    status: 'pending',
    createdAt: '2024-11-01T10:30:00',
    description: 'Need replacement brake pads for front wheels. Looking for OEM quality.',
    urgency: 'normal',
  },
  {
    id: 'ENQ-002',
    customer: 'David Clark',
    partName: 'Front Headlight Assembly',
    category: 'Bodywork',
    vehicle: 'Audi A4 2017',
    registration: 'GH78 IJK',
    status: 'quoted',
    createdAt: '2024-11-02T16:20:00',
    description: 'Left headlight assembly damaged. Need quick replacement.',
    urgency: 'urgent',
    quotedPrice: 185.00,
    quotedAt: '2024-11-02T17:30:00',
  },
  {
    id: 'ENQ-003',
    customer: 'Sarah Wilson',
    partName: 'Timing Belt Kit',
    category: 'Engine',
    vehicle: 'Toyota Corolla 2016',
    registration: 'IJ90 KLM',
    status: 'accepted',
    createdAt: '2024-11-03T14:10:00',
    description: 'Full timing belt kit with water pump if possible.',
    urgency: 'normal',
    quotedPrice: 275.50,
    quotedAt: '2024-11-03T15:20:00',
    acceptedAt: '2024-11-03T16:00:00',
  },
  {
    id: 'ENQ-004',
    customer: 'Mike Wilson',
    partName: 'Engine Oil Filter',
    category: 'Engine',
    vehicle: 'BMW 3 Series 2020',
    registration: 'EF56 GHI',
    status: 'declined',
    createdAt: '2024-10-28T08:45:00',
    description: 'Genuine BMW oil filter required.',
    urgency: 'normal',
  },
];

export default function SupplierEnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('2-3');

  const filteredEnquiries = mockEnquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.partName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockEnquiries.filter(e => e.status === 'pending').length;
  const quotedCount = mockEnquiries.filter(e => e.status === 'quoted').length;
  const acceptedCount = mockEnquiries.filter(e => e.status === 'accepted').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      case 'quoted':
        return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20';
      case 'accepted':
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'declined':
        return 'bg-[#F02801]/10 text-[#F02801] border-[#F02801]/20';
      default:
        return 'bg-[#475569]/10 text-[#475569] border-[#475569]/20';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    return urgency === 'urgent' ? (
      <Badge className="bg-[#F02801]/10 text-[#F02801] border-[#F02801]/20">Urgent</Badge>
    ) : null;
  };

  const handleSubmitQuote = () => {
    if (!quotePrice || parseFloat(quotePrice) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    toast.success('Quote submitted successfully');
    setQuoteDialogOpen(false);
    setQuotePrice('');
    setQuoteNotes('');
    setDeliveryTime('2-3');
    setSelectedEnquiry(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
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
          Manage customer part enquiries and submit quotes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Pending Response</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Quoted</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{quotedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                <Send className="h-6 w-6 text-[#3B82F6]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Roboto'] text-[#475569]">Accepted</p>
                <p className="font-['Inter'] text-[#0F172A] mt-1">{acceptedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-[#22C55E]" />
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
                <SelectItem value="declined">Declined</SelectItem>
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
                <TableHead className="font-['Roboto']">Status</TableHead>
                <TableHead className="font-['Roboto']">Received</TableHead>
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
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-['Roboto'] font-medium text-[#0F172A]">
                          {enquiry.partName}
                        </p>
                        <p className="font-['Roboto'] text-[#475569]">
                          {enquiry.category}
                        </p>
                      </div>
                      {getUrgencyBadge(enquiry.urgency)}
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
                      {enquiry.status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-[#F02801] hover:bg-[#D22301] text-white"
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setQuoteDialogOpen(true);
                          }}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Quote
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Inter']">Submit Quote</DialogTitle>
            <DialogDescription className="font-['Roboto']">
              Provide your best price for {selectedEnquiry?.partName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-[#F1F5F9]">
              <div className="grid grid-cols-2 gap-2 font-['Roboto']">
                <p className="text-[#475569]">Vehicle:</p>
                <p className="text-[#0F172A] font-medium">{selectedEnquiry?.vehicle}</p>
                <p className="text-[#475569]">Registration:</p>
                <p className="text-[#0F172A] font-medium">{selectedEnquiry?.registration}</p>
                <p className="text-[#475569]">Part:</p>
                <p className="text-[#0F172A] font-medium">{selectedEnquiry?.partName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-['Roboto'] text-[#0F172A]">
                Your Price (£) *
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
                step="0.01"
                min="0"
                className="font-['Roboto']"
              />
            </div>

            <div className="space-y-2">
              <label className="font-['Roboto'] text-[#0F172A]">
                Estimated Delivery
              </label>
              <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                <SelectTrigger className="font-['Roboto']">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same-day">Same Day</SelectItem>
                  <SelectItem value="next-day">Next Day</SelectItem>
                  <SelectItem value="2-3">2-3 Days</SelectItem>
                  <SelectItem value="3-5">3-5 Days</SelectItem>
                  <SelectItem value="5-7">5-7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="font-['Roboto'] text-[#0F172A]">
                Additional Notes
              </label>
              <Textarea
                placeholder="Part condition, warranty, etc."
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                rows={3}
                className="font-['Roboto']"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setQuoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#F02801] hover:bg-[#D22301] text-white"
              onClick={handleSubmitQuote}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
