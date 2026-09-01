"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Heart, Baby, Cake, Sparkles, Video, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSServices({ onOpenBooking }) {
  const { t, currentLang } = useLanguage();

  const servicesData = {
    en: [
      {
        id: "wedding",
        title: "Wedding Photography & Rituals",
        category: "Wedding & Event Photo Shoot",
        icon: Heart,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
        description: "Full multi-day coverage covering Muhurtham, Sangeet, Mehendi, Haldi, and grand Receptions.",
        features: ["Traditional & Candid Specialists", "Ultra HD Raw Capture", "Full High-Res Gallery", "20-Day Flush Mount Album"],
      },
      {
        id: "pre-wedding",
        title: "Pre & Post-Wedding Outdoor Shoots",
        category: "Pre-Wedding & Post Wedding Shoot",
        icon: Camera,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504211/tqb10uvuzmqdkuxyqmps.jpg",
        description: "Romantic cinematic concepts across hills, beaches, heritage palaces, and studio backdrops.",
        features: ["Creative Concept Direction", "Sunset & Scenic Highlights", "Outfit Styling Suggestions", "Signature Cinematic Teaser"],
      },
      {
        id: "maternity",
        title: "Maternity & Newborn Milestones",
        category: "Maternity Photo Shoot",
        icon: Baby,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505577/iqimm503wxxauaksjjzt.jpg",
        description: "Gentle, comfortable maternity portraiture and safe, cozy newborn wraps with sanitized studio props.",
        features: ["Sanitized Props & Wraps", "Custom Maternity Gowns", "Gentle Temperature Lighting", "Fine Art Wall Canvas"],
      },
      {
        id: "birthday",
        title: "Birthdays & Family Celebrations",
        category: "Birthday Shoot",
        icon: Cake,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505207/rm2cysblt45dofw4myda.jpg",
        description: "Capture the fun, laughter, and high spirits of milestone birthdays, anniversaries, and family get-togethers.",
        features: ["Cake Smash Setups", "Fast-Action Candid Moments", "Instant Highlight Reel", "Customized Photo Books"],
      },
      {
        id: "makeup",
        title: "Bridal HD Makeup & Saree Draping",
        category: "Makeup Artist Available",
        icon: Sparkles,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504214/eill2s5uvoq7wwabeunx.jpg",
        description: "In-house luxury bridal makeover studio with certified artists using premium international cosmetic brands.",
        features: ["HD & Airbrush Makeup", "Traditional & Modern Hairstyle", "Box Pleat Saree Draping", "On-Venue Bridal Trials"],
      },
      {
        id: "cinematic",
        title: "Cinematic Wedding Films & Teasers",
        category: "Cinematic Wedding Shoot",
        icon: Video,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504208/iydxdch0gcdo1vuea56q.jpg",
        description: "Documentary-style story films with cinema cameras, emotional vows, audio design, and signature color grading.",
        features: ["10-bit Color Grading", "Licensed Cinematic Soundtrack", "1-Min Instagram Teasers", "Full Multi-Cam Event Cut"],
      },
    ],
    ta: [
      {
        id: "wedding",
        title: "திருமண புகைப்படம் & சடங்குகள்",
        category: "Wedding & Event Photo Shoot",
        icon: Heart,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
        description: "முகூர்த்தம், சங்கீத், மெஹந்தி, மற்றும் வரவேற்பு நிகழ்ச்சிகளுக்கான முழுமையான புகைப்படம்.",
        features: ["கேண்டிட் புகைப்பட நிபுணர்கள்", "அல்ட்ரா HD தரம்", "முழு புகைப்பட தொகுப்பு", "20 நாட்களில் பிரீமியம் ஆல்பம்"],
      },
      {
        id: "pre-wedding",
        title: "ப்ரீ & போஸ்ட் வெடிங் அவுட்டோர் ஷூட்",
        category: "Pre-Wedding & Post Wedding Shoot",
        icon: Camera,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504211/tqb10uvuzmqdkuxyqmps.jpg",
        description: "இயற்கை எழில் கொஞ்சும் இடங்களில் சினிமா பாணியிலான காதல் புகைப்படங்கள்.",
        features: ["கருத்துரு வழிகாட்டுதல்", "அழகிய பின்னணி காட்சிகள்", "ஆடை வடிவமைப்பு பரிந்துரைகள்", "சினிமா டீசர்"],
      },
      {
        id: "maternity",
        title: "மெட்டர்னிட்டி & குழந்தை போட்டோஷூட்",
        category: "Maternity Photo Shoot",
        icon: Baby,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505577/iqimm503wxxauaksjjzt.jpg",
        description: "பாதுகாப்பான மற்றும் வசதியான ஸ்டுடியோ சூழலில் அழகான தாய்மை & குழந்தை புகைப்படங்கள்.",
        features: ["சுத்திகரிக்கப்பட்ட உபகரணங்கள்", "பிரத்யேக ஆடைகள்", "மிதமான வெளிச்சம்", "ஃபைன் ஆர்ட் கேன்வாஸ்"],
      },
      {
        id: "birthday",
        title: "பிறந்தநாள் & குடும்ப கொண்டாட்டங்கள்",
        category: "Birthday Shoot",
        icon: Cake,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505207/rm2cysblt45dofw4myda.jpg",
        description: "பிறந்தநாள் மற்றும் குடும்ப விழாக்களின் மகிழ்ச்சியான தருணங்களை படம்பிடியுங்கள்.",
        features: ["கேக் ஸ்மாஷ் செட்டப்", "இயல்பான தருணங்கள்", "விரைவு வீடியோ ரீல்", "தனிப்பயன் போட்டோ புக்"],
      },
      {
        id: "makeup",
        title: "பிரைடல் HD மேக்கப் & புடவை கட்டுதல்",
        category: "Makeup Artist Available",
        icon: Sparkles,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504214/eill2s5uvoq7wwabeunx.jpg",
        description: "சர்வதேச பிராண்டுகளுடன் கூடிய சொகுசு பிரைடல் மேக்கப் ஸ்டுடியோ.",
        features: ["HD & ஏர்பிரஷ் மேக்கப்", "பாரம்பரிய & நவீன சிகை அலங்காரம்", "பாக்ஸ் ப்ளீட் புடவை கட்டுதல்", "நேரடி டிரயல்ஸ்"],
      },
      {
        id: "cinematic",
        title: "சினிமாட்டிக் திருமண திரைப்படங்கள்",
        category: "Cinematic Wedding Shoot",
        icon: Video,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504208/iydxdch0gcdo1vuea56q.jpg",
        description: "உணர்வுபூர்வமான கதையுடன் கூடிய முழு நீள திருமண சினிமா திரைப்படங்கள்.",
        features: ["10-பிட் கலர் கிரேடிங்", "சினிமா இசை பின்னணி", "1 நிமிட இன்ஸ்டா டீசர்கள்", "முழு நீள வீடியோ"],
      },
    ],
    hi: [
      {
        id: "wedding",
        title: "वेडिंग फोटोग्राफी और रस्में",
        category: "Wedding & Event Photo Shoot",
        icon: Heart,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
        description: "मुहूर्त, संगीत, मेहंदी, हल्दी और भव्य रिसेप्शन का संपूर्ण कवरेज।",
        features: ["कैंडिड और ट्रेडिशनल विशेषज्ञ", "अल्ट्रा HD रॉ कैप्चर", "फुल हाई-रेस गैलरी", "20 दिनों में फ्लश माउंट एल्बम"],
      },
      {
        id: "pre-wedding",
        title: "प्री और पोस्ट वेडिंग आउटडोर शूट",
        category: "Pre-Wedding & Post Wedding Shoot",
        icon: Camera,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504211/tqb10uvuzmqdkuxyqmps.jpg",
        description: "हिल्स, समुद्र तट और सुंदर महलों में रोमांटिक सिनेमैटिक कॉन्सेप्ट्स।",
        features: ["क्रिएटिव कॉन्सेप्ट डायरेक्शन", "सनसेट और लैंडस्केप हाइलाइट्स", "आउटफ़िट स्टाइलिंग टिप्स", "सिनेमैटिक टीज़र"],
      },
      {
        id: "maternity",
        title: "मातृत्व और न्यूबॉर्न फोटोग्राफी",
        category: "Maternity Photo Shoot",
        icon: Baby,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505577/iqimm503wxxauaksjjzt.jpg",
        description: "सुरक्षित और आरामदायक वातावरण में यादगार मातृत्व और न्यूबॉर्न पोर्ट्रेट्स।",
        features: ["सैनिटाइज्ड प्रॉप्स और रैप्स", "कस्टम मैटरनिटी गाउन", "सॉफ्ट लाइटिंग सेटअप", "फाइन आर्ट कैनवास"],
      },
      {
        id: "birthday",
        title: "जन्मदिन और पारिवारिक उत्सव",
        category: "Birthday Shoot",
        icon: Cake,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505207/rm2cysblt45dofw4myda.jpg",
        description: "मील के पत्थर जन्मदिन और पारिवारिक मिलन समारोहों की हंसी और खुशी को कैद करें।",
        features: ["केक स्मैश सेटअप्स", "फास्ट एक्शन कैंडिड पलों", "इंस्टेंट हाइलाइट रील", "कस्टमाइज्ड फोटो बुक्स"],
      },
      {
        id: "makeup",
        title: "ब्राइडल HD मेकअप और साड़ी ड्रेपिंग",
        category: "Makeup Artist Available",
        icon: Sparkles,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504214/eill2s5uvoq7wwabeunx.jpg",
        description: "प्रीमियम इंटरनेशनल ब्रांड्स के साथ इन-हाउस लक्जरी ब्राइडल मेकओवर स्टूडियो।",
        features: ["HD और एयरब्रश मेकअप", "ट्रेडिशनल और मॉडर्न हेयरस्टाइल", "परफेक्ट साड़ी ड्रेपिंग", "वेन्यू पर ब्राइडल ट्रायल्स"],
      },
      {
        id: "cinematic",
        title: "सिनेमैटिक वेडिंग फिल्म्स और टीज़र्स",
        category: "Cinematic Wedding Shoot",
        icon: Video,
        image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504208/iydxdch0gcdo1vuea56q.jpg",
        description: "सिनेमा कैमरों, भावनात्मक क्षणों और सिग्नेचर कलर ग्रेडिंग के साथ डॉक्यूमेंट्री स्टाइल फिल्में।",
        features: ["10-बिट कलर ग्रेडिंग", "लाइसेंस्ड सिनेमैटिक साउंडट्रैक", "1-मिनट इंस्टाग्राम टीज़र्स", "फुल इवेंट मूवी कट"],
      },
    ]
  };

  const services = servicesData[currentLang] || servicesData.en;

  return (
    <section id="services" className="py-24 bg-[#0a100e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
            {t.services.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            {t.services.title}
          </h2>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-[#0c3530]/40 backdrop-blur-xl border border-teal-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-teal-400/50 transition-all duration-300"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c3530] via-[#0c3530]/40 to-transparent" />
                    
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-teal-300">
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold font-serif text-white mb-2 group-hover:text-teal-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check size={14} className="text-teal-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onOpenBooking(service.category)}
                    className="w-full py-3 bg-white/5 hover:bg-gradient-to-r hover:from-teal-400 hover:to-emerald-400 hover:text-[#071f1b] border border-white/10 hover:border-transparent text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer group-hover:shadow-lg group-hover:shadow-teal-500/20"
                  >
                    {t.services.bookBtn} <ArrowRight size={14} />
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
