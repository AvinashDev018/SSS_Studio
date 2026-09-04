"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSAbout() {
  const { currentLang, t } = useLanguage();

  return (
    <section id="about" className="py-24 bg-[#050b09] text-white relative overflow-hidden border-t border-amber-500/20">
      {/* Ambient Radial Lighting Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-emerald-500/5 to-teal-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-teal-500/10 to-emerald-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-amber-500/5">
            <Sparkles size={14} className="text-amber-400 animate-pulse" /> Our Heritage &amp; Craft
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            Capturing Timeless Moments Across <span className="bg-gradient-to-r from-amber-200 via-teal-200 to-emerald-400 bg-clip-text text-transparent">Tamil Nadu</span>
          </h2>
          <p className="text-zinc-300 text-base md:text-lg font-light leading-relaxed">
            Welcome to <strong className="text-amber-300 font-semibold">SSS Photography Studio</strong>. Based in Avaniyapuram, Madurai, we combine cinematic storytelling with technical precision to preserve your family's precious milestones forever.
          </p>
        </div>

        {/* Meet Our Founder / Managing Director Card */}
        <div className="mt-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 shadow-md">
              <Sparkles size={13} className="text-amber-400" /> Meet Our Founder
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
              Managing Director
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 mx-auto rounded-full" />
          </div>

          <div className="bg-gradient-to-b from-[#131109]/90 to-[#0a0804]/95 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Enhanced High-Res Founder Portrait */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-3xl blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-[#090804]">
                    <img
                      src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1788541019/sss-about/e5wqbahcvquxizqnw7ij.jpg"
                      alt="Mr. SIVA KUMAR - Managing Director SSS Studio"
                      className="w-full h-[400px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 text-center">
                      <h4 className="text-lg font-serif font-bold text-white">
                        Mr. SIVA KUMAR
                      </h4>
                      <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                        Founder &amp; Managing Director
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Quote Box & Founder Story */}
              <div className="lg:col-span-7 space-y-6">
                {/* Quote Container */}
                <div className="relative p-6 sm:p-8 rounded-2xl bg-amber-500/[0.07] border border-amber-400/30">
                  <Quote className="text-3xl text-amber-400/40 mb-3" />
                  <p className="text-zinc-200 italic text-sm sm:text-base leading-relaxed font-light">
                    &ldquo;At SSS Studio, our goal is not just to capture images, but to preserve the feelings, stories, and raw emotions that make your memories priceless. We blend professional precision with creative passion to ensure your special moments last a lifetime.&rdquo;
                  </p>
                </div>

                {/* Founder Bio Text */}
                <div className="space-y-4 text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
                  <p>
                    With years of dedication and a sharp creative vision, <strong className="text-white font-bold">Mr. SIVA KUMAR</strong> has steered <strong className="text-amber-300 font-semibold">SSS Studio</strong> to become a household name in professional wedding coverage, milestone events, and customized high-quality print designs.
                  </p>
                  <p>
                    His philosophy centers around <strong className="text-white font-bold">uncompromised premium quality</strong> and <strong className="text-white font-bold">customer-first delivery</strong>. From standard frame sizes to ultra-wide panoramic canvas prints, every piece crafted under his direction is built to endure for generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


