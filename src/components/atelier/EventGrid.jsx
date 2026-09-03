"use client";

import React from "react";
import { Check, Calendar, Clock, Sparkles } from "lucide-react";

export const EVENTS_DATA = [
  {
    id: "muhurtham",
    title: "Royal Muhurtham",
    subtitle: "Traditional Rituals & Sacred Mandapam Ceremonies",
    image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788426852/sss-hero-wedding.jpg",
    defaultDuration: 8,
    includedDeliverables: "Full Ceremony Film + Complete Stills Gallery",
    category: "Core Wedding",
  },
  {
    id: "sangeet",
    title: "Sangeet & Musical Night",
    subtitle: "High-Energy Stage Performances & Gala Celebrations",
    image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504209/y4t69imuaktbevg8re57.jpg",
    defaultDuration: 6,
    includedDeliverables: "Sangeet Highlight Reel + Party Candids",
    category: "Pre-Wedding Event",
  },
  {
    id: "haldi-mehendi",
    title: "Haldi & Mehendi Ceremony",
    subtitle: "Vibrant Color Rituals & Intimate Family Expressions",
    image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504208/iydxdch0gcdo1vuea56q.jpg",
    defaultDuration: 5,
    includedDeliverables: "Color Grade Story + Micro Teaser",
    category: "Pre-Wedding Event",
  },
  {
    id: "pre-wedding-shoot",
    title: "Scenic Outdoor Pre-Wedding",
    subtitle: "Cinematic Couple Session at Scenic Hillside / Beach",
    image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504211/tqb10uvuzmqdkuxyqmps.jpg",
    defaultDuration: 6,
    includedDeliverables: "10-Bit Cinematic Teaser + Fine-Art Canvas",
    category: "Couple Special",
  },
  {
    id: "reception",
    title: "Grand Reception Gala",
    subtitle: "High-Fashion Evening Portraits & Guest Greetings",
    image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
    defaultDuration: 6,
    includedDeliverables: "Reception Cinema + Full Stage Candids",
    category: "Post-Wedding Event",
  },
  {
    id: "post-wedding-shoot",
    title: "Post-Wedding Story Session",
    subtitle: "Relaxed Romantic Couple Session Post Ceremonies",
    image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504212/ksq2vkwzniqlgsly5k6p.jpg",
    defaultDuration: 4,
    includedDeliverables: "Luxury Portrait Album Selects",
    category: "Couple Special",
  },
];

export default function EventGrid({ selectedEvents, toggleEvent }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-normal text-white">
            Select Wedding Events &amp; Celebrations
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Choose the multi-day functions you want SSS Studio's master team to document.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#c5a880] bg-[#c5a880]/10 border border-[#c5a880]/30 px-3.5 py-1.5 rounded-full">
          {selectedEvents.length} Events Selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS_DATA.map((evt) => {
          const isSelected = selectedEvents.includes(evt.id);

          return (
            <div
              key={evt.id}
              onClick={() => toggleEvent(evt.id)}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                isSelected
                  ? "bg-[#161616] border-[#c5a880] shadow-[0_0_25px_rgba(197,168,128,0.2)]"
                  : "bg-[#111111] border-white/10 hover:border-white/25 hover:bg-[#141414]"
              }`}
            >
              {/* Event Cover Image */}
              <div className="relative h-48 overflow-hidden bg-zinc-900">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isSelected ? "scale-105" : "group-hover:scale-105 opacity-80"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />

                {/* Selection Checkmark Badge */}
                <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? "bg-[#c5a880] text-black shadow-lg scale-110"
                    : "bg-black/60 border border-white/20 text-white/50 group-hover:text-white"
                }`}>
                  <Check size={16} strokeWidth={2.5} />
                </div>

                {/* Event Category Tag */}
                <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wider text-zinc-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  {evt.category}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`text-lg font-serif font-normal mb-1 transition-colors ${
                    isSelected ? "text-[#c5a880]" : "text-white group-hover:text-[#c5a880]"
                  }`}>
                    {evt.title}
                  </h3>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed mb-4">
                    {evt.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-[#c5a880]" />
                    <span>~{evt.defaultDuration} Hours Coverage</span>
                  </span>
                  <span className="text-[11px] text-[#c5a880] font-medium">
                    {isSelected ? "Included ✓" : "+ Add Event"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
