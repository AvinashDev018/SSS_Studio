"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Heart, Baby, Cake, GraduationCap, ImageIcon, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSServices({ onOpenBooking }) {
  const { t, currentLang } = useLanguage();

  const servicesData = {
    en: [
      {
        id: "wedding",
        title: "Wedding & Event Photo Shoot",
        category: "Wedding & Event Photo Shoot",
        icon: Heart,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
        description: "Capturing the raw emotions, rituals, and joy of your weddings and events with high-end cinema cameras and candid storytelling.",
        features: ["Traditional & Candid Specialists", "Ultra HD Raw Capture", "Full High-Res Gallery", "1-Month Flush Mount Album"],
      },
      {
        id: "pre-wedding",
        title: "Pre-Wedding & Post Wedding Shoot",
        category: "Pre-Wedding & Post Wedding Shoot",
        icon: Camera,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284637/sss-services/hzsoecylmq8xfbzr9alp.jpg",
        description: "Intimate and beautifully directed couple portrait sessions at handpicked, scenic outdoor locations with cinematic color grading.",
        features: ["Creative Concept Direction", "Sunset & Scenic Highlights", "Outfit Styling Suggestions", "Signature Cinematic Teaser"],
      },
      {
        id: "birthday",
        title: "Birthday Shoot",
        category: "Birthday Shoot",
        icon: Cake,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284491/sss-services/zgbqvivzedgff47zs7p0.jpg",
        description: "Vibrant, fun, and memorable captures of your birthday celebrations, preserving moments of laughter and togetherness.",
        features: ["Cake Smash Setups", "Fast-Action Candid Moments", "Instant Highlight Reel", "Customized Photo Books"],
      },
      {
        id: "school-events",
        title: "School / College Events",
        category: "School / College Events",
        icon: GraduationCap,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284858/sss-services/wtlbwbusml7zldckkbfa.jpg",
        description: "Professional event coverage for institutional functions, graduation days, annual days, and campus celebrations.",
        features: ["Group & Individual Portraits", "Stage & Event Coverage", "Same-Day Highlight Reels", "Digital Album Delivery"],
      },
      {
        id: "baby",
        title: "Baby Photo Shoot",
        category: "Baby Photo Shoot",
        icon: Baby,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284860/sss-services/b9vmmrirqbnm97cnvyc8.jpg",
        description: "Safe, creative, and gentle photography for your little ones — from newborn wraps to toddler milestone sessions.",
        features: ["Sanitized Props & Wraps", "Gentle Newborn Posing", "Milestone Themes (3M, 6M, 1Y)", "Fine-Art Canvas Prints"],
      },
      {
        id: "maternity",
        title: "Maternity Photo Shoot",
        category: "Maternity Photo Shoot",
        icon: ImageIcon,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284638/sss-services/mzkt2cvn9ly6y96legk8.jpg",
        description: "Celebrating the incredible journey of motherhood with graceful, elegant, and emotionally rich maternity portraits.",
        features: ["Custom Maternity Gowns", "Indoor & Outdoor Setups", "Couple Maternity Poses", "Fine-Art Wall Canvas"],
      },
    ],
    ta: [
      {
        id: "wedding",
        title: "திருமண & நிகழ்வு போட்டோ ஷூட்",
        category: "Wedding & Event Photo Shoot",
        icon: Heart,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
        description: "உயர்தர சினிமா கேமராக்கள் மற்றும் கேண்டிட் ஸ்டோரிடெல்லிங் மூலம் திருமண உணர்வுகளை படம்பிடிக்கிறோம்.",
        features: ["கேண்டிட் புகைப்பட நிபுணர்கள்", "அல்ட்ரா HD தரம்", "முழு புகைப்பட தொகுப்பு", "1 மாதத்தில் பிரீமியம் ஆல்பம்"],
      },
      {
        id: "pre-wedding",
        title: "ப்ரீ & போஸ்ட் வெடிங் ஷூட்",
        category: "Pre-Wedding & Post Wedding Shoot",
        icon: Camera,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284637/sss-services/hzsoecylmq8xfbzr9alp.jpg",
        description: "இயற்கை எழில் கொஞ்சும் இடங்களில் சினிமா பாணியிலான காதல் ஜோடி புகைப்படங்கள்.",
        features: ["கருத்துரு வழிகாட்டுதல்", "அழகிய பின்னணி காட்சிகள்", "ஆடை வடிவமைப்பு பரிந்துரைகள்", "சினிமா டீசர்"],
      },
      {
        id: "birthday",
        title: "பிறந்தநாள் ஷூட்",
        category: "Birthday Shoot",
        icon: Cake,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284491/sss-services/zgbqvivzedgff47zs7p0.jpg",
        description: "பிறந்தநாள் கொண்டாட்டங்களின் மகிழ்ச்சியான தருணங்களை உயிரோட்டமாக படம்பிடியுங்கள்.",
        features: ["கேக் ஸ்மாஷ் செட்டப்", "இயல்பான தருணங்கள்", "விரைவு வீடியோ ரீல்", "தனிப்பயன் போட்டோ புக்"],
      },
      {
        id: "school-events",
        title: "பள்ளி / கல்லூரி நிகழ்வுகள்",
        category: "School / College Events",
        icon: GraduationCap,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284858/sss-services/wtlbwbusml7zldckkbfa.jpg",
        description: "பட்டமளிப்பு விழா, ஆண்டு விழா மற்றும் கல்வி நிறுவன நிகழ்வுகளுக்கான தொழில்முறை புகைப்படம்.",
        features: ["குழு & தனிப்பட்ட போட்ரெய்ட்", "மேடை நிகழ்வு கவரேஜ்", "அதே நாள் ஹைலைட் ரீல்", "டிஜிட்டல் ஆல்பம் டெலிவரி"],
      },
      {
        id: "baby",
        title: "குழந்தை போட்டோ ஷூட்",
        category: "Baby Photo Shoot",
        icon: Baby,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284860/sss-services/b9vmmrirqbnm97cnvyc8.jpg",
        description: "பாதுகாப்பான மற்றும் படைப்பாற்றல் மிக்க குழந்தை புகைப்படம் — நியூபார்ன் முதல் மைல்கல் வரை.",
        features: ["சுத்திகரிக்கப்பட்ட உபகரணங்கள்", "மென்மையான போஸிங்", "மைல்கல் தீம்கள் (3M, 6M, 1Y)", "ஃபைன் ஆர்ட் கேன்வாஸ்"],
      },
      {
        id: "maternity",
        title: "மெட்டர்னிட்டி போட்டோ ஷூட்",
        category: "Maternity Photo Shoot",
        icon: ImageIcon,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284638/sss-services/mzkt2cvn9ly6y96legk8.jpg",
        description: "தாய்மையின் அழகான பயணத்தை நேர்த்தியான மற்றும் உணர்வுபூர்வமான போட்ரெய்ட்களாக படம்பிடிக்கிறோம்.",
        features: ["பிரத்யேக மெட்டர்னிட்டி ஆடைகள்", "உள்ளகம் & வெளிப்புற செட்டப்", "ஜோடி மெட்டர்னிட்டி போஸ்", "ஃபைன் ஆர்ட் கேன்வாஸ்"],
      },
    ],
    hi: [
      {
        id: "wedding",
        title: "वेडिंग & इवेंट फोटो शूट",
        category: "Wedding & Event Photo Shoot",
        icon: Heart,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
        description: "हाई-एंड सिनेमा कैमरों और कैंडिड स्टोरीटेलिंग से शादी की भावनाओं और खुशियों को कैद करना।",
        features: ["कैंडिड और ट्रेडिशनल विशेषज्ञ", "अल्ट्रा HD रॉ कैप्चर", "फुल हाई-रेस गैलरी", "1 महीने में फ्लश माउंट एल्बम"],
      },
      {
        id: "pre-wedding",
        title: "प्री & पोस्ट वेडिंग शूट",
        category: "Pre-Wedding & Post Wedding Shoot",
        icon: Camera,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284637/sss-services/hzsoecylmq8xfbzr9alp.jpg",
        description: "खूबसूरत आउटडोर लोकेशन में सिनेमैटिक कलर ग्रेडिंग के साथ कपल पोर्ट्रेट सेशन।",
        features: ["क्रिएटिव कॉन्सेप्ट डायरेक्शन", "सनसेट और लैंडस्केप हाइलाइट्स", "आउटफ़िट स्टाइलिंग टिप्स", "सिनेमैटिक टीज़र"],
      },
      {
        id: "birthday",
        title: "बर्थडे शूट",
        category: "Birthday Shoot",
        icon: Cake,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284491/sss-services/zgbqvivzedgff47zs7p0.jpg",
        description: "जन्मदिन समारोहों की जीवंत, मज़ेदार और यादगार तस्वीरें — हंसी और एकजुटता के पलों को सहेजना।",
        features: ["केक स्मैश सेटअप्स", "फास्ट एक्शन कैंडिड मोमेंट्स", "इंस्टेंट हाइलाइट रील", "कस्टमाइज्ड फोटो बुक्स"],
      },
      {
        id: "school-events",
        title: "स्कूल / कॉलेज इवेंट्स",
        category: "School / College Events",
        icon: GraduationCap,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284858/sss-services/wtlbwbusml7zldckkbfa.jpg",
        description: "ग्रेजुएशन डे, वार्षिक दिवस और कैंपस इवेंट्स के लिए प्रोफेशनल इवेंट फोटोग्राफी।",
        features: ["ग्रुप और इंडिविजुअल पोर्ट्रेट", "स्टेज और इवेंट कवरेज", "सेम-डे हाइलाइट रील", "डिजिटल एल्बम डिलीवरी"],
      },
      {
        id: "baby",
        title: "बेबी फोटो शूट",
        category: "Baby Photo Shoot",
        icon: Baby,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284860/sss-services/b9vmmrirqbnm97cnvyc8.jpg",
        description: "सुरक्षित, क्रिएटिव और कोमल फोटोग्राफी — न्यूबॉर्न रैप्स से लेकर टॉडलर माइलस्टोन सेशन तक।",
        features: ["सैनिटाइज्ड प्रॉप्स और रैप्स", "जेंटल न्यूबॉर्न पोज़िंग", "माइलस्टोन थीम्स (3M, 6M, 1Y)", "फाइन-आर्ट कैनवास प्रिंट्स"],
      },
      {
        id: "maternity",
        title: "मैटरनिटी फोटो शूट",
        category: "Maternity Photo Shoot",
        icon: ImageIcon,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788284638/sss-services/mzkt2cvn9ly6y96legk8.jpg",
        description: "मातृत्व की अविश्वसनीय यात्रा को सुंदर, भावपूर्ण और शानदार मैटरनिटी पोर्ट्रेट्स से सेलिब्रेट करना।",
        features: ["कस्टम मैटरनिटी गाउन", "इंडोर और आउटडोर सेटअप", "कपल मैटरनिटी पोज़", "फाइन आर्ट वॉल कैनवास"],
      },
    ]
  };

  const [activeCategory, setActiveCategory] = useState("all");
  const services = servicesData[currentLang] || servicesData.en;

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(s => s.category.toLowerCase().includes(activeCategory));

  const filterTabs = [
    { id: "all", label: "All 6 Services" },
    { id: "wedding", label: "Weddings" },
    { id: "pre-wedding", label: "Pre / Post Wedding" },
    { id: "baby", label: "Baby & Maternity" },
    { id: "event", label: "Events & College" },
  ];

  return (
    <section id="services" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5">
      {/* Background ambient subtle warm lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[#c5a880] text-xs font-semibold uppercase tracking-widest mb-3">
            {t.services.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-white mb-4">
            {t.services.title}
          </h2>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
            {t.services.subtitle}
          </p>

          {/* Animated Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md max-w-fit mx-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === tab.id
                    ? "text-black bg-[#c5a880] font-semibold shadow-md"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                layout
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="opacity-100 bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-[#c5a880]/40 transition-all duration-300"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-black/40">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent" />
                    
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#c5a880] shadow-xl group-hover:scale-105 transition-all duration-300">
                      <Icon size={18} />
                    </div>

                    {idx === 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#c5a880] text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        ★ MOST POPULAR
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-serif font-normal text-white mb-2 group-hover:text-[#c5a880] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-light">
                      {service.description}
                    </p>

                    <div className="space-y-2.5 mb-6">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <span className="w-4 h-4 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onOpenBooking(service.category)}
                    className="w-full py-3 bg-white/[0.04] hover:bg-[#c5a880] text-zinc-200 hover:text-black border border-white/10 hover:border-[#c5a880] font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    <span>{t.services.bookBtn}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
