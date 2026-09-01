"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Quote, PlusCircle } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Anand & Divya",
    role: "Wedding & Muhurtham Shoot",
    rating: 5,
    text: "SSS Studio team made our wedding day absolutely unforgettable. They were extremely punctual, captured all candid rituals without interrupting, and our fine-art album was delivered in just 18 days!",
    date: "Jan 2026",
    location: "Madurai",
  },
  {
    id: 2,
    name: "Karthik & Revathi",
    role: "Maternity & Outdoor Couple Shoot",
    rating: 5,
    text: "A wonderful experience with SSS Studio! The team created such a warm and comfortable environment during our outdoor maternity shoot. The lighting, custom gowns, and color grading were stunning.",
    date: "Feb 2026",
    location: "Kodaikanal",
  },
  {
    id: 3,
    name: "Meera Krishnan",
    role: "Baby 1st Birthday & Cake Smash",
    rating: 5,
    text: "Booked SSS Studio for my baby's 1st birthday. The photos are vibrant, sharp, and captured all the cute joyful smiles. Prompt delivery and very polite crew!",
    date: "Mar 2026",
    location: "Avaniyapuram",
  },
];

export default function SSSTestimonials({ onOpenReviewModal }) {
  return (
    <section id="testimonials" className="py-24 bg-[#080c0b] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
            <MessageSquare size={14} /> Client Love &amp; Stories
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            What Our Clients Say About SSS Studio
          </h2>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed mb-8">
            Real stories from couples and families whose special memories we have had the honor to capture.
          </p>

          <button
            onClick={onOpenReviewModal}
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] font-bold rounded-full shadow-lg hover:shadow-teal-500/30 hover:scale-105 transition-all duration-300 text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle size={16} /> Leave a Testimonial
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-[#0c3530]/40 backdrop-blur-xl border border-teal-500/20 rounded-3xl p-8 relative flex flex-col justify-between group shadow-xl hover:border-teal-400/40 transition-all duration-300"
            >
              <div>
                <Quote className="text-4xl text-teal-400/20 mb-4" />
                <div className="flex gap-1 text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      size={16}
                      className={sIdx < item.rating ? "fill-amber-400 text-amber-400" : "text-gray-600"}
                    />
                  ))}
                </div>
                <p className="text-zinc-300 italic text-sm md:text-base leading-relaxed mb-6 font-light">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-center mt-auto">
                <div>
                  <h4 className="font-bold text-white text-sm md:text-base">{item.name}</h4>
                  <p className="text-xs text-teal-300 font-medium mt-0.5">{item.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-zinc-500 block">{item.location}</span>
                  <span className="text-[11px] text-zinc-500">{item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
