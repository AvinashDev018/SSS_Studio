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
import { Camera, Plane, Users, Video } from "lucide-react";

// Types/Data
const VIBES = [
  { id: "candid", label: "Candid & Natural", basePrice: 5000, icon: Camera },
  { id: "traditional", label: "Traditional", basePrice: 3000, icon: Users },
  { id: "cinematic", label: "Cinematic Story", basePrice: 8000, icon: Video },
  { id: "drone", label: "Plane Sweeps", basePrice: 4000, icon: Plane },
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
      className="flex items-center justify-between p-3 mb-2 bg-white rounded shadow cursor-grab active:cursor-grabbing border border-gray-200"
    >
      <span className="font-medium text-gray-700">{label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        className="text-red-500 hover:text-red-700 p-1"
        aria-label={`Remove ${label}`}
      >
        ×
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
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-32 relative min-h-[80vh] bg-gray-50 rounded-xl shadow-sm">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">
        Build Your Story
      </h2>
      <p className="text-gray-600 mb-8">
        Select your preferred photography styles and build your event timeline to get an instant estimate.
      </p>

      {/* Vibe Selection */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          1. Select Your Vibes
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
          {VIBES.map((vibe) => {
            const isSelected = selectedVibes.includes(vibe.id);
            const Icon = vibe.icon;
            return (
              <button
                key={vibe.id}
                onClick={() => toggleVibe(vibe.id)}
                className={`snap-start shrink-0 w-40 h-32 p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                    : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                }`}
              >
                <Icon size={32} className={isSelected ? "text-blue-500" : "text-gray-400"} />
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
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            2. Available Events
          </h3>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_EVENTS.map((event) => (
              <button
                key={event.id}
                onClick={() => addEvent(event)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100 hover:border-gray-400 transition-colors shadow-sm"
              >
                + Add {event.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Your Event Timeline
          </h3>
          {timelineEvents.length === 0 ? (
            <div className="text-gray-400 italic text-center py-8">
              Click events to add them to your timeline.
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 md:p-6 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                Estimated Price
              </p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{estimate.min.toLocaleString()} - ₹{estimate.max.toLocaleString()}
              </p>
            </div>
            <div className="hidden sm:block h-10 w-px bg-gray-300"></div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                Crew Size
              </p>
              <p className="text-lg font-medium text-gray-700">
                ~{crewSize} Professionals
              </p>
            </div>
          </div>
          <button
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors w-full md:w-auto"
            onClick={() => alert("Proceed to booking summary!")}
          >
            Review & Book
          </button>
        </div>
      </div>
    </div>
  );
}
