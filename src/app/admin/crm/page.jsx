"use client";

import { useState, useEffect } from "react";
import { Copy, Plus, ArrowRight, MessageCircle, Check, Trash2, Printer } from "lucide-react";
import Link from "next/link";
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
        const parsedOrders = res.orders.map(order => {
          let parsedItems = [];
          if (Array.isArray(order.items)) {
            parsedItems = order.items;
          } else if (typeof order.items === 'string') {
            try {
              parsedItems = JSON.parse(order.items);
            } catch (e) {
              parsedItems = [];
            }
          }
          return {
            ...order,
            items: parsedItems
          };
        });
        setOrders(parsedOrders);
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
    if (window.confirm("Are you sure you want to hide this order?")) {
      const newOrders = orders.filter((o) => o.orderId !== id);
      setOrders(newOrders);
    }
  };

  const getOrderType = (order) => {
    const items = order.items || [];
    const addressStr = order.address || "";
    const isPickup = addressStr.toLowerCase().includes("collect from studio") || addressStr.toLowerCase().includes("pickup");
    const isPassportOnly = items.length > 0 && items.every(item => item.category === 'Passport');
    
    if (!isPickup) return 'Courier';
    if (isPassportOnly) return 'Passport';
    return 'Frame';
  };

  const getStatusesAndOrders = () => {
    const mappedOrders = orders.map(o => ({
      ...o,
      status: o.status === 'UNCONFIRMED' ? 'PENDING' : o.status
    }));

    let activeStatuses = ["PENDING", "PROCESSING", "READY_FOR_PICKUP", "SHIPPED", "PICKED_UP", "DELIVERED"];
    let filteredOrders = mappedOrders;

    if (filterType === "Passport") {
      activeStatuses = ["PENDING", "READY_FOR_PICKUP", "PICKED_UP"];
      filteredOrders = mappedOrders.filter(o => getOrderType(o) === 'Passport');
    } else if (filterType === "Frame") {
      activeStatuses = ["PENDING", "PROCESSING", "READY_FOR_PICKUP", "PICKED_UP"];
      filteredOrders = mappedOrders.filter(o => getOrderType(o) === 'Frame');
    } else if (filterType === "Courier") {
      activeStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
      filteredOrders = mappedOrders.filter(o => getOrderType(o) === 'Courier');
    }

    return { activeStatuses, filteredOrders };
  };

  const { activeStatuses, filteredOrders } = getStatusesAndOrders();

  const handleNotifyCustomer = (order) => {
    const trackUrl = `${window.location.origin}/track?id=${order.orderId}`;
    let textMessage = `Hello ${order.customerName}! 👋\n\nYour order *#${order.orderId}* is currently in status: *${order.status}*\n\n*Total Amount:* ₹${order.totalAmount}\n\nYou can track it here:\n${trackUrl}\n\nThank you for choosing us! 📸`;
    
    if (order.status === "READY_FOR_PICKUP") {
      textMessage = `Hello ${order.customerName}! 👋\n\nGreat news! Your order *#${order.orderId}* is complete and *READY TO BE PICKED UP* from our studio.\n\n*Total Amount:* ₹${order.totalAmount}\n\nYou can view your order details here:\n${trackUrl}\n\nSee you soon! 📸`;
    } else if (order.status === "SHIPPED") {
       textMessage = `Hello ${order.customerName}! 👋\n\nYour order *#${order.orderId}* has been *SHIPPED*!\n\n${order.courierTrackingId ? `*Tracking ID:* ${order.courierTrackingId}\n` : ''}*Total Amount:* ₹${order.totalAmount}\n\nTrack it here:\n${trackUrl}\n\nThank you! 📸`;
    }

    const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading Orders...</div>;
  }

  const ordersByStatus = activeStatuses.reduce((acc, status) => {
    acc[status] = [];
    return acc;
  }, {});
  filteredOrders.forEach(order => {
    if (ordersByStatus[order.status]) {
      ordersByStatus[order.status].push(order);
    }
  });

  return (
    <div className="min-h-screen bg-zinc-950 p-6 sm:p-12 text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-white mb-2">CRM & Orders</h1>
            <p className="text-zinc-400">Database-backed Kanban board</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 w-full md:w-auto"
            >
              <option value="All">Show All Orders</option>
              <option value="Passport">Passport Photos (Pickup)</option>
              <option value="Frame">Frames & Gifts (Pickup)</option>
              <option value="Courier">Courier Delivery (Later)</option>
            </select>
            <Link href="/admin">
              <button className="text-brand-gradient hover:text-cyan-400 transition-colors text-sm font-medium whitespace-nowrap">
                &larr; Back to Admin
              </button>
            </Link>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            {activeStatuses.map((status) => (
              <div key={status} className="w-80 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-bold text-white">{status}</h3>
                  <span className="bg-zinc-800 text-xs px-2 py-1 rounded-full text-zinc-400">
                    {ordersByStatus[status].length}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {ordersByStatus[status].map((order) => (
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
                           const items = order.items || [];
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
                           return null;
                        })()}
                        
                        <div className="mb-4 flex justify-between items-center">
                          <Link href={`/admin/invoice/${order.orderId}`} className="text-xs text-brand-gradient hover:text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 flex items-center gap-1">
                            <Printer className="w-3 h-3" /> View Receipt
                          </Link>
                          <button
                            onClick={() => handleNotifyCustomer(order)}
                            title="Notify Customer via WhatsApp"
                            className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg> Notify
                          </button>
                        </div>
                        
                        {/* Status Mover Buttons */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-900">
                          {activeStatuses.indexOf(status) > 0 && (
                            <button
                              onClick={() => updateOrderStatus(order.orderId, activeStatuses[activeStatuses.indexOf(status) - 1])}
                              className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs py-2 rounded-lg transition-colors"
                            >
                              &larr; Back
                            </button>
                          )}
                          {activeStatuses.indexOf(status) < activeStatuses.length - 1 && (
                            <button
                              onClick={() => updateOrderStatus(order.orderId, activeStatuses[activeStatuses.indexOf(status) + 1])}
                              className="flex-1 bg-brand-gradient hover-glow-brand/10 hover:bg-brand-gradient hover-glow-brand/20 text-brand-gradient text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              Move <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {activeStatuses.indexOf(status) === activeStatuses.length - 1 && (
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
