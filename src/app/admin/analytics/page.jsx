"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { TrendingUp, Users, DollarSign, Package } from "lucide-react";

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
 Delivered: 0
 });

 useEffect(() => {
 const saved = localStorage.getItem("crm_orders");
 if (saved) {
 const orders = JSON.parse(saved);
 
 let revenue = 0;
 let delivered = 0;
 let pending = 0;
 const statusCounts = { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0 };

 orders.forEach(order => {
 // Only count delivered orders in revenue for realistic metrics
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
 }
 }, []);

 const maxStatusCount = Math.max(...Object.values(statusData), 1);

 return (
 <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand-gradient hover-glow-brand/30">
 <AdminNav />
 
 <main className="max-w-7xl mx-auto px-6 py-12">
 <header className="mb-12">
 <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Studio Analytics</h1>
 <p className="text-zinc-400">Track your revenue and order pipeline.</p>
 </header>

 {/* Top KPIs */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
 
 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gradient hover-glow-brand/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-4">
 <p className="text-zinc-400 font-medium">Total Revenue</p>
 <DollarSign className="text-brand-gradient w-5 h-5" />
 </div>
 <h3 className="text-3xl font-black">₹{stats.totalRevenue.toLocaleString()}</h3>
 <p className="text-xs text-zinc-500 mt-2">From delivered orders</p>
 </div>
 </div>

 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-4">
 <p className="text-zinc-400 font-medium">Total Orders</p>
 <Package className="text-blue-500 w-5 h-5" />
 </div>
 <h3 className="text-3xl font-black">{stats.totalOrders}</h3>
 <p className="text-xs text-zinc-500 mt-2">All time</p>
 </div>
 </div>

 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-4">
 <p className="text-zinc-400 font-medium">Completed</p>
 <TrendingUp className="text-green-500 w-5 h-5" />
 </div>
 <h3 className="text-3xl font-black">{stats.deliveredOrders}</h3>
 <p className="text-xs text-zinc-500 mt-2">Successfully delivered</p>
 </div>
 </div>

 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-4">
 <p className="text-zinc-400 font-medium">Action Required</p>
 <Users className="text-rose-500 w-5 h-5" />
 </div>
 <h3 className="text-3xl font-black">{stats.pendingOrders}</h3>
 <p className="text-xs text-zinc-500 mt-2">Orders waiting for processing</p>
 </div>
 </div>

 </div>

 {/* Charts Section */}
 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
 <h3 className="text-xl font-bold mb-8">Order Pipeline</h3>
 
 <div className="flex h-64 items-end gap-4 sm:gap-8">
 {Object.entries(statusData).map(([status, count], idx) => {
 // Calculate height percentage based on max value to make it dynamic
 const heightPercent = count === 0 ? 0 : Math.max(10, (count / maxStatusCount) * 100);
 const colors = ["bg-zinc-700", "bg-blue-500", "bg-purple-500", "bg-green-500"];
 
 return (
 <div key={status} className="flex-1 flex flex-col items-center justify-end h-full group">
 <div className="mb-2 text-xl font-black opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-300">
 {count}
 </div>
 <div 
 className={`w-full rounded-t-xl transition-all duration-1000 ease-out ${colors[idx]}`}
 style={{ height: `${heightPercent}%` }}
 ></div>
 <div className="mt-4 text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider text-center">
 {status}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </main>
 </div>
 );
}
