"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Search, Package, CheckCircle2, Clock, Truck, Home, Printer } from "lucide-react";
import Link from "next/link";

import { getOrder } from "@/app/actions/orders";

const COURIER_STEPS = [
  { id: "PENDING", label: "Order Placed", icon: Clock },
  { id: "PROCESSING", label: "Processing", icon: Package },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: Home },
];

const PICKUP_STEPS = [
  { id: "PENDING", label: "Order Placed", icon: Clock },
  { id: "PROCESSING", label: "Processing", icon: Package },
  { id: "READY_FOR_PICKUP", label: "Ready for Pickup", icon: Home },
  { id: "PICKED_UP", label: "Picked Up", icon: CheckCircle2 },
];

export default function TrackOrderPage() {
 const [orderId, setOrderId] = useState("");
 const [searchQuery, setSearchQuery] = useState("");
 const [order, setOrder] = useState(null);
 const [error, setError] = useState("");
 const [isSearching, setIsSearching] = useState(false);

 // If orderId is provided in URL query params on load, we can auto-search (optional)
 useEffect(() => {
 const params = new URLSearchParams(window.location.search);
 const idParam = params.get("id");
 if (idParam) {
 setOrderId(idParam);
 handleSearch(idParam);
 }
 }, []);

 const handleSearch = async (idToSearch = orderId) => {
 const cleanId = idToSearch.trim().toUpperCase();
 if (!cleanId) {
  setError("Please enter a valid Order ID");
  return;
 }
 
 setIsSearching(true);
 setError("");
 setOrder(null);
 setSearchQuery(cleanId);

 try {
      const res = await getOrder(cleanId);
      if (res.success && res.order) {
        setOrder({
          orderId: res.order.orderId,
          status: res.order.status.toUpperCase() === 'UNCONFIRMED' ? 'PENDING' : res.order.status.toUpperCase(),
          totalAmount: res.order.totalAmount,
          createdAt: res.order.createdAt,
          customerName: res.order.customerName,
          address: res.order.address,
          courierTrackingId: res.order.courierTrackingId,
          items: typeof res.order.items === 'string' ? JSON.parse(res.order.items) : res.order.items,
        });
      } else {
        setError(res.error || `No order found with ID: ${cleanId}`);
        setOrder(null);
      }
    } catch (err) {
      setError("Error fetching order. Please try again.");
    }
 setIsSearching(false);
 };

  const getActiveSteps = () => {
    return order?.address === "Collect from Studio" ? PICKUP_STEPS : COURIER_STEPS;
  };

  const getCurrentStepIndex = (status) => {
    const steps = getActiveSteps();
    return steps.findIndex(step => step.id === status);
  };

 const handlePrint = () => {
 window.print();
 };

 return (
 <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-20">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 
 <AnimatedSection className="text-center mb-12 print:hidden">
 <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
 Track Your Order
 </h1>
 <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
 Enter the tracking ID you received on WhatsApp to check the current status of your photo studio order.
 </p>
 </AnimatedSection>
 
 {/* Print Header */}
 <div className="hidden print:block text-center mb-8 border-b border-zinc-200 pb-8">
 <h1 className="font-serif text-4xl font-bold text-black mb-2">SSS Studio</h1>
 <p className="text-zinc-500">Invoice / Receipt</p>
 <p className="text-sm text-zinc-500 mt-4">Order ID: {orderId}</p>
 </div>

 {/* Search Box */}
 <AnimatedSection delay={0.1} className="max-w-2xl mx-auto mb-16 print:hidden">
 <div className="relative flex items-center">
 <div className="absolute left-4 text-zinc-400">
 <Search className="w-6 h-6" />
 </div>
 <input 
 type="text" 
 placeholder="e.g. SSS-12345678"
 value={orderId}
 onChange={(e) => setOrderId(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
 className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl py-5 pl-14 pr-32 text-lg font-mono focus:outline-none focus:border-cyan-500 transition-colors shadow-sm dark:text-white uppercase"
 />
 <button 
 onClick={() => handleSearch()}
 disabled={isSearching}
 className="absolute right-2 bg-brand-gradient hover-glow-brand text-white border-transparent hover:bg-brand-gradient hover-glow-brand text-black px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
 >
 {isSearching ? "Searching..." : "Track"}
 </button>
 </div>
 {error && (
 <p className="text-red-500 font-medium mt-4 text-center">{error}</p>
 )}
 </AnimatedSection>

 {/* Order Results */}
 {order && (
 <AnimatedSection delay={0.2} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-10 shadow-xl shadow-zinc-200/20 dark:shadow-none print:border-none print:shadow-none print:p-0">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-800">
 <div>
 <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Order Details</p>
 <div className="flex items-center gap-4">
 <h2 className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">{order.orderId}</h2>
 {order.status !== "PENDING" && (
 <button 
 onClick={handlePrint}
 className="print:hidden flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
 >
 <Printer className="w-4 h-4" /> Receipt
 </button>
 )}
 </div>
 <p className="text-zinc-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
 {order.courierTrackingId && (
    <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl inline-block">
      <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase mb-1">Courier Tracking ID</p>
      <p className="text-lg font-mono font-bold text-zinc-900 dark:text-white select-all">{order.courierTrackingId}</p>
    </div>
  )}
 </div>
 <div className="mt-4 md:mt-0 text-left md:text-right">
 <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Amount</p>
 <p className="text-3xl font-bold text-brand-gradient">₹{order.totalAmount}</p>
 </div>
 </div>

 {/* Visual Timeline */}
 <div className="relative mb-16 pt-4 print:hidden">
 <div className="absolute top-1/2 left-0 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 -translate-y-1/2 rounded-full hidden sm:block" />
 
 <div className="absolute top-1/2 left-0 h-1.5 bg-brand-gradient hover-glow-brand text-white border-transparent -translate-y-1/2 rounded-full hidden sm:block transition-all duration-1000" 
 style={{ width: `${(getCurrentStepIndex(order.status) / (getActiveSteps().length - 1)) * 100}%` }} 
 />

 <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 sm:gap-0">
 {getActiveSteps().map((step, index) => {
 const currentIdx = getCurrentStepIndex(order.status);
 const isCompleted = index <= currentIdx;
 const isCurrent = index === currentIdx;
 const Icon = step.icon;

 return (
 <div key={step.id} className="relative flex sm:flex-col items-center gap-4 sm:gap-3 z-10">
 <div className={`
 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-500 relative
 ${isCurrent ? 'bg-brand-gradient hover-glow-brand text-white border-transparent border-white dark:border-zinc-900 shadow-[0_0_25px_rgba(6,182,212,0.4)] text-black scale-110 z-20' : 
 isCompleted ? 'bg-brand-gradient hover-glow-brand border-white dark:border-zinc-900 shadow-md text-black' : 
 'bg-zinc-100 dark:bg-zinc-800 border-white dark:border-zinc-900 text-zinc-400'}
 `}>
 <Icon className="w-5 h-5" />
 </div>
 
 {/* Vertical line for mobile */}
 {index < getActiveSteps().length - 1 && (
 <div className={`absolute top-12 left-6 w-0.5 h-12 -ml-0.25 sm:hidden ${index < currentIdx ? 'bg-brand-gradient hover-glow-brand text-white border-transparent' : 'bg-zinc-100 dark:bg-zinc-800'}`} />
 )}

 <div className="sm:text-center pt-1 sm:pt-0">
 <p className={`font-bold ${isCurrent ? 'text-brand-gradient' : isCompleted ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
 {step.label}
 </p>
 {isCurrent && (
 <p className="text-xs text-brand-gradient font-medium mt-1">Current Status</p>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Order Items */}
 <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
 <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Items Ordered</h3>
 <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
 {order.items.map((item, idx) => (
 <li key={idx} className="py-4 flex justify-between items-center">
 <div className="flex items-center gap-4">
 {item.image && (
 <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0">
 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
 </div>
 )}
 <div>
 <p className="font-bold text-zinc-900 dark:text-white">{item.name}</p>
 {item.quantity && <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>}
 </div>
 </div>
 <p className="font-bold text-zinc-900 dark:text-white">₹{item.price * (item.quantity || 1)}</p>
 </li>
 ))}
 </ul>
 </div>

 <div className="mt-8 text-center print:hidden">
 <Link href="/support" className="text-zinc-500 hover:text-brand-gradient text-sm font-medium underline underline-offset-4">
 Need help with your order? Contact Support
 </Link>
 </div>
 
 <div className="hidden print:block text-center mt-12 text-sm text-zinc-500 pt-8 border-t border-zinc-200">
 Thank you for choosing SSS Studio!
 </div>
 </AnimatedSection>
 )}
 </div>
 </div>
 );
}
