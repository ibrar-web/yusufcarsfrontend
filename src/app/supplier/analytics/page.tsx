"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryBreakdownData, quotePerformanceData } from "@/page-components/supplier-dashboard/data";
import { apiGet } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type SupplierStats = {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalReviews: number;
  averageRating: number;
};

type SupplierStatsResponse = {
  statusCode: number;
  message: string;
  data: SupplierStats;
};

export default function SupplierAnalyticsPage() {
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const maxQuotes = Math.max(...categoryBreakdownData.map((item) => item.quotes));

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      setIsStatsLoading(true);
      setStatsError(null);

      try {
        const response = await apiGet<SupplierStatsResponse>(apiRoutes.supplier.stats.summary);
        if (!isMounted) return;
        if (response?.data) {
          setStats(response.data);
          return;
        }
        setStatsError("The stats response was empty.");
      } catch (error) {
        if (!isMounted) return;
        setStatsError(error instanceof Error ? error.message : "Failed to load stats.");
      } finally {
        if (isMounted) {
          setIsStatsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statsMetrics = stats
    ? [
        {
          label: "Total orders",
          value: stats.totalOrders.toLocaleString("en-GB"),
        },
        {
          label: "Active orders",
          value: stats.activeOrders.toLocaleString("en-GB"),
        },
        {
          label: "Completed orders",
          value: stats.completedOrders.toLocaleString("en-GB"),
        },
        {
          label: "Total reviews",
          value: stats.totalReviews.toLocaleString("en-GB"),
        },
        {
          label: "Average rating",
          value: stats.averageRating.toFixed(1),
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FFFFFF]">
        <CardContent className="p-6">
          <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">Analytics</h1>
          <p className="text-[#475569] font-['Roboto']">Track your performance and business metrics</p>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="font-['Inter'] text-[#0F172A]">Stats overview</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Live counts pulled from supplier/stats</CardDescription>
        </CardHeader>
        <CardContent>
          {isStatsLoading ? (
            <p className="text-sm font-['Roboto'] text-[#475569]">Loading stats…</p>
          ) : stats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statsMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-[#F1F5F9] bg-white px-4 py-3 shadow-sm"
                >
                  <p className="text-xs font-['Roboto'] uppercase tracking-wide text-[#94A3B8]">{metric.label}</p>
                  <p className="text-2xl font-['Inter'] text-[#0F172A]">{metric.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-['Roboto'] text-[#F02801]">
              Unable to load stats.
              {statsError ? ` ${statsError}` : ""}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="font-['Inter'] text-[#0F172A]">Quote Performance</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Monthly quotes and acceptance rate</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={quotePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                style={{ fontFamily: "Roboto", fontSize: "12px" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                style={{ fontFamily: "Roboto", fontSize: "12px" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  fontFamily: "Roboto",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Legend wrapperStyle={{ fontFamily: "Roboto", fontSize: "14px", paddingTop: "16px" }} />
              <Line type="monotone" dataKey="sent" stroke="#F02801" strokeWidth={3} name="Quotes Sent" dot={{ fill: "#F02801", r: 4 }} />
              <Line type="monotone" dataKey="accepted" stroke="#22C55E" strokeWidth={3} name="Accepted" dot={{ fill: "#22C55E", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="font-['Inter'] text-[#0F172A]">Category Performance</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Your quotes by part category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {categoryBreakdownData.map((category) => {
              const percentage = (category.quotes / maxQuotes) * 100;
              return (
                <div key={category.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Roboto'] text-[#0F172A]">{category.category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[#475569] font-['Roboto']">{category.quotes} quotes</span>
                      <span className="text-sm text-[#0F172A] font-['Roboto'] min-w-[60px] text-right">£{category.avgPrice} avg</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#F02801] rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
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
