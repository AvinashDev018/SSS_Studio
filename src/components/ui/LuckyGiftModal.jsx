"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, X, CheckCircle2, MessageCircle, Copy, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LuckyGiftModal({ isOpen, onClose }) {
  const { currentLang } = useLanguage();
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const perks = {
    en: {
      tag: "Limited Wedding Season Offer",
      title: "🎁 Surprise Wedding Gift Box!",
      sub: "Click the glowing gift box below to reveal your exclusive studio perk for 2026-27 bookings.",
      boxHint: "Tap to Open Gift Box",
      giftTitle: "CONGRATULATIONS! YOU UNLOCKED:",
      giftPerk: "FREE 12x18 Fine-Art Acrylic Canvas Wall Frame + Pre-Wedding Teaser",
      promoCode: "SSS-LUCKY2026",
      whatsappBtn: "Claim This Gift on WhatsApp",
    },
    ta: {
      tag: "வரையறுக்கப்பட்ட திருமண சலுகை",
      title: "🎁 சிறப்பு திருமண பரிசு பெட்டி!",
      sub: "உங்கள் 2026-27 முன்பதிவுகளுக்கான பிரத்யேக பரிசைத் திறக்க கீழே உள்ள பெட்டியைத் தட்டவும்.",
      boxHint: "பரிசை திறக்க தட்டவும்",
      giftTitle: "வாழ்த்துக்கள்! உங்கள் பரிசு:",
      giftPerk: "இலவச 12x18 ஃபைன்-ஆர்ட் அக்ரிலிக் கேன்வாஸ் பிரேம் + ப்ரீ-வெடிங் டீசர்",
      promoCode: "SSS-LUCKY2026",
      whatsappBtn: "வாட்ஸ்அப்பில் பரிசைப் பெறுக",
    },
    hi: {
      tag: "सीमित समय का वेडिंग ऑफर",
      title: "🎁 सरप्राइज वेडिंग गिफ्ट बॉक्स!",
      sub: "2026-27 बुकिंग के लिए अपना विशेष स्टूडियो गिफ्ट अनलॉक करने के लिए नीचे दिए गए बॉक्स पर टैप करें।",
      boxHint: "गिफ्ट बॉक्स खोलने के लिए टैप करें",
      giftTitle: "बधाई हो! आपका गिफ्ट:",
      giftPerk: "मुफ़्त 12x18 फाइन-आर्ट ऐक्रेलिक कैनवास वॉल फ्रेम + प्री-वेडिंग टीज़र",
      promoCode: "SSS-LUCKY2026",
      whatsappBtn: "व्हाट्सएप पर गिफ्ट क्लेम करें",
    },
  };

  const text = perks[currentLang] || perks.en;

  const handleClaimWhatsApp = () => {
    const msg = `🎁 *Claiming My SSS Studio Wedding Gift!* 🎁\n\n` +
      `Promo Code: *${text.promoCode}*\n` +
      `Unlocked Perk: *${text.giftPerk}*\n\n` +
      `Please apply this gift perk to my shoot inquiry!`;
    const url = `https://wa.me/916383565425?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    onClose();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(text.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-br from-[#0c3530] via-[#104b43] to-[#08201c] border border-teal-400/40 rounded-3xl p-8 shadow-2xl text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> {text.tag}
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            {text.title}
          </h3>
          <p className="text-zinc-300 text-xs sm:text-sm font-light mb-8 max-w-sm mx-auto">
            {text.sub}
          </p>

          {!isRevealed ? (
            /* Unopened Gift Box Animation */
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRevealed(true)}
              className="relative my-6 mx-auto w-40 h-40 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-1 flex items-center justify-center cursor-pointer shadow-[0_0_40px_rgba(245,158,11,0.5)] group"
            >
              <div className="w-full h-full rounded-[22px] bg-[#071f1b] flex flex-col items-center justify-center p-4">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Gift size={48} className="text-amber-400 mb-2" />
                </motion.div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider text-center">
                  {text.boxHint}
                </span>
              </div>
            </motion.div>
          ) : (
            /* Revealed Perk Card */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="my-6 p-6 rounded-2xl bg-black/40 border border-amber-400/40 shadow-inner"
            >
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 size={16} /> {text.giftTitle}
              </div>
              <p className="text-base sm:text-lg font-serif font-bold text-amber-300 mb-4 leading-snug">
                {text.giftPerk}
              </p>

              {/* Promo Code Pill */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="px-4 py-1.5 rounded-lg bg-white/10 border border-white/20 font-mono font-bold text-sm text-teal-300 tracking-wider">
                  {text.promoCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer flex items-center gap-1"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              <button
                onClick={handleClaimWhatsApp}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#071f1b] font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>{text.whatsappBtn}</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
