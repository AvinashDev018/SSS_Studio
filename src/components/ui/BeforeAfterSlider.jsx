"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel = "Before", afterLabel = "After" }) {
  const containerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);

  const updateSlider = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    },
    [isDragging, updateSlider]
  );

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  const onTouchStart = () => setIsDragging(true);
  const onTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0].clientX);
    },
    [isDragging, updateSlider]
  );
  const onTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-col-resize group border border-white/10 shadow-2xl"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* AFTER image (bottom layer - full width) */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* BEFORE image (top layer - clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ width: containerRef.current?.offsetWidth ? `${containerRef.current.offsetWidth}px` : "100%" }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.8),0_0_4px_rgba(6,182,212,0.9)]"
        style={{ left: `calc(${sliderPos}% - 1px)` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-[0_0_0_3px_rgba(6,182,212,0.5),0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center z-20 transition-transform group-hover:scale-110"
        style={{ left: `${sliderPos}%` }}
      >
        <svg className="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 z-10">
        <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <span className="bg-cyan-500/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-400/30">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
