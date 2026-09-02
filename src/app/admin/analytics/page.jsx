"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { TrendingUp, Users, DollarSign, Package, BarChart3, Clock, CheckCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
  });

  const [statusData, setStatusData] = useState({
    Pending: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("crm_orders");
    if (saved) {
      try {
        const orders = JSON.parse(saved);

        let revenue = 0;
        let delivered = 0;
        let pending = 0;
        const statusCounts = { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0 };

        orders.forEach((order) => {
          if (order.status === "Delivered") {
            revenue += parseInt(order.totalAmount) || 0;
            delivered++;
          }
          if (order.status === "Pending") {
            pending++;
          }

          if (statusCounts[order.status] !== undefined) {
            statusCounts[order.status]++;
          }
        });

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          deliveredOrders: delivered,
          pendingOrders: pending,
        });

        setStatusData(statusCounts);
      } catch (e) {
        console.error("Error parsing crm_orders:", e);
      }
    }
  }, []);

  const maxStatusCount = Math.max(...Object.values(statusData), 1);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/analytics" />

      {/* Friendly Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-gradient-to-r from-[#0c221e]/80 via-[#0a1815]/60 to-transparent p-6 rounded-3xl border border-teal-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-teal-400">
              Studio Financials & Pipeline
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Studio Performance & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-light max-w-2xl">
            Real-time tracking of studio revenue, client order delivery pipeline, and photo print fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-2xl bg-teal-500/10 border border-teal-500/30 shrink-0">
          <span className="text-xs text-zinc-400">Fulfillment Rate:</span>
          <span className="text-base font-black text-emerald-300">
            {stats.totalOrders > 0 ? `${Math.round((stats.deliveredOrders / stats.totalOrders) * 100)}%` : "100%"}
          </span>
        </div>
      </div>

      {/* 4 Interactive & Friendly KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Revenue */}
        <div className="bg-[#0b1412] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-200 group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-amber-300 text-xs sm:text-sm font-semibold">Total Revenue</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300">
            ₹{stats.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-[11px] text-amber-400/70 mt-1.5 font-light">From completed & delivered orders</p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#0b1412] border border-teal-500/20 hover:border-teal-400/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-200 group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-teal-300 text-xs sm:text-sm font-semibold">Total Orders</span>
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-300">{stats.totalOrders}</h3>
          <p className="text-[11px] text-teal-400/70 mt-1.5 font-light">All-time print & frame orders</p>
        </div>

        {/* Completed */}
        <div className="bg-[#0b1412] border border-emerald-500/20 hover:border-emerald-400/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-200 group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-emerald-300 text-xs sm:text-sm font-semibold">Delivered Orders</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <CheckCheck className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{stats.deliveredOrders}</h3>
          <p className="text-[11px] text-emerald-400/70 mt-1.5 font-light">Successfully handed to clients</p>
        </div>

        {/* Action Required */}
        <div className="bg-[#0b1412] border border-rose-500/20 hover:border-rose-400/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-200 group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-rose-300 text-xs sm:text-sm font-semibold">Pending Processing</span>
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-300">{stats.pendingOrders}</h3>
          <p className="text-[11px] text-rose-400/70 mt-1.5 font-light">In laboratory / printing queue</p>
        </div>
      </div>

      {/* Pipeline Chart Card */}
      <div className="bg-[#0a1310] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              Order Pipeline Distribution
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Visual overview of photo frames, prints, and custom photo gifts across production stages.
            </p>
          </div>
          <Link
            href="/admin/crm"
            className="text-xs text-teal-300 hover:text-white flex items-center gap-1 font-semibold underline underline-offset-4"
          >
            <span>View Orders Board</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex h-64 items-end gap-4 sm:gap-8 pt-6 pb-2 border-b border-white/10">
          {Object.entries(statusData).map(([status, count], idx) => {
            const heightPercent = count === 0 ? 8 : Math.max(14, (count / maxStatusCount) * 100);
            const colorGradients = [
              "from-zinc-600 to-zinc-700 text-zinc-300",
              "from-teal-500 to-teal-600 text-teal-300",
              "from-emerald-500 to-emerald-600 text-emerald-300",
              "from-amber-400 to-yellow-500 text-amber-300",
            ];

            return (
              <div key={status} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div className="mb-2 text-sm sm:text-base font-black text-white group-hover:scale-125 transition-transform duration-200">
                  {count}
                </div>
                <div
                  className={`w-full max-w-[90px] rounded-t-xl bg-gradient-to-t ${colorGradients[idx % colorGradients.length]} transition-all duration-700 ease-out shadow-lg group-hover:brightness-110`}
                  style={{ height: `${heightPercent}%` }}
                />
                <div className="mt-4 text-[11px] sm:text-xs font-bold text-zinc-300 uppercase tracking-wider text-center">
                  {status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
