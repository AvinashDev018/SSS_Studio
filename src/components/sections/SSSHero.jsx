"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSHero({ onOpenBooking, onOpenQuote }) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-10 pb-14 bg-[#0a0a0a] text-white">
      {/* Subtle Ambient Vignette & Warm Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-[#c5a880]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-black/80 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        
        {/* Top Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-sm backdrop-blur-md text-zinc-300 text-xs tracking-widest uppercase mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a880] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c5a880]" />
          </span>
          <span>Open for 2026-27 Bookings • Avaniyapuram, Madurai</span>
        </motion.div>

        {/* Editorial Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
          
          {/* Left Column: High-Fashion Editorial Bridal Photography Frame */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-6 relative group"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-zinc-900 aspect-[4/3] group-hover:border-[#c5a880]/50 transition-colors duration-500">
              <Image
                src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1788426852/sss-hero-wedding.jpg"
                alt="SSS Studio Luxury Editorial Wedding Photography"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Editorial Frame Overlay Tag */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 backdrop-blur-md bg-black/50 px-3.5 py-2 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                  <span className="font-serif italic text-sm tracking-wide">The Royal Heritage Series</span>
                </div>
                <span className="text-[11px] tracking-widest text-zinc-400 uppercase">Avaniyapuram</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High-Fashion Typography & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs text-[#c5a880] tracking-wider uppercase mb-5">
              <Sparkles size={12} className="text-[#c5a880]" />
              <span>Bespoke Visual Atelier</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-normal tracking-tight text-white leading-[1.15] mb-6">
              Capturing Timeless Stories With{" "}
              <span className="italic text-[#c5a880] font-serif block sm:inline">
                Editorial Artistry
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed mb-6 max-w-xl">
              Luxury wedding photography, candid cinematography, and bespoke fine-art portraits crafted with technical mastery and deep emotional resonance.
            </p>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-400 font-medium mb-8">
              <MapPin size={13} className="text-[#c5a880]" />
              <span>Madurai • Destination Shoots Worldwide</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => onOpenBooking && onOpenBooking("Wedding & Event Photo Shoot")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#c5a880] hover:bg-[#d4af37] text-black font-semibold text-xs tracking-wider uppercase shadow-lg hover:shadow-[0_0_25px_rgba(197,168,128,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t?.hero?.bookBtn || "Book a Consultation"}</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => onOpenQuote && onOpenQuote("Wedding & Event Photo Shoot")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-xs tracking-wider uppercase border border-white/15 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                <span>{t?.hero?.quoteBtn || "Request Pricing"}</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* 3-Column Minimalist Accolades Strip (Matches Approved Mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="w-full mt-14 pt-8 border-t border-b border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center"
        >
          <div className="py-5 md:py-3 px-6 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl sm:text-3xl text-white font-normal">15+ Years</span>
            <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">Heritage & Photographic Mastery</p>
          </div>

          <div className="py-5 md:py-3 px-6 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl sm:text-3xl text-[#c5a880] font-normal">1,200+ Celebrations</span>
            <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">Weddings & Milestones Documented</p>
          </div>

          <div className="py-5 md:py-3 px-6 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl sm:text-3xl text-white font-normal">Award-Winning Cinema</span>
            <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">Guaranteed 1-Month Delivery</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
