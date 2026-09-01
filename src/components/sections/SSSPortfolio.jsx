"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
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
    title: "Cinematic Hills Pre-Wedding Story",
    category: "pre-wedding",
    categoryLabel: "Pre / Post Wedding",
    description: "Golden hour romance and scenic landscape vistas captured across tea estates and misty hills.",
    videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
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

const parseVideoUrl = (url) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch && ytMatch[1]) {
    return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1` };
  }
  return { type: "direct", url };
};

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

  const totalMediaCount = (proj) => {
    if (!proj) return 0;
    return (proj.videoUrl ? 1 : 0) + (proj.images ? proj.images.length : 0);
  };

  return (
    <section id="portfolio" className="py-24 bg-[#080c0b] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Camera size={14} /> {t.portfolio.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            {t.portfolio.title}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 mx-auto rounded-full" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer border ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] border-transparent font-bold shadow-lg shadow-teal-500/20 scale-105"
                  : "bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                onClick={() => openLightbox(proj)}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between cursor-pointer group hover:border-teal-400/40 transition-all duration-300"
              >
                <div>
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-zinc-900">
                    <img
                      src={proj.images[0]}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <span className="absolute top-4 left-4 text-[11px] font-bold text-teal-300 bg-teal-950/80 border border-teal-400/30 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                      {proj.categoryLabel}
                    </span>

                    {proj.videoUrl && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
                        <Play size={10} className="fill-current" /> Video
                      </span>
                    )}

                    {proj.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-teal-400 text-[#071f1b] flex items-center justify-center pl-1 shadow-lg shadow-teal-400/30 group-hover:scale-125 transition-transform duration-300">
                          <Play size={16} className="fill-current" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold font-serif text-white mb-2 group-hover:text-teal-300 transition-colors duration-300">
                      {proj.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-light">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 mt-auto">
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    <span>
                      {proj.images ? `${proj.images.length} Photos` : ""}
                      {proj.videoUrl ? " + Video Film" : ""}
                    </span>
                    <span className="text-teal-400 group-hover:underline flex items-center gap-1">
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
                <span className="text-[10px] font-bold text-teal-400 bg-teal-950/80 border border-teal-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
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
              {totalMediaCount(selectedProject) > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const total = totalMediaCount(selectedProject);
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
                  {(() => {
                    if (selectedProject.videoUrl && mediaIndex === 0) {
                      const video = parseVideoUrl(selectedProject.videoUrl);
                      return (
                        <motion.div
                          key="video-slide"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full h-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex justify-center items-center bg-black"
                        >
                          {video?.type === "youtube" ? (
                            <iframe
                              src={video.embedUrl}
                              title={selectedProject.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video src={video?.url} controls autoPlay className="w-full h-full object-contain bg-black" />
                          )}
                        </motion.div>
                      );
                    }

                    const imgIndex = selectedProject.videoUrl ? mediaIndex - 1 : mediaIndex;
                    return selectedProject.images && selectedProject.images[imgIndex] ? (
                      <motion.img
                        key={mediaIndex}
                        src={selectedProject.images[imgIndex]}
                        alt={selectedProject.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
                      />
                    ) : null;
                  })()}
                </AnimatePresence>
              </div>

              {totalMediaCount(selectedProject) > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const total = totalMediaCount(selectedProject);
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
                {selectedProject.videoUrl && mediaIndex === 0
                  ? "Featured Cinematic Film"
                  : `Photo ${selectedProject.videoUrl ? mediaIndex : mediaIndex + 1} of ${selectedProject.images?.length || 0}`}
              </p>

              {totalMediaCount(selectedProject) > 1 && (
                <div className="flex justify-center gap-3 overflow-x-auto py-2">
                  {selectedProject.videoUrl && (
                    <button
                      onClick={() => setMediaIndex(0)}
                      className={`relative w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center bg-teal-950/60 ${
                        mediaIndex === 0
                          ? "border-teal-400 scale-105 shadow-md shadow-teal-400/30"
                          : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                    >
                      <Play size={14} className="text-teal-400 fill-current" />
                      <span className="text-[8px] uppercase tracking-wider text-teal-300 font-bold mt-1">Video</span>
                    </button>
                  )}

                  {selectedProject.images?.map((img, i) => {
                    const idx = selectedProject.videoUrl ? i + 1 : i;
                    return (
                      <button
                        key={i}
                        onClick={() => setMediaIndex(idx)}
                        className={`relative w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                          mediaIndex === idx
                            ? "border-teal-400 scale-105 shadow-md shadow-teal-400/30"
                            : "border-transparent opacity-50 hover:opacity-80"
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
