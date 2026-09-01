"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Gift, Film, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function SSSGuarantees({ onOpenBooking }) {
  const guarantees = [
    {
      icon: Clock,
      title: "20-Day Album Delivery Guarantee",
      badge: "Signature Promise",
      description:
        "No more waiting months for your wedding albums. We deliver premium flush-mount, handcrafted photo albums and full digital edits within 20 working days.",
      color: "from-teal-500/20 to-emerald-500/20",
      borderColor: "border-teal-500/30",
      iconColor: "text-teal-400",
    },
    {
      icon: Gift,
      title: "Free Pre-Wedding Shoot Perk",
      badge: "Complimentary",
      description:
        "Book our complete multi-day wedding package and receive a complimentary outdoor pre-wedding couple photoshoot with custom styling concepts.",
      color: "from-amber-500/20 to-yellow-500/20",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
    },
    {
      icon: Film,
      title: "4K Master Films & Cinema Editing",
      badge: "Cinema Standard",
      description:
        "Shot on cinema-grade mirrorless cameras with 10-bit color grading, gimbal stabilization, high-fidelity wireless audio, and master story editing.",
      color: "from-teal-500/20 to-cyan-500/20",
      borderColor: "border-teal-500/30",
      iconColor: "text-teal-400",
    },
    {
      icon: Sparkles,
      title: "Bridal Studio & HD Makeover",
      badge: "All-In-One Service",
      description:
        "Dedicated in-house bridal makeup artists specializing in HD Bridal Makeup, Saree Draping, Hairstyle, and pre-event trials directly at the venue.",
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#080c0b] via-[#0c3530]/40 to-[#080c0b] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
            Why SSS Studio is Different
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            Studio Guarantees &amp; Exclusive Perks
          </h2>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
            We combine high-end cinema equipment with strict timelines so your memories are preserved with perfection and delivered without delay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`bg-gradient-to-br ${item.color} bg-[#0c3530]/60 backdrop-blur-xl border ${item.borderColor} p-8 rounded-3xl shadow-xl transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-7 h-7 ${item.iconColor}`} />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 border border-white/10 text-zinc-300 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6 font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-teal-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-teal-400" /> Premium Inclusions
                  </span>
                  <button
                    onClick={() => onOpenBooking(item.title)}
                    className="text-xs text-white font-bold hover:text-teal-300 transition-colors flex items-center gap-1 group-hover:translate-x-1 duration-200 cursor-pointer"
                  >
                    Enquire Now <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
