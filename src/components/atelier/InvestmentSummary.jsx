"use client";

import React, { useState } from "react";
import { Check, ShieldCheck, Sparkles, ArrowRight, Lock, Calendar } from "lucide-react";
import { EVENTS_DATA } from "./EventGrid";
import { CREW_OPTIONS } from "./CrewCustomizer";

export default function InvestmentSummary({ selectedEvents, selectedCrew, onOpenBooking }) {
  const [currency, setCurrency] = useState("INR");

  // Calculate estimated investment
  const totalDays = Math.max(1, Math.ceil(selectedEvents.length / 2));
  
  const crewDailyCost = CREW_OPTIONS
    .filter(c => selectedCrew.includes(c.id) || c.required)
    .reduce((sum, c) => sum + c.pricePerDay, 0);

  const baseEventFee = selectedEvents.length * 20000;
  const totalInvestmentINR = baseEventFee + (crewDailyCost * totalDays);
  const totalInvestmentUSD = Math.round(totalInvestmentINR / 83);

  const selectedEventTitles = EVENTS_DATA
    .filter(e => selectedEvents.includes(e.id))
    .map(e => e.title);

  return (
    <div className="bg-[#121212] border border-[#c5a880]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
      {/* Subtle Warm Highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a880]/5 rounded-full blur-[100px] pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#c5a880] tracking-widest block mb-1">
              Atelier Quotation
            </span>
            <h3 className="text-xl font-serif font-normal text-white">
              Investment Summary
            </h3>
          </div>
          
          {/* Currency Toggle */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1 text-[11px]">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                currency === "INR" ? "bg-[#c5a880] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                currency === "USD" ? "bg-[#c5a880] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Selected Events Overview */}
        <div className="mb-6">
          <span className="text-xs font-medium text-zinc-400 block mb-2">
            Selected Events ({selectedEvents.length}):
          </span>
          {selectedEventTitles.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedEventTitles.map((title, i) => (
                <span key={i} className="text-[11px] text-zinc-200 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                  {title}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-zinc-500 italic">No events selected yet</span>
          )}
        </div>

        {/* Signature Inclusions Checklist */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-medium text-[#c5a880] uppercase tracking-wider block">
            Signature Inclusions:
          </span>

          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <Check size={14} className="text-[#c5a880] shrink-0 mt-0.5" />
            <span><strong>1-Month Handcrafted Album Box</strong> (Guaranteed 30-Day Delivery)</span>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <Check size={14} className="text-[#c5a880] shrink-0 mt-0.5" />
            <span><strong>4K Master Teaser &amp; Film</strong> with 10-Bit Color Grading</span>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <Check size={14} className="text-[#c5a880] shrink-0 mt-0.5" />
            <span><strong>Private Digital Proofing Vault Access</strong> (Password-Protected)</span>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <Check size={14} className="text-[#c5a880] shrink-0 mt-0.5" />
            <span>Dual Redundant Cloud &amp; Local NVMe Storage Backup</span>
          </div>
        </div>
      </div>

      {/* Investment Total & Action */}
      <div className="pt-5 border-t border-white/10 mt-4">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs text-zinc-400 font-medium">Estimated Investment:</span>
          <span className="font-serif text-2xl font-normal text-[#c5a880]">
            {currency === "INR" ? `₹${totalInvestmentINR.toLocaleString("en-IN")}` : `$${totalInvestmentUSD.toLocaleString()}`}
          </span>
        </div>

        <button
          onClick={() => onOpenBooking(`Bespoke Atelier Package (${selectedEvents.length} Events)`)}
          className="w-full py-3.5 bg-[#c5a880] hover:bg-[#d4af37] text-black font-semibold rounded-xl text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(197,168,128,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar size={14} />
          <span>Reserve Dates &amp; Consultation</span>
          <ArrowRight size={14} />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 mt-3">
          <Lock size={12} className="text-[#c5a880]" />
          <span>Date Reservation Secured via SSS Studio Concierge</span>
        </div>
      </div>
    </div>
  );
}
