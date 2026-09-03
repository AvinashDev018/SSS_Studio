"use client";

import React, { useState, useEffect } from "react";
import * as SunCalc from "suncalc";
import { MapPin, Sun, Upload, Camera, CheckCircle2, Sparkle } from "lucide-react";

// Heritage Locations in Madurai
const MADURAI_LOCATIONS = [
  {
    id: "mahal",
    name: "Thirumalai Nayakkar Mahal",
    description: "Grand Indo-Saracenic royal pillars with warm crimson & gold tones.",
    palettes: [
      { r: 200, g: 50, b: 50 }, // Deep Reds
      { r: 220, g: 150, b: 30 }, // Gold/Orange
      { r: 240, g: 230, b: 200 }, // Off-white/Cream
    ],
    image: "🏛️",
  },
  {
    id: "meenakshi",
    name: "Meenakshi Amman Temple Surroundings",
    description: "Vibrant traditional gopuram colors & intricate heritage carved stone.",
    palettes: [
      { r: 30, g: 144, b: 255 }, // Blues
      { r: 255, g: 105, b: 180 }, // Pinks
      { r: 50, g: 205, b: 50 }, // Greens
    ],
    image: "🛕",
  },
  {
    id: "resort",
    name: "Heritage Madurai Resort",
    description: "Lush tropical green gardens, rustic clay tiles & lotus reflection pools.",
    palettes: [
      { r: 34, g: 139, b: 34 }, // Forest Green
      { r: 139, g: 69, b: 19 }, // Saddle Brown
      { r: 255, g: 255, b: 255 }, // Whites
    ],
    image: "🌴",
  },
];

// Helper to calculate Euclidean color distance
const getColorDistance = (rgb1, rgb2) => {
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
};

/**
 * Extract dominant color safely without crashing on CORS or tainted canvas
 */
function extractDominantColor(imgSrc, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 100 / Math.max(img.width, img.height));
      canvas.width = Math.floor(img.width * scale);
      canvas.height = Math.floor(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a > 128) {
          rSum += data[i];
          gSum += data[i + 1];
          bSum += data[i + 2];
          count++;
        }
      }
      if (count === 0) {
        callback([212, 175, 55]);
      } else {
        callback([Math.round(rSum / count), Math.round(gSum / count), Math.round(bSum / count)]);
      }
    } catch (e) {
      console.warn("Canvas pixel extraction fallback triggered:", e);
      callback([212, 175, 55]);
    }
  };
  img.onerror = () => callback([212, 175, 55]);
  img.src = imgSrc;
}

export default function AIStylist() {
  const [imageSrc, setImageSrc] = useState(null);
  const [colorData, setColorData] = useState([212, 175, 55]);
  const [colorLoading, setColorLoading] = useState(false);
  const [bestMatch, setBestMatch] = useState(MADURAI_LOCATIONS[0]);
  const [goldenHour, setGoldenHour] = useState("");

  // Extract color when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    setColorLoading(true);
    extractDominantColor(imageSrc, (rgb) => {
      setColorLoading(false);
      if (rgb) {
        setColorData(rgb);
        findBestLocationMatch({ r: rgb[0], g: rgb[1], b: rgb[2] });
      }
    });
  }, [imageSrc]);

  // Calculate Golden Hour for Madurai coordinates (9.9252° N, 78.1198° E)
  useEffect(() => {
    try {
      const today = new Date();
      const times = SunCalc.getTimes(today, 9.9252, 78.1198);

      const formatTime = (date) => {
        return date.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      if (times.goldenHour && times.sunsetStart) {
        setGoldenHour(`${formatTime(times.goldenHour)} - ${formatTime(times.sunsetStart)}`);
      } else {
        setGoldenHour("5:15 PM - 6:30 PM (Madurai IST)");
      }
    } catch (e) {
      setGoldenHour("5:15 PM - 6:30 PM (Madurai IST)");
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoPhoto = () => {
    const demoUrl = "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788426852/sss-hero-wedding.jpg";
    setImageSrc(demoUrl);
  };

  const findBestLocationMatch = (uploadedColor) => {
    let closestLocation = MADURAI_LOCATIONS[0];
    let minDistance = Infinity;

    MADURAI_LOCATIONS.forEach((location) => {
      location.palettes.forEach((palette) => {
        const distance = getColorDistance(uploadedColor, palette);
        if (distance < minDistance) {
          minDistance = distance;
          closestLocation = location;
        }
      });
    });

    setBestMatch(closestLocation);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl text-white">
      <div className="text-center mb-8">
        <span className="text-[11px] uppercase tracking-widest text-[#c5a880] font-semibold px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 inline-block mb-3">
          Location &amp; Sunset Timing
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal font-serif text-white mb-3 flex items-center justify-center gap-2">
          <Camera className="text-[#c5a880]" /> AI Location &amp; Golden Hour Stylist
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed">
          Upload your outfit photo, and our color algorithm will recommend the ideal backdrop in Madurai along with today's live Golden Hour window.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#c5a880]/50 rounded-2xl p-6 bg-[#0a0a0a]/60 hover:bg-[#0a0a0a] transition-all relative overflow-hidden min-h-[300px]">
          {imageSrc ? (
            <div className="w-full text-center relative">
              <img
                src={imageSrc}
                alt="Outfit Preview"
                className="max-h-64 mx-auto rounded-xl object-contain shadow-lg border border-white/10 mb-4 bg-black/40"
              />
              <label className="inline-flex items-center gap-2 bg-[#c5a880] text-black font-semibold text-xs px-4 py-2 rounded-full cursor-pointer hover:bg-[#d4af37] transition-all">
                <Upload className="w-3.5 h-3.5" /> Upload Different Photo
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <div className="text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#c5a880]">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-white mb-1">Select an Outfit Photo</p>
              <p className="text-xs text-zinc-400 mb-4">Upload a dress or saree picture to match backdrops</p>

              <div className="flex flex-col gap-2.5 items-center">
                <label className="px-4 py-2 rounded-full bg-[#c5a880] text-black font-semibold text-xs cursor-pointer hover:bg-[#d4af37] transition-all inline-block shadow-md">
                  Browse Device Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={handleDemoPhoto}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-[#c5a880] text-xs hover:bg-white/10 transition-all cursor-pointer"
                >
                  ✨ Try Demo Royal Outfit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-5">
          {/* Dominant Color Swatch */}
          <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/10">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5 text-[#c5a880]" /> Dominant Outfit Color
            </h3>
            {colorLoading ? (
              <p className="text-xs text-zinc-400 animate-pulse font-mono">Analyzing outfit RGB spectrum...</p>
            ) : colorData ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border border-white/20 shadow-md"
                  style={{ backgroundColor: `rgb(${colorData[0]}, ${colorData[1]}, ${colorData[2]})` }}
                />
                <div>
                  <p className="text-xs font-mono font-semibold text-white">
                    RGB({colorData[0]}, {colorData[1]}, {colorData[2]})
                  </p>
                  <p className="text-[11px] text-[#c5a880] font-light">Extracted Spectrum Match</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Recommended Location */}
          <div className="bg-[#0a0a0a] p-5 rounded-xl border border-white/10 space-y-3">
            <h3 className="text-xs font-semibold text-[#c5a880] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c5a880]" /> Recommended Heritage Location
            </h3>

            {bestMatch ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{bestMatch.image}</span>
                  <h4 className="text-lg font-serif text-white font-normal">{bestMatch.name}</h4>
                </div>
                <p className="text-xs text-zinc-300 font-light leading-relaxed">{bestMatch.description}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#c5a880] bg-[#c5a880]/10 px-3 py-1.5 rounded-lg border border-[#c5a880]/20 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ideal color contrast match for your outfit tone
                </div>
              </div>
            ) : null}
          </div>

          {/* Live Golden Hour Section */}
          <div className="bg-[#0a0a0a] p-5 rounded-xl border border-[#c5a880]/30 space-y-2">
            <h3 className="text-xs font-semibold text-[#c5a880] uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#c5a880]" /> Today's Live Golden Hour (Madurai)
            </h3>
            <p className="text-xl font-mono text-white font-semibold tracking-wide">
              {goldenHour || "5:15 PM - 6:30 PM (Madurai IST)"}
            </p>
            <p className="text-[11px] text-zinc-400 font-light">
              SunCalc solar calculation for optimal warm sunset backlight at outdoor locations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
