"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Gift, Film, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Box, Palette, Camera } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSGuarantees({ onOpenBooking }) {
  const { t, currentLang } = useLanguage();

  const guaranteesData = {
    en: [
      {
        icon: Clock,
        title: "1-Month Album Delivery Guarantee",
        badge: "Signature Promise",
        description: "No more waiting endless months for your wedding albums. We deliver premium flush-mount, handcrafted photo albums and full digital edits within 1 month (30 days).",
        color: "from-[#d4af37]/20 to-[#a77c11]/20",
        borderColor: "border-[#d4af37]/40",
        iconColor: "text-[#d4af37]",
      },
      {
        icon: Gift,
        title: "Free Pre-Wedding Shoot Perk",
        badge: "Complimentary",
        description: "Book our complete multi-day wedding package and receive a complimentary outdoor pre-wedding couple photoshoot with custom styling concepts.",
        color: "from-[#d4af37]/20 to-[#a77c11]/20",
        borderColor: "border-[#d4af37]/40",
        iconColor: "text-[#d4af37]",
      },
      {
        icon: Film,
        title: "4K Cinematic Wedding Films",
        badge: "4K Ultra HD",
        description: "Captured in crisp 4K Ultra HD with professional cinematic color grading, gimbal stabilization, and wireless audio.",
        color: "from-[#d4af37]/20 to-[#a77c11]/20",
        borderColor: "border-[#d4af37]/40",
        iconColor: "text-[#d4af37]",
      },
      {
        icon: Palette,
        title: "Signature Color Grading & Retouching",
        badge: "Master Retouching",
        description: "Every photo and film is meticulously color-graded with custom film profiles, delivering timeless, skin-true, and magazine-quality portraits.",
        color: "from-[#d4af37]/20 to-[#a77c11]/20",
        borderColor: "border-[#d4af37]/40",
        iconColor: "text-[#d4af37]",
      },
    ],
    ta: [
      {
        icon: Clock,
        title: "1 மாதத்தில் ஆல்பம் டெலிவரி உறுதி",
        badge: "சிறப்பு வாக்குறுதி",
        description: "உங்கள் திருமண ஆல்பங்களுக்காக நீண்ட மாதங்கள் காத்திருக்க வேண்டியதில்லை. 1 மாதத்திற்குள் (30 நாட்களில்) பிரீமியம் ஆல்பங்கள் மற்றும் எடிட் செய்யப்பட்ட புகைப்படங்களை வழங்குகிறோம்.",
        color: "from-[#d4af37]/20 to-[#a77c11]/20",
        borderColor: "border-[#d4af37]/40",
        iconColor: "text-[#d4af37]",
      },
      {
        icon: Gift,
        title: "இலவச ப்ரீ-வெடிங் ஷூட் சலுகை",
        badge: "இலவசம்",
        description: "முழு திருமண தொகுப்பை முன்பதிவு செய்து, அழகான வெளிப்புற ஜோடி போட்டோஷூட்டை இலவசமாக பெறுங்கள்.",
        color: "from-amber-500/20 to-yellow-500/20",
        borderColor: "border-amber-500/30",
        iconColor: "text-amber-400",
      },
      {
        icon: Film,
        title: "4K சினிமா திரைப்படங்கள் & எடிட்டிங்",
        badge: "சினிமா தரம்",
        description: "உயர்தர சினிமா கேமராக்கள், ஜிம்பல் ஸ்டெபிலைசேஷன், தெளிவான ஆடியோ மற்றும் கலர் கிரேடிங் கொண்ட திரைப்படங்கள்.",
        color: "from-teal-500/20 to-cyan-500/20",
        borderColor: "border-teal-500/30",
        iconColor: "text-teal-400",
      },
      {
        icon: Palette,
        title: "சினிமாட்டிக் கலர் கிரேடிங் & ரீடச்சிங்",
        badge: "பிரத்யேக தரம்",
        description: "ஒவ்வொரு புகைப்படமும் திரைப்படமும் எங்கள் பிரத்யேக வண்ண அமைப்புகளுடன் நுணுக்கமாக எடிட் செய்யப்பட்டு, உன்னதமான ஆல்பங்களாக மாற்றப்படுகின்றன.",
        color: "from-emerald-500/20 to-teal-500/20",
        borderColor: "border-emerald-500/30",
        iconColor: "text-emerald-400",
      },
    ],
    hi: [
      {
        icon: Clock,
        title: "1 महीने में एल्बम डिलीवरी गारंटी",
        badge: "खास वादा",
        description: "अपनी शादी के एल्बम के लिए ज्यादा इंतज़ार करने की ज़रूरत नहीं। हम 1 महीने (30 दिनों) के भीतर प्रीमियम हैंडक्राफ्टेड एल्बम और डिजिटल एडिट्स डिलीवर करते हैं।",
        color: "from-teal-500/20 to-emerald-500/20",
        borderColor: "border-teal-500/30",
        iconColor: "text-teal-400",
      },
      {
        icon: Gift,
        title: "मुफ़्त प्री-वेडिंग शूट ऑफर",
        badge: "कॉम्प्लिमेंट्री",
        description: "हमारा पूरा वेडिंग पैकेज बुक करें और एक खूबसूरत आउटडोर प्री-वेडिंग कपल शूट बिल्कुल मुफ़्त पाएं।",
        color: "from-amber-500/20 to-yellow-500/20",
        borderColor: "border-amber-500/30",
        iconColor: "text-amber-400",
      },
      {
        icon: Film,
        title: "4K मास्टर फिल्म्स और सिनेमा एडिटिंग",
        badge: "सिनेमा स्टैंडर्ड",
        description: "सिनेमा-ग्रेड कैमरों, 10-बिट कलर ग्रेडिंग, गिम्बल स्टेबिलाइजेशन और हाई-फिडेलिटी ऑडियो के साथ शानदार स्टोरी फिल्म्स।",
        color: "from-teal-500/20 to-cyan-500/20",
        borderColor: "border-teal-500/30",
        iconColor: "text-teal-400",
      },
      {
        icon: Palette,
        title: "सिग्नेचर कलर ग्रेडिंग और रीटचिंग",
        badge: "मास्टर रीटचिंग",
        description: "हर फोटो और फिल्म को हमारी कस्टम सिनेमैटिक प्रोफाइल के साथ बारीकी से कलर-ग्रेड किया जाता है, जिससे आपके एल्बम को मैगज़ीन जैसी क्वालिटी मिलती है।",
        color: "from-emerald-500/20 to-teal-500/20",
        borderColor: "border-emerald-500/30",
        iconColor: "text-emerald-400",
      },
    ]
  };

  const timelineSteps = [
    { day: "Day 01", title: "Shoot & Dual Backup", desc: "Redundant cloud & NVMe storage", icon: Camera },
    { day: "Day 07", title: "Private Gallery Link", desc: "Clients choose favorite photos", icon: CheckCircle2 },
    { day: "Day 18", title: "Fine-Art Color Grading", desc: "10-bit skin tone retouching", icon: Palette },
    { day: "Day 30", title: "Handcrafted Album Box", desc: "Delivered directly to your door", icon: Box },
  ];

  const guarantees = guaranteesData[currentLang] || guaranteesData.en;

  return (
    <section className="py-24 bg-[#FFFFFF] text-zinc-900 relative overflow-hidden border-t border-black/5">
      {/* Background ambient subtle warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#d4af37]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/[0.03] border border-[#d4af37]/40 text-[#8b6508] text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldCheck size={14} /> {t.guarantees.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-zinc-900 mb-4">
            {t.guarantees.title}
          </h2>
          <p className="text-zinc-600 text-base md:text-lg font-light leading-relaxed">
            {t.guarantees.subtitle}
          </p>
        </div>

        {/* 4 Feature Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white border-2 border-[#d4af37]/70 hover:border-[#d4af37] p-8 rounded-2xl shadow-[0_10px_35px_rgba(212,175,55,0.12)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] transition-all duration-300 flex flex-col justify-between group relative"
              >
                {/* Thin Inner Gold Accent Border Frame */}
                <div className="absolute inset-1 border border-[#d4af37]/30 rounded-[14px] pointer-events-none z-10" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] border-2 border-[#d4af37] flex items-center justify-center group-hover:scale-105 transition-all duration-300 text-[#8b6508] shadow-md">
                      <Icon className="w-6 h-6 text-[#8b6508]" />
                    </div>
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-white/95 border border-[#d4af37]/50 text-[#8b6508] uppercase tracking-wider shadow-sm">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif font-bold text-zinc-900 mb-3 group-hover:text-[#b8860b] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-900 text-xs md:text-sm leading-relaxed mb-6 font-bold">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-700 font-bold tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[#8b6508]" /> {t.guarantees.inclusions}
                  </span>
                  <button
                    onClick={() => onOpenBooking(item.title)}
                    className="text-xs text-[#8b6508] font-black hover:underline transition-colors flex items-center gap-1 group-hover:translate-x-1 duration-200 cursor-pointer uppercase tracking-wider"
                  >
                    {t.guarantees.enquire} <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive 1-Month Delivery Timeline Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-10 rounded-3xl bg-[#FAFAFA] border-2 border-[#d4af37]/60 relative overflow-hidden shadow-xl text-zinc-900"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[#8b6508] text-xs font-black tracking-widest uppercase block mb-1">
                Guaranteed Workflow
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-zinc-900">
                How We Deliver Your Albums in 1 Month
              </h3>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-metallic-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shrink-0">
              <Clock size={14} /> 1 Month (30 Days) Guaranteed
            </div>
          </div>

          {/* Connecting Line with Animated Light Pulse (Desktop) */}
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] bg-[#d4af37]/40 -translate-y-1/2 pointer-events-none z-0" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {timelineSteps.map((step, sIdx) => {
                const StepIcon = step.icon;
                return (
                  <motion.div 
                    key={sIdx}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative bg-white border border-[#d4af37]/40 rounded-2xl p-5 hover:border-[#d4af37] transition-all duration-300 shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#d4af37]/20 text-[#8b6508] border border-[#d4af37]/40 group-hover:bg-metallic-gold group-hover:text-black transition-colors">
                        {step.day}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[#8b6508] group-hover:scale-110 transition-all">
                        <StepIcon size={16} />
                      </div>
                    </div>
                    <h4 className="text-zinc-900 font-bold text-sm mb-1 group-hover:text-[#b8860b] transition-colors">{step.title}</h4>
                    <p className="text-zinc-600 text-xs font-light">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
