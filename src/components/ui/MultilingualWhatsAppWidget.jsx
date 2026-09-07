"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Globe, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function MultilingualWhatsAppWidget({ whatsappNumber = "916383565425" }) {
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
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
    setIsWhatsAppModalOpen(false);
    setIsSpeedDialOpen(false);
  };

  const handleOpenAi = () => {
    setIsAiChatOpen(true);
    setIsWhatsAppModalOpen(false);
    setIsSpeedDialOpen(false);
  };

  const handleOpenWhatsApp = () => {
    setIsWhatsAppModalOpen(true);
    setIsAiChatOpen(false);
    setIsSpeedDialOpen(false);
  };

  return (
    <>
      {/* Controlled AI Chatbot Window */}
      {isAiChatOpen && (
        <ChatbotWidget
          forcedOpen={isAiChatOpen}
          onClose={() => setIsAiChatOpen(false)}
        />
      )}

      {/* Multilingual WhatsApp Popup */}
      <AnimatePresence>
        {isWhatsAppModalOpen && (
          <div className="fixed bottom-24 right-4 sm:right-6 z-[95]">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              className="w-80 bg-[#071a17]/95 border border-emerald-500/40 text-white rounded-3xl p-5 shadow-2xl overflow-hidden backdrop-blur-xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400" />
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white">SSS WhatsApp Concierge</h4>
                    <p className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      Online Now (+91 63835 65425)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWhatsAppModalOpen(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <p className="text-zinc-300 text-xs mb-4 font-light leading-relaxed">
                Select your preferred language to connect directly with SSS Studio:
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => startChat("en")}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 text-xs font-semibold flex justify-between items-center cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <span>Chat in English</span>
                  <span className="text-[10px] text-teal-300 font-bold font-mono uppercase">EN</span>
                </button>

                <button
                  onClick={() => startChat("ta")}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 text-xs font-semibold flex justify-between items-center cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex flex-col text-left">
                    <span>தமிழில் உரையாட (Tamil)</span>
                    <span className="text-[9px] text-emerald-400 font-normal">வணக்கம்! உங்கள் கேள்விகளை கேளுங்கள்</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold font-mono">தமிழ்</span>
                </button>

                <button
                  onClick={() => startChat("hi")}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 text-xs font-semibold flex justify-between items-center cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex flex-col text-left">
                    <span>हिंदी में चैट करें (Hindi)</span>
                    <span className="text-[9px] text-amber-400 font-normal">नमस्ते! हमसे बात करें</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold font-mono">हिंदी</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Master Unified Luxury Floating Button */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[90] flex flex-col items-end">
        <AnimatePresence>
          {isSpeedDialOpen && !isAiChatOpen && !isWhatsAppModalOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2.5 mb-3 items-end"
            >
              {/* Option 1: AI Concierge */}
              <motion.button
                whileHover={{ scale: 1.03, x: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenAi}
                className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[#14120c] via-[#1f1a0e] to-[#0e0c06] border border-amber-400/60 text-white rounded-full shadow-2xl backdrop-blur-xl group cursor-pointer"
              >
                <span className="text-xs font-extrabold text-amber-300 group-hover:text-amber-200">
                  Ask Studio AI Concierge
                </span>
                <span className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold shadow-md">
                  <Sparkles size={16} />
                </span>
              </motion.button>

              {/* Option 2: WhatsApp Chat */}
              <motion.button
                whileHover={{ scale: 1.03, x: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[#071c18] via-[#0b2b25] to-[#051410] border border-emerald-400/60 text-white rounded-full shadow-2xl backdrop-blur-xl group cursor-pointer"
              >
                <span className="text-xs font-extrabold text-emerald-300 group-hover:text-emerald-200">
                  Chat on WhatsApp (3 Languages)
                </span>
                <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md relative">
                  <MessageCircle size={16} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black text-[9px] font-black rounded-full flex items-center justify-center border border-black">
                    3
                  </span>
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          {!isSpeedDialOpen && !isAiChatOpen && !isWhatsAppModalOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsSpeedDialOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0e0c06]/90 backdrop-blur-md border border-amber-400/50 text-amber-300 rounded-full text-xs font-black shadow-xl cursor-pointer hover:bg-black transition-all hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Studio Assistance &amp; AI</span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isAiChatOpen) {
                setIsAiChatOpen(false);
              } else if (isWhatsAppModalOpen) {
                setIsWhatsAppModalOpen(false);
              } else {
                setIsSpeedDialOpen(!isSpeedDialOpen);
              }
            }}
            aria-label="Toggle Studio Floating Assistance Menu"
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border cursor-pointer relative ${
              isAiChatOpen || isWhatsAppModalOpen || isSpeedDialOpen
                ? "bg-red-500 border-red-400 text-white rotate-90 shadow-red-500/40"
                : "bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-amber-300 text-black shadow-amber-500/30 hover:shadow-amber-500/50"
            }`}
          >
            {isAiChatOpen || isWhatsAppModalOpen || isSpeedDialOpen ? (
              <X size={24} />
            ) : (
              <>
                <div className="absolute inset-0 rounded-full border border-amber-300/50 animate-ping opacity-30" />
                <Sparkles size={26} className="text-black font-bold fill-black" />
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-black shadow-sm">
                  AI
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}
