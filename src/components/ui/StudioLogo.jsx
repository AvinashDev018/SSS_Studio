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
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#c5a880]/30 via-[#e6cba8]/20 to-[#c5a880]/30 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />

        {/* Outer Bezel */}
        <div className={`relative ${currentSize.emblem} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#1c1c1c] to-[#0c0c0c] p-[1.5px] shadow-[0_4px_20px_rgba(0,0,0,0.8)] border border-white/15 group-hover:border-[#c5a880]/60 transition-all duration-300 group-hover:scale-105 flex items-center justify-center`}>
          {/* Inner Shutter Aperture SVG */}
          <svg
            className={`${currentSize.icon} text-[#c5a880] group-hover:text-white transition-colors duration-300`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Camera Body Outer Silhouette */}
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            {/* Precision Aperture Shutter / Lens Blades */}
            <circle cx="12" cy="13" r="3.5" className="stroke-[#c5a880]" />
            <path d="M12 9.5l2.5 4.5" className="stroke-[#c5a880]/60" />
            <path d="M15.5 13l-4.5 2.5" className="stroke-[#c5a880]/60" />
            <path d="M12 16.5l-2.5-4.5" className="stroke-[#c5a880]/60" />
            <path d="M8.5 13l4.5-2.5" className="stroke-[#c5a880]/60" />
            {/* Focal Catchlight Dot */}
            <circle cx="12" cy="13" r="1" className="fill-[#e6cba8] stroke-none" />
          </svg>
        </div>
      </div>

      {/* 2. Premium Typography */}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-center gap-2">
          {/* Main SSS Monogram with Gold/Silver Sheen */}
          <span className={`font-serif font-black ${currentSize.title} tracking-wider bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent leading-none drop-shadow-sm`}>
            SSS
          </span>

          {/* Vertical Fine Divider */}
          <div className="h-4 w-px bg-gradient-to-b from-transparent via-[#c5a880]/50 to-transparent" />

          {/* Brand Name */}
          <span className={`font-sans font-extrabold ${currentSize.sub} text-[#c5a880] uppercase leading-none group-hover:text-[#e6cba8] transition-colors`}>
            PHOTOGRAPHY
          </span>
        </div>

        {/* Secondary Subtitle Tagline */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`font-sans font-medium ${currentSize.tag} text-zinc-400 uppercase tracking-widest leading-none`}>
              STUDIO & ATELIER
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
