'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  adminCategoryData,
  adminStats,
  adminWeeklyData,
} from "@/page-components/admin-dashboard/data";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, ShoppingCart, TrendingUp, Users } from "lucide-react";

export default function AdminOverviewPage() {
  const stats = adminStats;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEE2E2] via-[#FEF3F2] to-white border-2 border-[#F02801]/20 p-4 md:p-5 shadow-[0_0_24px_rgba(240,40,1,0.12)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F02801]/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">
            Overview
          </h1>
          <p className="text-base md:text-lg text-[#475569] font-['Roboto']">
            Platform performance and key metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[#FEE2E2] to-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F02801]/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#7F1D1D] mb-1 font-['Roboto'] font-medium">
                  Active Suppliers
                </p>
                <p className="text-3xl font-['Inter'] font-bold text-[#0F172A]">
                  {stats.activeSuppliers}
                </p>
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
                <p className="text-sm text-[#1E40AF] mb-1 font-['Roboto'] font-medium">
                  Total Users
                </p>
                <p className="text-3xl font-['Inter'] font-bold text-[#0F172A]">
                  {stats.totalUsers.toLocaleString()}
                </p>
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
                <p className="text-sm text-[#92400E] mb-1 font-['Roboto'] font-medium">
                  Total Quotes
                </p>
                <p className="text-3xl font-['Inter'] font-bold text-[#0F172A]">
                  {stats.totalQuotes.toLocaleString()}
                </p>
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

      <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
        <CardHeader className="pb-6">
          <CardTitle className="font-['Inter'] text-[#0F172A]">Platform Activity</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">
            Weekly user and supplier growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={adminWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="week"
                stroke="#475569"
                style={{ fontFamily: "Roboto", fontSize: "12px" }}
                tickLine={false}
              />
              <YAxis
                stroke="#475569"
                style={{ fontFamily: "Roboto", fontSize: "12px" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  fontFamily: "Roboto",
                  boxShadow: "0 4px 24px rgba(15,23,42,0.08)",
                }}
              />
              <Legend wrapperStyle={{ fontFamily: "Roboto", fontSize: "14px", paddingTop: "20px" }} />
              <Line type="monotone" dataKey="users" stroke="#F02801" strokeWidth={3} name="Users" dot={{ fill: "#F02801", r: 4 }} />
              <Line type="monotone" dataKey="suppliers" stroke="#22C55E" strokeWidth={3} name="Suppliers" dot={{ fill: "#22C55E", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
        <CardHeader className="pb-6">
          <CardTitle className="font-['Inter'] text-[#0F172A]">Category Performance</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">
            Most requested parts by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {adminCategoryData.map((cat) => {
              const maxRequests = Math.max(...adminCategoryData.map((c) => c.requests));
              const percentage = (cat.requests / maxRequests) * 100;
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Roboto'] text-[#0F172A]">{cat.category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[#475569] font-['Roboto']">
                        {cat.requests} requests
                      </span>
                      <span className="text-sm text-[#0F172A] font-['Roboto'] min-w-[60px] text-right">
                        £{cat.avgPrice} avg
                      </span>
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
  );
}
