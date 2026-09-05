"use client";

import React from "react";
import Link from "next/link";

export default function StudioLogo({ 
  size = "md", 
  showSubtitle = true, 
  href = "/", 
  variant = "auto", // "dark" (for light backgrounds), "light" (for dark backgrounds), or "auto"
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

  // Title text color determination based on variant
  const titleColor = variant === "dark" 
    ? "text-zinc-950" 
    : variant === "light" 
    ? "text-white" 
    : "text-zinc-900 dark:text-white";

  const subtitleColor = variant === "dark"
    ? "text-[#a67c13]"
    : variant === "light"
    ? "text-amber-300"
    : "text-[#b8860b] dark:text-amber-300";

  const content = (
    <div className={`flex items-center gap-1.5 sm:gap-2.5 group shrink-0 ${className}`}>
      {/* 1. Gold Camera Emblem Box */}
      <div className="relative shrink-0 flex items-center">
        {/* Luminous Soft Glow */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#d4af37]/35 via-[#e6c280]/25 to-[#d4af37]/35 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500" />

        {/* Squircle Gold Icon Container */}
        <div className={`relative ${currentSize.emblem} rounded-lg sm:rounded-xl bg-gradient-to-br from-[#dfb738] via-[#c59b27] to-[#a67c13] p-1 shadow-sm border border-[#d4af37]/80 group-hover:scale-105 transition-all duration-300 flex items-center justify-center`}>
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
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3.5" className="stroke-black" />
            <path d="M12 9.5l2.5 4.5" className="stroke-black/70" />
            <path d="M15.5 13l-4.5 2.5" className="stroke-black/70" />
            <path d="M12 16.5l-2.5-4.5" className="stroke-black/70" />
            <path d="M8.5 13l4.5-2.5" className="stroke-black/70" />
            <circle cx="12" cy="13" r="1" className="fill-black stroke-none" />
          </svg>
        </div>
      </div>

      {/* 2. SSS Monogram & Subtitle Stack */}
      <div className="flex flex-col items-start justify-center select-none shrink-0 leading-none">
        <span className={`font-serif font-black ${currentSize.title} tracking-wider ${titleColor} leading-none drop-shadow-sm`}>
          SSS
        </span>
        {showSubtitle && (
          <span className={`font-sans font-extrabold ${currentSize.tag} ${subtitleColor} uppercase tracking-[0.16em] leading-none mt-0.5 whitespace-nowrap`}>
            STUDIO
          </span>
        )}
      </div>

      {/* 3. Gold Vertical Divider Bar */}
      <div className="h-5 sm:h-6 w-[1.5px] bg-[#b8860b] shrink-0 mx-0.5 sm:mx-1 rounded-full opacity-80" />

      {/* 4. PHOTOGRAPHY Label */}
      <div className="flex items-center select-none shrink-0">
        <span className={`font-sans font-black ${currentSize.sub} text-[#b8860b] uppercase leading-none tracking-[0.18em] transition-colors whitespace-nowrap`}>
          PHOTOGRAPHY
        </span>
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
