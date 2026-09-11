"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Layers, RefreshCw, Send, Sparkles } from "lucide-react";

function normalizeFeatures(raw) {
  if (Array.isArray(raw)) return raw.map((f) => (typeof f === "string" ? f.trim() : String(f))).filter(Boolean);
  if (typeof raw === "string") return raw.split(",").map((f) => f.trim()).filter(Boolean);
  return [];
}

function signedOffset(i, active, count) {
  let d = i - active;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

function PackageDetailFace({ pkg, isFront, onBook }) {
  const [flipped, setFlipped] = useState(false);
  const features = normalizeFeatures(pkg.features);
  const badge = pkg.popular
    ? pkg.name?.toLowerCase().includes("8")
      ? "Flagship Favorite"
      : "Most Popular"
    : (pkg.name || "").split("-")[0]?.trim() || "Package";

  useEffect(() => {
    if (!isFront) setFlipped(false);
  }, [isFront]);

  return (
    <div className="w-full h-full" style={{ perspective: "1600px" }}>
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[#d4af37]/90 bg-[#0d0f14] flex flex-col p-4 sm:p-5"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {pkg.popular && (
            <div className="absolute top-0 inset-x-0 py-1.5 text-center text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black z-10">
              ★ Most Popular · Favorite
            </div>
          )}

          <div className={`flex flex-wrap items-start justify-between gap-2 ${pkg.popular ? "pt-8" : "pt-0.5"} mb-2`}>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
              {badge}
            </span>
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-full border border-emerald-800/60 whitespace-nowrap">
              1-Month Guarantee
            </span>
          </div>

          <h3 className="text-white font-serif font-bold text-[15px] sm:text-lg leading-snug mb-2 break-words line-clamp-3">
            {pkg.name}
          </h3>
          {pkg.description && (
            <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed mb-3 font-light line-clamp-4">
              {pkg.description}
            </p>
          )}

          <div className="mt-auto mb-3 rounded-xl bg-zinc-950/80 border border-zinc-800 px-3.5 py-3">
            <span className="text-[#d4af37] font-mono font-black text-2xl sm:text-[28px] block leading-none">
              {pkg.price || "—"}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">Studio catalog rate</span>
          </div>

          <button
            type="button"
            disabled={!isFront}
            onClick={(e) => {
              e.stopPropagation();
              if (!isFront) return;
              setFlipped(true);
            }}
            className="w-full py-3 rounded-xl text-xs font-extrabold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Flip for inclusions
          </button>
        </div>

        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-[#12151c] flex flex-col p-4 sm:p-5"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5 shrink-0">
            <Layers className="w-3.5 h-3.5" />
            Inclusions &amp; deliverables
          </div>

          <ul className="space-y-1.5 overflow-y-auto flex-1 pr-1 mb-3 min-h-0">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-zinc-200 leading-snug">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
            {features.length === 0 && (
              <li className="text-xs text-zinc-500">Details confirmed on booking.</li>
            )}
          </ul>

          <div className="space-y-2 pt-2 border-t border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBook?.(pkg);
              }}
              className={`w-full py-3 rounded-xl text-xs font-extrabold cursor-pointer ${
                pkg.popular
                  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black"
                  : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
              }`}
            >
              Book Package / Lock Spot
            </button>
            <a
              href={`https://wa.me/919865992379?text=${encodeURIComponent(
                `Vanakkam SSS Studio! I am interested in *${pkg.name}* (${pkg.price || ""}). Please share availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2.5 rounded-xl text-[11px] font-bold text-zinc-400 hover:text-white bg-zinc-900/70 border border-zinc-800 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3 text-emerald-400" /> WhatsApp enquiry
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
              className="w-full py-1.5 text-[11px] font-bold text-zinc-500 hover:text-amber-300 cursor-pointer"
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
 * Same cover-flow 360 style as Client Stories, with full package detail cards.
 * Mobile: swipe · side cards peek · front card readable (no overlay).
 */
export default function PackageCoverFlow({ packages = [], onBook }) {
  const cards = useMemo(() => {
    return [...(packages || [])]
      .filter((p) => p?.name)
      .sort((a, b) => Number(!!b.popular) - Number(!!a.popular));
  }, [packages]);

  const count = cards.length;
  const [active, setActive] = useState(0);
  const [layout, setLayout] = useState({ w: 280, h: 440, gap: 150, stageH: 480 });
  const [dragDelta, setDragDelta] = useState(0);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef(null);
  const dragRef = useRef({ startX: 0, moved: false });

  useEffect(() => {
    setActive(0);
  }, [cards.map((c) => c.id).join("|")]);

  useEffect(() => {
    const measure = () => {
      const stageW = stageRef.current?.offsetWidth || window.innerWidth || 360;
      const mobile = stageW < 768;
      const w = mobile
        ? Math.min(Math.round(stageW * 0.78), 320)
        : Math.min(Math.round(stageW * 0.34), 300);
      const h = Math.round(w * 1.55);
      const gap = mobile ? Math.round(w * 0.55) : Math.round(w * 0.62);
      setLayout({ w, h, gap, stageH: h + (mobile ? 64 : 88) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [count]);

  if (!count) return null;

  const go = (dir) => setActive((prev) => (prev + dir + count) % count);
  const jumpTo = (i) => setActive(((i % count) + count) % count);

  const getX = (e) =>
    typeof e.clientX === "number"
      ? e.clientX
      : e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;

  const onPointerDown = (e) => {
    if (e.target?.closest?.("button, a")) return;
    dragRef.current = { startX: getX(e), moved: false };
    setDragging(true);
    setDragDelta(0);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const delta = getX(e) - dragRef.current.startX;
    if (Math.abs(delta) > 8) dragRef.current.moved = true;
    setDragDelta(delta);
  };

  const endDrag = (e) => {
    if (!dragging) return;
    const delta = getX(e) - dragRef.current.startX;
    setDragging(false);
    setDragDelta(0);
    if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1);
  };

  const current = cards[active];

  return (
    <div className="mb-2">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3 px-1">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#8b6508] mb-1">
            <Sparkles size={13} /> Photography Packages
          </div>
          <p className="text-xs text-zinc-500 font-medium">
            Swipe to browse · Flip front card for inclusions · Book on back
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => go(-1)}
            className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-black/10 hover:border-[#d4af37]/60 bg-white shadow-sm flex items-center justify-center text-zinc-700 hover:text-[#8b6508] cursor-pointer active:scale-95"
            aria-label="Previous package"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-black/10 hover:border-[#d4af37]/60 bg-white shadow-sm flex items-center justify-center text-zinc-700 hover:text-[#8b6508] cursor-pointer active:scale-95"
            aria-label="Next package"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="relative w-full select-none cursor-grab active:cursor-grabbing overflow-hidden"
        style={{ height: layout.stageH, perspective: "1100px", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 bottom-2 -translate-x-1/2 w-[55%] h-4 rounded-[100%] bg-black/10 blur-md" />

        <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
          {cards.map((pkg, i) => {
            const d = signedOffset(i, active, count);
            const abs = Math.abs(d);
            if (abs > 2) return null;

            const isFront = d === 0;
            const baseX = d * layout.gap + (dragging ? dragDelta * (isFront ? 1 : 0.35) : 0);
            const rotateY = d * -40 + (dragging ? dragDelta * -0.04 : 0);
            const scale = isFront ? 1 : Math.max(0.78, 1 - abs * 0.11);
            const opacity = isFront ? 1 : Math.max(0.4, 1 - abs * 0.25);

            return (
              <motion.div
                key={pkg.id}
                className={`absolute rounded-2xl overflow-hidden ${
                  isFront ? "shadow-[0_18px_40px_rgba(184,134,11,0.38)]" : "shadow-lg"
                }`}
                style={{
                  width: layout.w,
                  height: layout.h,
                  left: "50%",
                  top: "50%",
                  marginLeft: -layout.w / 2,
                  marginTop: -layout.h / 2,
                  transformStyle: "preserve-3d",
                  zIndex: isFront ? 50 : 30 - abs,
                  pointerEvents: isFront ? "auto" : "none",
                }}
                animate={{
                  x: baseX,
                  rotateY,
                  scale,
                  opacity,
                  z: isFront ? 60 : 20 - abs * 30,
                }}
                transition={
                  dragging
                    ? { type: "tween", duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 30 }
                }
                onClick={() => {
                  if (dragRef.current.moved) return;
                  if (!isFront) jumpTo(i);
                }}
              >
                <PackageDetailFace pkg={pkg} isFront={isFront} onBook={onBook} />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-1.5 mt-3 px-2">
        {cards.map((c, i) => (
          <button
            key={`dot-${c.id}`}
            type="button"
            aria-label={c.name}
            onClick={() => jumpTo(i)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === active ? "w-6 bg-[#d4af37]" : "w-1.5 bg-zinc-300"
            }`}
          />
        ))}
      </div>

      <p className="text-center text-[11px] text-zinc-500 font-medium mt-3 px-3">
        Showing{" "}
        <span className="text-[#8b6508] font-bold">{current?.name}</span>
        {current?.price ? (
          <>
            {" "}
            · <span className="font-semibold text-zinc-700">{current.price}</span>
          </>
        ) : null}{" "}
        · {active + 1} / {count}
      </p>
    </div>
  );
}
