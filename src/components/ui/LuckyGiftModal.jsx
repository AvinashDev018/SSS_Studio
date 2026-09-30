"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, X, CheckCircle2, MessageCircle, Copy, Check, Ban } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LAUNCH_OFFER } from "@/lib/launchOffer";
import { getLaunchOfferStatus } from "@/app/actions/promos";

export default function LuckyGiftModal({ isOpen, onClose }) {
  const { currentLang } = useLanguage();
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsRevealed(false);
      setStatus(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const s = await getLaunchOfferStatus();
        if (!cancelled) setStatus(s);
      } catch {
        if (!cancelled) {
          setStatus({
            active: false,
            message: "No offer is currently available.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const offerLive = !!status?.active;
  const expiredMessage = status?.message || "No offer is currently available.";

  const perks = {
    en: {
      tag: "Limited Store Offer — First 20 Only",
      title: "🎁 ₹100 Off Unlocked!",
      sub: "Tap the gift box to reveal your discount for Photo Frames & Birthday Gifts on our website.",
      boxHint: "Tap to Open Gift Box",
      giftTitle: "CONGRATULATIONS! YOU UNLOCKED:",
      giftPerk: `₹${LAUNCH_OFFER.discountInr} OFF on Frames & Birthday Gifts — only for the first ${LAUNCH_OFFER.maxUses} customers who book on the website`,
      promoCode: LAUNCH_OFFER.code,
      whatsappBtn: "Ask on WhatsApp / Use at Checkout",
      expiredTitle: "No offer right now",
      expiredSub: "No offer is currently available. Please check back later or contact SSS Studio on WhatsApp.",
    },
    ta: {
      tag: "முதல் 20 வாடிக்கையாளர்களுக்கு மட்டும்",
      title: "🎁 ₹100 தள்ளுபடி!",
      sub: "ஃப்ரேம் மற்றும் பிறந்தநாள் பரிசு ஆர்டர்களுக்கு தள்ளுபடியைப் பெற பெட்டியைத் தட்டவும்.",
      boxHint: "பரிசை திறக்க தட்டவும்",
      giftTitle: "வாழ்த்துக்கள்! உங்கள் சலுகை:",
      giftPerk: `ஃப்ரேம் & பிறந்தநாள் பரிசுகளுக்கு ₹${LAUNCH_OFFER.discountInr} தள்ளுபடி — இணையதளத்தில் முதல் ${LAUNCH_OFFER.maxUses} பேருக்கு மட்டும்`,
      promoCode: LAUNCH_OFFER.code,
      whatsappBtn: "வாட்ஸ்அப் / Checkout-ல் பயன்படுத்துக",
      expiredTitle: "தற்போது சலுகை இல்லை",
      expiredSub: "No offer is currently available. பின்னர் முயற்சிக்கவும் அல்லது WhatsApp-ல் தொடர்பு கொள்ளவும்.",
    },
    hi: {
      tag: "केवल पहले 20 ग्राहकों के लिए",
      title: "🎁 ₹100 की छूट!",
      sub: "फ्रेम और बर्थडे गिफ्ट ऑर्डर पर छूट पाने के लिए बॉक्स टैप करें।",
      boxHint: "गिफ्ट बॉक्स खोलने के लिए टैप करें",
      giftTitle: "बधाई हो! आपकी ऑफ़र:",
      giftPerk: `फ्रेम और बर्थडे गिफ्ट पर ₹${LAUNCH_OFFER.discountInr} छूट — वेबसाइट पर पहले ${LAUNCH_OFFER.maxUses} ग्राहकों के लिए`,
      promoCode: LAUNCH_OFFER.code,
      whatsappBtn: "WhatsApp / Checkout पर इस्तेमाल करें",
      expiredTitle: "अभी कोई ऑफर नहीं",
      expiredSub: "No offer is currently available. बाद में देखें या WhatsApp पर संपर्क करें।",
    },
  };

  const text = perks[currentLang] || perks.en;

  const handleClaimWhatsApp = () => {
    const msg =
      `🎁 *SSS Studio ₹100 Launch Offer*\n\n` +
      `Promo Code: *${text.promoCode}*\n` +
      `Offer: *₹${LAUNCH_OFFER.discountInr} OFF* on Photo Frames & Birthday Gifts\n` +
      `Limit: First *${LAUNCH_OFFER.maxUses}* website customers\n\n` +
      `I want to use this on my frame / birthday gift order.`;
    const url = `https://wa.me/919865992379?text=${encodeURIComponent(msg)}`;
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
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {loading ? (
            <p className="text-zinc-300 text-sm py-16">Checking offer…</p>
          ) : !offerLive ? (
            <div className="py-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/15 border border-rose-400/40 flex items-center justify-center mb-4">
                <Ban className="text-rose-300" size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">{text.expiredTitle}</h3>
              <p className="text-zinc-300 text-sm font-light max-w-sm mx-auto mb-2">{text.expiredSub}</p>
              <p className="text-rose-300/90 text-xs font-semibold mb-6">{expiredMessage}</p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={13} /> {text.tag}
                {status?.remaining != null && (
                  <span className="text-amber-200/80 normal-case">· {status.remaining} left</span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">{text.title}</h3>
              <p className="text-zinc-300 text-xs sm:text-sm font-light mb-8 max-w-sm mx-auto">{text.sub}</p>

              {!isRevealed ? (
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRevealed(true)}
                  className="relative my-6 mx-auto w-40 h-40 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-1 flex items-center justify-center cursor-pointer shadow-[0_0_40px_rgba(245,158,11,0.5)]"
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

                  <p className="text-[11px] text-zinc-400 mb-3">
                    Apply code <span className="text-teal-300 font-bold">{LAUNCH_OFFER.code}</span> at Frame or Birthday Gift checkout
                  </p>

                  <button
                    onClick={handleClaimWhatsApp}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#071f1b] font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span>{text.whatsappBtn}</span>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
