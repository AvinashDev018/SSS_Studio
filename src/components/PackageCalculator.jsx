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
import { Camera, Plane, Users, Video, GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";

// Types/Data
const VIBES = [
  { id: "candid", label: "Candid & Natural", basePrice: 5000, icon: Camera },
  { id: "traditional", label: "Traditional", basePrice: 3000, icon: Users },
  { id: "cinematic", label: "Cinematic Story", basePrice: 8000, icon: Video },
  { id: "drone", label: "Drone Sweeps", basePrice: 4000, icon: Plane },
];

const AVAILABLE_EVENTS = [
  { id: "haldi", label: "Haldi", duration: 3 },
  { id: "mehendi", label: "Mehendi", duration: 4 },
  { id: "sangeet", label: "Sangeet", duration: 5 },
  { id: "wedding", label: "Wedding Ceremony", duration: 8 },
  { id: "reception", label: "Reception", duration: 6 },
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
      className="flex items-center justify-between p-3 mb-2 bg-zinc-800/80 hover:bg-zinc-800 rounded-xl shadow cursor-grab active:cursor-grabbing border border-zinc-700/60 transition-colors"
    >
      <div className="flex items-center gap-2">
        <GripVertical size={16} className="text-zinc-500" />
        <span className="font-medium text-zinc-200">{label}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        className="text-zinc-400 hover:text-red-400 p-1 transition-colors"
        aria-label={`Remove ${label}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default function PackageCalculator() {
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]); // Array of objects { uniqueId, eventId, label, duration }

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

    // Base cost for selected vibes
    const vibesCost = selectedVibes.reduce((acc, vibeId) => {
      const vibe = VIBES.find((v) => v.id === vibeId);
      return acc + (vibe ? vibe.basePrice : 0);
    }, 0);

    // Event cost calculation (simplified: duration * 1000 + vibe markup)
    const eventsCost = timelineEvents.reduce((acc, ev) => {
      return acc + ev.duration * 1500;
    }, 0);

    // Multiplier based on number of events and vibes
    const multiplier = timelineEvents.length > 0 ? (1 + (selectedVibes.length * 0.1)) : 1;

    minTotal = (vibesCost + eventsCost) * multiplier;

    // Ensure some base value if they just clicked around
    if (minTotal === 0 && selectedVibes.length > 0) minTotal = 5000;

    return {
      min: Math.floor(minTotal),
      max: Math.floor(minTotal * 1.3),
    };
  };

  const calculateCrewSize = () => {
    let size = 1; // Base photographer
    if (selectedVibes.includes("cinematic") || selectedVibes.includes("drone")) {
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

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 mb-16 relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 inline-block mb-3">
          Interactive Tool
        </span>
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-2">
          Build-Your-Story Calculator
        </h2>
        <p className="text-zinc-400 text-sm">
          Select your preferred photography vibes and drag-and-drop your timeline events to calculate dynamic estimates.
        </p>
      </div>

      {/* Vibe Selection */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-zinc-200 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">1</span>
          Select Your Vibes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {VIBES.map((vibe) => {
            const isSelected = selectedVibes.includes(vibe.id);
            const Icon = vibe.icon;
            return (
              <button
                key={vibe.id}
                onClick={() => toggleVibe(vibe.id)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <Icon size={28} className={isSelected ? "text-cyan-400" : "text-zinc-400"} />
                <span className="font-medium text-center text-sm">
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
          <h3 className="text-lg font-semibold mb-4 text-zinc-200 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">2</span>
            Available Events
          </h3>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_EVENTS.map((event) => (
              <button
                key={event.id}
                onClick={() => addEvent(event)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-cyan-500/50 rounded-full text-sm font-medium text-zinc-200 transition-all shadow-sm"
              >
                + Add {event.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800/80 shadow-inner min-h-[260px]">
          <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-4">
            Your Event Timeline
          </h3>
          {timelineEvents.length === 0 ? (
            <div className="text-zinc-500 italic text-center py-12 text-sm">
              Click events on the left to add them to your custom timeline.
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
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

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 border-t border-zinc-800/90 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] p-4 md:px-8 md:py-4 z-50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-row gap-6 sm:gap-10 items-center">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
                Estimated Price
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                ₹{estimate.min.toLocaleString()} - ₹{estimate.max.toLocaleString()}
              </p>
            </div>
            <div className="h-8 w-px bg-zinc-800"></div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
                Estimated Crew
              </p>
              <p className="text-lg font-semibold text-zinc-200">
                ~{crewSize} Professionals
              </p>
            </div>
          </div>
          <a
            href="/contact"
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all text-center w-full sm:w-auto"
          >
            Review & Book Estimate
          </a>
        </div>
      </div>
    </div>
  );
}
