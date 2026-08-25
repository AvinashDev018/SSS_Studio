"use client";

import React, { useState, useEffect } from "react";
import * as SunCalc from "suncalc";
import { MapPin, Sun, Upload, Camera } from "lucide-react";
import { useColor } from "color-thief-react";

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

export default function AIStylist() {
  const [imageSrc, setImageSrc] = useState(null);
  const [bestMatch, setBestMatch] = useState(null);
  const [goldenHour, setGoldenHour] = useState("");

  // Use color-thief-react hook
  const { data: colorData, loading: colorLoading } = useColor(imageSrc || "", "rgbArray", { crossOrigin: "anonymous" });

  useEffect(() => {
    if (colorData && colorData.length === 3) {
      const rgbColor = { r: colorData[0], g: colorData[1], b: colorData[2] };
      findBestLocationMatch(rgbColor);
    }
  }, [colorData]);

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
    <div className="max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
          <Camera className="text-pink-500" /> AI Stylist
        </h2>
        <p className="text-gray-600">
          Upload your outfit, and we'll match it with the perfect Madurai location and find today's Golden Hour.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden min-h-[300px]">
          {imageSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Uploaded outfit"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="z-10 bg-white/90 p-4 rounded-lg shadow text-center backdrop-blur-sm">
                <p className="text-sm font-medium text-gray-700 mb-2">Change Image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
              </div>
            </>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <label className="cursor-pointer">
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Upload an image of your outfit
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-6">
          {/* Color Analysis */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Color Analysis</h3>
            {colorLoading ? (
               <p className="text-gray-500 text-sm">Analyzing image...</p>
            ) : colorData ? (
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full shadow-inner border border-gray-200"
                  style={{
                    backgroundColor: `rgb(${colorData[0]}, ${colorData[1]}, ${colorData[2]})`,
                  }}
                ></div>
                <div>
                  <p className="font-medium text-gray-800">Dominant Hue Found</p>
                  <p className="text-sm text-gray-500">Matching with our database...</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">Upload an image to extract colors.</p>
            )}
          </div>

          {/* Location Match */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex-1">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin size={16} /> Best Location Match
            </h3>
            {bestMatch ? (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-pink-100 animate-in fade-in zoom-in duration-300">
                <div className="text-4xl mb-2">{bestMatch.image}</div>
                <h4 className="font-bold text-lg text-gray-800">{bestMatch.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{bestMatch.description}</p>
                <div className="mt-3 flex gap-2">
                  {bestMatch.palettes.map((p, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full shadow-sm border border-gray-200"
                      style={{ backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})` }}
                      title="Complementary Color"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">Waiting for upload...</p>
            )}
          </div>
        </div>
      </div>

      {/* Golden Hour Bar */}
      <div className="mt-8 bg-amber-50 rounded-xl p-4 md:p-6 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-amber-800">
          <Sun className="h-8 w-8 text-amber-500" />
          <div>
            <h4 className="font-bold">Today's Golden Hour in Madurai</h4>
            <p className="text-sm text-amber-700/80">Best lighting for outdoor shoots</p>
          </div>
        </div>
        <div className="text-2xl font-black text-amber-600 bg-white px-6 py-2 rounded-lg shadow-sm">
          {goldenHour}
        </div>
      </div>
    </div>
  );
}
