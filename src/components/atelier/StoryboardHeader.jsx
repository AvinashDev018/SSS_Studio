"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";

export default function StoryboardHeader({ currentStep, setStep }) {
  const steps = [
    { number: "01", id: 1, title: "EVENT TIMELINE", sub: "Select Schedule & Rituals" },
    { number: "02", id: 2, title: "CINEMATOGRAPHY CREW", sub: "Configure Camera & Drone Team" },
    { number: "03", id: 3, title: "DELIVERABLES & ALBUMS", sub: "Handcrafted Flush-Mount Box" },
  ];

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-white/10 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Atelier Brand Title */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[#c5a880] text-[11px] font-semibold uppercase tracking-widest mb-2">
            <Sparkles size={12} className="text-[#c5a880]" />
            <span>SSS Atelier Bespoke Studio</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white">
            Bespoke Wedding Storyboard &amp; Investment
          </h1>
        </div>

        {/* Interactive Step Navigator */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 md:pb-0">
          {steps.map((s, idx) => {
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;

            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-left transition-all duration-300 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-[#c5a880]/15 border-[#c5a880]/40 text-[#c5a880] shadow-[0_0_15px_rgba(197,168,128,0.15)]"
                      : isCompleted
                      ? "bg-white/[0.04] border-white/20 text-zinc-200"
                      : "bg-white/[0.02] border-white/10 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? "bg-[#c5a880] text-black"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-white/5 border border-white/10 text-zinc-400"
                  }`}>
                    {isCompleted ? <Check size={14} /> : s.number}
                  </span>

                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-light hidden sm:inline">
                      {s.sub}
                    </span>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <div className="w-4 h-px bg-white/10 hidden md:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </div>
  );
}
