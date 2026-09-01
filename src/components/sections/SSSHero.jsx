"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Star, Award, Video } from "lucide-react";

const HERO_IMAGES = [
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504208/iydxdch0gcdo1vuea56q.jpg",
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504209/y4t69imuaktbevg8re57.jpg",
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504211/tqb10uvuzmqdkuxyqmps.jpg",
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504212/ksq2vkwzniqlgsly5k6p.jpg",
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504214/eill2s5uvoq7wwabeunx.jpg",
];

export default function SSSHero({ onOpenBooking, onOpenQuote }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Image Carousel with Rich Overlays */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIdx}
            src={HERO_IMAGES[currentIdx]}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-center"
            alt="SSS Photography Showcase"
          />
        </AnimatePresence>

        {/* Multi-layered cinematic overlays */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c0b] via-[#080c0b]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c3530]/60 via-transparent to-[#0c3530]/60 z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Guarantee Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-teal-400/30 bg-[#0c3530]/80 backdrop-blur-md mb-6 shadow-lg shadow-teal-900/30"
        >
          <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
          <span className="text-xs md:text-sm font-semibold tracking-widest text-teal-200 uppercase">
            ⚡ 20-Day Album Delivery Guarantee
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl leading-[1.15]"
        >
          Capturing Life&apos;s Most <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-200 to-[#D4AF37]">
            Beautiful Moments
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-base sm:text-xl md:text-2xl text-zinc-300 mb-10 max-w-3xl font-light leading-relaxed tracking-wide"
        >
          Wedding Stories, Cinematic Films, Candid Portraits, Maternity &amp; Bridal Styling Studio in Madurai &amp; Tamil Nadu.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md sm:max-w-none"
        >
          <button
            onClick={() => onOpenBooking("Wedding & Event Photo Shoot")}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#071f1b] font-bold rounded-full shadow-[0_0_25px_rgba(20,184,166,0.4)] hover:shadow-[0_0_35px_rgba(20,184,166,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base tracking-wider uppercase"
          >
            Book a Shoot <ArrowRight size={18} />
          </button>

          <button
            onClick={() => onOpenQuote("Wedding & Event Photo Shoot")}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-semibold rounded-full shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base tracking-wider uppercase cursor-pointer"
          >
            Request a Quote
          </button>
        </motion.div>
      </div>
    </section>
  );
}
