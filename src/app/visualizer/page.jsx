"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Sparkles, CheckCircle2, RefreshCw, Wand2, Shirt, Scissors, ShieldAlert, Sparkle, X } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AIStylist from "@/components/AIStylist";

const SHOOT_TYPES = [
  { id: "Wedding", label: "Wedding / Reception", emoji: "💍", desc: "Grand bridal & couple portraits" },
  { id: "Portrait", label: "Solo / Fine Art Portrait", emoji: "📸", desc: "Studio spotlight & headshots" },
  { id: "Birthday", label: "Birthday / Celebration", emoji: "🎉", desc: "Vibrant party & milestone candids" },
  { id: "Corporate", label: "Corporate Headshot", emoji: "💼", desc: "Business & LinkedIn profiles" },
];

function generateDynamicGuide(shootType, stylePreference, photoHex = "#D4AF37", photoUndertone = "Warm Gold") {
  const isMasculine = stylePreference === "Masculine";

  const guides = {
    Wedding: {
      palette: [photoHex, "#D4AF37", "#4A0E17"],
      paletteNames: ["Client Primary Tone", "Antique Gold", "Royal Muhurtham Maroon"],
      outfitRecommendations: isMasculine ? [
        {
          outfit: "Pure Silk Veshti & Gold Kurta Set",
          description: `A rich raw silk kurta in mustard or gold paired with traditional gold zari border veshti and angavastram over the shoulder.`,
          reason: `Formulated specifically for your photo's ${photoUndertone} undertone (${photoHex}) for an authentic South Indian wedding look.`
        },
        {
          outfit: "Royal Bandhgala Suit with Pocket Square",
          description: "A tailored bandhgala jacket in deep navy or maroon featuring subtle brass buttons, accessorized with a silk pocket square.",
          reason: "Provides an elegant editorial contrast against studio spotlight backdrops."
        },
        {
          outfit: "Classic Sherwani with Churidar",
          description: "An ivory or cream sherwani with self-texture embroidery and a contrasting dupion silk shawl.",
          reason: "Timeless groom and high-fashion wedding guest attire that adds regal stature."
        }
      ] : [
        {
          outfit: "Heavy Kanjivaram Zari Silk Saree",
          description: `A deep jewel-toned Kanjivaram silk saree in royal blue or emerald green with pure gold zari borders, paired with a custom embroidered blouse.`,
          reason: `Curated to complement your photo's ${photoUndertone} tone (${photoHex}), creating rich luster under studio flash keylights.`
        },
        {
          outfit: "Designer Silk Lehenga Choli",
          description: "A rich flared lehenga in blush pink or emerald green with intricate zardozi work and draped net dupatta.",
          reason: "Flowy silk layers add graceful movement for candid wedding studio portraits."
        },
        {
          outfit: "Heritage Temple Anarkali",
          description: "A floor-length silk Anarkali suit in deep maroon or wine with gold border detailing.",
          reason: "Combines grand traditional posture with effortless elegance."
        }
      ],
      avoidColors: isMasculine ? ["Neon green", "Faded pastels"] : ["Neon yellow", "Faded grey"],
      avoidReason: "Bright neon shades or faded tones wash out skin undertones under professional studio flash setups.",
      hairMakeupTip: isMasculine ? "Style hair with matte clay for clean volume. Keep beard neatly groomed and apply moisturizer for a healthy glow." : "Opt for a classic traditional updo adorned with fresh Madurai Malli (jasmine gajra). Use warm-toned foundation with subtle golden highlighter.",
      accessoryTip: isMasculine ? "Classic leather-strap watch and a royal gold lapel brooch." : "Layer traditional Kempu or Kasu Malai temple jewellery with matching jhumkas and bangles.",
      generalTip: "Keep posture erect and chest open to allow the structured silk fabric to drape crisp lines in camera."
    },
    Portrait: {
      palette: [photoHex, "#2C3E50", "#ECF0F1"],
      paletteNames: ["Client Primary Tone", "Studio Deep Navy", "Soft White"],
      outfitRecommendations: isMasculine ? [
        {
          outfit: "Solid Raw Silk Kurta",
          description: "A well-fitted raw silk kurta in a solid deep tone like navy, burgundy, or forest green.",
          reason: `Selected for your ${photoUndertone} tone (${photoHex}) to draw 100% of visual focus to your facial expressions.`
        },
        {
          outfit: "Structured Dark Nehru Jacket",
          description: "A sharp dark Nehru waistcoat worn over a light pastel cotton kurta pajama set.",
          reason: "Adds sharp shoulder structure and depth for fine-art studio headshots."
        },
        {
          outfit: "Mandarin Collar Linen Shirt",
          description: "A crisp linen mandarin collar shirt tucked into dark tailored chinos.",
          reason: "Modern Indo-Western fusion style ideal for contemporary personal branding."
        }
      ] : [
        {
          outfit: "Solid Jewel-Toned Kurti Set",
          description: "A premium cotton-silk straight kurti in deep emerald or royal blue with subtle neckline embroidery.",
          reason: `Tailored to your photo's ${photoUndertone} tone (${photoHex}) to ensure rich skin contrast without color bleeding.`
        },
        {
          outfit: "Soft Pastel Salwar Kameez",
          description: "A light pastel salwar kameez with delicate organza dupatta.",
          reason: "Soft, approachable look ideal for artistic and personal portrait sessions."
        },
        {
          outfit: "Handloom Linen Saree",
          description: "A lightweight linen or Chanderi silk saree with a contrast elbow-sleeve blouse.",
          reason: "Understated elegance that projects intellect and artistic grace."
        }
      ],
      avoidColors: ["Stark white", "Reflective neon"],
      avoidReason: "Pure white can clip highlights under keylights, while neons reflect harsh color casts onto skin.",
      hairMakeupTip: isMasculine ? "Neat dry styling with light hold spray. Use a matte lip balm to prevent reflection under softbox lights." : "Keep makeup clean and natural. Focus on smooth skin finish, subtle eye lining, and nude-pink lip tone.",
      accessoryTip: isMasculine ? "Minimal silver or gold wrist watch." : "Subtle gold jhumkas or a delicate pendant chain.",
      generalTip: "Ensure clothing is pressed without fold lines — fine details stand out sharp in high-res studio sensors."
    },
    Birthday: {
      palette: [photoHex, "#FF6B9D", "#F59E0B"],
      paletteNames: ["Client Primary Tone", "Celebration Pink", "Golden Amber"],
      outfitRecommendations: isMasculine ? [
        {
          outfit: "Printed Short Kurta with Denim",
          description: "A stylized block-printed short kurta with folded sleeves worn over dark jeans.",
          reason: "Youthful, vibrant, and relaxed, perfect for birthday celebrations and casual candids."
        },
        {
          outfit: "Festive Silk Nehru Waistcoat",
          description: "A colorful silk Nehru waistcoat over a simple white kurta pajama set.",
          reason: "Provides a premium, festive look that feels celebratory and polished."
        },
        {
          outfit: "Indo-Western Fusion Shirt",
          description: "A collared shirt featuring subtle ethnic patterns paired with dark chinos.",
          reason: "Gives a youthful, stylish look ideal for casual studio birthday setups."
        }
      ] : [
        {
          outfit: "Indo-Western Crop Top & Dhoti",
          description: "A festive crop top paired with stylish dhoti pants and an embellished cape.",
          reason: "Trendy, dynamic, and photogenic, great for active, candid birthday shots."
        },
        {
          outfit: "Lehenga with Crop Top",
          description: "A colorful lightweight skirt lehenga with a modern halter-neck crop top.",
          reason: "Vibrant and celebratory, perfect for a modern birthday celebration."
        },
        {
          outfit: "Flowy Anarkali Gown",
          description: "A lightweight, flowy Anarkali gown in pastel peach or lavender.",
          reason: "Gives a fairytale princess look that makes milestone birthdays feel extra special."
        }
      ],
      avoidColors: ["Pale pastels", "Beige"],
      avoidReason: "These colors can look washed out and blend into the backdrop in birthday party setups.",
      hairMakeupTip: isMasculine ? "Style hair with texture and volume." : "Go bold! Consider a blow-out, beach waves, or a fun braid with a bold lip in red or fuchsia.",
      accessoryTip: isMasculine ? "A stylish metallic watch or a simple silver bracelet." : "Statement earrings (heavy chandbalis) or a birthday sash are encouraged!",
      generalTip: "Bring a backup outfit option for cake cutting or action shots."
    },
    Corporate: {
      palette: [photoHex, "#1A1A2E", "#4A90D9"],
      paletteNames: ["Client Primary Tone", "Corporate Navy", "Corporate Blue"],
      outfitRecommendations: isMasculine ? [
        {
          outfit: "Single-Breasted Charcoal Suit",
          description: "A charcoal grey or dark navy blue suit with a white shirt and a solid-colored tie.",
          reason: "Classic corporate headshot attire that projects competence and leadership."
        },
        {
          outfit: "Structured Bandhgala Jacket",
          description: "A structured bandhgala or Nehru jacket in grey or navy over a crisp linen shirt.",
          reason: "A professional and modern Indian corporate profile look that balances culture and business."
        },
        {
          outfit: "Smart Business Casual Shirt",
          description: "A tucked-in light blue shirt with slim-fit khaki or dark trousers and a leather belt.",
          reason: "Approachable and modern — perfect for tech startups or creative agencies."
        }
      ] : [
        {
          outfit: "Formal Cotton Saree",
          description: "A neatly draped formal linen, cotton, or raw silk saree in subtle borders and muted colors.",
          reason: "Elegant, professional, and powerful corporate attire for Indian business contexts."
        },
        {
          outfit: "Formal Kurti Set",
          description: "A premium, well-fitted straight kurti set in solid muted tones like slate blue, olive, or charcoal.",
          reason: "Combines professionalism with comfort — excellent for company profiles."
        },
        {
          outfit: "Blazer with Trousers",
          description: "A fitted blazer in navy or dark grey over pressed trousers with a simple blouse.",
          reason: "Classic global professional look — ideal for international corporate websites and LinkedIn profiles."
        }
      ],
      avoidColors: ["Busy patterns", "Neon colors"],
      avoidReason: "Complex patterns are distracting in professional photos and can cause moiré distortion.",
      hairMakeupTip: isMasculine ? "Clean shave or neatly trimmed beard with dry matte hair styling." : "Polished, professional hair (pinned back or sleek blow-dry) with subtle neutral makeup.",
      accessoryTip: isMasculine ? "Classic leather-strap watch." : "Simple stud earrings and classic wrist watch.",
      generalTip: "Ensure your suit, saree, or jacket is freshly pressed for crisp shoulder lines."
    }
  };

  return guides[shootType] || guides.Portrait;
}

export default function VisualizerPage() {
  const [activeTab, setActiveTab] = useState("guide");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [shootType, setShootType] = useState("Wedding");
  const [stylePreference, setStylePreference] = useState("Feminine");
  const [result, setResult] = useState(() => generateDynamicGuide("Wedding", "Feminine"));
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
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSamplePhoto = async () => {
    const sampleUrl = "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788426852/sss-hero-wedding.jpg";
    setImagePreview(sampleUrl);
    setIsLoading(true);
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], "sample-hero.jpg", { type: "image/jpeg" });
      setImage(file);
    } catch (e) {
      console.warn("Sample fetch failed, using fallback preview");
    } finally {
      setTimeout(() => {
        setResult(generateDynamicGuide(shootType, stylePreference));
        setIsLoading(false);
      }, 1000);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 350;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name || "photo.jpg", { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.55
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const extractPhotoColors = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = 50;
            canvas.height = 50;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, 50, 50);
            const data = ctx.getImageData(0, 0, 50, 50).data;

            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 128) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
              }
            }
            if (count > 0) {
              r = Math.round(r / count);
              g = Math.round(g / count);
              b = Math.round(b / count);
            } else {
              r = 212; g = 175; b = 55;
            }

            const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
            const undertone = (r > b) ? "Warm Gold/Dusky" : "Cool Deep";
            resolve({ r, g, b, hex, undertone });
          } catch (err) {
            resolve({ r: 212, g: 175, b: 55, hex: "#D4AF37", undertone: "Warm Gold" });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    try {
      const compressedFile = await compressImage(image);
      const colorInfo = await extractPhotoColors(compressedFile);

      const formData = new FormData();
      formData.append("image", compressedFile);
      formData.append("shootType", shootType);
      formData.append("stylePreference", stylePreference);
      formData.append("photoHex", colorInfo.hex);
      formData.append("photoUndertone", colorInfo.undertone);

      let data = null;
      try {
        const res = await fetch("/api/visualizer", { method: "POST", body: formData });
        if (res.ok) {
          data = await res.json();
        }
      } catch (e) {
        console.warn("API fetch error, generating dynamic client guide:", e);
      }

      if (!data || !data.outfitRecommendations || data.outfitRecommendations.length === 0) {
        data = generateDynamicGuide(shootType, stylePreference, colorInfo.hex, colorInfo.undertone);
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setResult(generateDynamicGuide(shootType, stylePreference, "#D4AF37", "Warm Gold"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-zinc-900 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[160px] pointer-events-none" />

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
                      onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); setResult(INITIAL_TAMIL_HERITAGE_GUIDE); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors border border-white/20"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-[#c5a880] text-black text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Photo Loaded
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3 text-[#c5a880]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-white font-medium text-sm mb-1">Drop your photo here</p>
                    <p className="text-zinc-500 text-xs mb-3">or click to select from your device</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleSamplePhoto(); }}
                      className="px-3.5 py-1.5 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/40 text-[#c5a880] text-xs font-medium hover:bg-[#c5a880] hover:text-black transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>✨ Try Demo Royal Wedding Photo</span>
                    </button>
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
                disabled={isLoading}
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
              {isLoading ? (
                <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-white/10 bg-[#121212]">
                  <div className="w-16 h-16 rounded-full border-2 border-[#c5a880]/30 border-t-[#c5a880] animate-spin mb-6" />
                  <h3 className="font-serif text-xl font-normal text-white mb-2">Analyzing Your Style Profile...</h3>
                  <p className="text-[#c5a880] text-xs font-mono uppercase tracking-wider transition-all duration-300">
                    {loadingTexts[loadingStep]}
                  </p>
                </div>
              ) : result ? (
                <div className="space-y-6 bg-[#121212] p-6 sm:p-8 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest">SSS Studio AI Analysis</span>
                      <h2 className="font-serif text-2xl text-white font-normal">Personalized Style &amp; Pose Guide</h2>
                    </div>
                    <button
                      onClick={() => handleAnalyze()}
                      disabled={!image}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Re-analyze photo"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Color Palette Section */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                      <Sparkle className="w-3.5 h-3.5 text-[#c5a880]" /> Recommended Studio Color Palette
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {result.palette?.map((hex, idx) => (
                        <div key={idx} className="bg-black/50 border border-white/10 p-3 rounded-xl text-center">
                          <div className="w-full h-10 rounded-lg mb-2 shadow-inner border border-white/10" style={{ backgroundColor: hex }} />
                          <p className="text-xs font-semibold text-white truncate">{result.paletteNames?.[idx] || hex}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{hex}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outfit Recommendations */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                      <Shirt className="w-3.5 h-3.5 text-[#c5a880]" /> Outfit Options for {shootType} Shoot
                    </h4>
                    <div className="space-y-3">
                      {result.outfitRecommendations?.map((item, idx) => (
                        <div key={idx} className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#c5a880] text-xs font-semibold font-mono">Option 0{idx + 1}</span>
                            <span className="text-white text-xs font-semibold font-serif">{item.outfit}</span>
                          </div>
                          <p className="text-zinc-300 text-xs font-light">{item.description}</p>
                          <p className="text-zinc-500 text-[11px] italic font-light">Why: {item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors to Avoid */}
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-0.5">Colors &amp; Items to Avoid</h5>
                      <p className="text-xs text-red-200/80 font-light">
                        Avoid: <span className="font-semibold">{result.avoidColors?.join(", ")}</span>. {result.avoidReason}
                      </p>
                    </div>
                  </div>

                  {/* Expert Advice Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                    <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl">
                      <p className="text-[#c5a880] font-semibold mb-1 flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5" /> Hair &amp; Grooming
                      </p>
                      <p className="text-zinc-300 font-light leading-relaxed">{result.hairMakeupTip}</p>
                    </div>
                    <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl">
                      <p className="text-[#c5a880] font-semibold mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Jewellery &amp; Accessories
                      </p>
                      <p className="text-zinc-300 font-light leading-relaxed">{result.accessoryTip}</p>
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="bg-[#c5a880]/10 border border-[#c5a880]/20 p-4 rounded-xl text-xs">
                    <p className="text-[#c5a880] font-semibold mb-0.5 flex items-center gap-1.5">
                      <Sparkle className="w-3.5 h-3.5" /> SSS Studio Pro Lighting Tip
                    </p>
                    <p className="text-zinc-300 font-light leading-relaxed">{result.generalTip}</p>
                  </div>
                </div>
              ) : null}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
