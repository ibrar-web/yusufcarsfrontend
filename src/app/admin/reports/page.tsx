'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

// Mock data
const monthlyData = [
  { month: 'May', enquiries: 145, quotes: 432, orders: 98 },
  { month: 'Jun', enquiries: 168, quotes: 512, orders: 124 },
  { month: 'Jul', enquiries: 192, quotes: 598, orders: 142 },
  { month: 'Aug', enquiries: 215, quotes: 678, orders: 165 },
  { month: 'Sep', enquiries: 234, quotes: 745, orders: 189 },
  { month: 'Oct', enquiries: 267, quotes: 823, orders: 218 },
];

const categoryData = [
  { name: 'Engine', value: 285, color: '#F02801' },
  { name: 'Brakes', value: 198, color: '#F59E0B' },
  { name: 'Suspension', value: 156, color: '#3B82F6' },
  { name: 'Electrical', value: 142, color: '#8B5CF6' },
  { name: 'Bodywork', value: 128, color: '#22C55E' },
  { name: 'Interior', value: 98, color: '#475569' },
];

const supplierPerformance = [
  { name: 'AutoParts Express', quotes: 145, won: 98, responseTime: 2.5 },
  { name: 'Motors Direct', quotes: 203, won: 142, responseTime: 1.8 },
  { name: 'Parts Express UK', quotes: 89, won: 54, responseTime: 3.1 },
  { name: 'Quick Parts Ltd', quotes: 67, won: 38, responseTime: 4.2 },
  { name: 'UK Auto Supply', quotes: 124, won: 76, responseTime: 2.9 },
];

export default function AdminReportsPage() {
  const [period, setPeriod] = useState('6months');

  const totalEnquiries = monthlyData.reduce((sum, m) => sum + m.enquiries, 0);
  const totalQuotes = monthlyData.reduce((sum, m) => sum + m.quotes, 0);
  const totalOrders = monthlyData.reduce((sum, m) => sum + m.orders, 0);
  const conversionRate = ((totalOrders / totalEnquiries) * 100).toFixed(1);

  const enquiriesGrowth = ((monthlyData[monthlyData.length - 1].enquiries - monthlyData[0].enquiries) / monthlyData[0].enquiries * 100).toFixed(1);
  const ordersGrowth = ((monthlyData[monthlyData.length - 1].orders - monthlyData[0].orders) / monthlyData[0].orders * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-['Inter'] text-[#0F172A]">Reports & Analytics</h1>
          <p className="font-['Roboto'] text-[#475569] mt-1">
            Platform insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] font-['Roboto']">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#F02801] hover:bg-[#D22301] text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-['Roboto'] text-[#475569]">Total Enquiries</p>
              <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{enquiriesGrowth}%
              </Badge>
            </div>
            <p className="font-['Inter'] text-[#0F172A]">{totalEnquiries}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-['Roboto'] text-[#475569]">Total Quotes</p>
              <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20">
                {(totalQuotes / totalEnquiries).toFixed(1)} avg
              </Badge>
            </div>
            <p className="font-['Inter'] text-[#0F172A]">{totalQuotes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-['Roboto'] text-[#475569]">Completed Orders</p>
              <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{ordersGrowth}%
              </Badge>
            </div>
            <p className="font-['Inter'] text-[#0F172A]">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-['Roboto'] text-[#475569]">Conversion Rate</p>
              <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20">
                {conversionRate}%
              </Badge>
            </div>
            <p className="font-['Inter'] text-[#0F172A]">{totalOrders}/{totalEnquiries}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="font-['Inter']">Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#475569" style={{ fontFamily: 'Roboto' }} />
                <YAxis stroke="#475569" style={{ fontFamily: 'Roboto' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontFamily: 'Roboto',
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Roboto' }} />
                <Line type="monotone" dataKey="enquiries" stroke="#F02801" strokeWidth={2} name="Enquiries" />
                <Line type="monotone" dataKey="quotes" stroke="#3B82F6" strokeWidth={2} name="Quotes" />
                <Line type="monotone" dataKey="orders" stroke="#22C55E" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-['Inter']">Enquiries by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontFamily: 'Roboto',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="font-['Inter']">Supplier Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#475569" style={{ fontFamily: 'Roboto' }} />
              <YAxis stroke="#475569" style={{ fontFamily: 'Roboto' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontFamily: 'Roboto',
                }}
              />
              <Legend wrapperStyle={{ fontFamily: 'Roboto' }} />
              <Bar dataKey="quotes" fill="#3B82F6" name="Total Quotes" />
              <Bar dataKey="won" fill="#22C55E" name="Won Quotes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.map((category) => (
          <Card key={category.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Roboto'] text-[#475569]">{category.name}</p>
                  <p className="font-['Inter'] text-[#0F172A] mt-1">{category.value} enquiries</p>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
