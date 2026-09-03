"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Wand2, Upload, Sparkles, X, CheckCircle2, ChevronDown } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AIStylist from "@/components/AIStylist";
import Link from "next/link";

const SHOOT_TYPES = [
  { id: "Wedding", label: "Wedding", emoji: "💍", desc: "Bridal & groom looks" },
  { id: "Portrait", label: "Portrait", emoji: "🎭", desc: "Studio headshots & personal" },
  { id: "Birthday", label: "Birthday", emoji: "🎂", desc: "Celebration & party shoots" },
  { id: "Corporate", label: "Corporate", emoji: "💼", desc: "Business & LinkedIn profiles" },
];

export default function VisualizerPage() {
  const [activeTab, setActiveTab] = useState("stylist"); // "guide" or "stylist"
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [shootType, setShootType] = useState("Portrait");
  const [stylePreference, setStylePreference] = useState("Feminine");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const loadingTexts = [
    "Uploading photo to SSS Studio AI...",
    "Scanning facial structure & skin tone...",
    "Selecting premium palette combinations...",
    "Analyzing style preference config...",
    "Curating custom dress recommendations...",
    "Adding expert photography tips..."
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
            },
            "image/jpeg",
            0.7
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    setResult(null);
    try {
      const compressedFile = await compressImage(image);

      const formData = new FormData();
      formData.append("image", compressedFile);
      formData.append("shootType", shootType);
      formData.append("stylePreference", stylePreference);

      const res = await fetch("/api/visualizer", { method: "POST", body: formData });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        // Fallback if not JSON
        data = { isFallback: true, fallbackReason: "network_error", palette: ["#2C3E50", "#ECF0F1", "#3498DB"], paletteNames: ["Deep Navy", "Soft White", "Sky Blue"], outfitRecommendations: [], hairMakeupTip: "", accessoryTip: "", generalTip: "" };
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ isFallback: true, fallbackReason: "network_error", palette: ["#2C3E50", "#ECF0F1", "#3498DB"], paletteNames: ["Deep Navy", "Soft White", "Sky Blue"], outfitRecommendations: [], hairMakeupTip: "", accessoryTip: "", generalTip: "" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <AnimatedSection className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 text-[#c5a880] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4 text-[#c5a880]" /> AI-Powered Studio Stylist
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-tight mb-4 text-white">
            AI Outfit &amp; Pose Stylist
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Upload your photo, select your shoot theme, and get a personalized outfit palette &amp; pose guide crafted by SSS Studio AI.
          </p>
        </AnimatedSection>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === "guide"
                ? "bg-[#c5a880] text-black shadow-lg"
                : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10"
            }`}
          >
            Outfit &amp; Pose Guide
          </button>
          <button
            onClick={() => setActiveTab("stylist")}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === "stylist"
                ? "bg-[#c5a880] text-black shadow-lg"
                : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10"
            }`}
          >
            Location &amp; Golden Hour Stylist
          </button>
        </div>

        <div style={{ display: activeTab === "stylist" ? "block" : "none" }}>
          <AIStylist />
        </div>

        <div style={{ display: activeTab === "guide" ? "block" : "none" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Upload & Config */}
            <AnimatedSection delay={0.1} className="space-y-6">
              {/* Image Upload Box */}
              <div
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? "border-[#c5a880] bg-[#c5a880]/10"
                    : imagePreview
                    ? "border-white/20 bg-[#121212]"
                    : "border-white/15 hover:border-[#c5a880]/50 bg-[#121212]/50 hover:bg-[#121212]"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-72 object-contain bg-black/40 rounded-2xl" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); setResult(null); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors border border-white/20"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-[#c5a880] text-black text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Photo Loaded
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#c5a880]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-white font-medium text-sm mb-1">Drop your photo here</p>
                    <p className="text-zinc-500 text-xs">or click to select from your device</p>
                    <p className="text-zinc-600 text-[11px] mt-3">JPG, PNG, WEBP • Max 10MB</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

              {/* Style Preference */}
              <div>
                <p className="text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-3">Preferred Outfit Style</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStylePreference("Feminine")}
                    className={`p-3.5 rounded-xl border text-center font-medium transition-all duration-300 text-xs cursor-pointer ${
                      stylePreference === "Feminine"
                        ? "border-[#c5a880] bg-[#c5a880]/15 text-[#c5a880]"
                        : "border-white/10 bg-[#121212] text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    🙋‍♀️ Women's Wear / Feminine
                  </button>
                  <button
                    onClick={() => setStylePreference("Masculine")}
                    className={`p-3.5 rounded-xl border text-center font-medium transition-all duration-300 text-xs cursor-pointer ${
                      stylePreference === "Masculine"
                        ? "border-[#c5a880] bg-[#c5a880]/15 text-[#c5a880]"
                        : "border-white/10 bg-[#121212] text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    🙋‍♂️ Men's Wear / Masculine
                  </button>
                </div>
              </div>

              {/* Shoot Type Selection */}
              <div>
                <p className="text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-3">Select Shoot Theme</p>
                <div className="grid grid-cols-2 gap-3">
                  {SHOOT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setShootType(type.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                        shootType === type.id
                          ? "border-[#c5a880] bg-[#c5a880]/15 shadow-[0_0_20px_rgba(197,168,128,0.15)]"
                          : "border-white/10 bg-[#121212] hover:border-white/25"
                      }`}
                    >
                      <span className="text-2xl mb-1.5 block">{type.emoji}</span>
                      <p className="font-serif font-normal text-white text-sm">{type.label}</p>
                      <p className="text-zinc-400 text-xs font-light">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!image || isLoading}
                className="w-full py-4 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-[#c5a880] hover:bg-[#d4af37] text-black shadow-lg hover:shadow-[0_0_25px_rgba(197,168,128,0.35)] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                    <span>Analyzing skin tone &amp; outfit options...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate AI Style &amp; Pose Guide</span>
                  </>
                )}
              </button>

              <p className="text-zinc-500 text-[11px] text-center font-light">
                🔒 Your photo is analyzed privately in real-time and never stored on public servers.
              </p>
            </AnimatedSection>

            {/* Right: Results Display */}
            <AnimatedSection delay={0.2}>
              {!result && !isLoading && (
                <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/15 bg-[#121212]/40">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 text-[#c5a880]">
                    <Wand2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-white mb-2">Your AI Style Guide Will Appear Here</h3>
                  <p className="text-zinc-400 text-xs max-w-xs font-light leading-relaxed">
                    Upload a clear photo and select your preferred shoot theme on the left to receive a custom color palette, outfit pairings, and pose suggestions.
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-white/10 bg-[#121212]">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-[#c5a880]/20 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-[#c5a880] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                    <div className="absolute inset-2 rounded-full bg-white/[0.03] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#c5a880]" />
                    </div>
                  </div>
                  <p className="text-white font-medium text-sm mb-2">{loadingTexts[loadingStep]}</p>
                  <p className="text-zinc-500 text-xs font-light">Analyzing facial undertones, contrast ratios, and outfit pairings...</p>
                </div>
              )}

              {result && (
                <div className="space-y-5">
                  {/* Color Palette */}
                  <div className="bg-[#121212] border border-white/10 rounded-2xl p-5">
                    <h3 className="font-serif font-normal text-white text-base mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#c5a880]" /> Recommended Color Palette
                    </h3>
                    <div className="flex gap-3">
                      {result.palette?.map((color, i) => (
                        <div key={i} className="flex-1 text-center">
                          <div className="h-12 rounded-xl mb-2 border border-white/10 shadow-inner" style={{ backgroundColor: color }} />
                          <p className="text-[11px] text-zinc-300 font-medium">{result.paletteNames?.[i] || color}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outfit Recommendations */}
                  <div className="bg-[#121212] border border-white/10 rounded-2xl p-5">
                    <h3 className="font-serif font-normal text-white text-base mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#c5a880]" /> Outfit Recommendations
                    </h3>
                    <div className="space-y-3">
                      {result.outfitRecommendations?.map((outfit, i) => (
                        <div key={i} className="bg-white/[0.02] rounded-xl p-4 border border-white/10">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-white text-xs sm:text-sm">{outfit.outfit}</p>
                            <span className="shrink-0 text-[10px] bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30 px-2.5 py-0.5 rounded-full font-medium">Option {i + 1}</span>
                          </div>
                          <p className="text-zinc-400 text-xs mt-1.5 font-light">{outfit.description}</p>
                          <p className="text-[#c5a880] text-xs mt-2 italic font-light">✦ {outfit.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pose Guidance */}
                  <div className="bg-[#121212] border border-white/10 rounded-2xl p-5">
                    <h3 className="font-serif font-normal text-white text-base mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#c5a880]" /> Recommended Studio Poses
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/10">
                        <p className="text-[#c5a880] font-medium text-xs mb-1">Classic Royal Angle</p>
                        <p className="text-zinc-400 text-xs font-light">Shoulders turned 45°, head straight toward lens with relaxed hands.</p>
                      </div>
                      <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/10">
                        <p className="text-[#c5a880] font-medium text-xs mb-1">Candid Soft Profile</p>
                        <p className="text-zinc-400 text-xs font-light">Gaze 30° off-camera toward key light for dramatic shadow contouring.</p>
                      </div>
                    </div>
                  </div>

                  {/* Tips Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-4">
                      <p className="text-[#c5a880] font-medium text-xs uppercase tracking-wider mb-1.5">Hair &amp; Grooming</p>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">{result.hairMakeupTip || "Clean styled locks with matte finish for studio lighting."}</p>
                    </div>
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-4">
                      <p className="text-[#c5a880] font-medium text-xs uppercase tracking-wider mb-1.5">Accessories &amp; Accents</p>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">{result.accessoryTip || "Minimalist gold or silver timepieces to complement tones."}</p>
                    </div>
                  </div>

                  {/* Direct Booking Link */}
                  <Link
                    href="/#contact"
                    className="block w-full text-center py-3.5 rounded-xl bg-[#c5a880] hover:bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(197,168,128,0.35)] transition-all duration-300"
                  >
                    Book Your Studio Session with This Style →
                  </Link>
                </div>
              )}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
