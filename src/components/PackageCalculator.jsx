"use client";

import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Camera, Users, Video, GripVertical, Trash2, Calculator, Send, Sparkles, HeartHandshake } from "lucide-react";

// Types/Data
const VIBES = [
  { id: "candid", label: "Candid & Natural", basePrice: 5000, icon: Camera },
  { id: "traditional", label: "Traditional Rituals", basePrice: 3000, icon: Users },
  { id: "cinematic", label: "Cinematic Film", basePrice: 8000, icon: Video },
  { id: "portraits", label: "Creative Portraits", basePrice: 4000, icon: Sparkles },
];

const AVAILABLE_EVENTS = [
  { id: "haldi", label: "Haldi", duration: 3 },
  { id: "mehendi", label: "Mehendi", duration: 4 },
  { id: "sangeet", label: "Sangeet", duration: 5 },
  { id: "wedding", label: "Muhurtham / Wedding", duration: 8 },
  { id: "reception", label: "Grand Reception", duration: 6 },
];

const SortableEvent = ({ id, label, onRemove }) => {
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
      className="flex items-center justify-between p-3 mb-2 bg-[#0c3530]/80 hover:bg-[#104b43] rounded-2xl shadow cursor-grab active:cursor-grabbing border border-teal-500/20 transition-colors"
    >
      <div className="flex items-center gap-2">
        <GripVertical size={16} className="text-teal-400/60" />
        <span className="font-medium text-zinc-100 text-sm">{label}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        className="text-zinc-400 hover:text-red-400 p-1 transition-colors cursor-pointer"
        aria-label={`Remove ${label}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default function PackageCalculator({ isEmbedded = false }) {
  const [selectedVibes, setSelectedVibes] = useState(["candid", "traditional"]);
  const [timelineEvents, setTimelineEvents] = useState([
    { id: "wedding", label: "Muhurtham / Wedding", duration: 8, uniqueId: "wedding-init" },
    { id: "reception", label: "Grand Reception", duration: 6, uniqueId: "reception-init" },
  ]);

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

  // Calculations
  const calculateEstimate = () => {
    let minTotal = 0;

    const vibesCost = selectedVibes.reduce((acc, vibeId) => {
      const vibe = VIBES.find((v) => v.id === vibeId);
      return acc + (vibe ? vibe.basePrice : 0);
    }, 0);

    const eventsCost = timelineEvents.reduce((acc, ev) => {
      return acc + ev.duration * 1800;
    }, 0);

    const multiplier = timelineEvents.length > 0 ? 1 + selectedVibes.length * 0.1 : 1;
    minTotal = (vibesCost + eventsCost) * multiplier;

    if (minTotal === 0 && selectedVibes.length > 0) minTotal = 8000;

    return {
      min: Math.floor(minTotal),
      max: Math.floor(minTotal * 1.25),
    };
  };

  const calculateCrewSize = () => {
    let size = 1;
    if (selectedVibes.includes("cinematic")) {
      size += 2;
    }
    if (selectedVibes.includes("traditional")) {
      size += 1;
    }
    if (timelineEvents.length > 2) {
      size += 1;
    }
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
      `✨ *Selected Styles:* ${vibeLabels || "None"}\n` +
      `📅 *Timeline Events:* ${eventLabels || "None"}\n` +
      `👥 *Estimated Crew:* ~${crewSize} Professionals\n` +
      `💰 *Estimated Budget:* ₹${estimate.min.toLocaleString()} - ₹${estimate.max.toLocaleString()}\n` +
      `--------------------------------\n` +
      `Please check availability for these events!`;

    const url = `https://wa.me/917871117875?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 my-16 relative bg-[#0c3530]/50 backdrop-blur-2xl border border-teal-500/20 rounded-3xl shadow-2xl">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Calculator size={14} /> Interactive Custom Estimator
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
          Build-Your-Story Package Calculator
        </h2>
        <p className="text-zinc-300 text-sm md:text-base font-light max-w-2xl mx-auto">
          Customize your shoot coverage by selecting your desired styles and timeline events for an instant quotation.
        </p>
      </div>

      {/* Vibe Selection */}
      <section className="mb-10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-300 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">1</span>
          Select Coverage Styles &amp; Vibes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {VIBES.map((vibe) => {
            const isSelected = selectedVibes.includes(vibe.id);
            const Icon = vibe.icon;
            return (
              <button
                key={vibe.id}
                onClick={() => toggleVibe(vibe.id)}
                className={`p-5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
                  isSelected
                    ? "border-teal-400 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-teal-200 shadow-[0_0_20px_rgba(20,184,166,0.25)] scale-[1.02]"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <Icon size={26} className={isSelected ? "text-teal-400" : "text-zinc-400"} />
                <span className="font-semibold text-center text-xs sm:text-sm">
                  {vibe.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Timeline Builder */}
      <section className="mb-10 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-300 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">2</span>
            Add Event Occasions
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {AVAILABLE_EVENTS.map((event) => (
              <button
                key={event.id}
                onClick={() => addEvent(event)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/40 rounded-full text-xs font-medium text-zinc-200 transition-all cursor-pointer shadow-sm hover:scale-105"
              >
                + Add {event.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#080c0b]/80 p-5 rounded-2xl border border-teal-500/20 shadow-inner min-h-[220px]">
          <h3 className="text-xs uppercase tracking-wider text-teal-400 font-bold mb-4 flex items-center justify-between">
            <span>Your Event Timeline</span>
            <span className="text-[10px] text-zinc-400 font-normal">Drag to reorder</span>
          </h3>
          {timelineEvents.length === 0 ? (
            <div className="text-zinc-500 italic text-center py-10 text-xs">
              Click event buttons on the left to add them to your schedule.
            </div>
          ) : (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={timelineEvents.map((e) => e.uniqueId)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {timelineEvents.map((event) => (
                    <SortableEvent
                      key={event.uniqueId}
                      id={event.uniqueId}
                      label={event.label}
                      onRemove={removeEvent}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </section>

      {/* Summary & Estimate Action */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0c3530] via-[#104b43] to-[#166055] border border-teal-400/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="flex flex-row gap-6 md:gap-10 items-center text-left">
          <div>
            <p className="text-[11px] text-teal-200 uppercase tracking-widest font-bold">
              Estimated Package Quote
            </p>
            <p className="text-2xl md:text-3xl font-bold font-serif text-white mt-0.5">
              ₹{estimate.min.toLocaleString()} – ₹{estimate.max.toLocaleString()}
            </p>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <p className="text-[11px] text-teal-200 uppercase tracking-widest font-bold">
              Recommended Crew
            </p>
            <p className="text-lg md:text-xl font-bold text-white mt-0.5">
              ~{crewSize} Artists
            </p>
          </div>
        </div>

        <button
          onClick={handleSendWhatsApp}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#071f1b] font-bold rounded-full shadow-[0_0_25px_rgba(20,184,166,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
        >
          <Send size={16} /> Send Custom Quote to WhatsApp
        </button>
      </div>
    </div>
  );
}
