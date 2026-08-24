"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Wand2, Upload, Sparkles, X, CheckCircle2, ChevronDown } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";

const SHOOT_TYPES = [
  { id: "Wedding", label: "Wedding", emoji: "💍", desc: "Bridal & groom looks" },
  { id: "Portrait", label: "Portrait", emoji: "🎭", desc: "Studio headshots & personal" },
  { id: "Birthday", label: "Birthday", emoji: "🎂", desc: "Celebration & party shoots" },
  { id: "Corporate", label: "Corporate", emoji: "💼", desc: "Business & LinkedIn profiles" },
];

export default function VisualizerPage() {
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
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" /> AI-Powered Feature
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-violet-600">
            AI Style Consultant
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Upload your photo, choose your shoot type, and get a personalized outfit & styling guide crafted just for you.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Upload & Config */}
          <AnimatedSection delay={0.1} className="space-y-6">
            {/* Image Upload */}
            <div
              className={`relative border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer ${
                isDragging
                  ? "border-cyan-400 bg-cyan-500/10"
                  : imagePreview
                  ? "border-zinc-700 bg-zinc-900/50"
                  : "border-zinc-700 hover:border-cyan-500/50 hover:bg-zinc-900/50 bg-zinc-900/30"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-72 object-contain bg-zinc-900/50 rounded-3xl" />
                  <div className="absolute inset-0 bg-black/20 rounded-3xl" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); setResult(null); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Photo ready
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-7 h-7 text-zinc-400" />
                  </div>
                  <p className="text-zinc-300 font-semibold mb-1">Drop your photo here</p>
                  <p className="text-zinc-500 text-sm">or click to browse</p>
                  <p className="text-zinc-600 text-xs mt-3">JPG, PNG, WEBP • Max 10MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

            {/* Style Preference */}
            <div>
              <p className="text-zinc-300 font-semibold mb-3">Preferred Outfit Style</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStylePreference("Feminine")}
                  className={`p-3 rounded-2xl border text-center font-medium transition-all duration-300 text-sm ${
                    stylePreference === "Feminine"
                      ? "border-cyan-500 bg-cyan-500/10 text-white"
                      : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  🙋‍♀️ Women's Wear / Feminine
                </button>
                <button
                  onClick={() => setStylePreference("Masculine")}
                  className={`p-3 rounded-2xl border text-center font-medium transition-all duration-300 text-sm ${
                    stylePreference === "Masculine"
                      ? "border-cyan-500 bg-cyan-500/10 text-white"
                      : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  🙋‍♂️ Men's Wear / Masculine
                </button>
              </div>
            </div>

            {/* Shoot Type Selection */}
            <div>
              <p className="text-zinc-300 font-semibold mb-3">Select your shoot type</p>
              <div className="grid grid-cols-2 gap-3">
                {SHOOT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setShootType(type.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      shootType === type.id
                        ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{type.emoji}</span>
                    <p className="font-semibold text-white text-sm">{type.label}</p>
                    <p className="text-zinc-500 text-xs">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!image || isLoading}
              className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  Analyzing your photo...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Get My Style Guide
                </>
              )}
            </button>

            <p className="text-zinc-600 text-xs text-center">
              🔒 Your photo is analyzed privately and never stored on our servers.
            </p>
          </AnimatedSection>

          {/* Right: Results */}
          <AnimatedSection delay={0.2}>
            {!result && !isLoading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 flex items-center justify-center mb-6">
                  <Wand2 className="w-9 h-9 text-cyan-400/60" />
                </div>
                <h3 className="font-serif text-xl font-bold text-zinc-400 mb-2">Your personalized guide will appear here</h3>
                <p className="text-zinc-600 text-sm max-w-xs">Upload a clear selfie and select your shoot type to get started.</p>
              </div>
            )}

            {isLoading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-violet-400 border-b-transparent border-l-transparent animate-spin" />
                  <div className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <p className="text-zinc-300 font-semibold text-lg mb-2">{loadingTexts[loadingStep]}</p>
                <p className="text-zinc-500 text-sm">Please wait while the AI finishes its analysis (usually takes 5-10 seconds)</p>
              </div>
            )}

            {result && (
              <div className="space-y-5">
                {/* Color Palette */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> Your Perfect Color Palette
                  </h3>
                  <div className="flex gap-3">
                    {result.palette?.map((color, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div className="h-12 rounded-xl mb-2 border border-white/10" style={{ backgroundColor: color }} />
                        <p className="text-xs text-zinc-400">{result.paletteNames?.[i] || color}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outfit Recommendations */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-400" /> Outfit Recommendations
                  </h3>
                  <div className="space-y-3">
                    {result.outfitRecommendations?.map((outfit, i) => (
                      <div key={i} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-white text-sm">{outfit.outfit}</p>
                          <span className="shrink-0 text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">Option {i + 1}</span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1">{outfit.description}</p>
                        <p className="text-cyan-400/80 text-xs mt-1.5 italic">✨ {outfit.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Avoid */}
                {result.avoidColors && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                    <p className="text-red-400 font-semibold text-sm mb-1">⚠ Colors to Avoid</p>
                    <p className="text-zinc-400 text-xs">{result.avoidColors.join(", ")} — {result.avoidReason}</p>
                  </div>
                )}

                {/* Tips Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                    <p className="text-zinc-300 font-semibold text-xs uppercase tracking-widest mb-2">💄 Hair & Makeup</p>
                    <p className="text-zinc-400 text-sm">{result.hairMakeupTip}</p>
                  </div>
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                    <p className="text-zinc-300 font-semibold text-xs uppercase tracking-widest mb-2">💎 Accessories</p>
                    <p className="text-zinc-400 text-sm">{result.accessoryTip}</p>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-2xl p-4">
                  <p className="text-cyan-400 font-semibold text-xs uppercase tracking-widest mb-2">⭐ Pro Tip</p>
                  <p className="text-zinc-300 text-sm">{result.generalTip}</p>
                </div>

                {/* CTA */}
                <Link
                  href="/book"
                  className="block w-full text-center py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300"
                >
                  Book Your Session Now →
                </Link>
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
