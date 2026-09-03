"use client";

import React, { useState } from "react";
import StoryboardHeader from "@/components/atelier/StoryboardHeader";
import EventGrid, { EVENTS_DATA } from "@/components/atelier/EventGrid";
import CrewCustomizer from "@/components/atelier/CrewCustomizer";
import InvestmentSummary from "@/components/atelier/InvestmentSummary";
import BookingQuoteModal from "@/components/ui/BookingQuoteModal";
import { Sparkles, ArrowRight, ShieldCheck, Check } from "lucide-react";

export default function AtelierPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEvents, setSelectedEvents] = useState(["muhurtham", "sangeet"]);
  const [selectedCrew, setSelectedCrew] = useState(["candid-lead", "traditional-stills", "drone-pilot"]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingShootType, setBookingShootType] = useState("Bespoke Atelier Wedding Storyboard");

  const toggleEvent = (id) => {
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCrew = (id) => {
    setSelectedCrew((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenBooking = (type = "Bespoke Atelier Package") => {
    setBookingShootType(type);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-[#c5a880]/30 selection:text-white min-h-screen">
      {/* Top Header Banner & Step Selector */}
      <StoryboardHeader currentStep={currentStep} setStep={setCurrentStep} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Area (Steps 1, 2, or 3) */}
            <div className="lg:col-span-7 space-y-8">
              {currentStep === 1 && (
                <EventGrid
                  selectedEvents={selectedEvents}
                  toggleEvent={toggleEvent}
                />
              )}

              {currentStep === 2 && (
                <CrewCustomizer
                  selectedCrew={selectedCrew}
                  toggleCrew={toggleCrew}
                />
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-normal text-white">
                      Handcrafted Albums &amp; Master Deliverables
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
                      Our signature 1-Month Delivery Guarantee promises handcrafted luxury albums and 4K cinema films.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] shrink-0 mt-1">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-serif font-normal text-white mb-1">
                          Signature 1-Month Flush Mount Album Box
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Every multi-day booking includes our premium handcrafted velvet/leather box with gold foil embossed couple initials, HD lustre pages, and lay-flat binding.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] shrink-0 mt-1">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-serif font-normal text-white mb-1">
                          Private Digital Proofing Vault (`SSS Vault`)
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Password-protected high-res proofing portal for brides and grooms to mark album favorites, request 10-bit retouching refinements, and share with family worldwide.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-white/15 text-xs text-zinc-300 hover:text-white uppercase tracking-wider cursor-pointer"
                    >
                      ← Back to Crew Setup
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Controls between steps */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                {currentStep > 1 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="px-5 py-2.5 rounded-xl border border-white/15 text-xs text-zinc-300 hover:text-white uppercase tracking-wider cursor-pointer"
                  >
                    ← Previous Step
                  </button>
                ) : <div />}

                {currentStep < 3 && (
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="px-6 py-2.5 rounded-xl bg-[#c5a880] hover:bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Next: {currentStep === 1 ? "Configure Crew" : "Select Deliverables"}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Sticky Investment Summary Column */}
            <div className="lg:col-span-5 sticky top-28">
              <InvestmentSummary
                selectedEvents={selectedEvents}
                selectedCrew={selectedCrew}
                onOpenBooking={handleOpenBooking}
              />
            </div>

          </div>
        </div>

        {/* Booking Modal Integration */}
        <BookingQuoteModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          prefilledType={bookingShootType}
          prefilledMode="booking"
        />
    </div>
  );
}
