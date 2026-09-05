 "use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PassportPackages from "@/components/store/PassportPackages";
import Gifts from "@/components/store/Gifts";
import OrderCart from "@/components/store/OrderCart";
import SSSPhotoFramePricing from "@/components/sections/SSSPhotoFramePricing";
import BirthdayGiftOrderModal from "@/components/ui/BirthdayGiftOrderModal";
import PhotoFrameOrderModal from "@/components/ui/PhotoFrameOrderModal";
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
 const [selectedPassportForOrder, setSelectedPassportForOrder] = useState(null);


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
  <div className="bg-zinc-900/90 dark:bg-zinc-900/95 backdrop-blur-xl p-2 rounded-full inline-flex border border-amber-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
  {tabs.map(tab => (
  <button
  key={tab.id}
  onClick={() => setActiveTab(tab.id)}
  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
  activeTab === tab.id
  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-extrabold shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-105"
  : "text-zinc-200 hover:text-white hover:bg-white/10"
  }`}
  >
  {tab.icon} {tab.label}
  </button>
  ))}
  </div>
  </div>
  </div>

 <div className="grid grid-cols-1 gap-8 relative">
 {/* Main Content Area */}
 <div className="w-full">
 {activeTab === "frames" && (
 <AnimatedSection>
   <SSSPhotoFramePricing />
 </AnimatedSection>
 )}

 {activeTab === "passport" && (
  isLoadingProducts ? (
    <div className="flex justify-center items-center h-48">
      <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
    </div>
  ) : (
 <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {passportPackages.map((pkg) => (
 <div key={pkg.id} className="bg-zinc-900/90 border border-amber-500/30 rounded-3xl overflow-hidden hover:border-amber-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-500 group flex flex-col h-full relative">
 <div className="h-48 overflow-hidden shrink-0 relative bg-black">
 <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
 <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/30 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>
 </div>
 <div className="p-6 flex flex-col flex-1 relative z-10 bg-zinc-900">
 <h3 className="font-serif font-bold text-xl text-white mb-1.5 drop-shadow">{pkg.name}</h3>
 <p className="text-amber-400 font-extrabold text-xl mb-4 font-mono">₹{pkg.price}</p>
 
 <div className="mt-auto pt-4">
 <div className="mb-4">
 <label className="text-xs font-bold text-zinc-300 mb-1.5 block">
 Old Studio Photo Ref Code? (Optional)
 </label>
 <input 
 type="text" 
 placeholder="e.g. A123" 
 value={passportRefs[pkg.id] || ""}
 onChange={(e) => setPassportRefs(prev => ({...prev, [pkg.id]: e.target.value}))}
 className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 uppercase placeholder-zinc-500 transition-colors"
 />
 </div>

 <button 
  onClick={() => {
    setSelectedPassportForOrder({
      id: pkg.id,
      size: pkg.name,
      price: `₹${pkg.price}`,
    });
  }}
  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-black py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:from-amber-300 hover:to-amber-400 shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
  >
  <Plus className="w-4 h-4 stroke-[3]" /> Order Passport Photos
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
 </div>

 {/* Birthday Gift Order Modal matching user screenshot */}
 <BirthdayGiftOrderModal
   isOpen={!!selectedGiftForOrder}
   onClose={() => setSelectedGiftForOrder(null)}
   selectedGift={selectedGiftForOrder}
 />

 {/* Passport Photo Order Modal */}
 <PhotoFrameOrderModal
   isOpen={!!selectedPassportForOrder}
   onClose={() => setSelectedPassportForOrder(null)}
   selectedFrame={selectedPassportForOrder}
 />
 </div>
 );
}
