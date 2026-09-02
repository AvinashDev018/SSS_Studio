"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Award, ShieldCheck, Clock, Users, Heart, Sparkles, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSAbout({ onOpenBooking }) {
  const { currentLang, t } = useLanguage();

  const stats = [
    { label: "Weddings & Shoots", value: "1,200+", icon: Camera },
    { label: "1-Month Album Delivery", value: "100%", icon: ShieldCheck },
    { label: "Client Satisfaction", value: "4.9 ★", icon: Heart },
    { label: "Years in Madurai", value: "15+", icon: Award },
  ];

  const highlights = [
    {
      title: "Masters of Candid Emotion",
      desc: "We focus on unscripted, genuine laughter, tears of joy, and subtle heartfelt glances that tell your true story.",
      icon: Heart,
    },
    {
      title: "1-Month Delivery Promise",
      desc: "Unlike other studios making you wait half a year, your custom leatherette album and 4K edits are delivered in 30 days.",
      icon: Clock,
    },
    {
      title: "Cinema-Grade 4K & Drone Tech",
      desc: "Equipped with Sony FX3/A7IV full-frame cinema cameras, prime master glass, and licensed drone aerial coverage.",
      icon: Sparkles,
    },
    {
      title: "Signature Color Grading",
      desc: "Every photograph is color-timed individually by our lead retoucher for timeless, vibrant South Indian tones.",
      icon: Award,
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#070d0b] text-white relative overflow-hidden border-t border-teal-500/10">
      {/* Ambient lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14} /> Our Heritage &amp; Craft
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            Capturing Timeless Moments Across Tamil Nadu
          </h2>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
            Welcome to <strong className="text-teal-300 font-semibold">SSS Photography Studio</strong>. Based in Avaniyapuram, Madurai, we combine cinematic storytelling with technical precision to preserve your family's precious milestones forever.
          </p>
        </div>

        {/* Studio Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#091512] border border-teal-500/20 hover:border-teal-400/50 shadow-lg text-center transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-white group-hover:text-teal-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-zinc-400 mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* 2-Column Story & Value Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Studio Image / Visual Card */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/30 to-emerald-500/20 rounded-3xl blur-xl opacity-50" />
            <div className="relative rounded-3xl overflow-hidden border border-teal-500/30 shadow-2xl bg-[#081412]">
              <img
                src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284637/sss-services/hzsoecylmq8xfbzr9alp.jpg"
                alt="SSS Photography Studio Team at Work"
                className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c0b] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  Madurai, Tamil Nadu
                </span>
                <h3 className="text-xl font-serif font-bold text-white">
                  34, Prasanna New Colony, Avaniyapuram
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Full-service creative space equipped with high-end strobe lights, master backdrops, and private client viewing lounge.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Highlights */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Why Couples &amp; Families Choose SSS Studio
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-2.5">
                      <Icon size={18} />
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">{h.title}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-light">{h.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenBooking ? onOpenBooking("Wedding & Event Photo Shoot") : null}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-black font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book Shoot Consultation</span>
                <ArrowRight size={15} />
              </button>

              <a
                href="https://wa.me/916383565425?text=Hello%20SSS%20Studio!%20I%20would%20like%20to%20know%20more%20about%20your%20photography%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-colors"
              >
                WhatsApp Direct: +91 63835 65425
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
