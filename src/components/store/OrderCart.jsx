"use client";

import { useState, useRef, useEffect } from "react";
import { ShoppingBag, ShoppingCart, Lock, Home, X, MessageCircle, Truck, User, Phone, Upload, Image as ImageIcon, Minus, Plus, CheckCircle2, CreditCard, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/orders";
import { uploadImageToCloud } from "@/app/actions/upload";
import { useSession } from "next-auth/react";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function OrderCart({ items, onRemove, onUpdateItem, isOpen }) {
 const { data: session } = useSession();
 const router = useRouter();
 const [name, setName] = useState("");
 const [phone, setPhone] = useState("");
 const [address, setAddress] = useState("");
 const [orderMode, setOrderMode] = useState("STUDIO_CASH");
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState("");
 const [fieldErrors, setFieldErrors] = useState({ name: false, phone: false, address: false });

 useEffect(() => {
   if (session?.user) {
     if (!name) setName(session.user.name || "");
     if (!phone && session.user.phone) setPhone(session.user.phone);
   }
 }, [session]);
 const [activeUploadId, setActiveUploadId] = useState(null);
 const [promoCode, setPromoCode] = useState("");
 const [appliedPromo, setAppliedPromo] = useState(null);
 const [checkoutSuccess, setCheckoutSuccess] = useState(false);
 const [createdOrderId, setCreatedOrderId] = useState(null);
 const fileInputRef = useRef(null);

 const itemTotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
 const deliveryCharge = orderMode === "HOME_UPI" ? 50 : 0;
 
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

 const handleCheckout = async () => {
 if (!session?.user) {
 router.push("/login?callbackUrl=/store");
 return;
 }

 const newFieldErrors = { name: !name.trim(), phone: !phone.trim(), address: orderMode === "HOME_UPI" && !address.trim() };
 setFieldErrors(newFieldErrors);

 if (!name.trim() || !phone.trim()) {
  setError("Please fill in all required fields highlighted below.");
  return;
 }
  
 if (orderMode === "HOME_UPI" && !address.trim()) {
  setError("Please provide a delivery address.");
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

  // 2. Load Razorpay Script
  const resScript = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!resScript) {
    setError("Failed to load Razorpay SDK. Please check your internet connection.");
    setIsSubmitting(false);
    return;
  }

  // 3. Create Order on Backend
  try {
    const orderData = await fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalAmount,
        customerName: name,
        customerPhone: phone,
        address: orderMode === "HOME_UPI" ? address : "Collect from Studio",
        items: processedItems,
        paymentMode: orderMode === "STUDIO_CASH" ? "CASH" : "UPI",
      }),
    }).then((t) => t.json());

    if (!orderData.success) {
      setError("Failed to create order on server.");
      setIsSubmitting(false);
      return;
    }

    // 4. Handle Cash Payment directly
    if (orderData.isCash) {
      localStorage.removeItem("studioCart");
      setCreatedOrderId(orderData.dbOrderId); 
      setCheckoutSuccess(true);
      setIsSubmitting(false);
      return;
    }

    // 5. Open Razorpay Checkout Widget for UPI/Online
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount: orderData.order.amount,
      currency: "INR",
      name: "SSS Studio",
      description: "Photo Studio Store Checkout",
      order_id: orderData.order.id,
      handler: async function (response) {
        // 5. Verify Signature on Backend
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            dbOrderId: orderData.dbOrderId,
          }),
        }).then((t) => t.json());

        if (verifyRes.success) {
          localStorage.removeItem("studioCart");
          setCreatedOrderId(orderData.dbOrderId); // Short db ID for user
          setCheckoutSuccess(true);
        } else {
          setError("Payment verification failed! Please contact support.");
        }
        setIsSubmitting(false);
      },
      prefill: {
        name: name,
        contact: phone,
        email: session?.user?.email || "",
      },
      theme: {
        color: "#06b6d4", // Cyan
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      setError(response.error.description);
      setIsSubmitting(false);
    });
    
    // Fallback if users close the popup without paying
    paymentObject.on("modal.closed", function () {
      setIsSubmitting(false);
    });

    paymentObject.open();

  } catch (err) {
    setError("An unexpected error occurred during checkout.");
    setIsSubmitting(false);
  }
  };

 if (!isOpen && items.length === 0) return null;

 if (checkoutSuccess) {
 return (
 <div className={`bg-black/40 backdrop-blur-3xl rounded-3xl p-6 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 text-center max-w-sm mx-auto`}>
 <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
 <CheckCircle2 className="w-10 h-10" />
 </div>
 <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
 <p className="text-zinc-400 text-sm mb-6">Your order <span className="font-bold text-white">{createdOrderId}</span> has been successfully placed.</p>
 
 <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-6 text-left">
 <p className="text-sm text-zinc-400 mb-1">Total Amount</p>
 <p className="text-2xl font-bold text-brand-gradient mb-4">₹{totalAmount}</p>
 
 {orderMode === "HOME_UPI" ? (
 <div className="flex flex-col items-center border-t border-white/10 pt-4 mt-2">
 <p className="text-xs text-zinc-300 text-center mb-3">Scan QR code to pay securely via UPI</p>
 <div className="w-32 h-32 bg-white p-2 rounded-xl">
 <img src="https://images.unsplash.com/photo-1607519539352-035987f2ff83?w=200&auto=format&fit=crop" alt="UPI QR Code" className="w-full h-full object-cover rounded-lg mix-blend-multiply opacity-80" />
 </div>
 <p className="text-[10px] text-zinc-500 mt-2">Once paid, your order will be shipped to {address}</p>
 </div>
 ) : (
 <div className="flex flex-col border-t border-white/10 pt-4 mt-2">
 <p className="text-sm font-medium text-white mb-1"><Home className="w-4 h-4 inline mr-1 text-cyan-400" /> Pay at Studio</p>
 <p className="text-xs text-zinc-400">Please pay ₹{totalAmount} when you visit the studio to collect your order.</p>
 </div>
 )}
 </div>

  <div className="space-y-2">
    {/* Send Order & Photo to WhatsApp Button */}
    <button
      onClick={() => {
        const itemNames = items.map((i) => `• ${i.name} (x${i.quantity || 1})`).join("\n");
        const photoLinks = items
          .filter((i) => i.image)
          .map((i, idx) => `🖼️ Photo ${idx + 1}: ${i.image}`)
          .join("\n");

        const msg =
          `🛒 *New Studio Frame Order* 🛒\n` +
          `--------------------------------\n` +
          `🔖 *Order ID:* #${createdOrderId}\n` +
          `👤 *Name:* ${name}\n` +
          `📞 *Phone:* ${phone}\n` +
          `📍 *Delivery:* ${orderMode === "HOME_UPI" ? address : "Studio Pickup"}\n` +
          `💰 *Total Amount:* ₹${totalAmount}\n` +
          `--------------------------------\n` +
          `📦 *Items:* \n${itemNames}\n` +
          (photoLinks ? `\n${photoLinks}\n` : "") +
          `--------------------------------\n` +
          `Please confirm printing and framing schedule!`;

        const waUrl = `https://wa.me/916383565425?text=${encodeURIComponent(msg)}`;
        const win = window.open(waUrl, "_blank");
        if (!win || win.closed || typeof win.closed === "undefined") {
          window.location.href = waUrl;
        }
      }}
      className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black py-3 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
    >
      <MessageCircle className="w-4 h-4 fill-black" /> Send Order Details & Photo to WhatsApp
    </button>

    <Link href={`/track?id=${createdOrderId}`} onClick={() => onRemove("ALL")} className="w-full bg-brand-gradient hover-glow-brand text-black py-3 rounded-xl font-bold text-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2">
      {orderMode === "HOME_UPI" ? (
        <><Truck className="w-4 h-4" /> Track Courier Status</>
      ) : (
        <><Store className="w-4 h-4" /> Check Order Status</>
      )}
    </Link>
  </div>
 </div>
 );
 }

 return (
  <div className={`bg-zinc-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-300 ${!isOpen && 'opacity-70 hover:opacity-100'}`}>
  {/* Cart Header */}
  <div className="flex justify-between items-center mb-6 border-b border-amber-500/20 pb-4">
  <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-white">
  <ShoppingBag className="w-5 h-5 text-amber-400" /> Your Order
  </h2>
  <span className="bg-amber-500/20 text-amber-300 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-500/40">
  {items.length} Items
  </span>
  </div>

  {/* Cart Items */}
  <div className="space-y-4">
  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" multiple />
  <AnimatePresence>
  {items.length === 0 ? (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-zinc-400 font-medium">
  Your cart is empty.
  </motion.div>
  ) : (
  items.map((item) => (
  <motion.div
  key={item.cartId}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, x: -20 }}
  className="flex gap-4 items-center bg-zinc-950 p-3 rounded-2xl border border-amber-500/25 relative group shadow-md"
  >
  <div className="relative shrink-0">
  {item.image ? (
  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-amber-500/30" />
  ) : (
  <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
  <ImageIcon className="w-6 h-6" />
  </div>
  )}
  {['Frame', 'Collage', 'Gift'].includes(item.category) && (
  <button 
  onClick={() => triggerUpload(item.cartId)}
  className="absolute -bottom-2 -right-2 bg-amber-400 text-black p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"
  >
  <Upload className="w-3 h-3" />
  </button>
  )}
  </div>
  <div className="flex-1">
  <h4 className="font-bold text-white text-sm leading-snug">{item.name}</h4>
  <div className="flex items-center justify-between mt-2">
  <p className="font-extrabold text-amber-400 font-mono">₹{item.price * (item.quantity || 1)}</p>
  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1">
  <button onClick={() => (item.quantity || 1) > 1 ? onUpdateItem(item.cartId, { quantity: item.quantity - 1 }) : onRemove(item.cartId)} className="text-zinc-300 hover:text-white font-bold cursor-pointer"><Minus className="w-3 h-3" /></button>
  <span className="text-xs font-black text-white w-4 text-center">{item.quantity || 1}</span>
  <button onClick={() => onUpdateItem(item.cartId, { quantity: (item.quantity || 1) + 1 })} className="text-zinc-300 hover:text-white font-bold cursor-pointer"><Plus className="w-3 h-3" /></button>
  </div>
  </div>
  </div>
  <button onClick={() => onRemove(item.cartId)} className="absolute right-3 top-3 text-zinc-400 hover:text-red-400 cursor-pointer"><X className="w-4 h-4" /></button>
  </motion.div>
  ))
  )}
  </AnimatePresence>
  </div>

  {/* Checkout Section */}
  {items.length > 0 && (
  <div className="mt-6 space-y-4">
  
  {hasPhotoItem && (
  <div className="bg-amber-400 text-black rounded-xl p-3 shadow-md">
  <p className="text-xs font-black flex items-center justify-center gap-2 uppercase tracking-wide">
  <Upload className="w-4 h-4 shrink-0" />
  Upload photos for your customized items
  </p>
  </div>
  )}

  <div className="space-y-4">
  <div>
   <label className="text-xs font-bold text-zinc-200 block mb-1">
    Full Name <span className="text-amber-400">*</span>
   </label>
   <input
    type="text"
    value={name}
    onChange={(e) => { setName(e.target.value); if(e.target.value.trim()) setFieldErrors(prev => ({...prev, name: false})); }}
    placeholder="e.g. Ramesh Kumar"
    className={`w-full bg-zinc-950 rounded-xl px-4 py-3 focus:outline-none text-sm font-semibold text-white placeholder-zinc-500 border ${
     fieldErrors.name ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-amber-400'
    }`}
   />
   {fieldErrors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1 font-bold">⚠ Name is required</p>}
  </div>
  <div>
   <label className="text-xs font-bold text-zinc-200 block mb-1">
    WhatsApp Number (10 Digits) <span className="text-amber-400">*</span>
   </label>
   <input
    type="tel"
    maxLength={10}
    value={phone}
    onChange={(e) => { 
      const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
      setPhone(digitsOnly); 
      if(digitsOnly.length === 10) setFieldErrors(prev => ({...prev, phone: false})); 
    }}
    placeholder="9876543210"
    className={`w-full bg-zinc-950 rounded-xl px-4 py-3 focus:outline-none text-sm font-semibold text-white placeholder-zinc-500 border ${
     fieldErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-amber-400'
    }`}
   />
   {fieldErrors.phone && <p className="text-red-400 text-xs mt-1 flex items-center gap-1 font-bold">⚠ Valid 10-digit phone number is required</p>}
  </div>

  <div className="pt-2">
  <label className="text-xs font-bold text-zinc-200 block mb-1">Promo Code (Optional)</label>
  <div className="flex gap-2">
  <input 
  type="text" 
  value={promoCode} 
  onChange={(e) => setPromoCode(e.target.value.toUpperCase())} 
  placeholder="e.g. FESTIVAL20" 
  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400 text-sm font-bold text-white placeholder-zinc-500 uppercase" 
  disabled={appliedPromo !== null}
  />
  {!appliedPromo ? (
  <button onClick={applyPromo} className="bg-amber-400 hover:bg-amber-300 text-black px-4 py-2.5 rounded-xl text-sm font-extrabold transition-colors cursor-pointer">
  Apply
  </button>
  ) : (
  <button onClick={() => { setAppliedPromo(null); setPromoCode(""); }} className="bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-colors">
  Remove
  </button>
  )}
  </div>
  </div>

  <div className="pt-2 border-t border-amber-500/20">
     <label className="text-xs font-bold text-zinc-200 block mb-3">Order & Payment Option</label>
     <div className="flex flex-col gap-2">
       <button onClick={() => setOrderMode("STUDIO_CASH")} className={`w-full flex justify-between items-center px-4 py-3 text-sm font-bold rounded-xl transition-all border cursor-pointer ${orderMode === "STUDIO_CASH" ? "bg-amber-500/20 text-white border-amber-400 shadow-sm" : "bg-zinc-950 text-zinc-300 border-zinc-700 hover:text-white"}`}>
         <div className="flex items-center gap-3"><Home className="w-4 h-4 text-amber-400" /> Pick Up (Pay at Studio)</div>
         {orderMode === "STUDIO_CASH" && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
       </button>
       
       <button onClick={() => setOrderMode("STUDIO_UPI")} className={`w-full flex justify-between items-center px-4 py-3 text-sm font-bold rounded-xl transition-all border cursor-pointer ${orderMode === "STUDIO_UPI" ? "bg-amber-500/20 text-white border-amber-400 shadow-sm" : "bg-zinc-950 text-zinc-300 border-zinc-700 hover:text-white"}`}>
         <div className="flex items-center gap-3"><CreditCard className="w-4 h-4 text-amber-400" /> Pick Up (Pay via UPI)</div>
         {orderMode === "STUDIO_UPI" && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
       </button>

       <button onClick={() => setOrderMode("HOME_UPI")} className={`w-full flex justify-between items-center px-4 py-3 text-sm font-bold rounded-xl transition-all border cursor-pointer ${orderMode === "HOME_UPI" ? "bg-amber-500/20 text-white border-amber-400 shadow-sm" : "bg-zinc-950 text-zinc-300 border-zinc-700 hover:text-white"}`}>
         <div className="flex items-center gap-3"><Truck className="w-4 h-4 text-amber-400" /> Courier Delivery (Pay via UPI)</div>
         <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full font-extrabold">+₹50</span>
            {orderMode === "HOME_UPI" && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
         </div>
       </button>
     </div>
   </div>

   {orderMode === "HOME_UPI" && (
    <div className="mt-2">
     <textarea
      rows={2}
      value={address}
      onChange={(e) => { setAddress(e.target.value); if(e.target.value.trim()) setFieldErrors(prev => ({...prev, address: false})); }}
      placeholder="Full Delivery Address with Pincode..."
      className={`w-full bg-zinc-950 rounded-xl px-4 py-3 focus:outline-none text-sm font-semibold text-white placeholder-zinc-500 border ${
       fieldErrors.address ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-amber-400'
      }`}
     />
     {fieldErrors.address && <p className="text-red-400 text-xs mt-1 flex items-center gap-1 font-bold">⚠ Delivery address is required</p>}
    </div>
   )}

  </div>

  <div className="flex flex-col gap-1 py-4 border-t border-amber-500/20">
  <div className="flex justify-between items-center text-zinc-300 text-sm font-medium"><span>Subtotal</span><span>₹{itemTotal}</span></div>
  {discountAmount > 0 && <div className="flex justify-between items-center text-emerald-400 text-sm font-bold"><span>Discount</span><span>-₹{discountAmount}</span></div>}
  {deliveryCharge > 0 && <div className="flex justify-between items-center text-zinc-300 text-sm font-medium"><span>Delivery</span><span>+₹{deliveryCharge}</span></div>}
  <div className="flex justify-between items-center pt-3 mt-2 border-t border-amber-500/20">
  <span className="text-white font-serif font-bold text-lg">Total Amount</span>
  <span className="text-3xl font-extrabold text-amber-400 font-mono drop-shadow">₹{totalAmount}</span>
  </div>
  </div>

  {error && (
   <div className="bg-red-500/15 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-xs font-bold flex items-start gap-2">
    <span className="text-sm leading-none">⚠️</span>
    <span>{error}</span>
   </div>
  )}
  <button onClick={handleCheckout} disabled={isSubmitting} className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black py-4 rounded-xl font-extrabold text-base uppercase tracking-wider hover:from-amber-300 hover:to-yellow-400 hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer shadow-lg">
   {isSubmitting ? "Processing..." : "Confirm Order"}
  </button>
 
 <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-1">
 <Lock className="w-3 h-3" /> Secure Order Processing
 </p>
 </div>
 )}
 </div>
 );
}
