"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: "Royal Traditional Muhurtham",
    category: "wedding",
    categoryLabel: "Wedding",
    description: "Full traditional rituals and authentic candid moments captured with vibrant South Indian ceremony tones.",
    videoUrl: "",
    images: [
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504208/iydxdch0gcdo1vuea56q.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504209/y4t69imuaktbevg8re57.jpg",
    ],
  },
  {
    id: 2,
    title: "Hills Pre-Wedding Story",
    category: "pre-wedding",
    categoryLabel: "Pre / Post Wedding",
    description: "Golden hour romance and scenic landscape vistas captured across tea estates and misty hills.",
    videoUrl: "",
    images: [
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504211/tqb10uvuzmqdkuxyqmps.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504212/ksq2vkwzniqlgsly5k6p.jpg",
    ],
  },
  {
    id: 3,
    title: "Serene Outdoor Maternity Shoot",
    category: "baby-maternity",
    categoryLabel: "Baby & Maternity",
    description: "Ethereal glow, custom gown styling, and tender candid love celebrating the arrival of new life.",
    videoUrl: "",
    images: [
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505577/iqimm503wxxauaksjjzt.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504214/eill2s5uvoq7wwabeunx.jpg",
    ],
  },
  {
    id: 4,
    title: "Joyous 1st Birthday Carnival Celebration",
    category: "birthday-events",
    categoryLabel: "Birthdays & Events",
    description: "Colorful balloon decor, cake smash moments, and joyful family celebrations documented with crisp clarity.",
    videoUrl: "",
    images: [
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505207/rm2cysblt45dofw4myda.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504215/da4knrrkqpznhaip7xx4.jpg",
    ],
  },
  {
    id: 5,
    title: "Grand Sangeet & Reception Night",
    category: "wedding",
    categoryLabel: "Wedding",
    description: "High-energy dance performances, stage lighting, and glamorous couple portraits under the stars.",
    videoUrl: "",
    images: [
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504209/y4t69imuaktbevg8re57.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg",
    ],
  },
  {
    id: 6,
    title: "Newborn Dreamland Portraiture",
    category: "baby-maternity",
    categoryLabel: "Baby & Maternity",
    description: "Safe, cozy setups with adorable organic wraps and handcrafted wooden cradles.",
    videoUrl: "",
    images: [
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504214/eill2s5uvoq7wwabeunx.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505577/iqimm503wxxauaksjjzt.jpg",
    ],
  },
];


export default function SSSPortfolio() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [mediaIndex, setMediaIndex] = useState(0);

  const categories = [
    { id: "all", label: t.portfolio.all },
    { id: "wedding", label: t.portfolio.wedding },
    { id: "pre-wedding", label: t.portfolio.preWedding },
    { id: "baby-maternity", label: t.portfolio.maternity },
    { id: "birthday-events", label: t.portfolio.birthday },
  ];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((proj) =>
    activeTab === "all" ? true : proj.category === activeTab
  );

  const openLightbox = (proj) => {
    setSelectedProject(proj);
    setMediaIndex(0);
  };

  const closeLightbox = () => {
    setSelectedProject(null);
  };


  return (
    <section id="portfolio" className="py-24 bg-[#FFFFFF] text-zinc-900 relative overflow-hidden border-t border-black/5">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/[0.03] border border-[#d4af37]/40 text-[#8b6508] text-xs font-bold uppercase tracking-widest mb-3">
            <Camera size={14} /> {t.portfolio.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-zinc-900 mb-4">
            {t.portfolio.title}
          </h2>
          <div className="w-16 h-0.5 bg-[#d4af37] mx-auto rounded-full" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {categories.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#d4af37] text-black shadow-md"
                    : "bg-black/[0.04] text-zinc-600 hover:text-black border border-black/10 hover:border-black/20 hover:bg-black/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                whileHover={{ y: -8 }}
                onClick={() => openLightbox(proj)}
                className="bg-white border-2 border-[#d4af37]/70 hover:border-[#d4af37] rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(212,175,55,0.12)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] flex flex-col justify-between cursor-pointer group transition-all duration-300 relative"
              >
                {/* Thin Inner Gold Accent Border Frame */}
                <div className="absolute inset-1 border border-[#d4af37]/30 rounded-[14px] pointer-events-none z-10" />

                <div>
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-zinc-100">
                    <img
                      src={proj.images[0]}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <span className="absolute top-4 left-4 text-[10px] font-extrabold text-[#8b6508] bg-white/95 border border-[#d4af37]/40 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md shadow-sm">
                      {proj.categoryLabel}
                    </span>

                    {/* All-Caps Category Bottom Frame Label (Matches Reference Image) */}
                    <div className="absolute bottom-3 left-4 right-4 text-center">
                      <span className="font-serif text-base tracking-[0.25em] font-extrabold text-white uppercase drop-shadow-lg">
                        {proj.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 text-left">
                    <h3 className="text-xl font-serif font-bold text-zinc-900 mb-2 group-hover:text-[#b8860b] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-zinc-600 text-xs line-clamp-2 font-light leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 mt-auto">
                  <div className="border-t border-black/10 pt-4 flex justify-between items-center text-xs text-zinc-600 font-bold uppercase tracking-wider">
                    <span className="text-[11px] text-zinc-500">
                      {proj.images ? `${proj.images.length} High-Res Photos` : ""}
                    </span>
                    <span className="text-[#8b6508] group-hover:underline flex items-center gap-1 font-extrabold">
                      View Story →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/98 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full max-w-6xl mx-auto z-10 pt-2 gap-4">
              <div className="text-white">
                <span className="text-[10px] font-semibold text-[#c5a880] bg-[#c5a880]/15 border border-[#c5a880]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedProject.categoryLabel}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold mt-2">
                  {selectedProject.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1 max-w-2xl hidden md:block">
                  {selectedProject.description}
                </p>
              </div>

              <button
                onClick={closeLightbox}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none cursor-pointer self-end sm:self-auto"
                aria-label="Close Gallery"
              >
                <X size={20} />
              </button>
            </div>

            {/* Media Viewer */}
            <div className="flex items-center justify-between w-full max-w-5xl mx-auto h-[60vh] relative my-auto">
              {(selectedProject.images?.length || 0) > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const total = selectedProject.images?.length || 0;
                    setMediaIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
                  }}
                  className="absolute left-0 md:-left-16 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 focus:outline-none cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <div className="w-full h-full flex justify-center items-center overflow-hidden px-4">
                <AnimatePresence mode="wait">
                  {selectedProject.images && selectedProject.images[mediaIndex] ? (
                    <motion.img
                      key={mediaIndex}
                      src={selectedProject.images[mediaIndex]}
                      alt={selectedProject.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
                      />
                  ) : null}
                </AnimatePresence>
              </div>

              {(selectedProject.images?.length || 0) > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const total = selectedProject.images?.length || 0;
                    setMediaIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-0 md:-right-16 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 focus:outline-none cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails */}
            <div className="w-full max-w-3xl mx-auto text-center z-10 pb-4">
              <p className="text-gray-400 text-xs mb-3 font-medium">
                {`Photo ${mediaIndex + 1} of ${selectedProject.images?.length || 0}`}
              </p>

              {(selectedProject.images?.length || 0) > 1 && (
                <div className="flex justify-center gap-3 overflow-x-auto py-2">
                  {selectedProject.images?.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMediaIndex(i)}
                      className={`relative w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                        mediaIndex === i
                          ? "border-[#c5a880] scale-105 shadow-md shadow-[#c5a880]/30"
                          : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
