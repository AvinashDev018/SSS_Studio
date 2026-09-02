"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PassportPackages from "@/components/store/PassportPackages";
import Gifts from "@/components/store/Gifts";
import OrderCart from "@/components/store/OrderCart";
import SSSPhotoFramePricing from "@/components/sections/SSSPhotoFramePricing";
import BirthdayGiftOrderModal from "@/components/ui/BirthdayGiftOrderModal";
import { Package, Camera, Gift, ShoppingCart, Plus, Loader2 } from "lucide-react";

export default function StorePage() {
 const [activeTab, setActiveTab] = useState("frames");
 const [gifts, setGifts] = useState([]);
 const [passportPackages, setPassportPackages] = useState([]);
 const [isLoadingProducts, setIsLoadingProducts] = useState(true);
 const [cartItems, setCartItems] = useState([]);
 const [isCartOpen, setIsCartOpen] = useState(false);
 const [isLoaded, setIsLoaded] = useState(false);
 const [passportRefs, setPassportRefs] = useState({});
 const [giftMessages, setGiftMessages] = useState({});
 const [giftImages, setGiftImages] = useState({});
 const [selectedGiftForOrder, setSelectedGiftForOrder] = useState(null);


 useEffect(() => {
   const fetchProducts = async () => {
     try {
       const res = await fetch('/api/products');
       if (res.ok) {
         const products = await res.json();
         setGifts(products.filter(p => p.category === 'Gift'));
         setPassportPackages(products.filter(p => p.category === 'Passport'));
       }
     } catch (error) {
       console.error("Failed to fetch products:", error);
     } finally {
       setIsLoadingProducts(false);
     }
   };
   fetchProducts();
 }, []);

 // Load cart from local storage on mount
 useEffect(() => {
 const savedCart = localStorage.getItem("studioCart");
 if (savedCart) {
 try {
 setCartItems(JSON.parse(savedCart));
 setIsCartOpen(true);
 } catch (e) {
 console.error("Failed to load cart");
 }
 }
 setIsLoaded(true);
 }, []);

 // Save cart to local storage whenever it changes
 useEffect(() => {
 if (isLoaded) {
 try {
 localStorage.setItem("studioCart", JSON.stringify(cartItems));
 } catch (error) {
 if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
 console.warn("Storage quota exceeded. Stripping base64 images to save cart.");
 // Strip large base64 strings so we don't crash the browser
 const strippedCart = cartItems.map(item => {
 const newItem = { ...item };
 if (newItem.image && newItem.image.startsWith('data:image')) {
 newItem.image = null;
 newItem.imageStripped = true;
 }
 if (newItem.collageImages) {
 newItem.collageImages = newItem.collageImages.map(img => 
 img.startsWith('data:image') ? null : img
 ).filter(Boolean);
 }
 return newItem;
 });
 
 try {
 localStorage.setItem("studioCart", JSON.stringify(strippedCart));
 // We don't alert here because it would trigger on every render if state is updated
 } catch (e) {
 console.error("Failed to save cart even after stripping images", e);
 }
 }
 }
 }
 }, [cartItems, isLoaded]);

 const addToCart = (product) => {
 const details = product.details || "";
 const hasCustomPhoto = product.hasCustomPhoto || false;
 const image = product.image || null;

 setCartItems(prev => {
 const existingItemIndex = prev.findIndex(item => 
 item.id === product.id && 
 item.details === details && 
 (!hasCustomPhoto || item.image === image)
 );

 if (existingItemIndex >= 0) {
 const newItems = [...prev];
 newItems[existingItemIndex] = {
 ...newItems[existingItemIndex],
 quantity: (newItems[existingItemIndex].quantity || 1) + 1
 };
 return newItems;
 } else {
 return [...prev, { 
 ...product, 
 details,
 quantity: 1,
 ...(hasCustomPhoto && { hasCustomPhoto, image }),
 cartId: Math.random().toString(36).substr(2, 9) 
 }];
 }
 });
 setIsCartOpen(true);
 };

 const removeFromCart = (cartId) => {
 setCartItems(prev => prev.filter(item => item.cartId !== cartId));
 };

 const updateCartItem = (cartId, updates) => {
 setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, ...updates } : item));
 };

  const tabs = [
    { id: "frames", label: "Photo Frames (13 Sizes)", icon: <Package className="w-4 h-4" /> },
    { id: "passport", label: "Passport Photos", icon: <Camera className="w-4 h-4" /> },
    { id: "gifts", label: "Birthday Gifts", icon: <Gift className="w-4 h-4" /> },
  ];

 return (
 <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[90vh] relative">
 <AnimatedSection className="text-center mb-12">
 <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-cyan-400 dark:to-violet-500">
 Studio Store
 </h1>
 <p className="text-zinc-600 dark:text-zinc-300 text-lg max-w-2xl mx-auto font-light">
 Order premium photo frames, passport prints, and personalized birthday gifts directly to your door.
 </p>
 </AnimatedSection>

 {/* Tabs */}
 <div className="w-full overflow-x-auto no-scrollbar mb-12 relative z-10 pb-4">
 <div className="flex sm:justify-center min-w-max px-4">
 <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-full inline-flex border border-white/10 shadow-2xl">
 {tabs.map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
 activeTab === tab.id
 ? "bg-brand-gradient hover-glow-brand text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]"
 : "text-zinc-400 hover:text-white hover:bg-white/5"
 }`}
 >
 {tab.icon} {tab.label}
 </button>
 ))}
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
 {/* Main Content Area */}
 <div className={activeTab === "frames" || activeTab === "gifts" ? "lg:col-span-12" : "lg:col-span-8"}>
 {activeTab === "frames" && (
 <AnimatedSection>
   <SSSPhotoFramePricing />
 </AnimatedSection>
 )}

 {activeTab === "passport" && (
  isLoadingProducts ? (
    <div className="flex justify-center items-center h-48">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  ) : (
 <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {passportPackages.map((pkg) => (
 <div key={pkg.id} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-500 group flex flex-col h-full relative">
 <div className="h-48 overflow-hidden shrink-0 relative">
 <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
 </div>
 <div className="p-5 flex flex-col flex-1 relative z-10">
 <h3 className="font-serif font-bold text-xl text-white mb-1">{pkg.name}</h3>
 <p className="text-brand-gradient font-bold text-lg mb-4">₹{pkg.price}</p>
 
 <div className="mt-auto pt-4">
 <div className="mb-4">
 <label className="text-xs font-medium text-zinc-400 mb-1 block">
 Old Studio Photo? (Optional)
 </label>
 <input 
 type="text" 
 placeholder="e.g. A123" 
 value={passportRefs[pkg.id] || ""}
 onChange={(e) => setPassportRefs(prev => ({...prev, [pkg.id]: e.target.value}))}
 className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 uppercase placeholder-zinc-600 transition-colors"
 />
 </div>

 <button 
 onClick={() => addToCart(pkg)}
 className="w-full bg-brand-gradient hover-glow-brand text-black py-2.5 rounded-xl font-bold hover:bg-brand-gradient hover-glow-brand text-white border-transparent hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
 >
 <Plus className="w-4 h-4" /> Add to Order
 </button>
 </div>
 </div>
 </div>
 ))}
 </AnimatedSection>
  )
 )}

 {activeTab === "gifts" && (
  isLoadingProducts ? (
    <div className="flex justify-center items-center h-48">
      <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
    </div>
  ) : (
 <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {gifts.map((gift) => (
 <div 
   key={gift.id} 
   onClick={() => setSelectedGiftForOrder(gift)}
   className="bg-black/40 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all duration-500 group flex flex-col h-full relative cursor-pointer"
 >
   <div className="h-52 overflow-hidden shrink-0 relative bg-[#081210]">
     <img src={gift.image} alt={gift.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
     <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-teal-300 border border-teal-500/30">
       Personalized
     </div>
   </div>
   <div className="p-5 flex flex-col flex-1 relative z-10 justify-between">
     <div>
       <h3 className="font-serif font-bold text-lg text-white mb-1 group-hover:text-teal-300 transition-colors">{gift.name}</h3>
       <p className="text-teal-400 font-bold text-base mb-3 font-serif">₹{gift.price}</p>
       <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
         Includes custom photo mounting, optional luxury gift box, and handwritten wish card.
       </p>
     </div>

     <button 
       type="button"
       onClick={(e) => {
         e.stopPropagation();
         setSelectedGiftForOrder(gift);
       }}
       className="w-full py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20 hover:scale-[1.02]"
     >
       <Gift className="w-4 h-4" /> Personalize &amp; Order Gift
     </button>
   </div>
 </div>
 ))}
 </AnimatedSection>
  )
 )}
 </div>

  {/* Sidebar Cart for Passport photos */}
  {activeTab === "passport" && (
  <div className="lg:col-span-4" id="cart-section">
  <div className="sticky top-24">
  <OrderCart 
  items={cartItems} 
  onRemove={removeFromCart} 
  onUpdateItem={updateCartItem}
  isOpen={isCartOpen}
  />
  </div>
  </div>
  )}
 {/* Mobile Floating Cart Button */}
 {cartItems.length > 0 && activeTab === "passport" && (
 <div className="lg:hidden fixed bottom-6 right-6 z-50">
 <button
 onClick={() => {
 const el = document.getElementById('cart-section');
 if (el) el.scrollIntoView({ behavior: 'smooth' });
 }}
 className="bg-brand-gradient hover-glow-brand hover:bg-brand-gradient hover-glow-brand text-white rounded-full p-4 shadow-2xl flex items-center gap-2 transition-transform active:scale-95"
 >
 <div className="relative">
 <ShoppingCart className="w-6 h-6" />
 <span className="absolute -top-2 -right-2 bg-zinc-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-cyan-500">
 {cartItems.length}
 </span>
 </div>
 <span className="font-bold">View Cart</span>
 </button>
 </div>
 )}
 </div>

 {/* Birthday Gift Order Modal matching user screenshot */}
 <BirthdayGiftOrderModal
   isOpen={!!selectedGiftForOrder}
   onClose={() => setSelectedGiftForOrder(null)}
   selectedGift={selectedGiftForOrder}
 />
 </div>
 );
}
