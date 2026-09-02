"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Frame, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Eye, 
  Truck, 
  Star,
  Info,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import PhotoFrameOrderModal from "@/components/ui/PhotoFrameOrderModal";

const FRAME_PRICE_LIST = [
  { id: 1, size: "8x10", price: "₹ 349", numPrice: 349, category: "compact", bestFor: "Desk, Bedside & Birthday Gift", popular: false, giftOccasion: "Birthday & Desk" },
  { id: 2, size: "8x12", price: "₹ 499", numPrice: 499, category: "compact", bestFor: "A4 Size Wall Frame / Ideal Surprise Gift", popular: true, tag: "Best Value Gift", giftOccasion: "Anniversary & Friends" },
  { id: 3, size: "10x12", price: "₹ 699", numPrice: 699, category: "compact", bestFor: "Couple Portrait / Baby Milestone Gift", popular: false, giftOccasion: "Baby & Couple" },
  { id: 4, size: "10x15", price: "₹ 799", numPrice: 799, category: "compact", bestFor: "Narrow Hallway / Passage Accent Gift", popular: false, giftOccasion: "Home Milestone" },
  { id: 5, size: "12x15", price: "₹ 999", numPrice: 999, category: "wedding", bestFor: "Traditional Family Heritage Portrait", popular: false, giftOccasion: "Parents & Family" },
  { id: 6, size: "12x18", price: "₹ 1,199", numPrice: 1199, category: "wedding", bestFor: "Wedding Portrait & Reception Classic", popular: true, tag: "Top Wedding Gift", giftOccasion: "Wedding Keepsake" },
  { id: 7, size: "12x24", price: "₹ 1,499", numPrice: 1499, category: "wedding", bestFor: "Panoramic Outdoor Couple Shoot Gift", popular: false, giftOccasion: "Outdoor Couple" },
  { id: 8, size: "16x20", price: "₹ 1,799", numPrice: 1799, category: "large", bestFor: "Living Room Accent Gallery Wall", popular: false, giftOccasion: "New Home Gift" },
  { id: 9, size: "16x24", price: "₹ 1,999", numPrice: 1999, category: "large", bestFor: "Grand Wedding Reception Feature Frame", popular: true, tag: "Premium Wedding Gift", giftOccasion: "Grand Wedding" },
  { id: 10, size: "18x24", price: "₹ 2,499", numPrice: 2499, category: "large", bestFor: "Centerpiece Living Room Focal Art", popular: false, giftOccasion: "Housewarming Luxury" },
  { id: 11, size: "20x24", price: "₹ 2,999", numPrice: 2999, category: "large", bestFor: "Luxury Heritage Family Frame", popular: false, giftOccasion: "Generations Heritage" },
  { id: 12, size: "20x30", price: "₹ 3,499", numPrice: 3499, category: "large", bestFor: "Large Scale Master Gallery Canvas", popular: false, giftOccasion: "VIP Master Gift" },
  { id: 13, size: "36x24", price: "₹ 4,999", numPrice: 4999, category: "large", bestFor: "Grand Villa / Ballroom Statement Piece", popular: true, tag: "Ultra Masterpiece", giftOccasion: "Villa Showcase" },
];

const FINISHES = [
  {
    id: "wood",
    name: "Synthetic Wood Frame",
    desc: "Matte black or rich walnut finish with crystal glass & museum backing.",
    icon: "🖼️",
    features: ["Crystal Clear Glass", "Anti-Scratch Coating", "Wall Mount Hooks Included"]
  },
  {
    id: "acrylic",
    name: "Ultra-Gloss Floating Acrylic",
    desc: "Modern frameless 5mm high-definition acrylic with floating wall studs.",
    icon: "💎",
    features: ["Vivid 3D Depth", "Shatterproof Acrylic", "Floating 1-Inch Wall Standoffs"]
  },
  {
    id: "canvas",
    name: "Textured Canvas Wrap",
    desc: "Heavyweight 380 GSM textured artistic canvas stretched on pine wood.",
    icon: "🎨",
    features: ["Fine-Art Matte Texture", "Fade-Proof Pigment Inks", "Ready-to-Hang Depth Edge"]
  }
];

export default function SSSPhotoFramePricing() {
  const [frameList, setFrameList] = useState(FRAME_PRICE_LIST);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedFrameForOrder, setSelectedFrameForOrder] = useState(null);
  const [previewSize, setPreviewSize] = useState(FRAME_PRICE_LIST[5]); // Default 12x18

  React.useEffect(() => {
    async function loadFrames() {
      try {
        const res = await fetch("/api/frames");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFrameList(data);
            const found12x18 = data.find((f) => f.size === "12x18") || data[0];
            setPreviewSize(found12x18);
          }
        }
      } catch (err) {
        console.error("Error loading live frames:", err);
      }
    }
    loadFrames();
  }, []);

  const filteredFrames = frameList.filter((frame) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "popular") return frame.popular;
    if (activeFilter === "compact") return frame.category === "compact" || (frame.width && frame.width <= 10);
    if (activeFilter === "large") return frame.category === "large" || frame.category === "wedding" || (frame.width && frame.width >= 12);
    return true;
  });

  return (
    <section id="frames" className="py-20 relative bg-[#060c0a] text-zinc-100 overflow-hidden scroll-mt-24">
      {/* Anchors for compatibility */}
      <span id="photo-frames" className="absolute -top-24 pointer-events-none" />
      <span id="gifts" className="absolute -top-24 pointer-events-none" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3.5 shadow-sm">
            <Frame size={13} /> Handcrafted Custom Photo Framing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight mb-4">
            Photo Frame Price List
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
            Preserve your wedding rituals, portraits, and milestones with SSS Studio&apos;s handcrafted frames. 
            All 13 standard sizes customized with crystal anti-fade prints and our 1-Month Delivery Guarantee.
          </p>

          {/* Quick Filter Pill Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: "all", label: "All 13 Standard Sizes" },
              { id: "popular", label: "⭐ Most Popular Wedding Picks" },
              { id: "compact", label: "Compact & Tabletop (8x10 to 10x15)" },
              { id: "large", label: "Feature Wall & Ballroom (12x18 to 36x24)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] font-bold shadow-[0_0_20px_rgba(20,184,166,0.35)] scale-105"
                    : "bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Price List Table + Live Scale Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Table (8 cols on desktop) */}
          <div className="lg:col-span-8 bg-[#091512]/90 border border-teal-500/25 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Frame size={18} className="text-teal-400" />
                  Available Standard Sizes &amp; Rates
                </h3>
                <p className="text-[11px] text-zinc-400 font-light">
                  Click any size to preview on the wall or tap &quot;Order Now&quot; to upload your photo.
                </p>
              </div>
              <span className="text-xs text-teal-300 font-semibold hidden sm:inline">
                {filteredFrames.length} Sizes Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-teal-500/20 text-[11px] font-bold uppercase tracking-wider text-teal-300">
                    <th className="py-3 px-3">Size (Inches)</th>
                    <th className="py-3 px-3 hidden sm:table-cell">Recommended Placement</th>
                    <th className="py-3 px-3 text-center sm:text-left">Price</th>
                    <th className="py-3 px-3 text-right">Order Frame</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredFrames.map((item) => {
                    const isPreviewed = previewSize.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setPreviewSize(item)}
                        className={`transition-all duration-200 cursor-pointer group ${
                          isPreviewed 
                            ? "bg-teal-500/15 border-l-4 border-l-teal-400" 
                            : "hover:bg-white/[0.04]"
                        }`}
                      >
                        {/* Size */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm sm:text-base font-mono">
                              {item.size}
                            </span>
                            <span className="text-[10px] text-zinc-400">Inches</span>
                            {item.tag && (
                              <span className="hidden md:inline px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[9px] font-extrabold uppercase">
                                {item.tag}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Best For */}
                        <td className="py-3.5 px-3 hidden sm:table-cell text-xs text-zinc-300 font-light">
                          {item.bestFor}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-3">
                          <div className="font-serif font-extrabold text-sm sm:text-base text-teal-300 text-center sm:text-left whitespace-nowrap">
                            {item.price}
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFrameForOrder(item);
                            }}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-105 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <span>Order Frame</span>
                            <ChevronRight size={13} className="hidden sm:inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-teal-300 font-medium">
                <Truck size={14} /> Safe Courier Shipping Across India &amp; Free Madurai Studio Pickup
              </span>
              <span>Need custom odd dimensions? WhatsApp us anytime.</span>
            </div>
          </div>

          {/* Scale Mockup Visualizer (4 cols on desktop) */}
          <div className="lg:col-span-4 bg-[#091512]/90 border border-teal-500/25 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <span className="text-xs uppercase font-extrabold tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Eye size={14} /> Live Wall Scale Preview
                </span>
                <span className="text-[10px] text-zinc-400 font-light">Interactive mockup</span>
              </div>

              {/* Room Mockup Box */}
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#162723] to-[#0d1c18] border border-teal-500/20 overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner">
                {/* Wall Base Trim */}
                <div className="absolute bottom-0 inset-x-0 h-4 bg-[#081210] border-t border-white/10" />

                {/* Living Room Sofa Graphic Silhouette */}
                <div className="absolute bottom-4 w-4/5 h-10 bg-black/40 rounded-t-xl border-t border-white/10 flex items-center justify-center">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Living Room Wall Above Sofa</span>
                </div>

                {/* Scaled Frame */}
                <motion.div
                  key={previewSize.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative mb-8 bg-black border-4 border-[#c5a059] rounded shadow-2xl overflow-hidden flex items-center justify-center"
                  style={{
                    width: `${Math.min(220, Math.max(70, previewSize.numPrice / 25))}px`,
                    height: `${Math.min(160, Math.max(50, (previewSize.numPrice / 25) * 0.75))}px`,
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop"
                    alt="Frame Scale Demo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-teal-300">
                    {previewSize.size}&quot;
                  </div>
                </motion.div>
              </div>

              {/* Selected Frame Details */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Selected Size:</span>
                  <span className="font-bold text-white font-mono text-sm">{previewSize.size} Inches</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Base Investment:</span>
                  <span className="font-bold text-teal-300 font-serif text-base">{previewSize.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Best Positioned:</span>
                  <span className="text-xs text-zinc-200 text-right">{previewSize.bestFor}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFrameForOrder(previewSize)}
              className="mt-6 w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:from-emerald-300 hover:to-teal-300 text-[#071f1b] font-black rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Order This {previewSize.size} Inch Frame</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 3 Premium Finish Materials Showcase */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">
              Craftsmanship &amp; Finish Options
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Choose Your Signature Frame Medium
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FINISHES.map((fin) => (
              <div
                key={fin.id}
                className="bg-[#091512]/80 border border-teal-500/20 hover:border-teal-400/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{fin.icon}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{fin.name}</h4>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                    {fin.desc}
                  </p>
                  <ul className="space-y-2 border-t border-white/10 pt-4 text-xs text-zinc-300">
                    {fin.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={14} className="text-teal-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Available across all sizes</span>
                  <span className="text-teal-300 font-semibold">100% Archival Quality</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Assurance Bar */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c2620] via-[#0e3028] to-[#091e19] border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">
                SSS Studio 1-Month Delivery Guarantee &amp; Lifetime Anti-Fade Inks
              </h4>
              <p className="text-xs text-zinc-300 font-light">
                Handcrafted at 34, Prasanna New Colony, Avaniyapuram, Madurai with strict quality inspection.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/916383565425?text=Hello%20SSS%20Studio!%20I%20would%20like%20to%20inquire%20about%20custom%20photo%20frames."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer hover:scale-105"
          >
            Ask Us on WhatsApp 💬
          </a>
        </div>
      </div>

      {/* 4-Step Order Modal */}
      <PhotoFrameOrderModal
        isOpen={!!selectedFrameForOrder}
        onClose={() => setSelectedFrameForOrder(null)}
        selectedFrame={selectedFrameForOrder}
      />
    </section>
  );
}
