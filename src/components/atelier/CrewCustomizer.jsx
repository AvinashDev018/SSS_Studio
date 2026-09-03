"use client";

import React from "react";
import { Camera, Film, Radio, Shield, Sparkles, Check } from "lucide-react";

export const CREW_OPTIONS = [
  {
    id: "candid-lead",
    title: "Master Candid Photographers",
    subtitle: "2 Senior Candid Artists with 50mm & 85mm f/1.2 Master Lenses",
    icon: Camera,
    pricePerDay: 25000,
    required: true,
    description: "Captures unscripted emotional expressions, tears of joy, and intimate candid portraiture.",
  },
  {
    id: "traditional-stills",
    title: "Traditional Stills Team",
    subtitle: "2 Full-Coverage Stills Photographers for Ceremony Rituals",
    icon: Shield,
    pricePerDay: 18000,
    required: true,
    description: "Ensures every family member, stage greeting, and ritual sequence is documented without missing a moment.",
  },
  {
    id: "drone-pilot",
    title: "4K Aerial Cinema Drone",
    subtitle: "Licensed Drone Pilot for Aerial Venue & Procession Shots",
    icon: Film,
    pricePerDay: 15000,
    required: false,
    description: "Breathtaking 4K aerial cinematography covering baraat, mandapam architecture, and outdoor couple sequences.",
  },
  {
    id: "live-stream",
    title: "4K Ultra-HD Live Streaming",
    subtitle: "Multi-Camera Wireless Live Broadcast to Family Worldwide",
    icon: Radio,
    pricePerDay: 12000,
    required: false,
    description: "Private password-protected 4K live YouTube/Web stream so relatives across the globe can attend in real time.",
  },
];

export default function CrewCustomizer({ selectedCrew, toggleCrew }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-normal text-white">
          Configure Cinematography &amp; Photography Team
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Select camera directors, aerial drone pilots, and live broadcast technicians for your production.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CREW_OPTIONS.map((crew) => {
          const Icon = crew.icon;
          const isSelected = selectedCrew.includes(crew.id) || crew.required;

          return (
            <div
              key={crew.id}
              onClick={() => !crew.required && toggleCrew(crew.id)}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                crew.required
                  ? "bg-[#141414] border-white/20 cursor-default"
                  : isSelected
                  ? "bg-[#161616] border-[#c5a880] shadow-[0_0_20px_rgba(197,168,128,0.15)] cursor-pointer"
                  : "bg-[#111111] border-white/10 hover:border-white/25 cursor-pointer"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#c5a880]">
                    <Icon size={22} />
                  </div>

                  <div className="flex items-center gap-2">
                    {crew.required && (
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                        Core Included
                      </span>
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? "bg-[#c5a880] text-black" : "bg-white/5 border border-white/20 text-transparent"
                    }`}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-serif font-normal text-white mb-1">
                  {crew.title}
                </h3>
                <p className="text-xs text-[#c5a880] font-medium mb-3">
                  {crew.subtitle}
                </p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                  {crew.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Daily Crew Investment:</span>
                <span className="text-white font-semibold">₹{crew.pricePerDay.toLocaleString("en-IN")} / Day</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
