"use client";

import { useState, useRef } from "react";
import { ShoppingBag, ShoppingCart, Lock, Home, X, MessageCircle, Truck, User, Phone, Upload, Image as ImageIcon, Minus, Plus } from "lucide-react";
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
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const fileInputRef = useRef(null);

  const itemTotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const deliveryCharge = deliveryOption === "HOME" ? 50 : 0;
  
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "PERCENTAGE") {
      discountAmount = (itemTotal * appliedPromo.value) / 100;
    } else if (appliedPromo.type === "FIXED") {
      discountAmount = appliedPromo.value;
    }
  }
  
  const totalAmount = itemTotal - discountAmount + deliveryCharge;
  const hasPhotoItem = items.some(item => item.hasCustomPhoto);

  const applyPromo = () => {
    const saved = localStorage.getItem("studioPromos");
    if (!saved) {
      setError("Invalid promo code.");
      return;
    }
    const promos = JSON.parse(saved);
    const found = promos.find(p => p.code === promoCode.toUpperCase() && p.active);
    if (found) {
      setAppliedPromo(found);
      setError("");
    } else {
      setAppliedPromo(null);
      setError("Invalid or inactive promo code.");
    }
  };

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
      let line = `${index + 1}. ${item.name} x${item.quantity || 1} ${item.details ? `(${item.details})` : ""} - ₹${item.price * (item.quantity || 1)}`;
      if (item.hasCustomPhoto && item.image && item.image.startsWith('http')) {
        line += `\n   📷 Photo: ${item.image}`;
      }
      return line;
    }).join("\n\n");

    let textMessage = `*New Store Order Request!* 🛍️\n\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\n\n*Order Details:*\n${orderDetails}\n\n*Subtotal:* ₹${itemTotal}\n`;
    
    if (appliedPromo) {
      textMessage += `*Discount (${appliedPromo.code}):* -₹${discountAmount}\n`;
    }

    textMessage += `*Delivery Option:* ${deliveryOption === "HOME" ? "Home Delivery (₹50)" : "Collect from Studio (Free)"}\n*Total Amount:* ₹${totalAmount}\n`;
    
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
    <div className={`bg-black/40 backdrop-blur-3xl rounded-3xl p-6 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 ${!isOpen && 'opacity-50 hover:opacity-100'}`}>
      {/* Cart Header */}
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-white">
          <ShoppingBag className="w-5 h-5 text-amber-500" /> Your Order
        </h2>
        <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
          {items.length} Items
        </span>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" multiple />
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-zinc-500">
              Your cart is empty.
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.cartId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 items-center bg-white/5 p-3 rounded-2xl border border-white/5 relative group"
              >
                <div className="relative shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  {['Frame', 'Collage', 'Gift'].includes(item.category) && (
                    <button 
                      onClick={() => triggerUpload(item.cartId)}
                      className="absolute -bottom-2 -right-2 bg-amber-500 text-black p-1.5 rounded-full shadow-md"
                    >
                      <Upload className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold text-amber-500">₹{item.price * (item.quantity || 1)}</p>
                    <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-2 py-1">
                      <button onClick={() => (item.quantity || 1) > 1 ? onUpdateItem(item.cartId, { quantity: item.quantity - 1 }) : onRemove(item.cartId)} className="text-zinc-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold text-white w-4 text-center">{item.quantity || 1}</span>
                      <button onClick={() => onUpdateItem(item.cartId, { quantity: (item.quantity || 1) + 1 })} className="text-zinc-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
                <button onClick={() => onRemove(item.cartId)} className="absolute right-3 top-3 text-zinc-500 hover:text-red-500"><X className="w-4 h-4" /></button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Checkout Section */}
      {items.length > 0 && (
        <div className="mt-6 space-y-4">
          {error && <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">{error}</div>}
          
          {hasPhotoItem && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-xs text-amber-400 font-medium flex items-center gap-2">
                <Upload className="w-4 h-4 shrink-0" />
                Upload photos for your customized items.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-sm text-white placeholder-zinc-600" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">WhatsApp Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-sm text-white placeholder-zinc-600" />
            </div>

            <div className="pt-2 border-t border-white/10">
              <label className="text-xs font-medium text-zinc-400 block mb-3">Delivery Option</label>
              <div className="flex gap-2 bg-black/50 p-1 rounded-xl border border-white/10">
                <button onClick={() => setDeliveryOption("STUDIO")} className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${deliveryOption === "STUDIO" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-white"}`}><Home className="w-4 h-4" /> Pick Up</button>
                <button onClick={() => setDeliveryOption("HOME")} className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${deliveryOption === "HOME" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-white"}`}><Truck className="w-4 h-4" /> Delivery (+₹50)</button>
              </div>
            </div>

            {deliveryOption === "HOME" && (
              <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery Address..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-sm text-white placeholder-zinc-600" />
            )}
          </div>

          <div className="flex flex-col gap-1 py-4 border-t border-white/10">
            <div className="flex justify-between items-center text-zinc-500 text-sm"><span>Subtotal</span><span>₹{itemTotal}</span></div>
            {discountAmount > 0 && <div className="flex justify-between items-center text-green-400 text-sm font-medium"><span>Discount</span><span>-₹{discountAmount}</span></div>}
            {deliveryCharge > 0 && <div className="flex justify-between items-center text-zinc-500 text-sm"><span>Delivery</span><span>+₹{deliveryCharge}</span></div>}
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-white/10">
              <span className="text-white font-bold text-lg">Total Amount</span>
              <span className="text-3xl font-bold text-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">₹{totalAmount}</span>
            </div>
          </div>

          <button onClick={handleWhatsAppOrder} disabled={isSubmitting} className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:-translate-y-1 transition-all disabled:opacity-50">
            {isSubmitting ? "Processing..." : "Place Order on WhatsApp"}
          </button>
          
          <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Secure Order Processing
          </p>
        </div>
      )}
    </div>
  );
}
