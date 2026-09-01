"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, Heart, Film, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSHero({ onOpenBooking, onOpenQuote }) {
  const { t } = useLanguage();

  // Pre-generate smooth random particle positions
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: (i * 5.5 + (i % 3) * 7) % 94 + 3,
      size: (i % 3 === 0 ? 28 : i % 2 === 0 ? 20 : 14),
      duration: 12 + (i % 5) * 3,
      delay: (i * 1.3) % 10,
      type: i % 4 === 0 ? "camera" : i % 4 === 1 ? "sparkle" : i % 4 === 2 ? "film" : "dot",
      opacity: 0.15 + (i % 3) * 0.1,
    }));
  }, []);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-12 pb-20 bg-gradient-to-b from-[#f8fafc] via-[#e8f3f1] to-[#f0f9f8] text-[#0c3530] select-none">
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
            className="absolute text-teal-800"
          >
            {p.type === "camera" && <Camera size={p.size} strokeWidth={1.5} />}
            {p.type === "sparkle" && <Sparkles size={p.size} strokeWidth={1.5} />}
            {p.type === "film" && <Film size={p.size} strokeWidth={1.5} />}
            {p.type === "dot" && (
              <div
                style={{ width: p.size / 2, height: p.size / 2 }}
                className="rounded-full bg-teal-600/30 blur-[1px]"
              />
            )}
          </motion.div>
        ))}

        {/* Ambient subtle light glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* 2. Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
        {/* 3D Center Floating Studio Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          whileHover={{ scale: 1.03, rotateY: 5, rotateX: -3 }}
          className="relative mb-10 group cursor-pointer"
        >
          {/* Outer glow shadow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-600/20 rounded-[32px] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Card Surface */}
          <div className="relative w-[320px] sm:w-[460px] md:w-[540px] h-[200px] sm:h-[260px] md:h-[290px] rounded-[28px] bg-gradient-to-br from-white via-[#f4f9f8] to-[#e4f1ef] border border-white/80 shadow-[0_20px_50px_rgba(12,53,48,0.18)] p-6 sm:p-8 flex items-center justify-between overflow-hidden backdrop-blur-md">
            {/* Background Geometric Pattern */}
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#0c3530_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            {/* Metallic Light Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            {/* Card Left: Stylized Studio Typography */}
            <div className="flex flex-col items-start z-10">
              <div className="flex items-center gap-1.5">
                <span className="font-serif italic font-normal text-4xl sm:text-6xl md:text-7xl text-[#0c3530] tracking-tight leading-none drop-shadow-sm">
                  SSS
                </span>
              </div>
              <span className="font-sans font-black text-[9px] sm:text-xs tracking-[0.45em] text-[#166055] uppercase mt-2 ml-1">
                P H O T O G R A P H Y
              </span>
            </div>

            {/* Card Right: Silhouette Vector Artwork */}
            <div className="relative z-10 shrink-0 w-28 sm:w-44 md:w-52 h-full flex items-center justify-end">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full text-[#166055] drop-shadow-md"
                fill="currentColor"
              >
                <path
                  d="M120 70 C120 60, 130 55, 140 55 C148 45, 155 45, 165 48 C175 52, 180 60, 180 70 C175 75, 170 78, 160 76 C150 74, 145 78, 140 82 C135 85, 125 80, 120 70 Z"
                  opacity="0.9"
                />
                <path
                  d="M142 58 Q150 48 160 52 Q168 56 166 65 Q164 72 155 72 Q146 72 142 58 Z"
                  opacity="0.95"
                />
                <rect
                  x="50"
                  y="75"
                  width="95"
                  height="65"
                  rx="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                />
                <path
                  d="M75 75 L85 62 L110 62 L120 75 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                />
                <circle
                  cx="97"
                  cy="107"
                  r="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                />
                <circle
                  cx="97"
                  cy="107"
                  r="12"
                  fill="currentColor"
                  opacity="0.25"
                />
                <circle cx="130" cy="88" r="4" fill="currentColor" />
                <path
                  d="M140 85 C155 90, 165 105, 165 125 L150 145 C140 135, 135 120, 135 110 Z"
                  opacity="0.85"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Big Editorial Heading Matching Exact Reference with Dynamic Translation */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0c3530] mb-4 leading-[1.12]"
        >
          {t.hero.titleLine1} <br />
          <span className="text-[#104b43] italic font-serif">{t.hero.titleLine2}</span>
        </motion.h1>

        {/* Sub-Heading Matching Exact Reference */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] sm:tracking-[0.35em] text-[#166055] uppercase mt-2 mb-8"
        >
          {t.hero.subtitle}
        </motion.p>
      </div>
    </section>
  );
}
