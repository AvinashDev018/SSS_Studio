"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, updateOrderTrackingId } from "@/app/actions/orders";
import { ShoppingBag, Package, Truck, CheckCircle2, Clock, Search, ExternalLink, Image as ImageIcon } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminOrders() {
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState("");
 const [statusFilter, setStatusFilter] = useState("ALL");

 useEffect(() => {
 fetchOrders();
 }, []);

 const fetchOrders = async () => {
 const res = await getOrders();
 if (res.success) {
 setOrders(res.orders);
 }
 setLoading(false);
 };

 const handleAcceptAndWhatsApp = async (order) => {
 const isPassportOnly = order.items.every(item => item.category === "Passport");
 const newStatus = isPassportOnly ? "READY_FOR_PICKUP" : "PROCESSING";
 
 await handleStatusUpdate(order.orderId, newStatus);
 
 const trackUrl = `${window.location.origin}/track?id=${order.orderId}`;
 
 let textMessage = "";
 if (isPassportOnly) {
   textMessage = `Hello ${order.customerName}! 👋\n\nYour Passport Photos from Photo Studio are printed and *READY FOR PICKUP* right now!\n\n*Total Amount:* ₹${order.totalAmount}\n\nYou can track your order status anytime here:\n${trackUrl}\n\nThank you for choosing us! 📸`;
 } else {
   textMessage = `Hello ${order.customerName}! 👋\n\nYour order *#${order.orderId}* from Photo Studio has been *CONFIRMED* and is now processing!\n\n*Total Amount:* ₹${order.totalAmount}\n\nYou can track your order status anytime here:\n${trackUrl}\n\nWe will notify you once it's ready. Thank you for choosing us! 📸`;
 }

 const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(textMessage)}`;
 window.open(whatsappUrl, '_blank');
 };

 const handleNotifyReady = (order) => {
 const trackUrl = `${window.location.origin}/track?id=${order.orderId}`;
 const textMessage = `Hello ${order.customerName}! 👋\n\nGreat news! Your order *#${order.orderId}* is complete and *READY TO BE PICKED UP* from our studio.\n\n*Total Amount:* ₹${order.totalAmount}\n\nYou can view your order details here:\n${trackUrl}\n\nSee you soon! 📸`;
 const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(textMessage)}`;
 window.open(whatsappUrl, '_blank');
 };

 const handleStatusUpdate = async (orderId, newStatus) => {
 const res = await updateOrderStatus(orderId, newStatus);
 if (res.success) {
 // Update local state
 setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
 } else {
 alert("Failed to update status");
 }
 };

 const filteredOrders = orders.filter(order => {
 const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
 order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
 order.customerPhone.includes(searchTerm);
 const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
 return matchesSearch && matchesStatus;
 });

  const getStatusColor = (status) => {
    switch (status) {
      case 'UNCONFIRMED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'READY_FOR_PICKUP': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case 'PICKED_UP':
      case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      default: return 'bg-zinc-100 text-zinc-800';
    }
  };

 return (
 <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AdminNav currentPath="/admin/orders" />
 <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Store Orders</h1>
 <p className="text-zinc-500 mt-1">Manage physical product orders and track shipments.</p>
 </div>
 <div className="bg-brand-gradient hover-glow-brand text-white border-transparent dark:bg-brand-gradient hover-glow-brand text-white border-transparent/30 text-brand-gradient dark:text-brand-gradient px-4 py-2 rounded-xl font-bold flex items-center gap-2 self-start md:self-auto">
 <ShoppingBag className="w-5 h-5" />
 {orders.length} Total Orders
 </div>
 </div>

 <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
 <div className="flex flex-col md:flex-row gap-4 justify-between">
 <div className="relative flex-1 max-w-md">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
 <input
 type="text"
 placeholder="Search ID, Name, or Phone..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm"
 />
 </div>
 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm font-medium"
 >
  <option value="ALL">All Statuses</option>
  <option value="UNCONFIRMED">Unconfirmed</option>
  <option value="PENDING">Pending</option>
  <option value="PROCESSING">Processing</option>
  <option value="READY_FOR_PICKUP">Ready for Pickup</option>
  <option value="SHIPPED">Shipped</option>
  <option value="PICKED_UP">Picked Up</option>
  <option value="DELIVERED">Delivered</option>
  </select>
 </div>
 </div>

 <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
 <tr>
 <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white text-sm">Order ID</th>
 <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white text-sm">Customer</th>
 <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white text-sm">Items & Total</th>
 <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white text-sm">Status</th>
 <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white text-sm">Update</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
 {loading ? (
 <tr>
 <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">Loading orders...</td>
 </tr>
 ) : filteredOrders.length === 0 ? (
 <tr>
 <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">No orders found.</td>
 </tr>
 ) : (
 filteredOrders.map((order) => (
 <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
 <td className="px-6 py-4">
 {order.status === "UNCONFIRMED" ? (
 <span className="font-medium text-red-500 text-sm">ID Hidden</span>
 ) : (
 <span className="font-bold text-zinc-900 dark:text-white font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded select-all cursor-pointer">
 {order.orderId}
 </span>
 )}
 <p className="text-xs text-zinc-500 mt-2">
 {new Date(order.createdAt).toLocaleDateString()}
 </p>
 </td>
 <td className="px-6 py-4">
 <p className="font-semibold text-zinc-900 dark:text-white">{order.customerName}</p>
 <p className="text-sm text-zinc-500">{order.customerPhone}</p>
 <p className="text-xs text-zinc-400 mt-1 max-w-[150px] truncate" title={order.address}>
 {order.address}
 </p>
 </td>
 <td className="px-6 py-4">
 <div className="flex flex-col gap-1">
 <span className="font-bold text-brand-gradient dark:text-brand-gradient">₹{order.totalAmount}</span>
 <span className="text-xs text-zinc-500">{order.items.length} items</span>
 <div className="mt-2 flex flex-col gap-1">
 {order.items.map((item, idx) => (
 item.image && (
 <a 
 key={idx} 
 href={item.image} 
 target="_blank" 
 rel="noreferrer" 
 className="text-xs flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit"
 >
 <ImageIcon className="w-3 h-3" /> Photo: {item.name}
 </a>
 )
 ))}
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
 {order.status}
 </span>
 </td>
 <td className="px-6 py-4">
 {order.status === "UNCONFIRMED" ? (
 <button
 onClick={() => handleAcceptAndWhatsApp(order)}
 className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-2 whitespace-nowrap"
 >
 <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
 </svg>
 {order.items.every(i => i.category === "Passport") ? "Accept & Mark Ready" : "Accept & Process"}
 </button>
 ) : (
 <div className="flex items-center gap-2">
 <select
 value={order.status}
 onChange={async (e) => {
   const newStatus = e.target.value;
   if (newStatus === "SHIPPED") {
     const tId = window.prompt("Enter Courier Tracking ID (e.g., Shiprocket AWB):", order.courierTrackingId || "");
     if (tId !== null) {
       await updateOrderTrackingId(order.orderId, tId);
       // Update local state for tracking id
       setOrders(prev => prev.map(o => o.orderId === order.orderId ? { ...o, courierTrackingId: tId } : o));
     }
   }
   handleStatusUpdate(order.orderId, newStatus);
 }}
 className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
 >
  <option value="PENDING">Pending</option>
  <option value="PROCESSING">Processing</option>
  {order.address === "Collect from Studio" ? (
    <>
      <option value="READY_FOR_PICKUP">Ready for Pickup</option>
      <option value="PICKED_UP">Picked Up</option>
    </>
  ) : (
    <>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
    </>
  )}
  </select>
  {order.status === "READY_FOR_PICKUP" && (
    <button
      onClick={() => handleNotifyReady(order)}
      title="Notify Customer via WhatsApp"
      className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2 rounded-lg shadow-sm transition-colors flex shrink-0"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>
  )}
 </div>
 )}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
