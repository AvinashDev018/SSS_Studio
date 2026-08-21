"use client";

import { useState, useRef } from "react";
import { ShoppingBag, X, MessageCircle, Truck, User, Phone, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createOrder } from "@/app/actions/orders";
import { uploadImageToCloud } from "@/app/actions/upload";

export default function OrderCart({ items, onRemove, onUpdateItem, isOpen }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("STUDIO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeUploadId, setActiveUploadId] = useState(null);
  const fileInputRef = useRef(null);

  const itemTotal = items.reduce((sum, item) => sum + item.price, 0);
  const deliveryCharge = deliveryOption === "HOME" ? 50 : 0;
  const totalAmount = itemTotal + deliveryCharge;
  const hasPhotoItem = items.some(item => item.hasCustomPhoto);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && activeUploadId) {
      if (files.length === 1) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onUpdateItem(activeUploadId, { 
            image: reader.result, 
            hasCustomPhoto: true, 
            collageImages: null
          });
        };
        reader.readAsDataURL(files[0]);
      } else {
        Promise.all(files.map(file => new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        }))).then(results => {
          onUpdateItem(activeUploadId, {
            image: results[0],
            collageImages: results,
            hasCustomPhoto: true
          });
        });
      }
    }
  };

  const triggerUpload = (cartId) => {
    setActiveUploadId(cartId);
    fileInputRef.current?.click();
  };

  const handleWhatsAppOrder = async () => {
    if (!name || !phone || (deliveryOption === "HOME" && !address)) {
      setError(deliveryOption === "HOME" ? "Please fill in all details including address." : "Please fill in Name and Phone.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    
    // 1. Upload custom photos to cloud (ImgBB)
    let processedItems = [...items];
    for (let i = 0; i < processedItems.length; i++) {
      let item = processedItems[i];
      if (item.hasCustomPhoto) {
        if (item.collageImages && item.collageImages.length > 0) {
          const uploadedUrls = [];
          for (const b64 of item.collageImages) {
             if (b64.startsWith('data:image')) {
                const res = await uploadImageToCloud(b64);
                if (res.success) uploadedUrls.push(res.url);
             } else {
                uploadedUrls.push(b64);
             }
          }
          item.collageImages = uploadedUrls;
          item.image = uploadedUrls[0] || item.image;
        } else if (item.image && item.image.startsWith('data:image')) {
          const result = await uploadImageToCloud(item.image);
          if (result.success) {
            item.image = result.url;
          }
        }
      }
    }

    // 2. Save to Database
    const res = await createOrder({
      customerName: name,
      customerPhone: phone,
      address: deliveryOption === "HOME" ? address : "Collect from Studio",
      items: processedItems,
      totalAmount
    });

    if (!res.success) {
      setError("Failed to create order. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // 3. Format the cart items for WhatsApp
    let orderDetails = processedItems.map((item, index) => {
      let line = `${index + 1}. ${item.name} ${item.details ? `(${item.details})` : ""} - ₹${item.price}`;
      if (item.hasCustomPhoto && item.image && item.image.startsWith('http')) {
        line += `\n   📷 Photo: ${item.image}`;
      }
      return line;
    }).join("\n\n");

    let textMessage = `*New Store Order Request!* 🛍️\n\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\n\n*Order Details:*\n${orderDetails}\n\n*Delivery Option:* ${deliveryOption === "HOME" ? "Home Delivery (₹50)" : "Collect from Studio (Free)"}\n*Total Amount:* ₹${totalAmount}\n`;
    
    if (deliveryOption === "HOME") {
      textMessage += `\n*Delivery Address:*\n${address}\n`;
    }

    textMessage += `\nPlease let me know how to pay so my order can be confirmed!`;

    if (hasPhotoItem) {
      textMessage += `\n\n*(Note: Custom photos are attached as links above!)*`;
    }

    const whatsappUrl = `https://wa.me/916383565425?text=${encodeURIComponent(textMessage)}`;
    
    // Clear cart in local storage
    localStorage.removeItem("studioCart");

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsSubmitting(false);
    }, 500);
  };

  if (!isOpen && items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-y-auto shadow-2xl flex flex-col max-h-[calc(100vh-6rem)] relative">
      {/* Cart Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between sticky top-0 z-20">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-500" /> Your Order
        </h2>
        <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-bold">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cart Items */}
      <div className="p-6 space-y-4">
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" multiple />
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
                <div className="relative shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  {['Frame', 'Collage', 'Gift'].includes(item.category) && (
                    <button 
                      onClick={() => triggerUpload(item.cartId)}
                      className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-full shadow-md hover:bg-amber-600 transition-colors"
                      title="Upload/Change Photo"
                    >
                      <Upload className="w-3 h-3" />
                    </button>
                  )}
                </div>
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

          <div className="space-y-3">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Delivery Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeliveryOption("STUDIO")}
                className={`p-3 border-2 rounded-xl text-left transition-colors flex flex-col gap-1 ${
                  deliveryOption === "STUDIO" 
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" 
                    : "border-zinc-200 dark:border-zinc-800 hover:border-amber-200"
                }`}
              >
                <span className="font-semibold text-sm text-zinc-900 dark:text-white">Collect from Studio</span>
                <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">Free</span>
              </button>
              <button
                onClick={() => setDeliveryOption("HOME")}
                className={`p-3 border-2 rounded-xl text-left transition-colors flex flex-col gap-1 ${
                  deliveryOption === "HOME" 
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" 
                    : "border-zinc-200 dark:border-zinc-800 hover:border-amber-200"
                }`}
              >
                <span className="font-semibold text-sm text-zinc-900 dark:text-white">Home Delivery</span>
                <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">+₹50 Courier</span>
              </button>
            </div>
          </div>

          {deliveryOption === "HOME" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
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
            </motion.div>
          )}

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
