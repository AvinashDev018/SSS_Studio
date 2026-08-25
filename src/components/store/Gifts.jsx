"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Plus } from "lucide-react";

const GIFTS = [
 { id: "g1", name: "Magic Mug", price: 350, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/sss-store/magic-mug" },
 { id: "g2", name: "Crystal Photo Cube", price: 850, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/sss-store/crystal-cube" },
 { id: "g3", name: "Custom Keychain", price: 150, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/sss-store/custom-keychain" },
 { id: "g4", name: "LED Photo Lamp", price: 1200, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/sss-store/led-photo-lamp" },
];

export default function Gifts({ onAddToCart }) {
 const [giftMessages, setGiftMessages] = useState({});
 const [giftImages, setGiftImages] = useState({});

 const handleAddToCart = (gift) => {
 let details = gift.details || "";
 let hasCustomPhoto = false;
 let image = null;

 const msg = giftMessages[gift.id];
 const imgObj = giftImages[gift.id];
 const imgName = imgObj ? imgObj.name : null;

 if (msg && imgName) {
 details = `Message: "${msg}" | Photo: ${imgName}`;
 } else if (msg) {
 details = `Message: "${msg}"`;
 } else if (imgName) {
 details = `Photo: ${imgName}`;
 }

 if (imgObj && imgObj.dataUrl) {
 hasCustomPhoto = true;
 image = imgObj.dataUrl;
 }

 onAddToCart({
 ...gift,
 details,
 ...(hasCustomPhoto && { hasCustomPhoto, image })
 });

 setGiftMessages(prev => ({ ...prev, [gift.id]: "" }));
 setGiftImages(prev => ({ ...prev, [gift.id]: null }));
 };

 return (
 <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {GIFTS.map((gift) => (
 <div key={gift.id} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-500 group flex flex-col h-full relative">
 <div className="h-48 overflow-hidden shrink-0 relative">
 <img src={gift.image} alt={gift.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
 </div>
 <div className="p-5 flex flex-col flex-1 relative z-10">
 <h3 className="font-serif font-bold text-xl text-white mb-1">{gift.name}</h3>
 <p className="text-brand-gradient font-bold text-lg mb-4">₹{gift.price}</p>

 <div className="mt-auto pt-4">
 <div className="mb-4">
 <div className="mb-3">
 <label className="text-xs font-medium text-zinc-400 mb-1 block">
 Upload Custom Photo (Optional)
 </label>
 <input
 type="file"
 accept="image/*"
 onChange={(e) => {
 const file = e.target.files[0];
 if (file) {
 const reader = new FileReader();
 reader.onloadend = () => {
 setGiftImages(prev => ({...prev, [gift.id]: { name: file.name, dataUrl: reader.result }}));
 };
 reader.readAsDataURL(file);
 }
 }}
 className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-cyan-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-brand-gradient hover-glow-brand file:text-black hover:file:bg-brand-gradient hover-glow-brand text-white border-transparent transition-colors"
 />
 </div>
 <label className="text-xs font-medium text-zinc-400 mb-1 block">
 Custom Text / Name (Optional)
 </label>
 <input
 type="text"
 placeholder="e.g. Happy Birthday!"
 value={giftMessages[gift.id] || ""}
 onChange={(e) => setGiftMessages(prev => ({...prev, [gift.id]: e.target.value}))}
 className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 placeholder-zinc-600 transition-colors"
 />
 </div>

 <button
 onClick={() => handleAddToCart(gift)}
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
