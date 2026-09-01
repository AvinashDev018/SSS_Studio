"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, MessageCircle, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSStudioInfo({ onOpenBooking }) {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 bg-[#0a100e] relative overflow-hidden border-t border-white/5">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles size={14} /> {t.contact.tag}
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              {t.contact.title}
            </h2>
            <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed mb-8">
              {t.contact.subtitle}
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/30 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">Studio Address</h4>
                  <p className="text-zinc-400 text-sm font-light mt-0.5">
                    {t.contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/30 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">Direct Phone &amp; WhatsApp</h4>
                  <p className="text-zinc-400 text-sm font-light mt-0.5">
                    +91 63835 65425
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/30 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-bold text-base">Working Hours</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> OPEN
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm font-light mt-0.5">
                    {t.contact.hours}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onOpenBooking("Wedding & Event Photo Shoot")}
                className="px-8 py-4 bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] font-bold rounded-full shadow-lg hover:shadow-teal-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <Calendar size={16} /> {t.contact.bookSlot}
              </button>
              
              <a
                href="https://wa.me/916383565425"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <MessageCircle size={16} className="text-emerald-400" /> {t.contact.chatWhatsApp}
              </a>
            </div>
          </motion.div>

          {/* Right Card / Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-[#0c3530]/90 via-[#104b43]/90 to-[#166055]/90 border border-teal-500/30 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider mb-4">
                <Sparkles size={12} /> Instant Date Check
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Quick Studio Consultation
              </h3>
              <p className="text-zinc-300 text-sm font-light mb-6">
                Have specific venue dates in mind? Check date availability directly with our lead team in seconds.
              </p>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 mb-6">
                <div className="flex items-center justify-between text-xs text-zinc-300 border-b border-white/10 pb-3">
                  <span className="text-teal-300 font-semibold">Wedding Season Slots</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Open 2026-27
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-300 border-b border-white/10 pb-3">
                  <span>Album Delivery</span>
                  <span className="text-white font-semibold">Guaranteed 20 Days</span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span>Pre-Wedding Outdoors</span>
                  <span className="text-white font-semibold">Tamil Nadu &amp; Kerala</span>
                </div>
              </div>

              <button
                onClick={() => onOpenBooking("Wedding & Event Photo Shoot")}
                className="w-full py-4 bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] font-bold rounded-2xl shadow-xl hover:shadow-teal-400/40 hover:scale-[1.02] transition-all duration-300 text-sm uppercase tracking-wider cursor-pointer"
              >
                Schedule Shoot Now
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
