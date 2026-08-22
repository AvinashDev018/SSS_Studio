"use client";

import { useState, useEffect } from "react";
import { Copy, Plus, ArrowRight, MessageCircle, Check, Trash2, Printer } from "lucide-react";
import Link from "next/link";

export default function CRMDashboard() {
 const [orders, setOrders] = useState([]);
 const [pastedMessage, setPastedMessage] = useState("");
 const [parsedData, setParsedData] = useState(null);
 const [copiedId, setCopiedId] = useState(null);

 // Load from LocalStorage
 useEffect(() => {
 const saved = localStorage.getItem("crm_orders");
 if (saved) {
 setOrders(JSON.parse(saved));
 }
 }, []);

 // Save to LocalStorage whenever orders change
 useEffect(() => {
 if (orders.length > 0) {
 localStorage.setItem("crm_orders", JSON.stringify(orders));
 } else {
 localStorage.removeItem("crm_orders");
 }
 }, [orders]);

 // WhatsApp Message Parser
 const parseMessage = () => {
 if (!pastedMessage) return;

 try {
 // Basic Regex to extract Name, Phone, and Subtotal/Total Amount
 const nameMatch = pastedMessage.match(/Name:\s*(.+)/i);
 const phoneMatch = pastedMessage.match(/Phone:\s*(\d+)/i);
 const totalMatch = pastedMessage.match(/Total Amount:\s*[^\d]*(\d+)/i);
 const orderIdMatch = pastedMessage.match(/Order ID:\s*(ORD-[A-Z0-9]+)/i);

 let orderId = orderIdMatch ? orderIdMatch[1] : `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

 const data = {
 id: orderId,
 name: nameMatch ? nameMatch[1].trim() : "Unknown",
 phone: phoneMatch ? phoneMatch[1].trim() : "Unknown",
 total: totalMatch ? totalMatch[1].trim() : "0",
 rawMessage: pastedMessage,
 status: "Pending", // Default status
 date: new Date().toLocaleDateString(),
 };

 setParsedData(data);
 } catch (e) {
 alert("Could not parse message. Make sure it's the exact format from the website.");
 }
 };

 const confirmNewOrder = () => {
 if (!parsedData) return;
 setOrders((prev) => [parsedData, ...prev]);
 setPastedMessage("");
 setParsedData(null);
 
 // Generate WhatsApp Reply Link
 const replyMessage = `Hi ${parsedData.name},%0A%0AWe have received your order!%0A*Order ID:* ${parsedData.id}%0A*Status:* Processing%0A%0AYou can track your order status on our website:%0Ahttps://photostudio.com/track%0A%0AThank you for choosing us!`;
 window.open(`https://wa.me/91${parsedData.phone}?text=${replyMessage}`, '_blank');
 };

 const updateOrderStatus = (id, newStatus) => {
 setOrders((prev) =>
 prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
 );
 };

 const deleteOrder = (id) => {
 if (window.confirm("Are you sure you want to delete this order?")) {
 const newOrders = orders.filter((o) => o.id !== id);
 setOrders(newOrders);
 }
 };

 const statuses = ["Pending", "Processing", "Shipped", "Delivered"];

 return (
 <div className="min-h-screen bg-zinc-950 p-6 sm:p-12 text-zinc-100 font-sans">
 <div className="max-w-7xl mx-auto space-y-12">
 {/* Header */}
 <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
 <div>
 <h1 className="text-4xl font-serif font-bold text-white mb-2">CRM & Orders</h1>
 <p className="text-zinc-400">Offline-first Kanban board and WhatsApp Auto-Parser</p>
 </div>
 <Link href="/admin">
 <button className="text-brand-gradient hover:text-cyan-400 transition-colors text-sm font-medium">
 &larr; Back to Admin
 </button>
 </Link>
 </div>

 {/* Alert Banner */}
 <div className="bg-brand-gradient hover-glow-brand/10 border border-cyan-500/20 rounded-2xl p-4 flex gap-3 text-brand-gradient text-sm">
 <MessageCircle className="w-5 h-5 text-brand-gradient shrink-0" />
 <div>
 <p className="font-bold text-brand-gradient mb-1">How this CRM works (No Database)</p>
 <p>Orders do <strong>not</strong> appear here automatically. When a customer places an order, they send it to your WhatsApp. You must <strong>Copy their WhatsApp message</strong> and <strong>Paste it into the box below</strong> to track it in this dashboard.</p>
 </div>
 </div>

 {/* Panel A: WhatsApp Parser */}
 <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
 <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
 <MessageCircle className="text-brand-gradient" /> WhatsApp Order Parser
 </h2>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div>
 <label className="block text-sm font-medium text-zinc-400 mb-2">
 Paste Customer Message Here
 </label>
 <textarea
 value={pastedMessage}
 onChange={(e) => setPastedMessage(e.target.value)}
 placeholder="*New Store Order Request!*..."
 className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 focus:border-cyan-500 focus:outline-none resize-none transition-colors"
 />
 <button
 onClick={parseMessage}
 disabled={!pastedMessage}
 className="mt-4 w-full bg-zinc-800 text-white font-medium py-3 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 >
 Parse Order Details
 </button>
 </div>

 {/* Parsed Output Preview */}
 <div className="bg-black/50 rounded-2xl p-6 border border-zinc-800/50 flex flex-col justify-center">
 {parsedData ? (
 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="flex items-center justify-between">
 <span className="text-zinc-500 text-sm">Extracted Name</span>
 <span className="font-medium text-white">{parsedData.name}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-zinc-500 text-sm">Extracted Phone</span>
 <span className="font-medium text-white">{parsedData.phone}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-zinc-500 text-sm">Total Amount</span>
 <span className="font-bold text-brand-gradient">₹{parsedData.total}</span>
 </div>
 <div className="pt-4 border-t border-zinc-800">
 <div className="flex items-center justify-between mb-2">
 <span className="text-zinc-500 text-sm">Generated Tracking ID</span>
 <span className="font-mono text-brand-gradient bg-brand-gradient hover-glow-brand/10 px-2 py-1 rounded text-xs">
 {parsedData.id}
 </span>
 </div>
 </div>
 <button
 onClick={confirmNewOrder}
 className="mt-6 w-full bg-brand-gradient hover-glow-brand text-black font-bold py-3 rounded-xl hover:bg-brand-gradient hover-glow-brand text-white border-transparent transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
 >
 <Check className="w-5 h-5" /> Add to Kanban & Send Reply
 </button>
 </div>
 ) : (
 <div className="text-center text-zinc-600">
 <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
 <p>Paste a message and click Parse to extract details.</p>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Panel B: Kanban Board */}
 <div>
 <h2 className="text-2xl font-bold text-white mb-6">Order Kanban Board</h2>
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
 key={order.id}
 className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-2xl p-4 group"
 >
 <div className="flex justify-between items-start mb-2">
 <span className="font-mono text-xs text-brand-gradient bg-brand-gradient hover-glow-brand/10 px-2 py-1 rounded">
 {order.id}
 </span>
 <button 
 onClick={() => deleteOrder(order.id)}
 className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 <h4 className="font-bold text-white text-lg">{order.name}</h4>
 <p className="text-zinc-400 text-sm mb-3">Ph: {order.phone}</p>
 
 <div className="mb-4">
 <Link href={`/admin/invoice/${order.id}`} className="text-xs text-brand-gradient hover:text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 flex items-center gap-1">
 <Printer className="w-3 h-3" /> View Receipt
 </Link>
 </div>
 
 {/* Status Mover Buttons */}
 <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-900">
 {status !== "Pending" && (
 <button
 onClick={() => updateOrderStatus(order.id, statuses[statuses.indexOf(status) - 1])}
 className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs py-2 rounded-lg transition-colors"
 >
 &larr; Back
 </button>
 )}
 {status !== "Delivered" && (
 <button
 onClick={() => updateOrderStatus(order.id, statuses[statuses.indexOf(status) + 1])}
 className="flex-1 bg-brand-gradient hover-glow-brand/10 hover:bg-brand-gradient hover-glow-brand/20 text-brand-gradient text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
 >
 Move <ArrowRight className="w-3 h-3" />
 </button>
 )}
 {status === "Delivered" && (
 <button
 onClick={() => deleteOrder(order.id)}
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
