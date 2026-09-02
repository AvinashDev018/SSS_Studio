"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Globe, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function MultilingualWhatsAppWidget({ whatsappNumber = "916383565425" }) {
  const [isOpen, setIsOpen] = useState(false);
  const { changeLanguage } = useLanguage();

  const startChat = (lang) => {
    let message = "";
    if (lang === "en") {
      message = "Hello SSS Photography Studio! I would like to enquire about your photography packages and date availability.";
    } else if (lang === "ta") {
      message = "வணக்கம் SSS போட்டோகிராபி! உங்கள் புகைப்பட சேவைகள் மற்றும் கட்டண விவரங்களை அறிய விரும்புகிறேன்.";
    } else if (lang === "hi") {
      message = "नमस्ते SSS फोटोग्राफी! मैं आपकी फोटोग्राफी सेवाओं और पैकेज के बारे में पूछताछ करना चाहता हूँ।";
    }

    changeLanguage(lang);
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[85]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 bg-[#0d3430] border border-white/10 text-white rounded-3xl p-5 shadow-2xl overflow-hidden backdrop-blur-md"
          >
            {/* Top Glow bar */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide">SSS Studio WhatsApp</h4>
                  <p className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    Online Now (+91 63835 65425)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer focus:outline-none"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-gray-300 text-xs mb-4 leading-relaxed">
              Select your preferred language to start chatting directly on WhatsApp with SSS Studio:
            </p>

            <div className="space-y-2.5">
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startChat("en")}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left px-4 text-xs font-semibold flex justify-between items-center cursor-pointer transition-colors"
              >
                <span>Chat in English</span>
                <span className="text-[10px] text-teal-300 uppercase tracking-widest font-bold font-mono">
                  EN
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startChat("ta")}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left px-4 text-xs font-semibold flex justify-between items-center cursor-pointer transition-colors"
              >
                <div className="flex flex-col">
                  <span>தமிழில் உரையாட (Tamil)</span>
                  <span className="text-[10px] text-emerald-400 font-normal">வணக்கம்! உங்கள் கேள்விகளை கேளுங்கள்</span>
                </div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold font-mono">
                  தமிழ்
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startChat("hi")}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left px-4 text-xs font-semibold flex justify-between items-center cursor-pointer transition-colors"
              >
                <div className="flex flex-col">
                  <span>हिंदी में चैट करें (Hindi)</span>
                  <span className="text-[10px] text-amber-400 font-normal">नमस्ते! हमसे बात करें</span>
                </div>
                <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold font-mono">
                  हिंदी
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Main Button & Quick Badge */}
      <div className="flex items-center gap-3">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#0c3530]/90 backdrop-blur-md border border-emerald-500/30 text-white rounded-full text-xs font-semibold shadow-xl cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chat in 3 Languages</span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          suppressHydrationWarning
          className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] cursor-pointer focus:outline-none relative group shrink-0"
          aria-label="Open WhatsApp Chat in 3 Languages"
        >
          <div className="absolute inset-0 rounded-full border border-emerald-300/40 animate-ping opacity-30" />
          <MessageCircle size={28} className="fill-white text-transparent group-hover:scale-110 transition-transform" />
          
          <span className="absolute -top-1 -right-1 bg-emerald-400 text-[#071f1b] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#080c0b] shadow-sm">
            3
          </span>
        </motion.button>
      </div>
    </div>
  );
}
