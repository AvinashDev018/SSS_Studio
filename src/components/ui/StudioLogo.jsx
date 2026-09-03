"use client";

import React from "react";
import Link from "next/link";

export default function StudioLogo({ 
  size = "md", 
  showSubtitle = true, 
  href = "/", 
  className = "" 
}) {
  // Size configurations
  const sizes = {
    sm: {
      emblem: "w-8 h-8",
      icon: "w-4 h-4",
      title: "text-lg",
      sub: "text-[9px] tracking-[0.22em]",
      tag: "text-[8px] tracking-[0.18em]",
    },
    md: {
      emblem: "w-10 h-10",
      icon: "w-5 h-5",
      title: "text-2xl",
      sub: "text-[10px] sm:text-[11px] tracking-[0.28em]",
      tag: "text-[8px] sm:text-[9px] tracking-[0.2em]",
    },
    lg: {
      emblem: "w-14 h-14",
      icon: "w-7 h-7",
      title: "text-3xl sm:text-4xl",
      sub: "text-xs sm:text-sm tracking-[0.32em]",
      tag: "text-[10px] tracking-[0.24em]",
    },
  };

  const currentSize = sizes[size] || sizes.md;

  const content = (
    <div className={`flex items-center gap-3 group shrink-0 ${className}`}>
      {/* 1. Luxury Camera Aperture Emblem */}
      <div className="relative">
        {/* Luminous Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d4af37]/40 via-[#e6c280]/30 to-[#d4af37]/40 opacity-70 blur-md group-hover:opacity-100 transition-opacity duration-500" />

        {/* Outer Bezel */}
        <div className={`relative ${currentSize.emblem} rounded-xl sm:rounded-2xl bg-metallic-gold p-[2px] shadow-lg border border-[#d4af37] group-hover:border-black transition-all duration-300 group-hover:scale-105 flex items-center justify-center`}>
          {/* Inner Shutter Aperture SVG */}
          <svg
            className={`${currentSize.icon} text-black transition-colors duration-300`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Camera Body Outer Silhouette */}
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            {/* Precision Aperture Shutter / Lens Blades */}
            <circle cx="12" cy="13" r="3.5" className="stroke-black" />
            <path d="M12 9.5l2.5 4.5" className="stroke-black/70" />
            <path d="M15.5 13l-4.5 2.5" className="stroke-black/70" />
            <path d="M12 16.5l-2.5-4.5" className="stroke-black/70" />
            <path d="M8.5 13l4.5-2.5" className="stroke-black/70" />
            {/* Focal Catchlight Dot */}
            <circle cx="12" cy="13" r="1" className="fill-black stroke-none" />
          </svg>
        </div>
      </div>

      {/* 2. Premium Bold Typography */}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-center gap-2">
          {/* Main SSS Monogram - Extra Bold High Contrast Onyx Black */}
          <span className={`font-serif font-black ${currentSize.title} tracking-wider text-zinc-900 leading-none drop-shadow-sm`}>
            SSS
          </span>

          {/* Vertical Fine Divider */}
          <div className="h-4 w-[2px] bg-gradient-to-b from-transparent via-[#b8860b] to-transparent" />

          {/* Brand Name */}
          <span className={`font-sans font-black ${currentSize.sub} text-[#b8860b] uppercase leading-none tracking-[0.2em] transition-colors`}>
            PHOTOGRAPHY
          </span>
        </div>

        {/* Secondary Subtitle Tagline */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`font-sans font-bold ${currentSize.tag} text-zinc-600 uppercase tracking-widest leading-none`}>
              STUDIO &amp; ATELIER
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="SSS Photography Studio Home">
        {content}
      </Link>
    );
  }

  return content;
}
