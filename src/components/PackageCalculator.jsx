"use client";

import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Camera, 
  Users, 
  Video, 
  GripVertical, 
  Trash2, 
  Calculator, 
  Send, 
  Sparkles, 
  Check, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Plus
} from "lucide-react";

// SSS Studio Photography Styles
const VIBES = [
  { 
    id: "candid", 
    label: "Candid & Natural", 
    tagline: "Unposed genuine emotions & moments",
    basePrice: 6000, 
    icon: Camera 
  },
  { 
    id: "traditional", 
    label: "Traditional Rituals", 
    tagline: "Complete Muhurtham & family rituals",
    basePrice: 4000, 
    icon: Users 
  },
  { 
    id: "cinematic", 
    label: "Cinematic 4K Video", 
    tagline: "120 FPS slow-mo & drone highlights",
    basePrice: 10000, 
    icon: Video 
  },
  { 
    id: "portraits", 
    label: "Creative Portraits", 
    tagline: "Fine-art couple & bridal framing",
    basePrice: 5000, 
    icon: Sparkles 
  },
];

// SSS Studio Real Celebration Occasions
const AVAILABLE_EVENTS = [
  { id: "engagement", label: "Engagement / Nichayathartham", duration: 4, icon: "💍" },
  { id: "wedding", label: "Muhurtham / Wedding Ceremony", duration: 8, icon: "🪔" },
  { id: "reception", label: "Grand Evening Reception", duration: 6, icon: "✨" },
  { id: "prewedding", label: "Pre-Wedding Outdoor Shoot", duration: 5, icon: "🌿" },
  { id: "baby", label: "Baby / 1st Birthday Shoot", duration: 3, icon: "🎂" },
  { id: "maternity", label: "Outdoor Maternity Session", duration: 3, icon: "🌸" },
];

const SortableEvent = ({ id, label, duration, onRemove, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-3.5 mb-2 bg-[#081210]/90 hover:bg-[#0d1e1a] rounded-2xl shadow-md cursor-grab active:cursor-grabbing border border-teal-500/25 transition-all group hover:border-teal-400/60"
    >
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center text-[11px] font-bold shrink-0">
          {index + 1}
        </span>
        <div>
          <span className="font-bold text-white text-xs sm:text-sm block">{label}</span>
          <span className="text-[11px] text-teal-400/80 font-light flex items-center gap-1 mt-0.5">
            <Clock size={11} /> ~{duration} Hours Coverage
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <GripVertical size={16} className="text-zinc-500 group-hover:text-teal-400 transition-colors" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
          aria-label={`Remove ${label}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default function PackageCalculator({ isEmbedded = false }) {
  const [mounted, setMounted] = useState(false);
  const [selectedVibes, setSelectedVibes] = useState(["candid", "traditional"]);
  const [timelineEvents, setTimelineEvents] = useState([
    { id: "wedding", label: "Muhurtham / Wedding Ceremony", duration: 8, uniqueId: "wedding-init" },
    { id: "reception", label: "Grand Evening Reception", duration: 6, uniqueId: "reception-init" },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleVibe = (vibeId) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeId)
        ? prev.filter((id) => id !== vibeId)
        : [...prev, vibeId]
    );
  };

  const addEvent = (event) => {
    setTimelineEvents((prev) => [
      ...prev,
      { ...event, uniqueId: `${event.id}-${Date.now()}` },
    ]);
  };

  const removeEvent = (uniqueId) => {
    setTimelineEvents((prev) => prev.filter((e) => e.uniqueId !== uniqueId));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setTimelineEvents((items) => {
        const oldIndex = items.findIndex((item) => item.uniqueId === active.id);
        const newIndex = items.findIndex((item) => item.uniqueId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Accurate transparent estimation logic
  const calculateEstimate = () => {
    let minTotal = 0;

    const vibesCost = selectedVibes.reduce((acc, vibeId) => {
      const vibe = VIBES.find((v) => v.id === vibeId);
      return acc + (vibe ? vibe.basePrice : 0);
    }, 0);

    const eventsCost = timelineEvents.reduce((acc, ev) => {
      return acc + ev.duration * 2200;
    }, 0);

    const multiplier = timelineEvents.length > 0 ? 1 + selectedVibes.length * 0.08 : 1;
    minTotal = (vibesCost + eventsCost) * multiplier;

    if (minTotal === 0 && selectedVibes.length > 0) minTotal = 12000;

    return {
      min: Math.floor(minTotal),
      max: Math.floor(minTotal * 1.25),
    };
  };

  const calculateCrewSize = () => {
    let size = 1;
    if (selectedVibes.includes("cinematic")) size += 2;
    if (selectedVibes.includes("traditional")) size += 1;
    if (timelineEvents.length > 2) size += 1;
    return size;
  };

  const estimate = calculateEstimate();
  const crewSize = calculateCrewSize();

  const handleSendWhatsApp = () => {
    const vibeLabels = selectedVibes
      .map((id) => VIBES.find((v) => v.id === id)?.label)
      .filter(Boolean)
      .join(", ");
    const eventLabels = timelineEvents.map((e) => e.label).join(", ");

    const msg = `🧾 *Custom Shoot Estimation Request* 🧾\n` +
      `--------------------------------\n` +
      `📸 *Coverage Styles:* ${vibeLabels || "Standard"}\n` +
      `📅 *Selected Events:* ${eventLabels || "None"}\n` +
      `👥 *Recommended Crew:* ~${crewSize} Studio Artists\n` +
      `💰 *Estimated Budget:* ₹${estimate.min.toLocaleString()} - ₹${estimate.max.toLocaleString()}\n` +
      `🛡️ *Guarantee:* 1-Month Album Delivery\n` +
      `--------------------------------\n` +
      `Hello SSS Studio team, please check availability for our celebration dates!`;

    const url = `https://wa.me/916383565425?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto p-8 my-16 bg-[#0c221e]/40 border border-teal-500/20 rounded-3xl min-h-[420px] flex items-center justify-center">
        <div className="text-teal-400 font-serif flex items-center gap-2 animate-pulse">
          <Calculator size={20} /> Loading Story Calculator...
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto my-16 px-4 sm:px-6">
      <div className="relative bg-gradient-to-b from-[#0c221e]/90 via-[#0a1815]/85 to-[#071310]/95 backdrop-blur-2xl border border-teal-500/30 rounded-[32px] p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-teal-500/10 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="mb-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3 shadow-inner">
            <Calculator size={13} /> Instant Custom Estimator
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 tracking-tight">
            Build-Your-Story Package Calculator
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Choose your signature coverage styles and celebration events to generate an instant, transparent quote customized for your dates.
          </p>
        </div>

        {/* Step 1: Coverage Style Cards */}
        <div className="mb-10 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-500/30">
                1
              </span>
              Select Coverage Styles &amp; Vibes
            </h3>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">Click to toggle styles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VIBES.map((vibe) => {
              const isSelected = selectedVibes.includes(vibe.id);
              const Icon = vibe.icon;

              return (
                <button
                  key={vibe.id}
                  onClick={() => toggleVibe(vibe.id)}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? "border-teal-400 bg-gradient-to-br from-teal-500/25 via-emerald-500/15 to-[#0c221e] text-white shadow-[0_0_25px_rgba(20,184,166,0.3)] scale-[1.02]"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:border-teal-500/30 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  {/* Selected Pill Badge */}
                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-teal-400 text-[#071f1b] flex items-center justify-center shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  <div>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 transition-transform group-hover:scale-110 ${
                      isSelected ? "bg-teal-400 text-[#071f1b]" : "bg-white/10 text-teal-300"
                    }`}>
                      <Icon size={22} />
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-white mb-1">{vibe.label}</h4>
                    <p className="text-[11px] text-zinc-400 font-light leading-snug">{vibe.tagline}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-teal-300 font-bold">+₹{vibe.basePrice.toLocaleString()} base</span>
                    <span className={`text-[10px] font-semibold uppercase ${isSelected ? "text-teal-300" : "text-zinc-500"}`}>
                      {isSelected ? "Included" : "Add"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Event Occasions & Timeline Builder */}
        <div className="mb-10 grid md:grid-cols-2 gap-6 relative z-10">
          {/* Left: Add Event Occasions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-500/30">
                  2
                </span>
                Add Celebration Occasions
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_EVENTS.map((event) => (
                <button
                  key={event.id}
                  onClick={() => addEvent(event)}
                  className="px-3.5 py-3 bg-[#081210]/80 hover:bg-[#0c1f1a] border border-white/10 hover:border-teal-400/50 rounded-2xl text-xs font-semibold text-zinc-200 transition-all cursor-pointer shadow-sm hover:scale-[1.02] flex items-center justify-between text-left group"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span>{event.icon}</span>
                    <span className="truncate">{event.label}</span>
                  </span>
                  <Plus size={14} className="text-teal-400 shrink-0 group-hover:rotate-90 transition-transform" />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 font-light mt-3">
              Tap any celebration above to add it to your custom photoshoot schedule.
            </p>
          </div>

          {/* Right: Scheduled Timeline Box */}
          <div className="bg-[#080f0d]/90 p-5 rounded-3xl border border-teal-500/25 shadow-inner flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-white/10">
                <span className="text-xs uppercase tracking-wider text-teal-300 font-bold flex items-center gap-1.5">
                  <Calendar size={13} className="text-teal-400" />
                  Your Event Timeline ({timelineEvents.length})
                </span>
                <span className="text-[10px] text-zinc-400 font-normal">↕ Drag to reorder</span>
              </div>

              {timelineEvents.length === 0 ? (
                <div className="text-zinc-400 italic text-center py-12 text-xs font-light">
                  No occasions added yet. Click any celebration on the left.
                </div>
              ) : (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={timelineEvents.map((e) => e.uniqueId)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                      {timelineEvents.map((event, idx) => (
                        <SortableEvent
                          key={event.uniqueId}
                          id={event.uniqueId}
                          index={idx}
                          label={event.label}
                          duration={event.duration}
                          onRemove={removeEvent}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {timelineEvents.length > 0 && (
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Total Scheduled Coverage:</span>
                <span className="font-bold text-teal-300">
                  ~{timelineEvents.reduce((acc, e) => acc + (e.duration || 4), 0)} Hours
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Redesigned VIP Quote Card & WhatsApp Action */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0c2a23] via-[#0f3830] to-[#0a201b] border-2 border-teal-400/50 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Subtle Decorative Gradient Orb */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left: Estimate and Crew Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 text-left w-full lg:w-auto">
            <div>
              <span className="text-[10px] sm:text-[11px] text-teal-300 uppercase tracking-widest font-extrabold block mb-1">
                Estimated Package Investment
              </span>
              <div className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight">
                ₹{estimate.min.toLocaleString()} – ₹{estimate.max.toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-300 font-light mt-1 flex items-center gap-1.5">
                <Sparkles size={12} className="text-teal-400" />
                Includes Master RAW Files + 10-Bit Color Grading
              </p>
            </div>

            <div className="hidden sm:block h-12 w-[1px] bg-teal-500/30" />

            <div>
              <span className="text-[10px] sm:text-[11px] text-teal-300 uppercase tracking-widest font-extrabold block mb-1">
                Recommended Crew &amp; Turnaround
              </span>
              <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Users size={16} className="text-teal-400" />
                ~{crewSize} Dedicated Artists
              </div>
              <p className="text-[11px] text-amber-300 font-semibold mt-1 flex items-center gap-1">
                <ShieldCheck size={13} /> 1-Month (30 Days) Album Guarantee
              </p>
            </div>
          </div>

          {/* Right: Instant Send to WhatsApp Button */}
          <button
            onClick={handleSendWhatsApp}
            className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:from-emerald-300 hover:to-teal-300 text-[#071f1b] font-black rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm uppercase tracking-wider cursor-pointer shrink-0"
          >
            <Send size={16} className="stroke-[2.5]" />
            <span>Send Custom Quote to WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
}
