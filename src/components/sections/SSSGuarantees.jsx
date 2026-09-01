"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Gift, Film, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSGuarantees({ onOpenBooking }) {
  const { t, currentLang } = useLanguage();

  const guaranteesData = {
    en: [
      {
        icon: Clock,
        title: "20-Day Album Delivery Guarantee",
        badge: "Signature Promise",
        description: "No more waiting months for your wedding albums. We deliver premium flush-mount, handcrafted photo albums and full digital edits within 20 working days.",
        color: "from-teal-500/20 to-emerald-500/20",
        borderColor: "border-teal-500/30",
        iconColor: "text-teal-400",
      },
      {
        icon: Gift,
        title: "Free Pre-Wedding Shoot Perk",
        badge: "Complimentary",
        description: "Book our complete multi-day wedding package and receive a complimentary outdoor pre-wedding couple photoshoot with custom styling concepts.",
        color: "from-amber-500/20 to-yellow-500/20",
        borderColor: "border-amber-500/30",
        iconColor: "text-amber-400",
      },
      {
        icon: Film,
        title: "4K Master Films & Cinema Editing",
        badge: "Cinema Standard",
        description: "Shot on cinema-grade mirrorless cameras with 10-bit color grading, gimbal stabilization, high-fidelity wireless audio, and master story editing.",
        color: "from-teal-500/20 to-cyan-500/20",
        borderColor: "border-teal-500/30",
        iconColor: "text-teal-400",
      },
      {
        icon: Sparkles,
        title: "Bridal Studio & HD Makeover",
        badge: "All-In-One Service",
        description: "Dedicated in-house bridal makeup artists specializing in HD Bridal Makeup, Saree Draping, Hairstyle, and pre-event trials directly at the venue.",
        color: "from-emerald-500/20 to-teal-500/20",
        borderColor: "border-emerald-500/30",
        iconColor: "text-emerald-400",
      },
    ],
    ta: [
      {
        icon: Clock,
        title: "20 நாட்களில் ஆல்பம் டெலிவரி உறுதி",
        badge: "சிறப்பு வாக்குறுதி",
        description: "உங்கள் திருமண ஆல்பங்களுக்காக மாதக்கணக்கில் காத்திருக்க வேண்டியதில்லை. 20 வேலை நாட்களில் பிரீமியம் ஆல்பங்கள் மற்றும் எடிட் செய்யப்பட்ட புகைப்படங்களை வழங்குகிறோம்.",
        color: "from-teal-500/20 to-emerald-500/20",
        borderColor: "border-teal-500/30",
        iconColor: "text-teal-400",
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
        icon: Sparkles,
        title: "பிரைடல் ஸ்டுடியோ & HD மேக்கப்",
        badge: "முழுமையான சேவை",
        description: "HD பிரைடல் மேக்கப், புடவை கட்டுதல், சிகை அலங்காரம் மற்றும் டிரயல்ஸ் ஆகியவற்றை எங்கள் அனுபவமிக்க கலைஞர்கள் வழங்குகிறார்கள்.",
        color: "from-emerald-500/20 to-teal-500/20",
        borderColor: "border-emerald-500/30",
        iconColor: "text-emerald-400",
      },
    ],
    hi: [
      {
        icon: Clock,
        title: "20 दिनों में एल्बम डिलीवरी गारंटी",
        badge: "खास वादा",
        description: "अपनी शादी के एल्बम के लिए महीनों इंतज़ार करने की ज़रूरत नहीं। हम 20 दिनों के भीतर प्रीमियम हैंडक्राफ्टेड एल्बम और डिजिटल एडिट्स डिलीवर करते हैं।",
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
        icon: Sparkles,
        title: "ब्राइडल स्टूडियो और HD मेकओवर",
        badge: "ऑल-इन-वन सेवा",
        description: "HD ब्राइडल मेकअप, साड़ी ड्रेपिंग, हेयरस्टाइल और वेन्यू पर प्री-इवेंट ट्रायल्स में विशेषज्ञ मेकअप आर्टिस्ट्स।",
        color: "from-emerald-500/20 to-teal-500/20",
        borderColor: "border-emerald-500/30",
        iconColor: "text-emerald-400",
      },
    ]
  };

  const guarantees = guaranteesData[currentLang] || guaranteesData.en;

  return (
    <section className="py-20 bg-gradient-to-b from-[#080c0b] via-[#0c3530]/40 to-[#080c0b] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
            {t.guarantees.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            {t.guarantees.title}
          </h2>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
            {t.guarantees.subtitle}
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
                    <CheckCircle2 size={14} className="text-teal-400" /> {t.guarantees.inclusions}
                  </span>
                  <button
                    onClick={() => onOpenBooking(item.title)}
                    className="text-xs text-white font-bold hover:text-teal-300 transition-colors flex items-center gap-1 group-hover:translate-x-1 duration-200 cursor-pointer"
                  >
                    {t.guarantees.enquire} <ArrowRight size={14} />
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
