"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";

/**
 * 3D gift box — tap to lift the lid and reveal the full product photo above the box.
 */
export default function GiftBoxUnbox({ gift, onOrder }) {
  const [open, setOpen] = useState(false);
  const priceLabel =
    typeof gift.price === "number" ? `₹${gift.price}` : gift.price || "";

  return (
    <div className="flex flex-col h-full">
      <div
        className={`relative mx-auto w-full max-w-[280px] mb-4 transition-[height] duration-300 ${
          open ? "h-[300px]" : "h-[240px]"
        }`}
        style={{ perspective: "1000px" }}
      >
        {/* Soft glow floor */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full bg-[#d4af37]/25 blur-md pointer-events-none" />

        {/* Revealed photo — sits ABOVE the box, never clipped by lid */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute left-1/2 -translate-x-1/2 top-0 z-30 w-[78%] aspect-[4/5] rounded-xl overflow-hidden border-2 border-[#d4af37] shadow-[0_16px_40px_rgba(0,0,0,0.35)] bg-black"
            >
              <img
                src={gift.image}
                alt={gift.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2.5 py-2 pt-8 pointer-events-none">
                <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                  Unboxed
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Box body */}
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="absolute left-[16%] right-[16%] bottom-[6%] h-[42%] rounded-b-xl rounded-t-md cursor-pointer border border-[#b8860b]/50 outline-none z-10 overflow-visible"
          style={{
            transformStyle: "preserve-3d",
            background:
              "linear-gradient(145deg, #1a1a1a 0%, #2a2418 40%, #3d3420 100%)",
            boxShadow:
              "0 18px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(212,175,55,0.25)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Inner cavity hint */}
          <div className="absolute inset-x-2 top-1 bottom-2 rounded-md bg-black/35 border border-white/5" />
          {/* Ribbon vertical */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 bg-gradient-to-b from-[#d4af37] via-[#f0d78c] to-[#b8860b] opacity-90 z-[1]" />
        </motion.button>

        {/* Lid — flips fully back / out of photo area when open */}
        <motion.div
          className="absolute left-[14%] right-[14%] h-[20%] rounded-t-lg rounded-b-sm border border-[#d4af37]/40 cursor-pointer origin-bottom z-20"
          style={{
            top: open ? "48%" : "48%",
            background:
              "linear-gradient(160deg, #d4af37 0%, #b8860b 45%, #8b6508 100%)",
            transformStyle: "preserve-3d",
            boxShadow: "0 8px 20px rgba(139,101,8,0.35)",
          }}
          animate={{
            rotateX: open ? -155 : 0,
            y: open ? 8 : 0,
            opacity: open ? 0.35 : 1,
            zIndex: open ? 5 : 20,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 16 }}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 bg-[#f5e6b8]/50" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
            <div className="w-4 h-4 rounded-full bg-[#f0d78c] shadow-sm" />
            <div className="w-4 h-4 rounded-full bg-[#d4af37] shadow-sm -ml-1" />
          </div>
          {!open && (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-black/70">
              Tap to open
            </span>
          )}
        </motion.div>
      </div>

      <div className="text-center px-1 flex-1 flex flex-col">
        <div className="inline-flex self-center items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8b6508] mb-1">
          <Sparkles size={11} /> Luxury gift box
        </div>
        <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white mb-0.5">
          {gift.name}
        </h3>
        <p className="text-[#b8860b] font-extrabold text-base mb-2">{priceLabel}</p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
          {open
            ? "Your personalized photo gift is ready — order with custom photo & message."
            : "Open the box to preview this personalized keepsake."}
        </p>
        <button
          type="button"
          onClick={() => onOrder?.(gift)}
          className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Gift size={14} /> Personalize &amp; Order
        </button>
      </div>
    </div>
  );
}
