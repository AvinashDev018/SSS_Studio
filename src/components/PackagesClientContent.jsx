"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Sparkles
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PackageCalculator from "@/components/PackageCalculator";
import BookingQuoteModal from "@/components/ui/BookingQuoteModal";
import PackageCoverFlow from "@/components/ui/PackageCoverFlow";

export default function PackagesClientContent({ displayPackages }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackageName, setSelectedPackageName] = useState("Package 3 - Elevated Drone & Screen");
  const [activeCategory, setActiveCategory] = useState("all");

  const handleOpenBooking = (pkgName) => {
    setSelectedPackageName(pkgName || "Package 3 - Elevated Drone & Screen");
    setIsBookingOpen(true);
  };

  const travelTiers = [
    {
      district: "Local Base District (Madurai & Suburbs)",
      cost: "FREE / Included",
      desc: "Zero travel charges for Madurai city, Avaniyapuram, Thiruparankundram, Mattuthavani & 30 km radius."
    },
    {
      district: "Neighboring Districts (Dindigul, Theni, Virudhunagar, Sivagangai, Ramnad)",
      cost: "₹1,500 – ₹3,000",
      desc: "Nominal cab & fuel travel charge added based on exact location distance from Madurai."
    },
    {
      district: "Far Districts & Hill Stations (Chennai, Coimbatore, Kodaikanal, Ooty, Tirunelveli, Salem)",
      cost: "Actual Transport + Stay",
      desc: "Direct actual fuel/vehicle charges + basic accommodation for the 2–4 photographer crew."
    }
  ];

  // Categorize packages
  const filteredPackages = (displayPackages || []).filter((pkg) => {
    const isWedding = pkg.name.toLowerCase().startsWith("package");
    if (activeCategory === "wedding") return isWedding;
    if (activeCategory === "portraits") return !isWedding;
    return true;
  });

  // Popular / favorite packages lead the list
  const orderedPackages = [...filteredPackages].sort(
    (a, b) => Number(!!b.popular) - Number(!!a.popular)
  );

  return (
    <>
      <div className="py-12 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 relative px-2">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-48 h-32 sm:h-48 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Official Studio Price Catalog • 2025 – 2026
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 text-zinc-900 dark:text-white font-serif leading-tight">
            Official Photography Packages
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Transparent, fixed rates with genuine studio equipment breakdowns, master album specifications, and 1-Month Delivery Guarantee across Tamil Nadu.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            All Packages ({(displayPackages || []).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("wedding")}
            className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeCategory === "wedding"
                ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <span>💍</span>
            Grand Wedding Packages (6 Official Tiers)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("portraits")}
            className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeCategory === "portraits"
                ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <span>🌸</span>
            Portraits &amp; Milestone Shoots
          </button>
        </div>

        {/* Packages cover-flow 360 — detailed cards (Client Stories style) */}
        <div className="mb-14 sm:mb-20">
          <div className="rounded-2xl sm:rounded-3xl bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200/80 dark:border-zinc-800 p-2 sm:p-4 overflow-hidden">
            <PackageCoverFlow
              packages={orderedPackages}
              onBook={(pkg) => handleOpenBooking(pkg.name)}
            />
          </div>
        </div>

        {/* District Travel Policy Section */}
        <AnimatedSection className="mb-16 sm:mb-24">
          <div className="bg-zinc-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-zinc-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-cyan-500/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-wide leading-snug">
                  All-District Travel Charges (எல்லா மாவட்டங்களுக்கும் பயணம்)
                </h2>
                <p className="text-zinc-300 text-xs sm:text-sm mt-1 font-medium leading-relaxed">
                  SSS Photography Studio is based in Avaniyapuram, Madurai and covers all 38 districts of Tamil Nadu.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              {travelTiers.map((tier, tIdx) => (
                <div key={tIdx} className="bg-zinc-800/90 border border-zinc-700/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-cyan-400/60 transition-all shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg sm:text-xl mb-2 sm:mb-3">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
                      {tier.cost}
                    </div>
                    <h3 className="font-bold text-white text-sm sm:text-base mb-2 leading-snug">{tier.district}</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-normal mt-2 pt-2 border-t border-zinc-700/50">
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-800 flex items-start sm:items-center gap-2.5 sm:gap-3 text-zinc-200 text-xs sm:text-sm font-medium leading-relaxed">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                All packages include our signature <strong className="text-white">1-Month Album Delivery Guarantee</strong> (or ₹1,000 cash credit) &amp; 100% Transit Damage Replacement Guarantee.
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* Package Calculator Section */}
        <AnimatedSection delay={0.3}>
          <PackageCalculator />
        </AnimatedSection>
      </div>

      {/* Booking Modal */}
      <BookingQuoteModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        prefilledType={selectedPackageName}
        prefilledMode="booking"
      />
    </>
  );
}
