"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Search, Package, CheckCircle2, Clock, Truck, Home, Printer, Camera, Sparkles, MessageCircle, Calendar, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { searchOrdersByPhoneOrId } from "@/app/actions/orders";

const COURIER_STEPS = [
  { id: "PENDING", label: "Order Placed", icon: Clock },
  { id: "PROCESSING", label: "Printing & Framing", icon: Package },
  { id: "SHIPPED", label: "Shipped via Courier", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: Home },
];

const PICKUP_STEPS = [
  { id: "PENDING", label: "Order Placed", icon: Clock },
  { id: "PROCESSING", label: "Printing & Framing", icon: Package },
  { id: "READY_FOR_PICKUP", label: "Ready at Studio", icon: Home },
  { id: "PICKED_UP", label: "Picked Up", icon: CheckCircle2 },
];

const SHOOT_STEPS = [
  { id: "PENDING", label: "Shoot Booked", icon: Calendar },
  { id: "CONFIRMED", label: "Coverage Complete", icon: Camera },
  { id: "PROCESSING", label: "Color Grading & Retouching", icon: Sparkles },
  { id: "COMPLETED", label: "Album Delivered (1-Month Guarantee)", icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState(null);
  const [multipleOrders, setMultipleOrders] = useState([]);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    const phoneParam = params.get("phone");
    const initialQuery = idParam || phoneParam;
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, []);

  const handleSearch = async (valToSearch = query) => {
    const cleanVal = (valToSearch || "").trim();
    if (!cleanVal) {
      setError("Please enter a valid Order ID or 10-digit Mobile Number");
      return;
    }

    setIsSearching(true);
    setError("");
    setOrder(null);
    setMultipleOrders([]);

    try {
      const res = await searchOrdersByPhoneOrId(cleanVal);
      if (res.success) {
        if (res.multiple && res.orders) {
          setMultipleOrders(res.orders);
        } else if (res.order) {
          selectOrder(res.order);
        }
      } else {
        setError(res.error || `No orders or shoots found for: ${cleanVal}`);
      }
    } catch (err) {
      setError("Error fetching order. Please try again or message us on WhatsApp.");
    }
    setIsSearching(false);
  };

  const selectOrder = (rawOrder) => {
    const normalizedStatus = (rawOrder.status || "PENDING").toUpperCase();
    setOrder({
      orderId: rawOrder.orderId,
      status: normalizedStatus === "UNCONFIRMED" ? "PENDING" : normalizedStatus,
      totalAmount: rawOrder.totalAmount || 0,
      createdAt: rawOrder.createdAt,
      customerName: rawOrder.customerName || "Valued Client",
      customerPhone: rawOrder.customerPhone || "",
      address: rawOrder.address || "",
      courierTrackingId: rawOrder.courierTrackingId || null,
      items: typeof rawOrder.items === "string" ? JSON.parse(rawOrder.items) : (rawOrder.items || []),
      type: rawOrder.type || "product",
      eventType: rawOrder.eventType || null,
      date: rawOrder.date || null,
    });
    setMultipleOrders([]);
  };

  const getActiveSteps = () => {
    if (order?.type === "booking" || order?.eventType) {
      return SHOOT_STEPS;
    }
    return order?.address === "Collect from Studio" ? PICKUP_STEPS : COURIER_STEPS;
  };

  const getCurrentStepIndex = (status) => {
    const steps = getActiveSteps();
    const idx = steps.findIndex((step) => step.id === status);
    if (idx !== -1) return idx;
    if (status === "DELIVERED" || status === "PICKED_UP") return steps.length - 1;
    return 1; // Default to Processing if in-between
  };

  const handlePrint = () => {
    window.print();
  };

  const getWhatsAppHelpLink = () => {
    const text = `Vanakkam SSS Studio! 👋 I am checking the status of my order/booking *#${order?.orderId}* for ${order?.customerName}. Could you share an update?`;
    return `https://wa.me/916383565425?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-zinc-900 pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-10 print:hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#8b6508] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Live Studio Tracking
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
            Track Your Order or Shoot
          </h1>
          <p className="text-zinc-600 max-w-xl mx-auto text-base">
            Enter your <span className="text-[#8b6508] font-bold">10-Digit Mobile Number</span> or <span className="text-[#8b6508] font-bold">Order ID</span> to view real-time production, framing, and delivery progress.
          </p>
        </AnimatedSection>

        {/* Printable Header */}
        <div className="hidden print:block text-center mb-8 border-b border-zinc-200 pb-8 text-black">
          <h1 className="font-serif text-4xl font-bold mb-2">SSS Photography Studio</h1>
          <p className="text-zinc-600">34, Prasanna New Colony, Avaniyapuram, Madurai - 625012 | +91 63835 65425</p>
          <p className="text-sm font-mono mt-4">Order ID: {order?.orderId}</p>
        </div>

        {/* Search Box */}
        <AnimatedSection delay={0.1} className="max-w-2xl mx-auto mb-10 print:hidden">
          <div className="relative flex items-center shadow-2xl rounded-2xl">
            <div className="absolute left-4 text-[#d4af37]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="e.g. 9876543210 or ORD-1A2B3C"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-[#15171E] border-2 border-[#d4af37]/30 hover:border-[#d4af37]/60 focus:border-[#d4af37] rounded-2xl py-4 pl-12 pr-32 text-base md:text-lg font-mono focus:outline-none transition-all text-white placeholder:text-zinc-500 shadow-inner"
            />
            <button
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="absolute right-2 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-black px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-teal-500/20"
            >
              {isSearching ? "Searching..." : "Track"}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}
        </AnimatedSection>

        {/* Multi-Order Selection List (When multiple orders match phone number) */}
        {multipleOrders.length > 0 && (
          <AnimatedSection delay={0.15} className="mb-12 print:hidden">
            <div className="bg-[#0b1412] border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Phone size={18} className="text-teal-400" /> Multiple Orders Found ({multipleOrders.length})
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select which order or photoshoot booking you would like to track:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {multipleOrders.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectOrder(item)}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-400 hover:bg-teal-500/[0.05] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                          {item.orderId}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.status}
                        </span>
                      </div>

                      <h4 className="text-white font-bold text-sm mb-1 group-hover:text-teal-300 transition-colors">
                        {item.type === "booking" ? `${item.eventType} Photoshoot` : (item.items?.[0]?.name || "Photo Frame Order")}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {item.type === "booking" && item.date ? `Event: ${new Date(item.date).toLocaleDateString()}` : `Placed: ${new Date(item.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-teal-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>View Progress Details</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Order Results */}
        {order && (
          <AnimatedSection
            delay={0.2}
            className="bg-[#0b1412] border border-teal-500/20 rounded-3xl p-6 md:p-10 shadow-2xl print:border-none print:shadow-none print:p-0 print:bg-white print:text-black"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/10">
              <div>
                <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Package size={14} /> {order.type === "booking" ? "Shoot Booking Details" : "Studio Order Details"}
                </p>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-mono font-bold text-white print:text-black">{order.orderId}</h2>
                  <button
                    onClick={handlePrint}
                    className="print:hidden flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-lg text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Receipt
                  </button>
                </div>
                <p className="text-zinc-400 text-xs mt-1">
                  Customer: <strong className="text-white print:text-black">{order.customerName}</strong> • {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </p>

                {order.courierTrackingId && (
                  <div className="mt-3 p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl inline-block">
                    <p className="text-[10px] text-teal-300 font-bold uppercase tracking-wider mb-0.5">Courier Tracking ID</p>
                    <p className="text-sm font-mono font-bold text-white select-all">{order.courierTrackingId}</p>
                  </div>
                )}
              </div>

              {order.totalAmount > 0 && (
                <div className="mt-4 md:mt-0 text-left md:text-right">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent print:text-black">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>

            {/* Signature Guarantee Banner (if Shoot/Album) */}
            {(order.type === "booking" || order.items.some((i) => (i.name || "").toLowerCase().includes("album") || (i.name || "").toLowerCase().includes("wedding"))) && (
              <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-teal-950/60 to-[#07241e] border border-teal-500/30 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold">1-Month Album Delivery Guarantee</h4>
                    <p className="text-xs text-teal-300/80">30-day handcrafted delivery promise (or ₹1,000 cash credit)</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  On Schedule 🟢
                </span>
              </div>
            )}

            {/* Visual Timeline */}
            <div className="relative mb-14 pt-4 print:hidden">
              <div className="absolute top-1/2 left-0 w-full h-1.5 bg-white/5 -translate-y-1/2 rounded-full hidden sm:block" />
              <div
                className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-400 -translate-y-1/2 rounded-full hidden sm:block transition-all duration-700"
                style={{
                  width: `${(getCurrentStepIndex(order.status) / (getActiveSteps().length - 1)) * 100}%`,
                }}
              />

              <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                {getActiveSteps().map((step, index) => {
                  const currentIdx = getCurrentStepIndex(order.status);
                  const isCompleted = index <= currentIdx;
                  const isCurrent = index === currentIdx;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="relative flex sm:flex-col items-center gap-3.5 sm:gap-2.5 z-10">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-300 relative ${
                          isCurrent
                            ? "bg-gradient-to-br from-teal-400 to-emerald-500 border-teal-200 text-black shadow-[0_0_20px_rgba(20,184,166,0.5)] scale-110"
                            : isCompleted
                            ? "bg-teal-500/20 border-teal-500 text-teal-300"
                            : "bg-[#071310] border-white/10 text-zinc-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Line for mobile */}
                      {index < getActiveSteps().length - 1 && (
                        <div
                          className={`absolute top-11 left-5 w-0.5 h-8 sm:hidden ${
                            index < currentIdx ? "bg-teal-400" : "bg-white/10"
                          }`}
                        />
                      )}

                      <div className="sm:text-center pt-0.5">
                        <p
                          className={`text-xs font-bold leading-tight ${
                            isCurrent
                              ? "text-teal-300"
                              : isCompleted
                              ? "text-white"
                              : "text-zinc-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-[10px] text-teal-400 font-semibold mt-0.5">
                            Current Stage
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Summary */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 mb-8">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-3">
                Items / Services
              </h3>
              <ul className="divide-y divide-white/5 text-sm">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="w-10 h-10 rounded-lg bg-[#071310] border border-white/10 overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        {item.quantity && (
                          <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                        )}
                      </div>
                    </div>
                    {item.price > 0 && (
                      <p className="font-bold text-teal-300">
                        ₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions & WhatsApp Support */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 print:hidden">
              <Link
                href="/support"
                className="text-zinc-400 hover:text-teal-300 text-xs font-medium underline underline-offset-4"
              >
                Need to report damaged items? Submit Damage Claim
              </Link>

              <a
                href={getWhatsAppHelpLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Chat with Studio on WhatsApp</span>
              </a>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
