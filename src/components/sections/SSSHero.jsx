"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Palette, Clock, Award, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSHero({ onOpenBooking, onOpenQuote }) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-10 pb-14 bg-white text-zinc-900">
      {/* Subtle Ambient Vignette & Warm Gold Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-[#d4af37]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-zinc-100/80 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        
        {/* Top Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-black/[0.03] border border-[#d4af37]/40 shadow-sm backdrop-blur-md text-zinc-800 text-[10px] sm:text-xs tracking-widest uppercase mb-6 sm:mb-10 font-bold max-w-full text-center"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b8860b] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b8860b]" />
          </span>
          <span className="truncate">Open for 2026-27 Bookings • Avaniyapuram, Madurai</span>
        </motion.div>

        {/* Editorial Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
          
          {/* Left Column: High-Fashion Editorial Wedding Photography Frame */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-6 relative group"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.12)] bg-zinc-100 aspect-[4/3] group-hover:border-[#d4af37] transition-colors duration-500">
              <Image
                src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1788426852/sss-hero-wedding.jpg"
                alt="SSS Studio Luxury Editorial Wedding Photography"
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Editorial Frame Overlay Tag */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 backdrop-blur-md bg-black/60 px-4 py-2.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <span className="font-serif italic text-sm tracking-wide text-white">The Royal Heritage Series</span>
                </div>
                <span className="text-[11px] tracking-widest text-[#d4af37] uppercase font-mono">Avaniyapuram Lab</span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/60 bg-[#d4af37]/15 text-xs text-[#8b6508] tracking-widest uppercase mb-4 font-black shadow-sm">
              <Sparkles size={13} className="text-[#8b6508]" />
              <span>SSS Studio Photography</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-black leading-[1.15] mb-4 uppercase">
              Capturing The{" "}
              <span className="italic text-[#b8860b] font-serif block sm:inline font-black">
                Moment.
              </span>
            </h1>

            <p className="text-zinc-900 text-base sm:text-lg font-bold leading-relaxed mb-6 max-w-lg">
              Professional wedding, portrait, and milestone event photography with our guaranteed 1-month delivery promise.
            </p>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/15 bg-black/[0.04] text-xs text-zinc-900 font-bold mb-8 shadow-sm">
              <MapPin size={13} className="text-[#b8860b]" />
              <span>Madurai, Tamil Nadu</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => onOpenBooking && onOpenBooking("Wedding & Event Photo Shoot")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-metallic-gold text-black font-bold text-xs tracking-wider uppercase shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t?.hero?.bookBtn || "Book a Consultation"}</span>
                <ArrowRight size={14} />
              </button>

              <Link
                href="/#portfolio"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-zinc-900 font-bold text-xs tracking-wider uppercase border border-[#d4af37]/40 hover:border-[#d4af37] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <span>Explore Portfolio</span>
                <ArrowRight size={14} className="text-[#b8860b]" />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Floating Studio Commitments Cards Strip (Matches Approved Mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="w-full mt-16 pt-10"
        >
          <div className="text-center mb-6">
            <h3 className="font-serif text-lg text-zinc-900 font-normal uppercase tracking-widest">Our Commitment</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 100% Color Accuracy Card */}
            <div className="bg-[#FAFAFA] border border-[#d4af37]/30 hover:border-[#d4af37] p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 shadow-md">
              <div className="w-14 h-14 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                <Palette className="w-7 h-7 text-[#b8860b]" />
              </div>
              <div>
                <span className="text-xs text-[#b8860b] font-mono uppercase tracking-widest block font-bold">Unmatched Quality</span>
                <h4 className="font-serif text-lg text-zinc-900 font-semibold">100% Color Accuracy</h4>
                <p className="text-xs text-zinc-600 font-light mt-0.5">True-to-life vibrant colors captured flawlessly without harsh oversaturation.</p>
              </div>
            </div>

            {/* 1-Month Delivery Guarantee Card */}
            <div className="bg-[#FAFAFA] border border-[#d4af37]/30 hover:border-[#d4af37] p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 shadow-md">
              <div className="w-14 h-14 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                <Clock className="w-7 h-7 text-[#b8860b]" />
              </div>
              <div>
                <span className="text-xs text-[#b8860b] font-mono uppercase tracking-widest block font-bold">Efficient Delivery</span>
                <h4 className="font-serif text-lg text-zinc-900 font-semibold">1-Month Delivery Guarantee</h4>
                <p className="text-xs text-zinc-600 font-light mt-0.5">Full edited gallery and fine-art album delivered within 30 days of the event.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

