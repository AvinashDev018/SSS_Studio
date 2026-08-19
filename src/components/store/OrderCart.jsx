"use client";

import { useState } from "react";
import { ShoppingBag, X, MessageCircle, Truck, User, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createOrder } from "@/app/actions/orders";

export default function OrderCart({ items, onRemove, isOpen }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  const handleWhatsAppOrder = async () => {
    if (!name || !phone || !address) {
      setError("Please fill in all details (Name, Phone, Address).");
      return;
    }
    setError("");
    setIsSubmitting(true);
    
    // 1. Save to Database first
    const res = await createOrder({
      customerName: name,
      customerPhone: phone,
      address,
      items,
      totalAmount
    });

    if (!res.success) {
      setError("Failed to create order. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const orderId = res.orderId;

    // 2. Format the cart items for WhatsApp
    let orderDetails = items.map((item, index) => 
      `${index + 1}. ${item.name} ${item.details ? `(${item.details})` : ""} - ₹${item.price}`
    ).join("\n");

    const textMessage = `*New Store Order!* 🛍️\n\n*Order ID:* ${orderId}\n\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\n\n*Order Details:*\n${orderDetails}\n\n*Total Amount:* ₹${totalAmount}\n\n*Delivery Address:*\n${address}\n\nPlease confirm my order.`;

    const whatsappUrl = `https://wa.me/916383565425?text=${encodeURIComponent(textMessage)}`;
    
    // Clear cart in local storage
    localStorage.removeItem("studioCart");

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      // Optional: you could clear the cart state here if you passed a clearCart function from parent
      setIsSubmitting(false);
    }, 500);
  };

  if (!isOpen && items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-8rem)]">
      {/* Cart Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-500" /> Your Order
        </h2>
        <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-bold">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-10 text-zinc-500"
            >
              Your cart is empty. Add some items to build your order!
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.cartId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 items-center bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 relative group"
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                )}
                <div className="flex-1 pr-6">
                  <h4 className="font-semibold text-zinc-900 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                  {item.details && <p className="text-xs text-zinc-500 line-clamp-1">{item.details}</p>}
                  <p className="font-bold text-amber-600 dark:text-amber-500 mt-1">₹{item.price}</p>
                </div>
                <button
                  onClick={() => onRemove(item.cartId)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Checkout Section */}
      {items.length > 0 && (
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4">
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mb-1">
              <User className="w-3 h-3" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mb-1">
              <Phone className="w-3 h-3" /> Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mb-1">
              <Truck className="w-3 h-3" /> Delivery Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address for courier delivery..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div className="flex justify-between items-center py-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-zinc-500 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">₹{totalAmount}</span>
          </div>

          <button
            onClick={handleWhatsAppOrder}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#25D366]/30 disabled:opacity-50"
          >
            <MessageCircle className="w-5 h-5" />
            {isSubmitting ? "Generating Order..." : "Order via WhatsApp"}
          </button>
        </div>
      )}
    </div>
  );
}
