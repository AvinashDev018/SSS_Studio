"use client";

import React, { useState, useEffect, useRef } from "react";
import * as SunCalc from "suncalc";
import { MapPin, Sun, Upload, Camera } from "lucide-react";

// Mock Data for Madurai Locations
const MADURAI_LOCATIONS = [
  {
    id: "mahal",
    name: "Thirumalai Nayakkar Mahal",
    description: "Rich heritage vibes with grand pillars.",
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
    description: "Vibrant colors and traditional aesthetics.",
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
    description: "Lush greens and rustic brick backdrops.",
    palettes: [
      { r: 34, g: 139, b: 34 }, // Forest Green
      { r: 139, g: 69, b: 19 }, // Saddle Brown
      { r: 255, g: 255, b: 255 }, // Whites
    ],
    image: "🌴",
  },
];

// Helper to calculate color distance
const getColorDistance = (rgb1, rgb2) => {
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
};

/**
 * Extract the dominant color from an image using a hidden canvas.
 * Returns [r, g, b] or null if it fails.
 */
function extractDominantColor(imgSrc, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const canvas = document.createElement("canvas");
    // Sample from a small version for speed
    const scale = Math.min(1, 100 / Math.max(img.width, img.height));
    canvas.width = Math.floor(img.width * scale);
    canvas.height = Math.floor(img.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a > 128) { // ignore transparent pixels
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
        count++;
      }
    }
    if (count === 0) {
      callback(null);
    } else {
      callback([Math.round(rSum / count), Math.round(gSum / count), Math.round(bSum / count)]);
    }
  };
  img.onerror = () => callback(null);
  img.src = imgSrc;
}

export default function AIStylist() {
  const [imageSrc, setImageSrc] = useState(null);
  const [colorData, setColorData] = useState(null);
  const [colorLoading, setColorLoading] = useState(false);
  const [bestMatch, setBestMatch] = useState(null);
  const [goldenHour, setGoldenHour] = useState("");

  // Extract dominant color whenever a new image is set
  useEffect(() => {
    if (!imageSrc) {
      setColorData(null);
      return;
    }
    setColorLoading(true);
    extractDominantColor(imageSrc, (rgb) => {
      setColorLoading(false);
      if (rgb) {
        setColorData(rgb);
        findBestLocationMatch({ r: rgb[0], g: rgb[1], b: rgb[2] });
      }
    });
  }, [imageSrc]);

  // Calculate Golden Hour for Madurai (9.9252 N, 78.1198 E)
  useEffect(() => {
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
      setGoldenHour("Calculate later today");
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setBestMatch(null);
        setColorData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const findBestLocationMatch = (uploadedColor) => {
    let closestLocation = null;
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

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#c5a880]/50 rounded-2xl p-6 bg-[#0a0a0a]/60 hover:bg-[#0a0a0a] transition-all relative overflow-hidden min-h-[300px] cursor-pointer">
          {imageSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Uploaded outfit"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="z-10 bg-black/90 p-4 rounded-xl shadow-lg text-center backdrop-blur-md border border-white/15">
                <p className="text-xs font-medium text-white mb-2">Change Outfit Image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#c5a880]/20 file:text-[#c5a880] hover:file:bg-[#c5a880]/30"
                />
              </div>
            </>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-10 w-10 text-[#c5a880] mb-3" />
              <label className="cursor-pointer">
                <span className="block text-xs font-semibold text-white">
                  Upload an image of your outfit
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <p className="mt-2 text-[11px] text-zinc-500 font-light">PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-6">
          {/* Color Analysis */}
          <div className="bg-[#0a0a0a]/60 p-5 rounded-xl border border-white/10">
            <h3 className="text-[10px] font-semibold text-[#c5a880] uppercase tracking-widest mb-3">Color Analysis</h3>
            {colorLoading ? (
               <p className="text-zinc-400 text-xs">Analyzing outfit color palette...</p>
            ) : colorData ? (
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full shadow-inner border border-white/20"
                  style={{
                    backgroundColor: `rgb(${colorData[0]}, ${colorData[1]}, ${colorData[2]})`,
                  }}
                ></div>
                <div>
                  <p className="font-serif text-sm font-normal text-white">Dominant Hue Extracted</p>
                  <p className="text-xs text-zinc-400 font-light">RGB ({colorData[0]}, {colorData[1]}, {colorData[2]})</p>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 italic text-xs font-light">Upload an image to extract color palette.</p>
            )}
          </div>

          {/* Location Match */}
          <div className="bg-[#0a0a0a]/60 p-5 rounded-xl border border-white/10 flex-1">
            <h3 className="text-[10px] font-semibold text-[#c5a880] uppercase tracking-widest mb-3 flex items-center gap-2">
              <MapPin size={13} className="text-[#c5a880]" /> Best Location Match
            </h3>
            {bestMatch ? (
              <div className="bg-[#161616] p-4 rounded-xl border border-[#c5a880]/30 animate-in fade-in duration-300">
                <div className="text-2xl mb-1">{bestMatch.image}</div>
                <h4 className="font-serif font-normal text-base text-white">{bestMatch.name}</h4>
                <p className="text-xs text-zinc-400 mt-1 font-light">{bestMatch.description}</p>
                <div className="mt-3 flex gap-2">
                  {bestMatch.palettes.map((p, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full shadow-sm border border-white/20"
                      style={{ backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})` }}
                      title="Complementary Backdrop Color"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 italic text-xs font-light">Waiting for outfit image upload...</p>
            )}
          </div>
        </div>
      </div>

      {/* Golden Hour Bar */}
      <div className="mt-8 bg-white/[0.02] rounded-xl p-4 md:p-5 border border-[#c5a880]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-[#c5a880]">
          <Sun className="h-7 w-7 text-[#c5a880]" />
          <div>
            <h4 className="font-serif text-sm text-white">Today&apos;s Golden Hour in Madurai</h4>
            <p className="text-xs text-zinc-400 font-light">Calculated using SunCalc live astronomical position</p>
          </div>
        </div>
        <div className="text-sm font-semibold text-[#c5a880] bg-[#c5a880]/10 border border-[#c5a880]/30 px-5 py-2 rounded-xl">
          {goldenHour}
        </div>
      </div>
    </div>
  );
}
