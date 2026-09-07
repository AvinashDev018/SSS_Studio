"use client";

import React, { useState, useEffect } from "react";
import { getClientGallery, togglePhotoSelection, submitGallerySelections } from "@/app/actions/gallery";
import {
  Lock,
  Heart,
  CheckCircle,
  Sparkles,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function ClientGalleryPage({ params }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState({});
  const [comments, setComments] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Full-Screen Lightbox & Zoom State
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, 1.5 = 150%, 2 = 200%, 3 = 300%

  useEffect(() => {
    async function loadData() {
      const data = await getClientGallery(slug);
      setGallery(data);
      if (data && data.photos) {
        const initialSelections = {};
        const initialComments = {};
        data.photos.forEach((p) => {
          if (p.isSelected) initialSelections[p.id] = true;
          if (p.comment) initialComments[p.id] = p.comment;
        });
        setSelectedPhotos(initialSelections);
        setComments(initialComments);
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  // Keyboard navigation for Lightbox (Esc to close, Left/Right arrows to switch photos)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIndex === null || !gallery?.photos) return;
      if (e.key === "Escape") {
        setActivePhotoIndex(null);
        setZoomLevel(1);
      } else if (e.key === "ArrowLeft") {
        navigatePhoto(-1);
      } else if (e.key === "ArrowRight") {
        navigatePhoto(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, gallery]);

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (gallery && passcode.trim() === gallery.passcode) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid access PIN passcode. Please check with SSS Studio.");
    }
  };

  const handleTogglePhoto = async (photoId) => {
    const currentStatus = !!selectedPhotos[photoId];
    const newStatus = !currentStatus;

    // Check max selections
    const currentCount = Object.values(selectedPhotos).filter(Boolean).length;
    if (newStatus && currentCount >= (gallery?.maxSelections || 40)) {
      alert(`You can select a maximum of ${gallery?.maxSelections || 40} photos for your physical album.`);
      return;
    }

    // Optimistic UI update
    setSelectedPhotos((prev) => ({ ...prev, [photoId]: newStatus }));
    await togglePhotoSelection(photoId, newStatus, comments[photoId] || "");
  };

  const handleCommentChange = async (photoId, text) => {
    setComments((prev) => ({ ...prev, [photoId]: text }));
    if (selectedPhotos[photoId]) {
      await togglePhotoSelection(photoId, true, text);
    }
  };

  const handleSubmitSelections = async () => {
    const count = Object.values(selectedPhotos).filter(Boolean).length;
    if (count === 0) {
      alert("Please select at least 1 photo before submitting for printing.");
      return;
    }

    if (!confirm(`Confirm submit ${count} selected photos for photobook printing?`)) return;

    setSubmitting(true);
    const res = await submitGallerySelections(gallery.id);
    setSubmitting(false);

    if (res.success) {
      setGallery((prev) => ({ ...prev, status: "SUBMITTED" }));
      alert("🎉 Your album photo choices have been sent directly to the SSS Studio printing lab in Avaniyapuram!");
    }
  };

  const navigatePhoto = (direction) => {
    if (activePhotoIndex === null || !gallery?.photos) return;
    const total = gallery.photos.length;
    const nextIndex = (activePhotoIndex + direction + total) % total;
    setActivePhotoIndex(nextIndex);
    setZoomLevel(1); // Reset zoom when switching photos
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-amber-400 font-serif text-lg">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span>Opening SSS Studio Proofing Portal...</span>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-serif font-bold text-red-400 mb-2">Gallery Not Found</h1>
        <p className="text-zinc-400 text-sm mb-6">The requested client gallery link does not exist or has expired.</p>
        <Link href="/" className="px-5 py-2.5 bg-amber-400 text-black font-bold rounded-xl text-xs uppercase">
          Back to Homepage
        </Link>
      </div>
    );
  }

  // Passcode Lock View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="bg-[#121816] border border-amber-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-400/40">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-serif font-extrabold text-white mb-1">{gallery.clientName}</h1>
          <p className="text-xs text-amber-300 font-semibold uppercase tracking-widest mb-6">
            Private Album Proofing Portal
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Enter Client PIN Passcode
              </label>
              <input
                type="password"
                required
                maxLength={6}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="e.g. 4829"
                className="w-full text-center text-2xl tracking-[0.4em] font-mono bg-black border border-zinc-700 rounded-xl py-3 text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              Unlock Gallery
            </button>
          </form>
        </div>
      </div>
    );
  }

  const selectedCount = Object.values(selectedPhotos).filter(Boolean).length;
  const isSubmitted = gallery.status === "SUBMITTED" || gallery.status === "PRINTING";
  const activePhoto = activePhotoIndex !== null ? gallery.photos[activePhotoIndex] : null;

  return (
    <div className="min-h-screen bg-[#070908] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Sticky Floating Bar */}
      <div className="sticky top-4 z-40 bg-[#121614]/90 backdrop-blur-xl border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> SSS Studio Album Proofing
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-white leading-tight">
            {gallery.clientName}
          </h1>
        </div>

        {/* Counter Badge & Submit Action */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="px-4 py-2 bg-amber-500/15 border border-amber-400/40 rounded-2xl text-center">
            <span className="text-xs text-zinc-300 font-semibold block">Selected for Album:</span>
            <span className="text-lg font-black font-mono text-amber-300">
              {selectedCount} / {gallery.maxSelections}
            </span>
          </div>

          {isSubmitted ? (
            <div className="px-5 py-2.5 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-2xl font-bold text-xs uppercase flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Submitted for Printing</span>
            </div>
          ) : (
            <button
              onClick={handleSubmitSelections}
              disabled={submitting || selectedCount === 0}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Album Choices</span>
            </button>
          )}
        </div>
      </div>

      {/* Proofing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.photos.map((photo, index) => {
          const isSel = !!selectedPhotos[photo.id];
          return (
            <div
              key={photo.id}
              className={`group rounded-3xl overflow-hidden bg-[#101412] border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                isSel
                  ? "border-amber-400 shadow-amber-500/20 ring-2 ring-amber-400/50"
                  : "border-zinc-800 hover:border-amber-500/40"
              }`}
            >
              {/* Clickable Image Thumbnail to open Full-Screen Lightbox */}
              <div
                onClick={() => {
                  setActivePhotoIndex(index);
                  setZoomLevel(1);
                }}
                className="relative aspect-[4/3] overflow-hidden bg-zinc-900 cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Click to Zoom Hover Badge */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                  <ZoomIn className="w-5 h-5 text-amber-400" />
                  <span>Click to View Full-Screen &amp; Zoom</span>
                </div>

                {/* Heart Toggle Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSubmitted) handleTogglePhoto(photo.id);
                  }}
                  disabled={isSubmitted}
                  className={`absolute top-3 right-3 p-3 rounded-full backdrop-blur-md transition-all shadow-xl cursor-pointer z-10 ${
                    isSel
                      ? "bg-amber-400 text-black scale-110"
                      : "bg-black/60 text-white/70 hover:text-white hover:bg-black/80"
                  }`}
                  aria-label="Toggle photo selection"
                >
                  <Heart className={`w-5 h-5 ${isSel ? "fill-black text-black" : ""}`} />
                </button>
              </div>

              {/* Photo Controls & Notes */}
              <div className="p-4 bg-[#101412]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-400">{photo.filename}</span>
                  {isSel && (
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-black">
                      ★ Included in Album
                    </span>
                  )}
                </div>

                {!isSubmitted && (
                  <input
                    type="text"
                    placeholder="Add optional note for lab editor..."
                    value={comments[photo.id] || ""}
                    onChange={(e) => handleCommentChange(photo.id, e.target.value)}
                    className="w-full text-xs bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL-SCREEN ZOOMABLE LIGHTBOX MODAL */}
      {activePhoto && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden select-none">
          {/* Lightbox Top Header Bar */}
          <div className="p-4 bg-black/70 border-b border-zinc-800 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-400 font-bold">
                {activePhotoIndex + 1} / {gallery.photos.length}
              </span>
              <span className="text-xs font-mono text-zinc-300">{activePhoto.filename}</span>
            </div>

            {/* Zoom Controls & Close Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 mr-2">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(1, +(prev - 0.5).toFixed(1)))}
                  disabled={zoomLevel <= 1}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-amber-300 font-bold px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(3.5, +(prev + 0.5).toFixed(1)))}
                  disabled={zoomLevel >= 3.5}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                {zoomLevel !== 1 && (
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="px-2 py-1 text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-300 rounded-md hover:bg-amber-400 hover:text-black transition-all ml-1"
                  >
                    Reset Zoom
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setActivePhotoIndex(null);
                  setZoomLevel(1);
                }}
                className="p-2.5 rounded-xl bg-zinc-800 text-white hover:bg-red-500 transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image Stage */}
          <div className="relative flex-1 flex items-center justify-center p-4 overflow-auto">
            {/* Previous Arrow */}
            <button
              onClick={() => navigatePhoto(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 border border-zinc-700 text-white hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-2xl"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Interactive Zoom Image */}
            <div
              className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-300 ease-out cursor-zoom-in"
              onClick={() => setZoomLevel((prev) => (prev > 1 ? 1 : 2))}
            >
              <img
                src={activePhoto.url}
                alt={activePhoto.filename}
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-transform duration-300"
              />
            </div>

            {/* Next Arrow */}
            <button
              onClick={() => navigatePhoto(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 border border-zinc-700 text-white hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-2xl"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Bottom Action Bar (Select Heart & Editing Notes) */}
          <div className="p-4 bg-black/90 border-t border-zinc-800 z-20 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Selection Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => !isSubmitted && handleTogglePhoto(activePhoto.id)}
                disabled={isSubmitted}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase flex items-center gap-2 transition-all cursor-pointer ${
                  selectedPhotos[activePhoto.id]
                    ? "bg-amber-400 text-black shadow-lg shadow-amber-400/30 scale-105"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                <Heart className={`w-4 h-4 ${selectedPhotos[activePhoto.id] ? "fill-black" : ""}`} />
                <span>
                  {selectedPhotos[activePhoto.id] ? "★ Included in Album" : "Select for Album"}
                </span>
              </button>
            </div>

            {/* Middle: Editing Note Input */}
            {!isSubmitted && (
              <div className="w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder="Add editing note for lab (e.g. Use for front cover)..."
                  value={comments[activePhoto.id] || ""}
                  onChange={(e) => handleCommentChange(activePhoto.id, e.target.value)}
                  className="w-full text-xs bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
