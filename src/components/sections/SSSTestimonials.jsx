"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Quote, PlusCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSTestimonials({ onOpenReviewModal }) {
  const { t, currentLang } = useLanguage();

  const testimonialsData = {
    en: [
      {
        id: 1,
        name: "Anand & Divya",
        role: "Wedding & Muhurtham Shoot",
        rating: 5,
        text: "SSS Studio team made our wedding day absolutely unforgettable. They were extremely punctual, captured all candid rituals without interrupting, and our fine-art album was delivered in just 18 days!",
        date: "Jan 2026",
        location: "Madurai",
      },
      {
        id: 2,
        name: "Karthik & Revathi",
        role: "Maternity & Outdoor Couple Shoot",
        rating: 5,
        text: "A wonderful experience with SSS Studio! The team created such a warm and comfortable environment during our outdoor maternity shoot. The lighting, custom gowns, and color grading were stunning.",
        date: "Feb 2026",
        location: "Kodaikanal",
      },
      {
        id: 3,
        name: "Meera Krishnan",
        role: "Baby 1st Birthday & Cake Smash",
        rating: 5,
        text: "Booked SSS Studio for my baby's 1st birthday. The photos are vibrant, sharp, and captured all the cute joyful smiles. Prompt delivery and very polite crew!",
        date: "Mar 2026",
        location: "Avaniyapuram",
      },
    ],
    ta: [
      {
        id: 1,
        name: "ஆனந்த் & திவ்யா",
        role: "திருமண போட்டோஷூட்",
        rating: 5,
        text: "எங்கள் திருமண நாளை SSS ஸ்டுடியோ மிகவும் மறக்க முடியாததாக மாற்றியது. சரியான நேரத்தில் வந்து அனைத்து சடங்குகளையும் அழகாக படம்பிடித்தனர். 18 நாட்களில் ஆல்பம் கிடைத்தது!",
        date: "ஜனவரி 2026",
        location: "மதுரை",
      },
      {
        id: 2,
        name: "கார்த்திக் & ரேவதி",
        role: "மெட்டர்னிட்டி & அவுட்டோர் ஷூட்",
        rating: 5,
        text: "SSS ஸ்டுடியோவுடன் ஒரு அற்புதமான அனுபவம்! அவுட்டோர் ஷூட்டின் போது மிக சௌகரியமான சூழலை உருவாக்கினர். வண்ண அமைப்பு மற்றும் உடைகள் மிக அருமை.",
        date: "பிப்ரவரி 2026",
        location: "கொடைக்கானல்",
      },
      {
        id: 3,
        name: "மீரா கிருஷ்ணன்",
        role: "குழந்தையின் 1வது பிறந்தநாள்",
        rating: 5,
        text: "என் குழந்தையின் முதல் பிறந்தநாளுக்கு SSS ஸ்டுடியோவை பதிவு செய்தேன். புகைப்படங்கள் மிக தெளிவாகவும் அழகாகவும் உள்ளன. மிகவும் மரியாதையான குழு!",
        date: "மார்ச் 2026",
        location: "அவனியாபுரம்",
      },
    ],
    hi: [
      {
        id: 1,
        name: "आनंद और दिव्या",
        role: "वेडिंग और मुहूर्त शूट",
        rating: 5,
        text: "SSS स्टूडियो टीम ने हमारी शादी को यादगार बना दिया। टीम बहुत समयनिष्ठ थी और केवल 18 दिनों में हमारा एल्बम डिलीवर कर दिया!",
        date: "जनवरी 2026",
        location: "मदुरै",
      },
      {
        id: 2,
        name: "कार्तिक और रेवती",
        role: "मातृत्व और आउटडोर कपल शूट",
        rating: 5,
        text: "SSS स्टूडियो के साथ एक शानदार अनुभव! आउटडोर शूट के दौरान टीम ने बहुत ही आरामदायक माहौल बनाया। लाइटिंग और कलर ग्रेडिंग कमाल की थी।",
        date: "फरवरी 2026",
        location: "कोडाइकनाल",
      },
      {
        id: 3,
        name: "मीरा कृष्णन",
        role: "बेबी 1st बर्थडे शूट",
        rating: 5,
        text: "मेरे बच्चे के पहले जन्मदिन के लिए SSS स्टूडियो बुक किया। तस्वीरें बहुत जीवंत और साफ हैं। समय पर डिलीवरी और बहुत विनम्र क्रू!",
        date: "मार्च 2026",
        location: "अवनियापुरम",
      },
    ]
  };

  const testimonials = testimonialsData[currentLang] || testimonialsData.en;

  return (
    <section id="testimonials" className="py-24 bg-[#060807] relative overflow-hidden border-t border-amber-500/15">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 shadow-lg shadow-amber-500/5">
            <MessageSquare size={14} className="text-amber-400" /> {t.testimonials.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-zinc-300 text-base md:text-lg font-light leading-relaxed mb-8">
            {t.testimonials.subtitle}
          </p>

          <button
            onClick={onOpenReviewModal}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle size={16} /> {t.testimonials.leaveReview}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-b from-[#161208]/80 to-[#0b0a04]/90 backdrop-blur-xl border border-amber-500/25 rounded-3xl p-8 relative flex flex-col justify-between group shadow-xl hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-300 overflow-hidden"
            >
              {/* Shimmer sweep on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div>
                <Quote className="text-4xl text-amber-400/25 mb-4 group-hover:text-amber-400/50 transition-colors" />
                <div className="flex gap-1 text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      size={16}
                      className={`${sIdx < item.rating ? "fill-amber-400 text-amber-400" : "text-gray-600"} group-hover:scale-110 transition-transform`}
                    />
                  ))}
                </div>
                <p className="text-zinc-200 italic text-sm md:text-base leading-relaxed mb-6 font-light">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-center mt-auto">
                <div>
                  <h4 className="font-bold text-white text-sm md:text-base group-hover:text-amber-300 transition-colors">{item.name}</h4>
                  <p className="text-xs text-amber-300 font-semibold mt-0.5">{item.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-zinc-300 block">{item.location}</span>
                  <span className="text-[11px] text-zinc-400">{item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
