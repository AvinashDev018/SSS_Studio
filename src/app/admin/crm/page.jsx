"use client";

import { useState, useEffect } from "react";
import { Copy, Plus, ArrowRight, MessageCircle, Check, Trash2, Printer } from "lucide-react";
import Link from "next/link";
import { getOrders, updateOrderStatus as updateDbOrderStatus } from "@/app/actions/orders";

export default function CRMDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from Database
  useEffect(() => {
    async function fetchOrders() {
      const res = await getOrders();
      if (res.success) {
        setOrders(res.orders);
      }
      setIsLoading(false);
    }
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, newStatus) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((order) => (order.orderId === id ? { ...order, status: newStatus } : order))
    );
    
    // Save to Database
    await updateDbOrderStatus(id, newStatus);
  };

  const deleteOrder = (id) => {
    // In a real app we'd have a delete action. For now we just filter it out locally 
    // or you can implement a deleteOrder server action.
    if (window.confirm("Are you sure you want to hide this order?")) {
      const newOrders = orders.filter((o) => o.orderId !== id);
      setOrders(newOrders);
    }
  };

  const statuses = ["UNCONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading Orders...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 sm:p-12 text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-white mb-2">CRM & Orders</h1>
            <p className="text-zinc-400">Database-backed Kanban board</p>
          </div>
          <Link href="/admin">
            <button className="text-brand-gradient hover:text-cyan-400 transition-colors text-sm font-medium">
              &larr; Back to Admin
            </button>
          </Link>
        </div>

        {/* Kanban Board */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statuses.map((status) => (
              <div key={status} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-bold text-white">{status}</h3>
                  <span className="bg-zinc-800 text-xs px-2 py-1 rounded-full text-zinc-400">
                    {orders.filter((o) => o.status === status).length}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {orders
                    .filter((order) => order.status === status)
                    .map((order) => (
                      <div
                        key={order.orderId}
                        className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-2xl p-4 group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs text-brand-gradient bg-brand-gradient hover-glow-brand/10 px-2 py-1 rounded">
                            {order.orderId}
                          </span>
                          <button 
                            onClick={() => deleteOrder(order.orderId)}
                            className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-white text-lg">{order.customerName}</h4>
                        <div className="flex justify-between items-center mb-3">
                           <p className="text-zinc-400 text-sm">Ph: {order.customerPhone}</p>
                           <p className="text-zinc-500 text-xs">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}</p>
                        </div>
                        
                        {/* Show Images */}
                        {(() => {
                           try {
                             const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);
                             const images = items.filter(item => item.image).map(item => item.image);
                             if (images.length > 0) {
                               return (
                                 <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide pt-1">
                                   {images.map((img, i) => (
                                      <div key={i} className="relative group/img shrink-0">
                                        <a href={img} target="_blank" rel="noopener noreferrer">
                                          <img src={img} alt="Order Upload" className="w-12 h-12 rounded-lg object-cover border border-zinc-800 hover:border-cyan-500 transition-colors" />
                                        </a>
                                        <button 
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                              const response = await fetch(img);
                                              const blob = await response.blob();
                                              const blobUrl = window.URL.createObjectURL(blob);
                                              const a = document.createElement('a');
                                              a.href = blobUrl;
                                              a.download = `${order.orderId}-image-${i + 1}.jpg`;
                                              document.body.appendChild(a);
                                              a.click();
                                              window.URL.revokeObjectURL(blobUrl);
                                              document.body.removeChild(a);
                                            } catch (err) {
                                              window.open(img, '_blank');
                                            }
                                          }}
                                          className="absolute top-1 right-1 bg-brand-gradient text-black p-1 rounded-full shadow-lg opacity-0 group-hover/img:opacity-100 transition-all z-10 hover:scale-110"
                                          title="Download Image"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        </button>
                                      </div>
                                   ))}
                                 </div>
                               );
                             }
                           } catch (e) {
                             return null;
                           }
                           return null;
                        })()}
                        
                        <div className="mb-4">
                          <Link href={`/admin/invoice/${order.orderId}`} className="text-xs text-brand-gradient hover:text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 flex items-center gap-1">
                            <Printer className="w-3 h-3" /> View Receipt
                          </Link>
                        </div>
                        
                        {/* Status Mover Buttons */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-900">
                          {status !== "UNCONFIRMED" && (
                            <button
                              onClick={() => updateOrderStatus(order.orderId, statuses[statuses.indexOf(status) - 1])}
                              className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs py-2 rounded-lg transition-colors"
                            >
                              &larr; Back
                            </button>
                          )}
                          {status !== "DELIVERED" && (
                            <button
                              onClick={() => updateOrderStatus(order.orderId, statuses[statuses.indexOf(status) + 1])}
                              className="flex-1 bg-brand-gradient hover-glow-brand/10 hover:bg-brand-gradient hover-glow-brand/20 text-brand-gradient text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              Move <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {status === "DELIVERED" && (
                            <button
                              onClick={() => deleteOrder(order.orderId)}
                              className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
