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
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl text-white">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 inline-block mb-3">
          Interactive Stylist
        </span>
        <h2 className="text-3xl font-bold font-serif text-white mb-3 flex items-center justify-center gap-2">
          <Camera className="text-violet-400" /> AI Stylist &amp; Location Matcher
        </h2>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Upload your outfit, and our color matcher will recommend the perfect backdrop in Madurai, along with the ideal Golden Hour timing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 bg-zinc-950/40 hover:bg-zinc-950/60 transition-colors relative overflow-hidden min-h-[300px]">
          {imageSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Uploaded outfit"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="z-10 bg-zinc-900/90 p-4 rounded-xl shadow-lg text-center backdrop-blur-md border border-zinc-800">
                <p className="text-sm font-medium text-zinc-300 mb-2">Change Outfit Image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-500/20 file:text-violet-300 hover:file:bg-violet-500/30"
                />
              </div>
            </>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
              <label className="cursor-pointer">
                <span className="mt-2 block text-sm font-semibold text-zinc-200">
                  Upload an image of your outfit
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <p className="mt-2 text-xs text-zinc-500">PNG, JPG, JPEG up to 5MB</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-6">
          {/* Color Analysis */}
          <div className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-800/80">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Color Analysis</h3>
            {colorLoading ? (
               <p className="text-zinc-400 text-sm">Analyzing outfit color palette...</p>
            ) : colorData ? (
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full shadow-inner border border-zinc-700/60"
                  style={{
                    backgroundColor: `rgb(${colorData[0]}, ${colorData[1]}, ${colorData[2]})`,
                  }}
                ></div>
                <div>
                  <p className="font-semibold text-zinc-200">Dominant Hue Extracted</p>
                  <p className="text-xs text-zinc-400">R: {colorData[0]} G: {colorData[1]} B: {colorData[2]}</p>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 italic text-sm">Upload an image to extract color.</p>
            )}
          </div>

          {/* Location Match */}
          <div className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-800/80 flex-1">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-violet-400" /> Best Location Match
            </h3>
            {bestMatch ? (
              <div className="bg-zinc-900/80 p-4 rounded-xl border border-violet-500/20 animate-in fade-in zoom-in duration-300">
                <div className="text-3xl mb-2">{bestMatch.image}</div>
                <h4 className="font-bold text-lg text-white">{bestMatch.name}</h4>
                <p className="text-sm text-zinc-400 mt-1">{bestMatch.description}</p>
                <div className="mt-3 flex gap-2">
                  {bestMatch.palettes.map((p, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full shadow-sm border border-zinc-800"
                      style={{ backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})` }}
                      title="Complementary Color"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 italic text-sm">Waiting for outfit image upload...</p>
            )}
          </div>
        </div>
      </div>

      {/* Golden Hour Bar */}
      <div className="mt-8 bg-amber-500/10 rounded-2xl p-4 md:p-6 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-amber-400">
          <Sun className="h-8 w-8 text-amber-500" />
          <div>
            <h4 className="font-bold text-zinc-100 font-serif">Today&apos;s Golden Hour in Madurai</h4>
            <p className="text-xs text-zinc-400">Best lighting for outdoor shoots</p>
          </div>
        </div>
        <div className="text-xl font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-xl">
          {goldenHour}
        </div>
      </div>
    </div>
  );
}
