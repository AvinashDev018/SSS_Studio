"use client";

import { useState, useEffect } from "react";
import { Copy, Plus, ArrowRight, MessageCircle, Check, Trash2, Printer, ShoppingBag, Filter, Download } from "lucide-react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { getOrders, updateOrderStatus as updateDbOrderStatus } from "@/app/actions/orders";

export default function CRMDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  // Load from Database
  useEffect(() => {
    async function fetchOrders() {
      const res = await getOrders();
      if (res.success) {
        const parsedOrders = res.orders.map((order) => {
          let parsedItems = [];
          if (Array.isArray(order.items)) {
            parsedItems = order.items;
          } else if (typeof order.items === "string") {
            try {
              parsedItems = JSON.parse(order.items);
            } catch (e) {
              parsedItems = [];
            }
          }
          return {
            ...order,
            items: parsedItems,
          };
        });
        setOrders(parsedOrders);
      }
      setIsLoading(false);
    }
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.orderId === id ? { ...order, status: newStatus } : order))
    );
    await updateDbOrderStatus(id, newStatus);
  };

  const deleteOrder = (id) => {
    if (window.confirm("Are you sure you want to hide this order?")) {
      const newOrders = orders.filter((o) => o.orderId !== id);
      setOrders(newOrders);
    }
  };

  const getOrderType = (order) => {
    const items = order.items || [];
    const addressStr = order.address || "";
    const hasCourierAddress = addressStr && addressStr.length > 5 && !addressStr.includes("Studio Pickup");

    if (hasCourierAddress) return "Courier";
    const hasFrame = items.some((i) => i.name && (i.name.includes("Frame") || i.name.includes("Canvas") || i.name.includes("Gift")));
    if (hasFrame) return "Frame";
    return "Passport";
  };

  const getStatusesAndOrders = () => {
    const mappedOrders = orders.map((o) => {
      let st = o.status.toUpperCase();
      if (st === "PENDING") st = "PENDING";
      else if (st === "PROCESSING") st = "PROCESSING";
      else if (st === "READY_FOR_PICKUP" || st === "SHIPPED") st = st;
      else if (st === "PICKED_UP" || st === "DELIVERED") st = "DELIVERED";
      else st = "PENDING";
      return { ...o, status: st };
    });

    let activeStatuses = ["PENDING", "PROCESSING", "READY_FOR_PICKUP", "DELIVERED"];
    let filteredOrders = mappedOrders;

    if (filterType === "Passport") {
      activeStatuses = ["PENDING", "PROCESSING", "READY_FOR_PICKUP", "PICKED_UP"];
      filteredOrders = mappedOrders.filter((o) => getOrderType(o) === "Passport");
    } else if (filterType === "Frame") {
      activeStatuses = ["PENDING", "PROCESSING", "READY_FOR_PICKUP", "PICKED_UP"];
      filteredOrders = mappedOrders.filter((o) => getOrderType(o) === "Frame");
    } else if (filterType === "Courier") {
      activeStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
      filteredOrders = mappedOrders.filter((o) => getOrderType(o) === "Courier");
    }

    return { activeStatuses, filteredOrders };
  };

  const { activeStatuses, filteredOrders } = getStatusesAndOrders();

  const handleNotifyCustomer = (order) => {
    let textMessage = `Hello ${order.customerName}! 👋\n\nYour order *#${order.orderId}* is currently in status: *${order.status}*\n\n*Total Amount:* ₹${order.totalAmount}\n\nYou can track your order using your *Order ID (${order.orderId})* or *Mobile Number* on our website **Track Order** page.\n\nThank you for choosing SSS Studio! 📸`;

    if (order.status === "READY_FOR_PICKUP") {
      textMessage = `Hello ${order.customerName}! 👋\n\nGreat news! Your order *#${order.orderId}* is ready and *AVAILABLE FOR STUDIO PICKUP* at SSS Studio, Avaniyapuram.\n\n*Total Amount:* ₹${order.totalAmount}\n\nYou can track your order status using your *Order ID (${order.orderId})* or *Mobile Number* on our website **Track Order** page.\n\nSee you soon! 📸`;
    } else if (order.status === "SHIPPED") {
      textMessage = `Hello ${order.customerName}! 👋\n\nYour order *#${order.orderId}* has been *DISPATCHED* via courier!\n\n${order.courierTrackingId ? `*Tracking ID:* ${order.courierTrackingId}\n` : ""}*Total Amount:* ₹${order.totalAmount}\n\nYou can track delivery status using your *Order ID (${order.orderId})* or *Mobile Number* on our website **Track Order** page.\n\nThank you! 📸`;
    }

    const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="py-12 px-6 max-w-7xl mx-auto min-h-screen text-center text-amber-300">
        <AdminNav currentPath="/admin/crm" />
        <div className="py-24 font-serif text-lg">Loading SSS Studio CRM &amp; Orders...</div>
      </div>
    );
  }

  const ordersByStatus = activeStatuses.reduce((acc, status) => {
    acc[status] = [];
    return acc;
  }, {});
  filteredOrders.forEach((order) => {
    if (ordersByStatus[order.status]) {
      ordersByStatus[order.status].push(order);
    }
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans bg-[#050907]">
      <AdminNav currentPath="/admin/crm" />

      {/* Friendly Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-gradient-to-r from-[#181308]/90 via-[#100d05]/80 to-transparent p-6 rounded-3xl border border-amber-500/25 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-400/30">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
              Order Fulfillment &amp; Client CRM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            CRM &amp; Studio Print Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-light max-w-2xl">
            Live database-backed order fulfillment board. Advance orders through production, download client high-res photos, and send 1-click WhatsApp updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0a0c06] border border-amber-500/30">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent border-none text-xs text-amber-300 focus:ring-0 cursor-pointer font-bold"
            >
              <option value="All" className="bg-[#0b1412]">All Orders ({orders.length})</option>
              <option value="Passport" className="bg-[#0b1412]">Passport Photos</option>
              <option value="Frame" className="bg-[#0b1412]">Frames &amp; Wall Art</option>
              <option value="Courier" className="bg-[#0b1412]">Courier Deliveries</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4 no-scrollbar">
        <div className="flex gap-5 min-w-max">
          {activeStatuses.map((status) => (
            <div key={status} className="w-80 bg-gradient-to-b from-[#0c0d06]/90 to-[#070905]/95 border border-amber-500/25 rounded-3xl p-4 flex flex-col min-h-[520px] shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-amber-300 text-xs uppercase tracking-widest">{status.replace(/_/g, " ")}</h3>
                <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  {ordersByStatus[status].length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {ordersByStatus[status].length === 0 ? (
                  <div className="h-40 rounded-2xl border border-dashed border-amber-500/15 flex items-center justify-center text-zinc-500 text-xs font-light">
                    No orders in this stage
                  </div>
                ) : (
                  ordersByStatus[status].map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-[#090b07] border border-amber-500/20 hover:border-amber-400/60 transition-all rounded-2xl p-4 group shadow-lg relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-lg shadow-sm">
                          #{order.orderId}
                        </span>
                        <button
                          onClick={() => deleteOrder(order.orderId)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          title="Hide / Archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-bold text-white text-base leading-snug">{order.customerName}</h4>
                      <div className="flex justify-between items-center text-xs text-zinc-300 mt-1 mb-3">
                        <span className="font-mono font-medium text-amber-300/90">{order.customerPhone}</span>
                        <span className="text-zinc-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Today"}</span>
                      </div>

                      {/* Uploaded Customer Photos Preview */}
                      {(() => {
                        const items = order.items || [];
                        const images = items.filter((item) => item.image).map((item) => item.image);
                        if (images.length > 0) {
                          return (
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar pt-1">
                              {images.map((img, i) => (
                                <div key={i} className="relative group/img shrink-0">
                                  <a href={img} target="_blank" rel="noopener noreferrer">
                                    <img src={img} alt="Order Upload" className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 hover:border-amber-400 transition-colors shadow-sm" />
                                  </a>
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      try {
                                        const response = await fetch(img);
                                        const blob = await response.blob();
                                        const blobUrl = window.URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = blobUrl;
                                        a.download = `${order.orderId}-image-${i + 1}.jpg`;
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(blobUrl);
                                        document.body.removeChild(a);
                                      } catch (err) {
                                        window.open(img, "_blank");
                                      }
                                    }}
                                    className="absolute top-1 right-1 bg-amber-400 text-black p-1 rounded-full shadow-lg opacity-0 group-hover/img:opacity-100 transition-all z-10 hover:scale-110"
                                    title="Download High-Res Image"
                                  >
                                    <Download className="w-2.5 h-2.5 stroke-[2.5]" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <div className="mb-3 flex justify-between items-center">
                        <Link
                          href={`/admin/invoice/${order.orderId}`}
                          className="text-xs text-amber-300 hover:text-white underline underline-offset-4 flex items-center gap-1 font-medium"
                        >
                          <Printer className="w-3 h-3" /> View Invoice
                        </Link>
                        
                        {/* High-visibility WhatsApp Notify Button */}
                        <button
                          onClick={() => handleNotifyCustomer(order)}
                          title="Notify Customer via WhatsApp"
                          className="bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold px-3 py-1 rounded-xl transition-all shadow-md flex items-center gap-1.5 text-xs hover:scale-105 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-black" />
                          <span>WhatsApp</span>
                        </button>
                      </div>

                      {/* Status Mover Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-white/5">
                        {activeStatuses.indexOf(status) > 0 && (
                          <button
                            onClick={() => updateOrderStatus(order.orderId, activeStatuses[activeStatuses.indexOf(status) - 1])}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs py-1.5 rounded-xl transition-colors font-medium cursor-pointer"
                          >
                            &larr; Back
                          </button>
                        )}
                        {activeStatuses.indexOf(status) < activeStatuses.length - 1 && (
                          <button
                            onClick={() => updateOrderStatus(order.orderId, activeStatuses[activeStatuses.indexOf(status) + 1])}
                            className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-extrabold py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
                          >
                            Move &rarr;
                          </button>
                        )}
                        {activeStatuses.indexOf(status) === activeStatuses.length - 1 && (
                          <button
                            onClick={() => deleteOrder(order.orderId)}
                            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
