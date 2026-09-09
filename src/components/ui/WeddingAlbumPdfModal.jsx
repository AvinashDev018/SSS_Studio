"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Download,
  Sparkles,
  BookOpen,
  Share2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  ZoomIn
} from "lucide-react";

// All 41 Pages extracted directly from the uploaded Wedding Album PDF
// web: ~280KB progressive JPEG for instantaneous 60fps main display
// thumb: ~6KB micro-JPEG for instantaneous filmstrip carousel loading
export const WEDDING_ALBUM_PAGES = Array.from({ length: 41 }, (_, i) => {
  const pageNum = i + 1;
  const pad = String(pageNum).padStart(2, "0");
  const isCover = pageNum === 1;

  return {
    id: pageNum,
    page: pageNum,
    title: isCover
      ? "Royal South Indian Wedding — Master Cover Spread"
      : `Royal South Indian Wedding — Album Spread ${pageNum - 1}`,
    subtitle: isCover
      ? "Royal South Indian Wedding Photobook"
      : `Spread ${pageNum - 1} of 40 • Sacred Muhurtham & Reception Celebrations`,
    image: `/images/wedding-album/web/page-${pad}.jpg`,
    thumb: `/images/wedding-album/thumbs/page-${pad}.jpg`,
    original: `/images/wedding-album/page-${pad}.jpg`,
    details: isCover ? "Front Cover & Title Page" : `Page ${pageNum} of 41 • 12x36 Seamless Layflat Photobook`,
  };
});

export default function WeddingAlbumPdfModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState("spreads"); // 'spreads' | 'pdf'
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const thumbnailsRef = useRef(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === WEDDING_ALBUM_PAGES.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? WEDDING_ALBUM_PAGES.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsAnimationDone(false);
      const timer = setTimeout(() => setIsAnimationDone(true), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Smart Preloader: Preload next 3 pages and previous 1 page into browser cache
  useEffect(() => {
    if (!isOpen) return;
    setIsImageLoading(true);

    const preloadIndices = [
      currentIndex + 1,
      currentIndex + 2,
      currentIndex + 3,
      currentIndex - 1,
    ].filter((idx) => idx >= 0 && idx < WEDDING_ALBUM_PAGES.length);

    preloadIndices.forEach((idx) => {
      const img = new Image();
      img.src = WEDDING_ALBUM_PAGES[idx].image;
    });
  }, [currentIndex, isOpen]);

  // Auto-scroll thumbnail bar to keep the active page in view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[currentIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (viewMode === "spreads") {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "Home") setCurrentIndex(0);
        if (e.key === "End") setCurrentIndex(WEDDING_ALBUM_PAGES.length - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, viewMode]);

  if (!isOpen) return null;

  const currentPage = WEDDING_ALBUM_PAGES[currentIndex] || WEDDING_ALBUM_PAGES[0];

  const handleShareWhatsApp = () => {
    const fullUrl = window.location.origin + "#portfolio";
    const text = encodeURIComponent(
      `Check out the Complete 40-Page Royal Wedding Photobook Album for Srijitha + Sreeraj (11.05.2025) by SSS Photography Studio! 📸💍✨\n\nPreview all 40 pages here: ${fullUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/92 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          onAnimationComplete={() => setIsAnimationDone(true)}
          className="bg-zinc-950 border border-[#d4af37]/40 rounded-2xl w-full max-w-6xl h-[94vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.15)] overflow-hidden relative"
        >
          {/* Top Header Bar */}
          <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border-b border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8b6508] p-0.5 flex items-center justify-center shadow-lg shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-[#d4af37]">
                  <BookOpen size={18} />
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 flex items-center gap-1">
                    <Sparkles size={11} /> Complete 40-Page Photobook
                  </span>
                  {viewMode === "spreads" ? (
                    <span className="text-[10px] text-zinc-400">
                      • Page {currentIndex + 1} of {WEDDING_ALBUM_PAGES.length}
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> Full Master PDF Loaded
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-base font-serif font-bold text-white mt-0.5 truncate max-w-[220px] sm:max-w-md">
                  Royal South Indian Wedding Showcase
                </h3>
              </div>
            </div>

            {/* Mode Toggle & Actions */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Dual-Mode Selector: Spreads vs Live PDF */}
              <div className="flex items-center bg-zinc-900/90 p-0.5 sm:p-1 rounded-xl border border-[#d4af37]/30 shadow-inner">
                <button
                  onClick={() => setViewMode("spreads")}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "spreads"
                      ? "bg-[#d4af37] text-black shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Layers size={13} />
                  <span>All 40 Pages</span>
                </button>
                <button
                  onClick={() => setViewMode("pdf")}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "pdf"
                      ? "bg-[#d4af37] text-black shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <FileText size={13} />
                  <span>PDF Document</span>
                </button>
              </div>

              {/* Page Jump Selector in Spreads Mode */}
              {viewMode === "spreads" && (
                <div className="hidden lg:flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-300">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Jump:</span>
                  <select
                    value={currentIndex}
                    onChange={(e) => setCurrentIndex(Number(e.target.value))}
                    className="bg-transparent text-[#d4af37] font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    {WEDDING_ALBUM_PAGES.map((p, idx) => (
                      <option key={`opt-${p.id}`} value={idx} className="bg-zinc-900 text-white">
                        {p.isCover || idx === 0 ? "Cover Spread" : `Page ${p.page} (Spread ${idx})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Direct PDF Download */}
              <a
                href="/docs/srijitha-sreeraj-wedding-album.pdf"
                download="The_Wedding_of_Srijitha_Sreeraj_Album_40_Pages.pdf"
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[#d4af37] border border-[#d4af37]/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                title="Download Full 40-Page Album PDF"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Download PDF</span>
              </a>

              {/* Open in New Tab */}
              <a
                href="/docs/srijitha-sreeraj-wedding-album.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                title="Open PDF in Full Tab"
              >
                <ExternalLink size={15} />
              </a>

              {/* Share WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="p-1.5 sm:p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                title="Share Album on WhatsApp"
              >
                <Share2 size={15} />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer ml-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Stage */}
          {viewMode === "pdf" ? (
            /* LIVE PDF VIEW */
            <div className="flex-1 w-full h-full bg-zinc-900 p-2 sm:p-3 relative overflow-hidden flex flex-col">
              {isAnimationDone ? (
                <iframe
                  src="/docs/srijitha-sreeraj-wedding-album.pdf#toolbar=1&navpanes=0&view=FitH"
                  className="w-full h-full rounded-xl bg-zinc-950 border border-[#d4af37]/20 shadow-2xl"
                  title="The Wedding of Srijitha + Sreeraj Album PDF"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
                  <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Loading complete 40-page PDF document...</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 px-2 shrink-0">
                <span className="text-zinc-300">
                  ✨ Full 40-page master PDF with continuous scroll, native zoom & print controls
                </span>
                <button
                  onClick={() => setViewMode("spreads")}
                  className="text-[#d4af37] hover:underline font-medium cursor-pointer"
                >
                  Switch to 60fps Flipbook Spreads →
                </button>
              </div>
            </div>
          ) : (
            /* PHOTOBOOK SPREADS VIEW (Zero-Lag 60fps viewer for all 41 pages) */
            <div className="flex-1 w-full h-full relative bg-zinc-950 p-2 sm:p-3 overflow-hidden flex flex-col justify-between">
              <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-black/70 border border-[#d4af37]/20 shadow-inner">
                {/* Quick Nav: First Page */}
                {currentIndex > 0 && (
                  <button
                    onClick={() => setCurrentIndex(0)}
                    className="absolute left-2 sm:left-4 top-4 z-20 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 text-[10px] font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md hidden sm:flex items-center gap-1"
                    title="Jump to Cover"
                  >
                    <ChevronsLeft size={13} /> Cover
                  </button>
                )}

                {/* Left Prev Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 hover:border-[#d4af37] transition-all cursor-pointer shadow-2xl backdrop-blur-md"
                  aria-label="Previous Page"
                  title="Previous Page (←)"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Animated Spread Image with Instant Loading */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-3"
                  >
                    <div className="relative flex items-center justify-center">
                      {isImageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg backdrop-blur-sm z-10 pointer-events-none">
                          <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      <img
                        src={currentPage.image}
                        alt={currentPage.title}
                        onLoad={() => setIsImageLoading(false)}
                        className="max-h-[60vh] sm:max-h-[64vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = currentPage.original || "/images/wedding/spread-1.png";
                          setIsImageLoading(false);
                        }}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide">
                        {currentPage.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {currentPage.subtitle} • <span className="text-[#d4af37]">{currentPage.details}</span>
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Right Next Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 hover:border-[#d4af37] transition-all cursor-pointer shadow-2xl backdrop-blur-md"
                  aria-label="Next Page"
                  title="Next Page (→)"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Quick Nav: Last Page */}
                {currentIndex < WEDDING_ALBUM_PAGES.length - 1 && (
                  <button
                    onClick={() => setCurrentIndex(WEDDING_ALBUM_PAGES.length - 1)}
                    className="absolute right-2 sm:right-4 top-4 z-20 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 text-[10px] font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md hidden sm:flex items-center gap-1"
                    title="Jump to End"
                  >
                    Last <ChevronsRight size={13} />
                  </button>
                )}
              </div>

              {/* Complete Filmstrip Bottom Thumbnails (All 41 Pages) */}
              <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
                <div
                  ref={thumbnailsRef}
                  className="flex items-center gap-2 overflow-x-auto max-w-full py-1 scroll-smooth"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {WEDDING_ALBUM_PAGES.map((page, idx) => (
                    <button
                      key={page.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative w-12 h-9 sm:w-16 sm:h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        currentIndex === idx
                          ? "border-[#d4af37] scale-105 shadow-md shadow-[#d4af37]/40 ring-2 ring-[#d4af37]/50"
                          : "border-transparent opacity-50 hover:opacity-90"
                      }`}
                      title={page.isCover ? "Cover" : `Page ${page.page}`}
                    >
                      <img
                        src={page.thumb || page.image}
                        alt={`Page ${page.page}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = page.image;
                        }}
                      />
                      <span className="absolute bottom-0 right-0 px-1 text-[8px] font-black bg-black/80 text-white rounded-tl">
                        {idx === 0 ? "C" : idx}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <FileText size={13} className="text-[#d4af37]" />
                    <span>
                      Showing <strong>{currentIndex + 1} of 41</strong> pages
                    </span>
                  </div>
                  <span className="text-zinc-600 hidden md:inline">•</span>
                  <span className="text-zinc-400 hidden md:inline">
                    ← / → or Home / End to flip
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
