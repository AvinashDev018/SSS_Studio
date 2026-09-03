"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Sliders, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSColorGradingComparison({ onOpenBooking }) {
  const { currentLang } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  // Auto-breathe idle animation when not interacting
  useEffect(() => {
    if (hasInteracted) return;

    let startTime = null;
    let animId = null;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      // Oscillate smoothly between 38% and 62%
      const newPos = 50 + Math.sin(elapsed * 1.5) * 12;
      setSliderPos(newPos);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [hasInteracted]);

  const handleMove = (e) => {
    if (!hasInteracted) setHasInteracted(true);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 5), 95));
  };

  const titles = {
    en: {
      tag: "Cinematic Color Magic",
      heading: "See The SSS Studio Color Grading Difference",
      subtitle: "Drag the slider to compare unedited flat RAW footage with our signature 10-bit South Indian fine-art color science.",
      rawLabel: "RAW Flat Profile (Unedited)",
      gradedLabel: "SSS 10-Bit Master Color Graded",
      cta: "Get This Cinematic Quality for Your Wedding",
    },
    ta: {
      tag: "சினிமாட்டிக் கலர் கிரேடிங்",
      heading: "SSS ஸ்டுடியோவின் கலர் கிரேடிங் வித்தியாசம்",
      subtitle: "எடிட் செய்யப்படாத சாதாரண புகைப்படத்திற்கும், எங்களின் 10-பிட் பிரீமியம் கலர் கிரேடிங்கிற்கும் உள்ள வித்தியாசத்தை ஸ்லைடர் மூலம் பாருங்கள்.",
      rawLabel: "RAW புகைப்படம் (எடிட் செய்யப்படாதது)",
      gradedLabel: "SSS 10-பிட் கலர் கிரேடட்",
      cta: "உங்கள் திருமணத்திற்கும் இந்த சினிமா தரத்தை பெறுங்கள்",
    },
    hi: {
      tag: "सिनेमैटिक कलर ग्रेडिंग",
      heading: "SSS स्टूडियो कलर ग्रेडिंग का असली अंतर देखें",
      subtitle: "स्लाइडर को खींचकर देखें कि बिना एडिट किए गए RAW फुटेज और हमारे 10-बिट फाइन-आर्ट कलर ग्रेडिंग में क्या अंतर है।",
      rawLabel: "RAW अन-एडिटेड प्रोफाइल",
      gradedLabel: "SSS 10-बिट मास्टर कलर ग्रेडेड",
      cta: "अपनी शादी के लिए यह सिनेमैटिक क्वालिटी बुक करें",
    },
  };

  const text = titles[currentLang] || titles.en;

  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#c5a880]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[#c5a880] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles size={14} /> {text.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-white mb-4">
            {text.heading}
          </h2>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
            {text.subtitle}
          </p>
        </div>

        {/* Interactive Comparison Slider Container */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            onClick={handleMove}
            className="relative h-[360px] sm:h-[480px] md:h-[540px] rounded-2xl overflow-hidden shadow-2xl border border-white/15 cursor-ew-resize select-none group"
          >
            {/* 1. After (Color Graded) Image - Full background */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1788426852/sss-hero-wedding.jpg"
                alt="SSS Master Color Graded"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-[#c5a880] text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#c5a880]" />
                <span>{text.gradedLabel}</span>
              </div>
            </div>

            {/* 2. Before (RAW Flat) Image - Clipped */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1788426852/sss-hero-wedding.jpg"
                alt="RAW Flat Profile"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{
                  width: containerRef.current ? containerRef.current.offsetWidth : "100%",
                  height: "100%",
                  filter: "saturate(0.55) contrast(0.82) brightness(0.92)",
                }}
              />
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-zinc-300 text-xs sm:text-sm font-medium shadow-xl">
                <span>{text.rawLabel}</span>
              </div>
            </div>

            {/* 3. Slider Handle Line & Knob */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#c5a880] pointer-events-none shadow-[0_0_15px_rgba(197,168,128,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Halo ripple ring */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#c5a880]/20 animate-ping pointer-events-none" />
              
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#c5a880] text-black shadow-2xl flex items-center justify-center border-2 border-white scale-100 group-hover:scale-105 transition-transform">
                <ArrowLeftRight size={16} strokeWidth={2.5} />
              </div>
            </div>

            {/* Top Helper Floating Pill */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[11px] font-medium flex items-center gap-1.5 pointer-events-none shadow-lg">
              <Sliders size={12} className="text-[#c5a880]" />
              <span>{hasInteracted ? "Dragging to compare" : "✦ Touch or drag to compare live"}</span>
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div className="mt-8 text-center">
            <button
              onClick={() => onOpenBooking("Wedding & Event Photo Shoot")}
              className="px-8 py-3.5 bg-[#c5a880] hover:bg-[#d4af37] text-black font-semibold rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(197,168,128,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xs uppercase tracking-wider cursor-pointer inline-flex items-center gap-2 group"
            >
              <Sparkles size={15} />
              <span>{text.cta}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
