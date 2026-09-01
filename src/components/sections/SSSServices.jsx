"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Heart, Baby, Cake, Sparkles, Video, ArrowRight, Check } from "lucide-react";

export default function SSSServices({ onOpenBooking }) {
  const services = [
    {
      id: "wedding",
      title: "Wedding Photography & Rituals",
      category: "Wedding & Event Photo Shoot",
      icon: Heart,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
      description: "Full multi-day coverage covering Muhurtham, Sangeet, Mehendi, Haldi, and grand Receptions.",
      features: ["Traditional & Candid Specialists", "Ultra HD Raw Capture", "Full High-Res Gallery", "20-Day Flush Mount Album"],
    },
    {
      id: "pre-wedding",
      title: "Pre & Post-Wedding Outdoor Shoots",
      category: "Pre-Wedding & Post Wedding Shoot",
      icon: Camera,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504211/tqb10uvuzmqdkuxyqmps.jpg",
      description: "Romantic cinematic concepts across hills, beaches, heritage palaces, and studio backdrops.",
      features: ["Creative Concept Direction", "Sunset & Scenic Highlights", "Outfit Styling Suggestions", "Signature Cinematic Teaser"],
    },
    {
      id: "maternity",
      title: "Maternity & Newborn Milestones",
      category: "Maternity Photo Shoot",
      icon: Baby,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505577/iqimm503wxxauaksjjzt.jpg",
      description: "Gentle, comfortable maternity portraiture and safe, cozy newborn wraps with sanitized studio props.",
      features: ["Sanitized Props & Wraps", "Custom Maternity Gowns", "Gentle Temperature Lighting", "Fine Art Wall Canvas"],
    },
    {
      id: "birthday",
      title: "Birthdays & Family Celebrations",
      category: "Birthday Shoot",
      icon: Cake,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505207/rm2cysblt45dofw4myda.jpg",
      description: "Capture the fun, laughter, and high spirits of milestone birthdays, anniversaries, and family get-togethers.",
      features: ["Cake Smash Setups", "Fast-Action Candid Moments", "Instant Highlight Reel", "Customized Photo Books"],
    },
    {
      id: "makeup",
      title: "Bridal HD Makeup & Saree Draping",
      category: "Makeup Artist Available",
      icon: Sparkles,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504214/eill2s5uvoq7wwabeunx.jpg",
      description: "In-house luxury bridal makeover studio with certified artists using premium international cosmetic brands.",
      features: ["HD & Airbrush Makeup", "Traditional & Modern Hairstyle", "Box Pleat Saree Draping", "On-Venue Bridal Trials"],
    },
    {
      id: "cinematic",
      title: "Cinematic Wedding Films & Teasers",
      category: "Cinematic Wedding Shoot",
      icon: Video,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504208/iydxdch0gcdo1vuea56q.jpg",
      description: "Documentary-style story films with cinema cameras, emotional vows, audio design, and signature color grading.",
      features: ["10-bit Color Grading", "Licensed Cinematic Soundtrack", "1-Min Instagram Teasers", "Full Multi-Cam Event Cut"],
    },
  ];

  return (
    <section id="services" className="py-24 bg-[#0a100e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
            What We Offer
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            Our Photography &amp; Film Services
          </h2>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
            Tailored packages designed for every milestone, crafted with creativity and technical mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-[#0c3530]/40 backdrop-blur-xl border border-teal-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-teal-400/50 transition-all duration-300"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c3530] via-[#0c3530]/40 to-transparent" />
                    
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-teal-300">
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold font-serif text-white mb-2 group-hover:text-teal-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check size={14} className="text-teal-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onOpenBooking(service.category)}
                    className="w-full py-3 bg-white/5 hover:bg-gradient-to-r hover:from-teal-400 hover:to-emerald-400 hover:text-[#071f1b] border border-white/10 hover:border-transparent text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer group-hover:shadow-lg group-hover:shadow-teal-500/20"
                  >
                    Book This Service <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
