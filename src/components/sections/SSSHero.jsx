"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, Film, ArrowRight, ShieldCheck, Star, MapPin, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSHero({ onOpenBooking, onOpenQuote }) {
  const { t } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFlashing, setIsFlashing] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const triggerFlash = (callback) => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      if (callback) callback();
    }, 250);
  };

  // Pre-generate smooth random particle positions
  const particles = useMemo(() => {
    return Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      x: (i * 4.2 + (i % 3) * 5) % 94 + 3,
      size: (i % 3 === 0 ? 24 : i % 2 === 0 ? 18 : 12),
      duration: 10 + (i % 6) * 2.5,
      delay: (i * 0.9) % 8,
      type: i % 4 === 0 ? "camera" : i % 4 === 1 ? "sparkle" : i % 4 === 2 ? "film" : "dot",
      opacity: 0.2 + (i % 3) * 0.15,
    }));
  }, []);

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden pt-12 pb-16 bg-gradient-to-b from-[#080c0b] via-[#09231f] to-[#080c0b] text-white select-none"
    >
      {/* Flash Effect on Action Clicks */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 1. Animated Floating Particles Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "110vh", x: `${p.x}vw`, opacity: 0, rotate: 0 }}
            animate={{
              y: "-15vh",
              opacity: [0, p.opacity, p.opacity, 0],
              rotate: [0, 180, 360],
              x: [`${p.x}vw`, `${p.x + (p.id % 2 === 0 ? 3 : -3)}vw`, `${p.x}vw`],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            className="absolute text-teal-400/40"
          >
            {p.type === "camera" && <Camera size={p.size} strokeWidth={1.5} />}
            {p.type === "sparkle" && <Sparkles size={p.size} strokeWidth={1.5} className="text-amber-400/40" />}
            {p.type === "film" && <Film size={p.size} strokeWidth={1.5} />}
            {p.type === "dot" && (
              <div
                style={{ width: p.size / 2, height: p.size / 2 }}
                className="rounded-full bg-teal-400/40 blur-[1px]"
              />
            )}
          </motion.div>
        ))}

        {/* Optical Aperture Rotating Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-25"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-teal-400">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <path d="M50 4 L50 20 M50 96 L50 80 M4 50 L20 50 M96 50 L80 50" stroke="currentColor" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Counter-Rotating Outer Orbital Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none opacity-15"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 6" />
          </svg>
        </motion.div>

        {/* Ambient subtle glowing light orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* 2. Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
        
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-teal-400/40 shadow-[0_0_20px_rgba(20,184,166,0.25)] backdrop-blur-xl text-teal-300 text-xs font-bold uppercase tracking-widest mb-6 hover:scale-105 transition-transform cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5" />
          <span>SSS Photography Studio • Madurai</span>
        </motion.div>

        {/* 3D Center Floating Studio Card with Optical Viewfinder Corners */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotateX: -mousePos.y * 14,
            rotateY: mousePos.x * 14,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="relative mb-8 group cursor-pointer perspective-1000"
        >
          {/* Viewfinder Focus Brackets */}
          <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-teal-400/70 rounded-tl-lg pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute -top-4 -right-4 w-6 h-6 border-t-2 border-r-2 border-teal-400/70 rounded-tr-lg pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b-2 border-l-2 border-teal-400/70 rounded-bl-lg pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b-2 border-r-2 border-teal-400/70 rounded-br-lg pointer-events-none group-hover:scale-125 transition-transform" />

          {/* Highlighted Outer Glow Shadow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/40 via-emerald-500/40 to-amber-500/30 rounded-[36px] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Floating Viewfinder Left Pill */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-3.5 -left-3 sm:-left-6 z-20 hidden sm:flex items-center gap-2 px-4 py-1.5 bg-[#080c0b]/95 border border-teal-400/40 rounded-full text-white text-[11px] font-bold shadow-2xl backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-teal-300 font-black">REC</span>
            <span className="tracking-wider">4K CINEMA</span>
          </motion.div>

          {/* Floating Guarantee Right Pill */}
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-3.5 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-[#071f1b] font-black rounded-full text-[11px] shadow-2xl tracking-wider"
          >
            <ShieldCheck size={15} className="fill-current" />
            <span>1-MONTH ALBUM GUARANTEE</span>
          </motion.div>

          {/* Highlighted Gradient Border Frame */}
          <div className="p-[2px] rounded-[30px] bg-gradient-to-br from-teal-400/80 via-emerald-400/80 to-amber-400/80 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(20,184,166,0.3)]">
            {/* Dark Obsidian Glass Card Surface */}
            <div className="relative w-[320px] sm:w-[480px] md:w-[560px] h-[200px] sm:h-[260px] md:h-[290px] rounded-[28px] bg-gradient-to-br from-[#0c2e28] via-[#081f1b] to-[#04100e] p-6 sm:p-8 flex items-center justify-between overflow-hidden backdrop-blur-2xl">
              {/* Background Geometric Micro-Pattern */}
              <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              {/* Metallic Light Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              {/* Card Left: Stylized Studio Typography */}
              <div className="flex flex-col items-start z-10">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif italic font-black text-5xl sm:text-6xl md:text-7xl bg-gradient-to-r from-white via-teal-100 to-amber-200 bg-clip-text text-transparent tracking-tight leading-none drop-shadow-[0_4px_15px_rgba(45,212,191,0.35)]">
                    SSS
                  </span>
                </div>
                <span className="font-sans font-black text-[9px] sm:text-xs tracking-[0.45em] text-teal-300/90 uppercase mt-3 ml-1">
                  P H O T O G R A P H Y
                </span>
              </div>

              {/* Card Right: Clean Professional Cinema DSLR Camera Illustration */}
              <div className="relative z-10 shrink-0 w-28 sm:w-44 md:w-52 h-full flex items-center justify-end">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full text-teal-400 drop-shadow-[0_0_20px_rgba(45,212,191,0.35)]"
                  fill="none"
                >
                  {/* Camera Body Outer Contour */}
                  <rect
                    x="28"
                    y="65"
                    width="144"
                    height="98"
                    rx="16"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="#041210"
                    fillOpacity="0.85"
                  />

                  {/* Top Prism Viewfinder */}
                  <path
                    d="M72 65 L84 46 L116 46 L128 65 Z"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="#061a16"
                  />

                  {/* Hotshoe / Top Flash Mount */}
                  <rect x="90" y="40" width="20" height="6" rx="2" fill="currentColor" />

                  {/* Right Handgrip Texture */}
                  <rect x="36" y="76" width="16" height="76" rx="6" fill="#082822" stroke="currentColor" strokeWidth="2" />
                  <line x1="44" y1="84" x2="44" y2="144" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />

                  {/* Top Mode Dial & Shutter Button */}
                  <rect x="140" y="55" width="18" height="10" rx="3" fill="#f59e0b" />
                  <circle cx="156" cy="78" r="4" fill="#ef4444" className="animate-pulse" />

                  {/* 35mm Master Lens Outer Barrel */}
                  <circle
                    cx="106"
                    cy="114"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="#030d0b"
                  />
                  <circle
                    cx="106"
                    cy="114"
                    r="31"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    opacity="0.8"
                  />

                  {/* Multi-Coated Optical Glass Lens Elements */}
                  <circle
                    cx="106"
                    cy="114"
                    r="23"
                    fill="url(#lensGrad)"
                    stroke="#2dd4bf"
                    strokeWidth="3"
                  />

                  {/* Lens Glass Reflection Arc */}
                  <path
                    d="M93 99 A 20 20 0 0 1 123 103"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <circle cx="118" cy="126" r="3.5" fill="#ffffff" opacity="0.6" />

                  {/* Lens Gradient Definition */}
                  <defs>
                    <radialGradient id="lensGrad" cx="40%" cy="35%" r="70%">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.8" />
                      <stop offset="45%" stopColor="#0f766e" stopOpacity="0.9" />
                      <stop offset="85%" stopColor="#042f2c" stopOpacity="1" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Big Editorial Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 leading-[1.12]"
        >
          {t.hero.titleLine1} <br />
          <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent italic font-serif">
            {t.hero.titleLine2}
          </span>
        </motion.h1>

        {/* Sub-Heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-teal-300/90 uppercase mt-2 mb-8 max-w-3xl"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Hero Interactive Call To Action Buttons with Flash Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => triggerFlash(() => onOpenBooking("Wedding & Event Photo Shoot"))}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(20,184,166,0.4)] hover:shadow-[0_0_35px_rgba(20,184,166,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-2.5 cursor-pointer border border-teal-400/50 group"
          >
            <span>{t.hero.bookBtn}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => triggerFlash(() => onOpenQuote("Wedding & Event Photo Shoot"))}
            className="px-8 py-4 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20 flex items-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <Sparkles size={16} className="text-amber-400" />
            <span>{t.hero.quoteBtn}</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
