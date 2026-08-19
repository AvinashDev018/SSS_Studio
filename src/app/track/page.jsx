"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, Search } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getOrder } from "@/app/actions/orders";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError("");
    setOrder(null);

    const res = await getOrder(orderId.trim().toUpperCase());
    
    if (res.success && res.order) {
      setOrder(res.order);
    } else {
      setError("Order not found. Please check your Order ID and try again.");
    }
    setLoading(false);
  };

  const statuses = [
    { id: "PENDING", label: "Order Placed", icon: <Clock className="w-6 h-6" /> },
    { id: "PROCESSING", label: "Processing", icon: <Package className="w-6 h-6" /> },
    { id: "SHIPPED", label: "Shipped", icon: <Truck className="w-6 h-6" /> },
    { id: "DELIVERED", label: "Delivered", icon: <CheckCircle2 className="w-6 h-6" /> },
  ];

  const getStatusIndex = (status) => {
    return statuses.findIndex(s => s.id === status);
  };

  return (
    <div className="py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[90vh]">
      <AnimatedSection className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
          Track Your Order
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl mx-auto">
          Enter your Order ID below to see the current status of your custom frames and gifts.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                placeholder="e.g. ORD-1A2B3C"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium tracking-wide uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !orderId}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black px-8 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {order && (
            <div className="mt-12 pt-12 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Order Details</p>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{order.orderId}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-1">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="relative mt-12 mb-8">
                {/* Connecting Line */}
                <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                
                {/* Active Line */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 left-8 h-1 bg-amber-500 rounded-full transition-all duration-1000"
                  style={{ width: `calc(${getStatusIndex(order.status) * 33.33}% - 1rem)` }}
                />

                <div className="relative flex justify-between">
                  {statuses.map((s, idx) => {
                    const isActive = getStatusIndex(order.status) >= idx;
                    const isCurrent = getStatusIndex(order.status) === idx;
                    
                    return (
                      <div key={s.id} className="flex flex-col items-center gap-3 z-10 w-24">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                          isActive 
                            ? "bg-amber-500 border-white dark:border-zinc-900 text-white shadow-lg" 
                            : "bg-zinc-100 dark:bg-zinc-800 border-white dark:border-zinc-900 text-zinc-400"
                        } ${isCurrent ? 'ring-4 ring-amber-500/20' : ''}`}>
                          {s.icon}
                        </div>
                        <span className={`text-xs font-bold text-center ${
                          isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                        }`}>
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-6 mt-8">
                <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Items Ordered</h4>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs">{i + 1}</span>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-200">{item.name}</p>
                          {item.details && <p className="text-zinc-500 text-xs">{item.details}</p>}
                        </div>
                      </div>
                      <span className="font-bold">₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="font-semibold text-zinc-500">Total</span>
                  <span className="font-bold text-xl text-zinc-900 dark:text-white">₹{order.totalAmount}</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
