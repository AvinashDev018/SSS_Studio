"use client";

import { useState, useRef, useEffect } from "react";
import { ShoppingBag, ShoppingCart, Lock, Home, X, MessageCircle, Truck, User, Phone, Upload, Image as ImageIcon, Minus, Plus, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/orders";
import { uploadImageToCloud } from "@/app/actions/upload";
import { useSession } from "next-auth/react";

export default function OrderCart({ items, onRemove, onUpdateItem, isOpen }) {
 const { data: session } = useSession();
 const router = useRouter();
 const [name, setName] = useState("");
 const [phone, setPhone] = useState("");
 const [address, setAddress] = useState("");
 const [deliveryOption, setDeliveryOption] = useState("STUDIO");
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState("");

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

 const handleCheckout = async () => {
 if (!session?.user) {
 router.push("/login?callbackUrl=/store");
 return;
 }

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

 // Clear cart in local storage
 localStorage.removeItem("studioCart");
 setCreatedOrderId(res.orderId);
 setCheckoutSuccess(true);
 setIsSubmitting(false);
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
 
 {deliveryOption === "HOME" ? (
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

 <Link href="/track" onClick={() => onRemove("ALL")} className="block w-full bg-brand-gradient hover-glow-brand text-black py-3 rounded-xl font-bold text-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all">
 Track Your Order
 </Link>
 </div>
 );
 }

 return (
 <div className={`bg-black/40 backdrop-blur-3xl rounded-3xl p-6 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 ${!isOpen && 'opacity-50 hover:opacity-100'}`}>
 {/* Cart Header */}
 <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
 <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-white">
 <ShoppingBag className="w-5 h-5 text-brand-gradient" /> Your Order
 </h2>
 <span className="bg-brand-gradient hover-glow-brand/20 text-brand-gradient text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30">
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
 className="absolute -bottom-2 -right-2 bg-brand-gradient hover-glow-brand text-black p-1.5 rounded-full shadow-md"
 >
 <Upload className="w-3 h-3" />
 </button>
 )}
 </div>
 <div className="flex-1">
 <h4 className="font-semibold text-white text-sm">{item.name}</h4>
 <div className="flex items-center justify-between mt-2">
 <p className="font-bold text-brand-gradient">₹{item.price * (item.quantity || 1)}</p>
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
 <div className="bg-brand-gradient hover-glow-brand border border-transparent rounded-xl p-3">
 <p className="text-sm text-black font-bold flex items-center justify-center gap-2">
 <Upload className="w-4 h-4 shrink-0" />
 Upload photos for your customized items
 </p>
 </div>
 )}

 <div className="space-y-4">
 <div>
 <label className="text-xs font-medium text-zinc-400 block mb-1">Full Name</label>
 <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm text-white placeholder-zinc-600" />
 </div>
 <div>
 <label className="text-xs font-medium text-zinc-400 block mb-1">WhatsApp Number</label>
 <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm text-white placeholder-zinc-600" />
 </div>

 <div className="pt-2 border-t border-white/10">
 <label className="text-xs font-medium text-zinc-400 block mb-3">Delivery Option</label>
 <div className="flex gap-2 bg-black/50 p-1 rounded-xl border border-white/10">
 <button onClick={() => setDeliveryOption("STUDIO")} className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${deliveryOption === "STUDIO" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-white"}`}><Home className="w-4 h-4" /> Pick Up</button>
 <button onClick={() => setDeliveryOption("HOME")} className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${deliveryOption === "HOME" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-white"}`}><Truck className="w-4 h-4" /> Delivery (+₹50)</button>
 </div>
 </div>

 {deliveryOption === "HOME" && (
 <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery Address..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm text-white placeholder-zinc-600" />
 )}

 <div className="pt-2">
 <label className="text-xs font-medium text-zinc-400 block mb-1">Promo Code (Optional)</label>
 <div className="flex gap-2">
 <input 
 type="text" 
 value={promoCode} 
 onChange={(e) => setPromoCode(e.target.value.toUpperCase())} 
 placeholder="e.g. FESTIVAL20" 
 className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm text-white placeholder-zinc-600 uppercase" 
 disabled={appliedPromo !== null}
 />
 {!appliedPromo ? (
 <button onClick={applyPromo} className="bg-brand-gradient hover-glow-brand text-black px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-gradient hover-glow-brand text-white border-transparent transition-colors">
 Apply
 </button>
 ) : (
 <button onClick={() => { setAppliedPromo(null); setPromoCode(""); }} className="bg-red-500/20 text-red-500 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-colors">
 Remove
 </button>
 )}
 </div>
 </div>
 </div>

 <div className="flex flex-col gap-1 py-4 border-t border-white/10">
 <div className="flex justify-between items-center text-zinc-500 text-sm"><span>Subtotal</span><span>₹{itemTotal}</span></div>
 {discountAmount > 0 && <div className="flex justify-between items-center text-green-400 text-sm font-medium"><span>Discount</span><span>-₹{discountAmount}</span></div>}
 {deliveryCharge > 0 && <div className="flex justify-between items-center text-zinc-500 text-sm"><span>Delivery</span><span>+₹{deliveryCharge}</span></div>}
 <div className="flex justify-between items-center pt-3 mt-2 border-t border-white/10">
 <span className="text-white font-bold text-lg">Total Amount</span>
 <span className="text-3xl font-bold text-brand-gradient drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">₹{totalAmount}</span>
 </div>
 </div>

 <button onClick={handleCheckout} disabled={isSubmitting} className="w-full bg-brand-gradient hover-glow-brand text-black py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all disabled:opacity-50">
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
