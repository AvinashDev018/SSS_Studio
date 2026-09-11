"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Layers, RefreshCw, Send, Sparkles } from "lucide-react";

function normalizeFeatures(raw) {
  if (Array.isArray(raw)) return raw.map((f) => (typeof f === "string" ? f.trim() : String(f))).filter(Boolean);
  if (typeof raw === "string") return raw.split(",").map((f) => f.trim()).filter(Boolean);
  return [];
}

/**
 * One flippable package-style face (old flip-card design) inside the ring slot.
 */
function FlippablePackageFace({ card, isFront, onBook, onInteract }) {
  const [flipped, setFlipped] = useState(false);
  const features = card.features || [];

  // Reset flip when spun away from front
  useEffect(() => {
    if (!isFront) setFlipped(false);
  }, [isFront]);

  return (
    <div className="w-full h-full" style={{ perspective: "1200px" }} onClick={(e) => e.stopPropagation()}>
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT — same look as old package cards */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[#d4af37]/80 bg-[#0d0f14] flex flex-col p-3.5 sm:p-4"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {card.popular && (
            <div className="absolute top-0 inset-x-0 py-1.5 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black z-10">
              ★ Most Popular · Favorite
            </div>
          )}

          <div className={`flex items-start justify-between gap-2 ${card.popular ? "pt-7" : "pt-1"} mb-2`}>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-[9px] font-black uppercase tracking-wider">
              {card.badge || "Package"}
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-800/60 whitespace-nowrap">
              1-Month Guarantee
            </span>
          </div>

          <h3 className="text-white font-serif font-bold text-sm sm:text-[15px] leading-snug line-clamp-3 mb-2">
            {card.label}
          </h3>
          {card.description && (
            <p className="text-zinc-400 text-[10px] sm:text-[11px] leading-relaxed line-clamp-3 mb-3 font-light">
              {card.description}
            </p>
          )}

          <div className="mt-auto mb-3 rounded-xl bg-zinc-950/80 border border-zinc-800 px-3 py-2.5">
            <span className="text-[#d4af37] font-mono font-black text-lg sm:text-xl block leading-none">
              {card.meta || "—"}
            </span>
            <span className="text-[9px] text-zinc-500 font-medium">Studio catalog rate</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInteract?.();
              if (!isFront) return;
              setFlipped(true);
            }}
            className="w-full py-2.5 rounded-xl text-[10px] sm:text-[11px] font-extrabold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Flip for inclusions
          </button>
        </div>

        {/* BACK — inclusions + book (old design) */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-[#12151c] flex flex-col p-3.5 sm:p-4"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-[10px] font-black uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Inclusions &amp; deliverables
          </div>

          <ul className="space-y-1.5 overflow-y-auto flex-1 pr-0.5 mb-3">
            {features.slice(0, 8).map((f, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] text-zinc-200 leading-snug">
                <Check className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
            {features.length === 0 && (
              <li className="text-[10px] text-zinc-500">Details confirmed on booking.</li>
            )}
          </ul>

          <div className="space-y-1.5 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBook?.(card.raw);
              }}
              className={`w-full py-2.5 rounded-xl text-[10px] sm:text-[11px] font-extrabold cursor-pointer ${
                card.popular
                  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black"
                  : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
              }`}
            >
              Book Package / Lock Spot
            </button>
            <a
              href={`https://wa.me/919865992379?text=${encodeURIComponent(
                `Vanakkam SSS Studio! I am interested in *${card.label}* (${card.meta || ""}). Please share availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2 rounded-xl text-[10px] font-bold text-zinc-400 hover:text-white bg-zinc-900/70 border border-zinc-800 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3 text-emerald-400" /> WhatsApp enquiry
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
              className="w-full py-1.5 text-[10px] font-bold text-zinc-500 hover:text-amber-300 cursor-pointer"
            >
              ← Flip back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive rotating card ring.
 * Package items can set flippable + features (old flip-card UX).
 * Photo items tap to open via onSelect.
 */
export default function RoundMemoryCarousel({
  items = [],
  onSelect,
  title = "Browse cards",
  subtitle = "Swipe to browse · Tap the front card",
  className = "",
  popularFirst = true,
}) {
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(220);
  const [isDragging, setIsDragging] = useState(false);
  const [cardSize, setCardSize] = useState({ w: 220, h: 340 });
  const [stageH, setStageH] = useState(400);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startRot: 0,
    moved: false,
  });
  const stageRef = useRef(null);

  const cards = useMemo(() => {
    let list = (items || []).map((item, idx) => {
      const raw = item.raw !== undefined ? item.raw : item;
      const popular = !!(item.popular ?? raw?.popular);
      const features = normalizeFeatures(item.features ?? raw?.features);
      const flippable =
        item.flippable === true ||
        (!item.image && !item.videoUrl && features.length > 0);
      return {
        id: item.id ?? idx,
        label: item.label || item.title || item.name || item.shortName || `Item ${idx + 1}`,
        image: item.image || item.avatar || item.images?.[0] || null,
        videoUrl: item.videoUrl || null,
        badge:
          item.badge ||
          item.categoryLabel ||
          item.tag ||
          (popular ? "Most Popular" : null),
        meta: item.meta || item.price || item.priceFormatted || null,
        description: item.description || raw?.description || "",
        features,
        flippable,
        popular,
        raw,
      };
    });

    list = list.filter((c) => c.label);
    if (popularFirst) {
      list = [...list].sort((a, b) => Number(b.popular) - Number(a.popular));
    }
    return list.slice(0, 12);
  }, [items, popularFirst]);

  const count = Math.max(cards.length, 1);
  const step = 360 / count;
  const normalized = ((-rotation % 360) + 360) % 360;
  const activeIndex = Math.round(normalized / step) % count;

  useEffect(() => {
    const layout = () => {
      const w = stageRef.current?.offsetWidth || window.innerWidth || 360;
      const isMobile = w < 640;
      const isTablet = w < 900;

      // Mobile: narrower cards + larger radius so neighbors don't clip the front card
      const cw = isMobile
        ? Math.min(Math.round(w * 0.42), 168)
        : isTablet
        ? Math.min(Math.round(w / 3.4), 220)
        : Math.min(Math.round(w / 3.2), 280);

      const ch = Math.round(cw * (isMobile ? 1.62 : 1.55));

      // Cylinder radius: must clear card half-width at the angular step
      const minR = cw / 2 / Math.tan(Math.PI / Math.max(count, 3));
      const r = Math.round(
        Math.max(
          minR + (isMobile ? cw * 0.55 : cw * 0.35),
          cw * (isMobile ? 1.45 : 1.1)
        )
      );

      setCardSize({ w: cw, h: ch });
      // Don't clamp radius too hard on mobile — clamping caused overlap
      setRadius(isMobile ? r : Math.min(r, Math.round(w * 0.62)));
      setStageH(Math.round(ch + (isMobile ? 130 : 150)));
    };
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [count]);

  useEffect(() => {
    setRotation(0);
  }, [cards.map((c) => c.id).join("|")]);

  const snapTo = (rot) => setRotation(Math.round(rot / step) * step);

  const onPointerDown = (e) => {
    // Don't start ring-drag from interactive buttons inside flippable cards
    if (e.target?.closest?.("button, a, input")) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragRef.current = { active: true, startX: x, startRot: rotation, moved: false };
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const delta = x - dragRef.current.startX;
    if (Math.abs(delta) > 4) dragRef.current.moved = true;
    setRotation(dragRef.current.startRot + delta * 0.6);
  };

  const endDrag = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    snapTo(rotation);
  };

  const spinBy = (dir) => snapTo(rotation + dir * step);

  const handleSlotClick = (card, index) => {
    if (dragRef.current.moved) return;
    if (index !== activeIndex) {
      snapTo(-index * step);
      return;
    }
    // Flippable cards handle their own flip / book — don't open on face tap
    if (card.flippable) return;
    onSelect?.(card.raw);
  };

  if (!cards.length) return null;

  const halfW = cardSize.w / 2;
  const halfH = cardSize.h / 2;

  return (
    <div className={`mb-8 sm:mb-12 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 px-1">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#8b6508] mb-1">
            <Sparkles size={13} /> {title}
          </div>
          <p className="text-xs text-zinc-500 font-medium">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => spinBy(1)}
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border border-black/10 hover:border-[#d4af37]/60 bg-white shadow-sm flex items-center justify-center text-zinc-700 hover:text-[#8b6508] cursor-pointer active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => spinBy(-1)}
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border border-black/10 hover:border-[#d4af37]/60 bg-white shadow-sm flex items-center justify-center text-zinc-700 hover:text-[#8b6508] cursor-pointer active:scale-95"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="relative mx-auto w-full max-w-6xl select-none touch-pan-y cursor-grab active:cursor-grabbing overflow-visible"
        style={{ perspective: "1200px", height: stageH }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div className="pointer-events-none absolute left-1/2 bottom-4 -translate-x-1/2 w-[65%] h-5 rounded-[100%] bg-black/10 blur-md" />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative w-0 h-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `translateZ(-${Math.round(radius * 0.12)}px) rotateY(${rotation}deg)`,
              transition: isDragging
                ? "none"
                : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {cards.map((card, i) => {
              const angle = i * step;
              const isFront = i === activeIndex;
              let diff = Math.abs((((angle + rotation) % 360) + 360) % 360);
              if (diff > 180) diff = 360 - diff;
              // Fade / shrink side cards more so they don't visually collide on mobile
              const depthFade = Math.max(0.22, 1 - diff / (count > 6 ? 110 : 140));
              const sideScale = isFront ? 1 : Math.max(0.82, 1 - diff / 220);

              return (
                <div
                  key={card.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSlotClick(card, i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleSlotClick(card, i);
                  }}
                  className={`absolute left-0 top-0 rounded-2xl overflow-hidden text-left cursor-pointer ${
                    isFront
                      ? "shadow-[0_16px_36px_rgba(184,134,11,0.35)]"
                      : "shadow-md"
                  } ${card.flippable ? "" : "border-2 border-white/80 bg-zinc-950"} ${
                    !card.flippable && isFront ? "border-[#d4af37]" : ""
                  }`}
                  style={{
                    width: cardSize.w,
                    height: cardSize.h,
                    marginLeft: -halfW,
                    marginTop: -halfH,
                    transform: `rotateY(${angle}deg) translateZ(${radius}px) scale(${sideScale})`,
                    transformStyle: "preserve-3d",
                    opacity: depthFade,
                    zIndex: isFront ? 30 : Math.max(1, Math.round(20 - diff / 8)),
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {card.flippable ? (
                    <FlippablePackageFace
                      card={card}
                      isFront={isFront}
                      onBook={(raw) => onSelect?.(raw)}
                      onInteract={() => {
                        if (!isFront) snapTo(-i * step);
                      }}
                    />
                  ) : (
                    <>
                      {card.videoUrl && !card.image ? (
                        <video
                          src={`${card.videoUrl}#t=1`}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      ) : (
                        <img
                          src={card.image}
                          alt={card.label}
                          className="w-full h-full object-cover pointer-events-none"
                          draggable={false}
                        />
                      )}
                      {card.badge && (
                        <span className="absolute top-2.5 left-2.5 z-10 text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-white/95 text-[#8b6508] border border-[#d4af37]/40 px-2 py-0.5 rounded-full">
                          {card.badge}
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-2.5 sm:p-3.5 pt-10 pointer-events-none">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#d4af37]">
                          {isFront ? "Tap to open" : "Spin to front"}
                        </p>
                        <p className="text-[12px] sm:text-sm font-bold text-white truncate leading-tight">
                          {card.label}
                        </p>
                        {card.meta && (
                          <p className="text-[11px] sm:text-xs font-extrabold text-amber-200/95 mt-0.5 truncate">
                            {card.meta}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-zinc-500 font-medium mt-1 px-2">
        Showing{" "}
        <span className="text-[#8b6508] font-bold">{cards[activeIndex]?.label}</span>
        {cards[activeIndex]?.meta ? (
          <>
            {" "}
            · <span className="font-semibold text-zinc-700">{cards[activeIndex].meta}</span>
          </>
        ) : null}{" "}
        · {activeIndex + 1} / {count}
      </p>
    </div>
  );
}
