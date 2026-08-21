"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FrameBuilder from "@/components/store/FrameBuilder";
import OrderCart from "@/components/store/OrderCart";
import { Package, Camera, Gift, ShoppingCart } from "lucide-react";

// Hardcoded store products (can be moved to DB later)
const GIFTS = [
  { id: "g1", name: "Magic Mug", price: 350, category: "Gift", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop" },
  { id: "g2", name: "Crystal Photo Cube", price: 850, category: "Gift", image: "https://images.unsplash.com/photo-1610444585149-aebaa465ccde?w=500&auto=format&fit=crop" },
  { id: "g3", name: "Custom Keychain", price: 150, category: "Gift", image: "https://images.unsplash.com/photo-1627993466185-5b87ec1b6a15?w=500&auto=format&fit=crop" },
  { id: "g4", name: "LED Photo Lamp", price: 1200, category: "Gift", image: "https://images.unsplash.com/photo-1517658797914-1fbc5b36916a?w=500&auto=format&fit=crop" },
];

const COLLAGE_PACKAGES = [
  { id: "c1", name: "3-Photo Small Collage", price: 500, category: "Collage", image: "https://images.unsplash.com/photo-1549210996-5256e6d195f2?w=500&auto=format&fit=crop" },
  { id: "c2", name: "5-Photo Family Collage", price: 850, category: "Collage", image: "https://images.unsplash.com/photo-1549210996-5256e6d195f2?w=500&auto=format&fit=crop" },
  { id: "c3", name: "10-Photo Giant Collage", price: 1500, category: "Collage", image: "https://images.unsplash.com/photo-1549210996-5256e6d195f2?w=500&auto=format&fit=crop" },
];

const PASSPORT_PACKAGES = [
  { id: "p1", name: "8 Passport Size Photos", price: 100, category: "Passport", image: "https://images.unsplash.com/photo-1579405021287-21fbdf8d2703?w=500&auto=format&fit=crop" },
  { id: "p2", name: "16 Passport Size Photos", price: 150, category: "Passport", image: "https://images.unsplash.com/photo-1579405021287-21fbdf8d2703?w=500&auto=format&fit=crop" },
  { id: "p3", name: "32 Passport + 2 Stamp Size", price: 250, category: "Passport", image: "https://images.unsplash.com/photo-1579405021287-21fbdf8d2703?w=500&auto=format&fit=crop" },
];

export default function StorePage() {
  const [activeTab, setActiveTab] = useState("frames");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [passportRefs, setPassportRefs] = useState({});
  const [giftMessages, setGiftMessages] = useState({});
  const [giftImages, setGiftImages] = useState({});

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
      localStorage.setItem("studioCart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product) => {
    let details = product.details || "";
    if (product.category === "Passport" && passportRefs[product.id]) {
      details = `Studio Reference No: ${passportRefs[product.id].toUpperCase()}`;
    } else if (product.category === "Gift") {
      const msg = giftMessages[product.id];
      const img = giftImages[product.id];
      if (msg && img) {
        details = `Message: "${msg}" | Photo: ${img}`;
      } else if (msg) {
        details = `Message: "${msg}"`;
      } else if (img) {
        details = `Photo: ${img}`;
      }
    }
    
    setCartItems(prev => [...prev, { 
      ...product, 
      details,
      cartId: Math.random().toString(36).substr(2, 9) 
    }]);
    setIsCartOpen(true);

    if (product.category === "Passport") {
      setPassportRefs(prev => ({ ...prev, [product.id]: "" }));
    }
    if (product.category === "Gift") {
      setGiftMessages(prev => ({ ...prev, [product.id]: "" }));
      setGiftImages(prev => ({ ...prev, [product.id]: null }));
    }
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateCartItem = (cartId, updates) => {
    setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, ...updates } : item));
  };

  const tabs = [
    { id: "frames", label: "Custom Frames", icon: <Package className="w-4 h-4" /> },
    { id: "passport", label: "Passport Photos", icon: <Camera className="w-4 h-4" /> },
    { id: "gifts", label: "Birthday Gifts", icon: <Gift className="w-4 h-4" /> },
    { id: "collages", label: "Photo Collages", icon: <Camera className="w-4 h-4" /> },
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[90vh] relative">
      <AnimatedSection className="text-center mb-12">
        <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-amber-100 dark:to-yellow-600">
          Studio Store
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 text-lg max-w-2xl mx-auto font-light">
          Order premium photo frames, passport prints, and personalized birthday gifts directly to your door.
        </p>
      </AnimatedSection>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full inline-flex border border-zinc-200 dark:border-zinc-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          {activeTab === "frames" && (
            <AnimatedSection>
              <FrameBuilder onAddToCart={addToCart} />
            </AnimatedSection>
          )}

          {activeTab === "passport" && (
            <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PASSPORT_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-400 transition-colors group">
                  <div className="h-48 overflow-hidden">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">{pkg.name}</h3>
                    <p className="text-amber-600 dark:text-amber-500 font-semibold mb-4">₹{pkg.price}</p>
                    
                    <div className="mb-4">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">
                        Old Studio Photo? (Optional)
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. A123" 
                        value={passportRefs[pkg.id] || ""}
                        onChange={(e) => setPassportRefs(prev => ({...prev, [pkg.id]: e.target.value}))}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 uppercase"
                      />
                    </div>

                    <button 
                      onClick={() => addToCart(pkg)}
                      className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-2 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </AnimatedSection>
          )}

          {activeTab === "gifts" && (
            <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {GIFTS.map((gift) => (
                <div key={gift.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-400 transition-colors group">
                  <div className="h-48 overflow-hidden">
                    <img src={gift.image} alt={gift.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">{gift.name}</h3>
                    <p className="text-amber-600 dark:text-amber-500 font-semibold mb-4">₹{gift.price}</p>
                    
                    <div className="mb-4">
                      <div className="mb-3">
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">
                          Upload Custom Photo (Optional)
                        </label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setGiftImages(prev => ({...prev, [gift.id]: file.name}));
                            }
                          }}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-zinc-500 dark:text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                      </div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">
                        Custom Text / Name (Optional)
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Happy Birthday!" 
                        value={giftMessages[gift.id] || ""}
                        onChange={(e) => setGiftMessages(prev => ({...prev, [gift.id]: e.target.value}))}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button 
                      onClick={() => addToCart(gift)}
                      className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-2 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </AnimatedSection>
          )}
          {activeTab === "collages" && (
            <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {COLLAGE_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-400 transition-colors group">
                  <div className="h-48 overflow-hidden">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">{pkg.name}</h3>
                    <p className="text-amber-600 dark:text-amber-500 font-semibold mb-4">₹{pkg.price}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        * You can upload multiple photos for this item in the cart!
                      </p>
                    </div>

                    <button 
                      onClick={() => addToCart(pkg)}
                      className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-2 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </AnimatedSection>
          )}
        </div>

        {/* Sidebar Cart */}
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
            {/* Mobile Floating Cart Button */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button
            onClick={() => {
              const el = document.getElementById('cart-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 shadow-2xl flex items-center gap-2 transition-transform active:scale-95"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-zinc-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-amber-500">
                {cartItems.length}
              </span>
            </div>
            <span className="font-bold">View Cart</span>
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
