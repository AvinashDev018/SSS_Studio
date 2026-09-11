"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight, Sparkles, BookOpen, Upload, FileText, Play, Film } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import WeddingAlbumPdfModal from "@/components/ui/WeddingAlbumPdfModal";
import RoundMemoryCarousel from "@/components/ui/RoundMemoryCarousel";
import { getFeaturedPhotos } from "@/app/actions/gallery";

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : url;
};

const CATEGORY_MAP = {
  Weddings: "wedding",
  "Pre-Wedding & Post Wedding": "pre-wedding",
  "Baby Photo Shoot": "baby-maternity",
  "Maternity Shoot": "baby-maternity",
  "Birthday Shoot": "birthday-events",
  "School & College Events": "birthday-events",
};

const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: "Royal South Indian Wedding Showcase",
    storyTitle: "Royal South Indian Wedding Showcase",
    category: "wedding",
    categoryLabel: "Wedding",
    shortName: "Wedding Showcase",
    storyName: "Wedding Showcase",
    avatar: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788884907/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_arch_portrait.jpg",
    description: "Sacred South Indian Muhurtham, garland exchange, Mangalya Dhaaranam, and grand reception captured with timeless cinematic elegance.",
    images: [
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788882990/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_spread_1.png",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788884907/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_arch_portrait.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788884909/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_talambralu_muhurtham.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788882991/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_spread_2.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788882993/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_spread_3.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788882994/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_spread_4.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788882996/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_spread_5.jpg",
    ],
  },
  {
    id: 7,
    title: "Cinematic Wedding Film Teaser (4K Ultra HD)",
    storyTitle: "Cinematic Wedding Highlights & Teaser Film",
    category: "wedding",
    categoryLabel: "Cinematic Film",
    shortName: "Wedding Teaser",
    storyName: "Wedding Teaser 4K",
    avatar: null,
    description: "An emotion-filled 4K cinematic film teaser capturing sacred rituals, aerial drone sweeps, candid family tears, and starlight celebrations.",
    videoUrl: "/videos/wedding-teaser.mp4",
    images: [],
  },
  {
    id: 9,
    title: "Grand Wedding & Reception Highlights (Cinematic Film)",
    storyTitle: "Grand Wedding & Reception Cinematic Highlights",
    category: "wedding",
    categoryLabel: "Wedding & Reception",
    shortName: "Wedding & Reception",
    storyName: "Reception Film",
    avatar: null,
    description: "Starlight evening reception and grand wedding celebration captured with vibrant stage lights, cinematic couple entries, family blessings, and festive energy.",
    videoUrl: "/videos/reception-wedding.mp4",
    images: [],
  },
  {
    id: 4,
    title: "Master K.K. Sathvik 1st Birthday Royal Celebration",
    category: "birthday-events",
    categoryLabel: "Birthdays & Events",
    shortName: "Sathvik 1st B'day",
    avatar: "/images/birthday/sathvik-1st-birthday-portrait.jpg",
    description: "Grand 1st birthday milestone celebration with royal purple theme decor, tender parent moments, cake cutting, and full family celebration.",
    images: [
      "/images/birthday/sathvik-1st-birthday-cake-cutting.jpg",
      "/images/birthday/sathvik-1st-birthday-portrait.jpg",
      "/images/birthday/sathvik-1st-birthday-parents-love.jpg",
      "/images/birthday/sathvik-1st-birthday-family-celebration.jpg",
    ],
  },
  {
    id: 5,
    title: "Royal Crimson Sangeet & Reception Shoot",
    storyTitle: "Royal Crimson Sangeet & Sisterhood Reception Shoot",
    category: "birthday-events",
    categoryLabel: "Events & Shoots",
    shortName: "Sangeet Shoot",
    storyName: "Sangeet Shoot",
    avatar: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788886049/sss_festive_sangeet_shoot/festive_sangeet_sister_duo_portrait.jpg",
    description: "Glamorous crimson silk lehenga styling, ornate bridal jewelry, candid sisterhood moments, and festive warm ambient stage lighting.",
    images: [
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788886066/sss_festive_sangeet_shoot/festive_sangeet_sisters_stage_pose.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788886049/sss_festive_sangeet_shoot/festive_sangeet_sister_duo_portrait.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788886070/sss_festive_sangeet_shoot/festive_sangeet_candid_laughter_moment.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788886057/sss_festive_sangeet_shoot/festive_sangeet_solo_grace_portrait.jpg",
      "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788886062/sss_festive_sangeet_shoot/festive_sangeet_solo_candid_glamour.jpg",
    ],
  },
  {
    id: 10,
    title: "Crimson Velvet Half Saree Portrait Series",
    storyTitle: "Crimson Velvet Half Saree & Henna Portrait Series",
    category: "birthday-events",
    categoryLabel: "Traditional Ceremony",
    shortName: "Crimson Portraits",
    storyName: "Half Saree Portraits",
    avatar: "/images/portfolio/crimson-portrait/crimson-portrait-01.jpg",
    description: "Elegant crimson velvet styling with emerald jewelry, intricate henna art, outdoor golden-hour portraits, and radiant stage celebrations captured in classic SSS Studio color grade.",
    images: [
      "/images/portfolio/crimson-portrait/crimson-portrait-01.jpg",
      "/images/portfolio/crimson-portrait/crimson-portrait-02.jpg",
      "/images/portfolio/crimson-portrait/crimson-portrait-03.jpg",
      "/images/portfolio/crimson-portrait/crimson-henna-detail.jpg",
      "/images/portfolio/crimson-portrait/crimson-portrait-stage.jpg",
      "/images/portfolio/crimson-portrait/crimson-portrait-throne.jpg",
    ],
  },
  {
    id: 11,
    title: "Kids Outdoor Portrait Session — Park & Nature",
    storyTitle: "Kids Outdoor Portrait Session — Park & Nature",
    category: "birthday-events",
    categoryLabel: "Kids & Family",
    shortName: "Kids Outdoor",
    storyName: "Kids Park Portraits",
    avatar: "/images/portfolio/kids-outdoor/kids-boy-portrait-01.jpg",
    description: "Natural daylight kids portraits in a lush park setting — plum formal styling, playful tree-framed poses, and soft candid moments on the lawn.",
    images: [
      "/images/portfolio/kids-outdoor/kids-boy-portrait-01.jpg",
      "/images/portfolio/kids-outdoor/kids-boy-trees.jpg",
      "/images/portfolio/kids-outdoor/kids-boy-full.jpg",
      "/images/portfolio/kids-outdoor/kids-girl-park.jpg",
    ],
  },
  {
    id: 8,
    title: "Grand Puberty Ceremony & Half Saree Celebration — Loshi (Cinematic Teaser)",
    storyTitle: "Traditional Puberty Ceremony Highlights — Loshi",
    category: "birthday-events",
    categoryLabel: "Traditional Ceremony",
    shortName: "Puberty Function",
    storyName: "Puberty Teaser",
    avatar: null,
    description: "Traditional South Indian Puberty Function (Manjal Neerattu Vizha / Half Saree celebration) captured with vibrant colors, floral decor, sacred blessings, and joy.",
    videoUrl: "/videos/loshi.mp4",
    images: [],
  },
];

export default function SSSPortfolio() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [mediaMode, setMediaMode] = useState("photos"); // "photos" | "video"
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const [featuredPhotos, setFeaturedPhotos] = useState([]);

  useEffect(() => {
    getFeaturedPhotos()
      .then((photos) => setFeaturedPhotos(Array.isArray(photos) ? photos : []))
      .catch(() => setFeaturedPhotos([]));
  }, []);

  const categories = useMemo(() => [
    { id: "all", label: t.portfolio.all },
    { id: "wedding", label: t.portfolio.wedding },
    { id: "birthday-events", label: t.portfolio.birthday },
  ], [t]);

  const portfolioProjects = useMemo(() => {
    const byCategory = {};
    featuredPhotos.forEach((photo) => {
      const key = CATEGORY_MAP[photo.category] || "wedding";
      if (!byCategory[key]) byCategory[key] = [];
      byCategory[key].push(photo.url);
    });

    return PORTFOLIO_PROJECTS.map((proj) => {
      const featured = byCategory[proj.category];
      if (!featured?.length || proj.videoUrl) return proj;
      const mergedImages = [...featured, ...(proj.images || [])].filter(
        (url, idx, arr) => arr.indexOf(url) === idx
      );
      return {
        ...proj,
        avatar: featured[0] || proj.avatar,
        images: mergedImages,
        description: `${proj.description} Featured gallery picks from the live studio CMS.`,
      };
    });
  }, [featuredPhotos]);

  const filteredProjects = portfolioProjects.filter((proj) =>
    activeTab === "all" ? true : proj.category === activeTab
  );

  const openLightbox = (proj, mode = null) => {
    setSelectedProject(proj);
    setMediaIndex(0);
    const initialMode = mode || (proj.videoUrl && (!proj.images || proj.images.length === 0) ? "video" : proj.categoryLabel === "Cinematic Film" ? "video" : "photos");
    setMediaMode(initialMode);
    setIsInfoExpanded(true);
  };

  const closeLightbox = () => {
    setSelectedProject(null);
  };

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-[#FFFFFF] text-zinc-900 relative overflow-hidden border-t border-black/5">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/[0.03] border border-[#d4af37]/40 text-[#8b6508] text-xs font-bold uppercase tracking-widest mb-3">
            <Camera size={14} /> {t.portfolio.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-zinc-900 mb-3 sm:mb-4">
            {t.portfolio.title}
          </h2>
          <div className="w-16 h-0.5 bg-[#d4af37] mx-auto rounded-full mb-6" />

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-[#d4af37] border border-[#d4af37]/60 hover:border-[#d4af37] font-extrabold rounded-full shadow-lg hover:scale-105 transition-all text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen size={16} /> 📖 Wedding Album (All 40 Pages)
            </button>
          </div>
        </div>

        {/* Round Memory Disc — removed from top; lives in project cards place below */}

        {/* Instagram-Style Recent Shoot Story Bubbles (Mobile & Tablet Showcase) */}
        <div className="mb-8 block">
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8b6508] flex items-center gap-1.5">
              <Sparkles size={14} /> Recent Client Stories
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">Tap to view photos</span>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {PORTFOLIO_PROJECTS.map((proj) => (
              <button
                key={`story-${proj.id}`}
                onClick={() => openLightbox(proj)}
                className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
              >
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#d4af37] via-amber-300 to-[#b8860b] shadow-md group-hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white bg-zinc-950 flex items-center justify-center">
                    {proj.videoUrl && !proj.avatar ? (
                      <video
                        src={`${proj.videoUrl}#t=1`}
                        preload="metadata"
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <img
                        src={proj.avatar || proj.images?.[0]}
                        alt={proj.storyName || proj.shortName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = proj.images?.[0] || "/images/wedding/spread-1.png";
                        }}
                      />
                    )}
                  </div>
                  {proj.videoUrl ? (
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-zinc-950 text-[#d4af37] border-2 border-[#d4af37] flex items-center justify-center text-[9px] font-black shadow-md" title="4K Teaser Video Available">
                      <Play size={8} className="fill-[#d4af37] ml-0.5" />
                    </span>
                  ) : (
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#d4af37] text-black border-2 border-white flex items-center justify-center text-[9px] font-black shadow">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-zinc-700 max-w-[76px] sm:max-w-[88px] truncate group-hover:text-[#8b6508] transition-colors">
                  {proj.storyName || proj.shortName}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 sm:mb-12">
          {categories.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
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

        {/* Special Wedding E-Album Showcase Banner */}
        {(activeTab === "wedding" || activeTab === "all") && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#d4af37]/40 p-5 sm:p-6 shadow-[0_10px_30px_rgba(212,175,55,0.1)] flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8b6508] p-0.5 shrink-0 shadow-lg">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-[#d4af37]">
                  <BookOpen size={28} />
                </div>
              </div>
              <div className="text-left">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#d4af37] bg-[#d4af37]/15 border border-[#d4af37]/30 px-2.5 py-0.5 rounded-full">
                    ✨ Complete 40-Page Photobook
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Master Wedding Album
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                  Royal South Indian Wedding — Complete 40-Page Photobook
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 max-w-xl">
                  Browse through all 40 high-definition album spreads: sacred Muhurtham ceremonies, garland exchange, and starlight reception. Buttery smooth 60fps with zero lag!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#d4af37] hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen size={15} /> Browse All 40 Pages
              </button>
            </div>
          </motion.div>
        )}

        {/* Mobile Guidance Banner */}
        <div className="flex md:hidden items-center justify-between px-2 mb-1 text-xs text-zinc-500 font-medium">
          <span className="flex items-center gap-1 text-[#8b6508] font-bold">
            Swipe to browse stories ({filteredProjects.length})
          </span>
        </div>

        {/* Portfolio stories — cover-flow 360 */}
        <RoundMemoryCarousel
          items={filteredProjects.map((proj) => ({
            id: proj.id,
            label: proj.storyName || proj.shortName || proj.title,
            image: proj.avatar || proj.images?.[0] || null,
            videoUrl: proj.videoUrl,
            badge: proj.categoryLabel,
            meta: proj.images?.length
              ? `${proj.images.length} photos`
              : proj.videoUrl
              ? "4K teaser"
              : null,
            raw: proj,
          }))}
          onSelect={(proj) => openLightbox(proj)}
          title="Client Stories"
          subtitle="Swipe to browse · Tap the front card to open"
        />
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-zinc-950/95 backdrop-blur-3xl flex items-center justify-center p-0 overflow-hidden"
            style={{ backgroundColor: "rgba(9, 10, 15, 0.97)" }}
          >
            {/* Floating Overlay Header Card */}
            <div className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 max-w-4xl mx-auto z-30 pointer-events-none">
              <div className="bg-zinc-950/85 hover:bg-zinc-950/95 border border-white/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-[0_15px_50px_rgba(0,0,0,0.85)] pointer-events-auto transition-all duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-white pr-2">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        {selectedProject.categoryLabel}
                      </span>
                      {selectedProject.videoUrl && selectedProject.images?.length > 0 ? (
                        <div className="inline-flex items-center p-0.5 bg-black/60 rounded-full border border-white/20 shadow-inner">
                          <button
                            onClick={() => setMediaMode("photos")}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              mediaMode === "photos"
                                ? "bg-[#d4af37] text-black shadow-md"
                                : "text-zinc-300 hover:text-white"
                            }`}
                          >
                            <Camera size={12} /> {selectedProject.images.length} Photos
                          </button>
                          <button
                            onClick={() => setMediaMode("video")}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              mediaMode === "video"
                                ? "bg-[#d4af37] text-black shadow-md"
                                : "text-amber-300 hover:text-white"
                            }`}
                          >
                            <Play size={12} className="fill-current" /> 4K Teaser Video
                          </button>
                        </div>
                      ) : selectedProject.videoUrl ? (
                        <span className="text-[11px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                          <Play size={10} className="fill-amber-300 text-amber-300" /> 4K Cinema Teaser
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-300 font-medium">
                          {selectedProject.images?.length ? `• ${selectedProject.images.length} Photos` : ""}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-white drop-shadow-md leading-snug">
                      {selectedProject.storyTitle || selectedProject.title}
                    </h3>
                    {isInfoExpanded && selectedProject.description && (
                      <p className="text-zinc-200 text-xs mt-1 max-w-2xl leading-relaxed font-normal line-clamp-2">
                        {selectedProject.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                      className="px-2.5 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/20 text-[11px] font-semibold transition-all focus:outline-none cursor-pointer flex items-center gap-1"
                      title={isInfoExpanded ? "Minimize details" : "Show details"}
                    >
                      {isInfoExpanded ? "Hide ▴" : "Details ▾"}
                    </button>
                    <button
                      onClick={closeLightbox}
                      className="p-2 sm:p-2.5 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-white border border-white/30 transition-all focus:outline-none cursor-pointer shadow-lg hover:scale-110"
                      aria-label="Close Gallery"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Viewer - Full Viewport with Overlay Spacing */}
            <div className="w-full h-full max-w-6xl mx-auto flex items-center justify-between pt-36 sm:pt-40 pb-28 sm:pb-32 px-4 sm:px-12 relative my-auto">
              {mediaMode === "photos" && (selectedProject.images?.length || 0) > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const total = selectedProject.images?.length || 0;
                    setMediaIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
                  }}
                  className="absolute left-2 md:-left-4 p-3 sm:p-3.5 rounded-full bg-zinc-900/90 hover:bg-black text-white border border-white/30 transition-all z-20 focus:outline-none cursor-pointer shadow-2xl hover:scale-110"
                  aria-label="Previous"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <div className="w-full h-full flex justify-center items-center overflow-hidden px-2 sm:px-4">
                {mediaMode === "video" && selectedProject.videoUrl ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-4xl aspect-video max-h-[70vh] rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] border-2 border-[#d4af37]/50 bg-black flex items-center justify-center"
                  >
                    {selectedProject.videoUrl?.includes("youtube") || selectedProject.videoUrl?.includes("youtu.be") ? (
                      <iframe
                        src={getYouTubeEmbedUrl(selectedProject.videoUrl)}
                        title={selectedProject.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        key={selectedProject.videoUrl}
                        src={selectedProject.videoUrl}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain bg-black"
                      >
                        Your browser does not support HTML5 video.
                      </video>
                    )}
                  </motion.div>
                ) : (
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
                        className="max-w-full max-h-[72vh] sm:max-h-[75vh] object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/15"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = selectedProject.images?.[0] || "/images/wedding/spread-1.png";
                        }}
                      />
                    ) : null}
                  </AnimatePresence>
                )}
              </div>

              {mediaMode === "photos" && (selectedProject.images?.length || 0) > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const total = selectedProject.images?.length || 0;
                    setMediaIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-2 md:-right-4 p-3 sm:p-3.5 rounded-full bg-zinc-900/90 hover:bg-black text-white border border-white/30 transition-all z-20 focus:outline-none cursor-pointer shadow-2xl hover:scale-110"
                  aria-label="Next"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Bottom Floating Thumbnails & Photo Counter Overlay */}
            <div className="absolute bottom-3 sm:bottom-5 inset-x-0 z-30 pointer-events-none flex flex-col items-center">
              <div className="inline-block bg-zinc-950/85 border border-white/15 px-4 py-1 rounded-full mb-2 shadow-lg backdrop-blur-md pointer-events-auto">
                <p className="text-amber-300 text-xs font-bold tracking-wider flex items-center gap-1.5">
                  {mediaMode === "video" ? (
                    <>
                      <Film size={13} /> 🎬 4K Cinematic Teaser Video
                    </>
                  ) : (
                    `Photo ${mediaIndex + 1} of ${selectedProject.images?.length || 0}`
                  )}
                </p>
              </div>

              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="flex justify-center gap-2 sm:gap-3 overflow-x-auto py-1.5 px-4 max-w-2xl mx-auto no-scrollbar pointer-events-auto">
                  {selectedProject.videoUrl && (
                    <button
                      onClick={() => setMediaMode("video")}
                      className={`relative w-14 h-9 sm:w-16 sm:h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shrink-0 bg-zinc-900 flex flex-col items-center justify-center text-white ${
                        mediaMode === "video"
                          ? "border-[#d4af37] scale-105 shadow-md shadow-[#d4af37]/40 ring-2 ring-[#d4af37]/30"
                          : "border-white/20 opacity-75 hover:opacity-100"
                      }`}
                      title="Watch 4K Teaser Video"
                    >
                      <Play size={14} className="fill-[#d4af37] text-[#d4af37]" />
                      <span className="text-[9px] font-black text-amber-300">TEASER</span>
                    </button>
                  )}

                  {selectedProject.images?.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMediaIndex(i);
                        setMediaMode("photos");
                      }}
                      className={`relative w-12 h-9 sm:w-16 sm:h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shrink-0 ${
                        mediaMode === "photos" && mediaIndex === i
                          ? "border-[#d4af37] scale-105 shadow-md shadow-[#d4af37]/40 ring-2 ring-[#d4af37]/30"
                          : "border-transparent opacity-60 hover:opacity-100"
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

      {/* Wedding Album PDF Viewer & Upload Modal */}
      <WeddingAlbumPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </section>
  );
}
