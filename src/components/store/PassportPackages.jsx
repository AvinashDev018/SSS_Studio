"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Plus } from "lucide-react";

const PASSPORT_PACKAGES = [
 { id: "p1", name: "8 Passport Size Photos", price: 100, category: "Passport", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/passport-mockup" },
 { id: "p2", name: "8 Passport + 8 Stamp Size", price: 150, category: "Passport", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/passport-mockup" },
 { id: "p3", name: "16 Stamp Size Photos", price: 100, category: "Passport", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/passport-mockup" },
];

export default function PassportPackages({ onAddToCart }) {
 const [passportRefs, setPassportRefs] = useState({});

 const handleAddToCart = (pkg) => {
 let details = pkg.details || "";
 if (passportRefs[pkg.id]) {
 details = `Studio Reference No: ${passportRefs[pkg.id].toUpperCase()}`;
 }

 onAddToCart({
 ...pkg,
 details
 });

 setPassportRefs(prev => ({ ...prev, [pkg.id]: "" }));
 };

 return (
 <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {PASSPORT_PACKAGES.map((pkg) => (
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
 onClick={() => handleAddToCart(pkg)}
 className="w-full bg-brand-gradient hover-glow-brand text-black py-2.5 rounded-xl font-bold hover:bg-brand-gradient hover-glow-brand text-white border-transparent hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
 >
 <Plus className="w-4 h-4" /> Add to Order
 </button>
 </div>
 </div>
 </div>
 ))}
 </AnimatedSection>
 );
}
