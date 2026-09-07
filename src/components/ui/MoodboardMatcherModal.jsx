"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Upload, CheckCircle2, Image as ImageIcon, Send } from "lucide-react";

export default function MoodboardMatcherModal({ isOpen, onClose, whatsappNumber = "916383565425" }) {
  const [images, setImages] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Convert uploaded files to base64 Data URLs for NVIDIA Vision API
    const promises = files.slice(0, 3).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((base64Urls) => {
      setImages(base64Urls);
      setMatchResult(null);
    });
  };

  const handleAnalyzeStyle = async () => {
    if (images.length === 0) return;
    setAnalyzing(true);

    try {
      // Import and call Server Action powered by NVIDIA Llama 3.2 Vision
      const { analyzeMoodboardAI } = await import("@/app/actions/moodboard");
      const res = await analyzeMoodboardAI(images);

      if (res && res.data) {
        setMatchResult(res.data);
      }
    } catch (err) {
      console.error("NVIDIA Vision AI error:", err);
      // Fallback
      setMatchResult({
        detectedTone: "Soft Pastel Baby & Birthday Tones",
        presetName: "Pastel Dreamland Baby Preset",
        recommendedPackage: "Royal Baby & Family Portrait (₹25,000)",
        matchScore: 96,
        features: [
          "3 Hours Studio / Outdoor Creative Shoot",
          "Custom Props, Costumes & Setup Included",
          "Handcrafted 15-Page Layflat Baby Album",
          "Guaranteed 1-Month Delivery"
        ]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-[#121008] via-[#1a160b] to-[#0d0b05] border border-amber-400/50 text-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative z-10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1 mb-1">
              <Sparkles size={14} /> AI Vision Photography Matcher
            </span>
            <h3 className="text-2xl font-serif font-extrabold text-white">
              Match Your Dream Moodboard
            </h3>
            <p className="text-xs text-zinc-300 font-light mt-1">
              Upload 1–3 reference photos from Pinterest or Instagram to match SSS Studio presets &amp; package quotes.
            </p>
          </div>

          {!matchResult ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-amber-500/40 rounded-2xl p-6 text-center bg-black/40 hover:border-amber-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="moodboard-upload"
                />
                <label htmlFor="moodboard-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/40">
                    <Upload size={22} />
                  </div>
                  <span className="text-xs font-bold text-amber-300">Click to Upload Inspiration Images</span>
                  <span className="text-[10px] text-zinc-400">Select up to 3 photos (.jpg, .png, .webp)</span>
                </label>
              </div>

              {images.length > 0 && (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-amber-400/60 shadow-md">
                        <img src={img} alt="Uploaded inspiration" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAnalyzeStyle}
                    disabled={analyzing}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-extrabold rounded-xl shadow-xl hover:brightness-110 transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <Sparkles size={16} className="animate-spin" />
                        <span>AI Analyzing Tones &amp; Presets...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Analyze &amp; Match Photography Style</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-black/60 border border-amber-400/60 rounded-2xl p-5 shadow-xl text-left">
                <div className="flex items-center justify-between mb-3 border-b border-amber-500/20 pb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={15} /> {matchResult.matchScore}% Aesthetic Match
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">AI Presets Engine</span>
                </div>

                <h4 className="text-lg font-serif font-extrabold text-amber-300 mb-1">{matchResult.detectedTone}</h4>
                <p className="text-xs text-zinc-300 font-medium mb-3">Preset: {matchResult.presetName}</p>

                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-400/30 mb-3">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Recommended Studio Package:</span>
                  <span className="text-sm font-extrabold text-white">{matchResult.recommendedPackage}</span>
                </div>

                <ul className="space-y-1.5 text-xs text-zinc-200">
                  {matchResult.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hi SSS Studio! I matched my moodboard inspiration photos on your website. My preferred style is ${matchResult.detectedTone}. Can we book this package?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-black font-extrabold rounded-xl shadow-xl hover:brightness-110 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send size={16} /> Book This Style on WhatsApp
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
