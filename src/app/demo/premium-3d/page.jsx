"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Frame, Layers, Sparkles } from "lucide-react";

const HERO =
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788426852/sss-hero-wedding.jpg";
const SPREAD =
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788882990/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_spread_1.png";
const ARCH =
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788884907/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_arch_portrait.jpg";
const SANGEET =
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788886066/sss_festive_sangeet_shoot/festive_sangeet_sisters_stage_pose.jpg";

const ALBUM_PAGES = [
  { src: SPREAD, caption: "Cover · Srijitha & Sreeraj" },
  { src: ARCH, caption: "Spread 02 · Arch Portrait" },
  { src: SANGEET, caption: "Spread 03 · Festive Sangeet" },
  { src: HERO, caption: "Spread 04 · Reception Light" },
];

function SectionLabel({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-8 max-w-xl">
      <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
        <Icon size={14} />
        Demo
      </div>
      <h2 className="font-serif text-3xl text-white sm:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
    </div>
  );
}

/** Demo 1 — mouse-driven 3D tilt frame */
function TiltFrameDemo() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 18 });
  const glareX = useTransform(x, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["15%", "85%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 45%)`
  );

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="border-b border-white/10 px-4 py-20 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <SectionLabel
          icon={Frame}
          title="Floating Photo Frame"
          subtitle="Move your mouse over the frame. Premium product pages use this 3D tilt + gold glass glare for frame & gift shop items."
        />

        <div className="flex justify-center perspective-[1200px]">
          <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full max-w-md cursor-grab active:cursor-grabbing"
          >
            {/* Soft floor shadow */}
            <div
              className="absolute -bottom-8 left-1/2 h-16 w-[78%] -translate-x-1/2 rounded-[100%] bg-black/60 blur-2xl"
              style={{ transform: "translateZ(-40px)" }}
            />

            {/* Outer gold frame */}
            <div
              className="relative overflow-hidden rounded-sm border-[10px] border-[#c9a227] bg-[#1a1408] p-3 shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                <Image src={ARCH} alt="Premium frame demo" fill unoptimized className="object-cover" sizes="400px" />
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: glareBg }}
                />
              </div>
              <div className="mt-3 text-center font-serif text-xs tracking-[0.25em] text-[#d4af37]/90 uppercase">
                Handcrafted Teak · 12×18
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Demo 2 — living album page flip */
function LivingAlbumDemo() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next) => {
    if (next < 0 || next >= ALBUM_PAGES.length) return;
    setDir(next > page ? 1 : -1);
    setPage(next);
  };

  return (
    <section className="border-b border-white/10 px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionLabel
          icon={BookOpen}
          title="The Living Album"
          subtitle="Click the arrows or the page. This is a lightweight faux-3D hardcover flip — later we can upgrade to real WebGL page curl."
        />

        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <div className="relative w-full" style={{ perspective: "1600px" }}>
            {/* Album base / spine shadow */}
            <div className="absolute inset-x-[8%] -bottom-6 h-10 rounded-[100%] bg-black/50 blur-2xl" />

            <div className="relative overflow-hidden rounded-r-md rounded-l-sm border border-[#d4af37]/35 bg-[#0c0e14] shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
              {/* Spine strip */}
              <div className="absolute left-0 top-0 z-20 h-full w-3 bg-gradient-to-r from-[#8a7020] via-[#d4af37] to-[#8a7020]" />

              <div className="relative ml-3 aspect-[16/10] bg-zinc-950">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={page}
                    custom={dir}
                    initial={{ rotateY: dir * -70, opacity: 0, transformOrigin: "left center" }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: dir * 70, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Image
                      src={ALBUM_PAGES[page].src}
                      alt={ALBUM_PAGES[page].caption}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <button
              type="button"
              onClick={() => go(page - 1)}
              disabled={page === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#d4af37] hover:text-[#d4af37] disabled:opacity-30"
              aria-label="Previous page"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-[180px] text-center">
              <p className="font-serif text-lg text-white">{ALBUM_PAGES[page].caption}</p>
              <p className="mt-1 text-xs tracking-widest text-zinc-500 uppercase">
                Page {page + 1} / {ALBUM_PAGES.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => go(page + 1)}
              disabled={page === ALBUM_PAGES.length - 1}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#d4af37] hover:text-[#d4af37] disabled:opacity-30"
              aria-label="Next page"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Demo 3 — layered depth parallax hero */
function DepthHeroDemo() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });

  const backX = useTransform(smx, [-40, 40], [-12, 12]);
  const backY = useTransform(smy, [-40, 40], [-8, 8]);
  const midX = useTransform(smx, [-40, 40], [-28, 28]);
  const midY = useTransform(smy, [-40, 40], [-18, 18]);
  const frontX = useTransform(smx, [-40, 40], [-48, 48]);
  const frontY = useTransform(smy, [-40, 40], [-30, 30]);

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx.set((e.clientX - cx) / 12);
    my.set((e.clientY - cy) / 12);
  };

  return (
    <section className="px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionLabel
          icon={Layers}
          title="Cinematic Depth Hero"
          subtitle="Move across the stage. Background, photo plane, and gold dust move at different speeds — the premium 'editorial depth' look without heavy WebGL."
        />

        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#07080c]"
        >
          <motion.div className="absolute inset-[-8%]" style={{ x: backX, y: backY }}>
            <Image src={HERO} alt="" fill unoptimized className="object-cover opacity-50 blur-[2px] scale-110" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-[#07080c]/40" />
          </motion.div>

          <motion.div
            className="absolute left-[12%] top-[14%] h-[72%] w-[55%] overflow-hidden rounded-xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
            style={{ x: midX, y: midY }}
          >
            <Image src={SPREAD} alt="Depth mid layer" fill unoptimized className="object-cover" sizes="60vw" />
          </motion.div>

          {/* Gold dust / light orbs */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ x: frontX, y: frontY }}
          >
            <div className="absolute right-[18%] top-[22%] h-28 w-28 rounded-full bg-[#d4af37]/25 blur-3xl" />
            <div className="absolute bottom-[24%] left-[40%] h-16 w-16 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute right-[28%] bottom-[30%] h-2 w-2 rounded-full bg-[#d4af37]" />
            <div className="absolute right-[34%] top-[38%] h-1.5 w-1.5 rounded-full bg-white/80" />
            <div className="absolute left-[58%] top-[28%] h-1 w-1 rounded-full bg-[#d4af37]/90" />
          </motion.div>

          <div className="absolute bottom-8 left-8 right-8 z-10">
            <p className="font-serif text-2xl text-white sm:text-4xl">SSS Studio</p>
            <p className="mt-2 max-w-md text-sm text-zinc-300">
              Cinematic wedding photography — move your cursor to feel the depth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Premium3dDemoPage() {
  return (
    <main className="min-h-screen bg-[#090b12] text-white">
      <header className="border-b border-white/10 px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-2 text-xs tracking-widest text-zinc-400 uppercase transition hover:text-[#d4af37]"
            >
              <ArrowLeft size={14} /> Back to site
            </Link>
            <h1 className="font-serif text-3xl sm:text-5xl">
              Premium 3D Motion <span className="text-[#d4af37]">Demo</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              These three effects are now live on the homepage. This page remains as a sandbox reference.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 text-xs font-bold tracking-widest text-[#d4af37] uppercase">
            <Sparkles size={14} /> Live on homepage
          </div>
        </div>
      </header>

      <TiltFrameDemo />
      <LivingAlbumDemo />
      <DepthHeroDemo />

      <footer className="border-t border-white/10 px-4 py-12 text-center sm:px-8">
        <p className="text-sm text-zinc-500">
          Live locations:{" "}
          <span className="text-[#d4af37]">Hero</span>, <span className="text-[#d4af37]">Wedding Album</span>,{" "}
          <span className="text-[#d4af37]">Photo Frames</span>.{" "}
          <Link href="/" className="text-white underline underline-offset-2 hover:text-[#d4af37]">
            Open homepage →
          </Link>
        </p>
      </footer>
    </main>
  );
}
