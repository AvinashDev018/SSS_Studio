"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/app/actions/orders";
import { ShoppingBag, Package, Truck, CheckCircle2, Clock, Search, ExternalLink } from "lucide-react";
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
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      default: return 'bg-zinc-100 text-zinc-800';
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminNav currentPath="/admin/orders" />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Store Orders</h1>
          <p className="text-zinc-500 mt-1">Manage physical product orders and track shipments.</p>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
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
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 text-sm font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNCONFIRMED">Unconfirmed</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
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
                        <span className="font-bold text-amber-600 dark:text-amber-500">₹{order.totalAmount}</span>
                        <span className="text-xs text-zinc-500">{order.items.length} items</span>
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
                          onClick={() => handleStatusUpdate(order.orderId, "PROCESSING")}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors"
                        >
                          Accept Order
                        </button>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                        </select>
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
