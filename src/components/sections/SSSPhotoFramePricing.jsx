"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Frame,
  Check,
  ChevronRight,
  Truck,
  ShieldCheck,
} from "lucide-react";
import PhotoFrameOrderModal from "@/components/ui/PhotoFrameOrderModal";

const FRAME_PREVIEW_IMG =
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788884907/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_arch_portrait.jpg";

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
    features: ["Crystal Clear Glass", "Anti-Scratch Coating", "Wall Mount Hooks Included"],
  },
  {
    id: "acrylic",
    name: "Ultra-Gloss Floating Acrylic",
    desc: "Modern frameless 5mm high-definition acrylic with floating wall studs.",
    icon: "💎",
    features: ["Vivid 3D Depth", "Shatterproof Acrylic", "Floating 1-Inch Wall Standoffs"],
  },
  {
    id: "canvas",
    name: "Textured Canvas Wrap",
    desc: "Heavyweight 380 GSM textured artistic canvas stretched on pine wood.",
    icon: "🎨",
    features: ["Fine-Art Matte Texture", "Fade-Proof Pigment Inks", "Ready-to-Hang Depth Edge"],
  },
];

function FloatingTiltFrame({ sizeLabel, priceLabel, onOrder }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 18 });
  const glareX = useTransform(x, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["15%", "85%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 45%)`
  );

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-center" style={{ perspective: "1200px" }}>
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={() => {
            x.set(0);
            y.set(0);
          }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full max-w-[280px] sm:max-w-[320px]"
        >
          <div className="absolute -bottom-7 left-1/2 h-14 w-[78%] -translate-x-1/2 rounded-[100%] bg-black/55 blur-2xl" />
          <div
            className="relative overflow-hidden rounded-sm border-[10px] border-[#c9a227] bg-[#1a1408] p-3 shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
            style={{ transform: "translateZ(36px)" }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
              <Image
                src={FRAME_PREVIEW_IMG}
                alt={`${sizeLabel} frame preview`}
                fill
                unoptimized
                className="object-cover"
                sizes="320px"
              />
              <motion.div className="pointer-events-none absolute inset-0" style={{ background: glareBg }} />
            </div>
            <div className="mt-3 text-center font-serif text-xs tracking-[0.22em] text-[#d4af37]/90 uppercase">
              Handcrafted · {sizeLabel}
            </div>
          </div>
        </motion.div>
      </div>
      <div className="mt-10 text-center">
        <p className="font-serif text-2xl text-white">{sizeLabel}</p>
        <p className="mt-1 text-[#d4af37] font-bold">{priceLabel}</p>
        <button
          type="button"
          onClick={onOrder}
          className="mt-4 px-5 py-2.5 rounded-xl bg-metallic-gold text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 inline-flex items-center gap-1.5 cursor-pointer"
        >
          Order This Size <ChevronRight size={13} />
        </button>
        <p className="mt-3 text-[11px] text-zinc-500">Move over the frame for the 3D tilt preview</p>
      </div>
    </div>
  );
}

export default function SSSPhotoFramePricing() {
  const [frameList, setFrameList] = useState(FRAME_PRICE_LIST);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedFrameForOrder, setSelectedFrameForOrder] = useState(null);
  const [previewSize, setPreviewSize] = useState(FRAME_PRICE_LIST[5]);

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
      <span id="photo-frames" className="absolute -top-24 pointer-events-none" />
      <span id="gifts" className="absolute -top-24 pointer-events-none" />

      <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                    ? "bg-metallic-gold text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-105"
                    : "bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center rounded-3xl border border-[#d4af37]/25 bg-[#0c1210] p-6 sm:p-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-3">Live 3D Preview</p>
            <h3 className="font-serif text-2xl sm:text-3xl text-white mb-3">See Your Frame in Depth</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-5">
              Hover the frame for gold glass glare. Tap any size in the price list below to update this preview instantly.
            </p>
            <div className="flex flex-wrap gap-2">
              {frameList
                .filter((f) => f.popular)
                .slice(0, 4)
                .map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setPreviewSize(f)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                      previewSize?.id === f.id
                        ? "bg-[#d4af37] text-black border-[#d4af37]"
                        : "border-white/15 text-zinc-300 hover:border-[#d4af37]/60"
                    }`}
                  >
                    {f.size}
                  </button>
                ))}
            </div>
          </div>
          <FloatingTiltFrame
            sizeLabel={previewSize?.size || "12x18"}
            priceLabel={previewSize?.price || "₹ 1,199"}
            onOrder={() => setSelectedFrameForOrder(previewSize)}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full mb-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFAFA] border border-[#d4af37]/40 rounded-3xl p-4 sm:p-7 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/10">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Frame size={18} className="text-[#b8860b]" />
                Official Photo Frame Size &amp; Pricing Directory
              </h3>
              <p className="text-[11px] text-zinc-600 font-light">
                Select any frame size and tap &quot;Order&quot; to customize and order instantly.
              </p>
            </div>
            <span className="text-xs text-[#8b6508] font-bold hidden sm:inline">
              {filteredFrames.length} Sizes Available
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  <th className="pb-3 px-3">Frame Size</th>
                  <th className="pb-3 px-3 hidden sm:table-cell">Recommended Placement</th>
                  <th className="pb-3 px-3 text-center sm:text-left">Price (Includes Print)</th>
                  <th className="pb-3 px-3 text-right">Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredFrames.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setPreviewSize(item)}
                    className={`hover:bg-black/[0.02] transition-colors duration-150 cursor-pointer ${
                      previewSize?.id === item.id ? "bg-[#d4af37]/10" : ""
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 text-sm sm:text-base font-mono">{item.size}</span>
                        <span className="text-[10px] text-zinc-500">Inches</span>
                        {item.tag && (
                          <span className="hidden md:inline px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#8b6508] text-[9px] font-extrabold uppercase">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 hidden sm:table-cell text-xs text-zinc-700 font-light">{item.bestFor}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-serif font-extrabold text-sm sm:text-base text-[#b8860b] text-center sm:text-left whitespace-nowrap">
                        {item.price}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFrameForOrder(item);
                        }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-metallic-gold text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <span>Order</span>
                        <ChevronRight size={13} className="hidden sm:inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5 text-[#8b6508] font-bold">
              <Truck size={14} /> Safe Courier Shipping Across India &amp; Free Madurai Studio Pickup
            </span>
            <span>Need custom odd dimensions? WhatsApp us anytime.</span>
          </div>
        </div>
      </div>

      <div className="mb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">Craftsmanship &amp; Finish Options</span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">Choose Your Signature Frame Medium</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FINISHES.map((fin) => (
            <div
              key={fin.id}
              className="bg-[#15171E] border border-[#d4af37]/20 hover:border-[#d4af37] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">{fin.icon}</div>
                <h4 className="text-lg font-bold text-white mb-2">{fin.name}</h4>
                <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">{fin.desc}</p>
                <ul className="space-y-2 border-t border-white/10 pt-4 text-xs text-zinc-300">
                  {fin.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check size={14} className="text-[#d4af37] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Available across all sizes</span>
                <span className="text-[#d4af37] font-semibold">100% Archival Quality</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-[#15171E] border border-[#d4af37]/30 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0">
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
            className="px-6 py-3 rounded-full bg-metallic-gold text-black font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer hover:scale-105 shadow-xl"
          >
            Ask Us on WhatsApp
          </a>
        </div>
      </div>

      <PhotoFrameOrderModal
        isOpen={!!selectedFrameForOrder}
        onClose={() => setSelectedFrameForOrder(null)}
        selectedFrame={selectedFrameForOrder}
      />
    </section>
  );
}
