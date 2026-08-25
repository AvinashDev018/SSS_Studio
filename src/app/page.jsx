"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Testimonials from "@/components/sections/Testimonials";
import HowItWorks from "@/components/sections/HowItWorks";

const HERO_IMAGES = [
 "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504208/iydxdch0gcdo1vuea56q.jpg",
 "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504209/y4t69imuaktbevg8re57.jpg",
 "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504211/tqb10uvuzmqdkuxyqmps.jpg",
 "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504212/ksq2vkwzniqlgsly5k6p.jpg",
 "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504214/eill2s5uvoq7wwabeunx.jpg"
];

export default function Home() {
 const [currentImage, setCurrentImage] = useState(0);

 useEffect(() => {
 const timer = setInterval(() => {
 setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
 }, 5000);
 return () => clearInterval(timer);
 }, []);

 return (
 <div>
 {/* Hero Section */}
 <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
 <div className="absolute inset-0 z-0 bg-black">
 <div className="absolute inset-0 bg-black/40 z-10" />
 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950 z-10" />
 
 <AnimatePresence mode="wait">
 <motion.img
 key={currentImage}
 src={HERO_IMAGES[currentImage]}
 initial={{ opacity: 0, scale: 1.05 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 1.5, ease: "easeInOut" }}
 className="absolute inset-0 w-full h-full object-cover object-center"
 alt="Studio Photography"
 />
 </AnimatePresence>
 </div>
 
  <AnimatedSection className="relative z-20 text-center px-4 max-w-5xl mx-auto" yOffset={40}>
  
  <div className="inline-block mb-6 px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
    <span className="text-xs md:text-sm font-medium tracking-[0.2em] text-zinc-300 uppercase">Premium Photography</span>
  </div>

  <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-wide mb-6 text-white drop-shadow-lg leading-tight">
  Capturing Your <br className="hidden md:block" /> Special Moments
  </h1>
  
  <p className="text-lg md:text-2xl text-zinc-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
  Timeless Photography & Videography for Weddings, Events, and Portraits in Madurai.
  </p>
  
  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
  <Link 
  href="/book" 
  className="group bg-white text-black px-10 py-4 rounded-full text-sm md:text-base font-semibold tracking-widest uppercase hover:bg-zinc-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3"
  >
  Book a Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </Link>
  <Link 
  href="/gallery" 
  className="bg-black/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full text-sm md:text-base font-semibold tracking-widest uppercase hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
  >
  View Portfolio
  </Link>
  </div>
  
  </AnimatedSection>
 </section>

 {/* Services Overview - Modern Bento Box */}
 <section className="py-32 relative">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-16">
 <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-cyan-400 dark:to-violet-500 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">Our Expertise</h2>
 <p className="text-zinc-600 dark:text-zinc-400 text-xl max-w-2xl mx-auto font-light">We specialize in a variety of photography styles to bring your vision to life.</p>
 </AnimatedSection>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
 {/* Main large card */}
 <AnimatedSection delay={0.1} className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl border border-zinc-800/50">
 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 duration-500" />
 <img src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Weddings" />
 <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
 <h3 className="font-serif text-3xl font-bold text-white mb-2">Weddings</h3>
 <p className="text-zinc-300">Timeless elegance and candid joy captured perfectly.</p>
 </div>
 </AnimatedSection>

 {/* Top right small card */}
 <AnimatedSection delay={0.2} className="relative group overflow-hidden rounded-3xl border border-zinc-800/50">
 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 duration-500" />
 <img src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505577/iqimm503wxxauaksjjzt.jpg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Portraits" />
 <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
 <h3 className="font-serif text-2xl font-bold text-white">Portraits</h3>
 </div>
 </AnimatedSection>

 {/* Bottom right small card */}
 <AnimatedSection delay={0.3} className="relative group overflow-hidden rounded-3xl border border-zinc-800/50">
 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 duration-500" />
 <img src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505207/rm2cysblt45dofw4myda.jpg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Birthdays" />
 <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
 <h3 className="font-serif text-2xl font-bold text-white">Birthday Functions</h3>
 </div>
 </AnimatedSection>
 </div>
 
 <AnimatedSection delay={0.4} className="mt-16 text-center">
 <Link href="/services" className="inline-flex items-center gap-2 text-brand-gradient hover:text-brand-gradient text-lg font-medium transition-colors">
 Explore All Services <ArrowRight className="w-5 h-5" />
 </Link>
 </AnimatedSection>
 </div>
 </section>

 {/* How It Works Section */}
 <HowItWorks />

 {/* Why Choose Us */}
 <section className="py-32 relative">
 {/* Subtle glass background behind the section */}
 <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-3xl border-y border-white/5 z-0" />
 
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
 <AnimatedSection>
 <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-brand-gradient hover-glow-brand drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">Why Choose SSS Studio?</h2>
 <p className="text-zinc-400 mb-10 text-xl font-light leading-relaxed">
 With years of experience and a passion for visual storytelling, we deliver exceptional quality and service for every client.
 </p>
 
 <ul className="space-y-6">
 {[
 "Professional Equipment & Premium Lighting",
 "Highly Experienced & Creative Team",
 "High-End Retouching & Color Grading",
 "Affordable & Transparent Packages"
 ].map((item, i) => (
 <li key={i} className="flex items-start gap-4 text-zinc-200">
 <div className="bg-brand-gradient hover-glow-brand/10 p-2 rounded-full border border-cyan-500/30 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
 <CheckCircle2 className="w-5 h-5 text-brand-gradient" />
 </div>
 <span className="text-lg pt-1">{item}</span>
 </li>
 ))}
 </ul>
 </AnimatedSection>
  <AnimatedSection className="grid grid-cols-2 gap-4" delay={0.2}>
  <div className="group overflow-hidden rounded-3xl border border-white/10 shadow-2xl h-72 w-full relative">
  <img src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504208/iydxdch0gcdo1vuea56q.jpg" alt="Studio Setup" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </div>
  <div className="group overflow-hidden rounded-3xl border border-white/10 shadow-2xl h-72 w-full mt-12 relative">
  <img src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504215/da4knrrkqpznhaip7xx4.jpg" alt="Camera Lens" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </div>
  </AnimatedSection>
 </div>
 </div>
 </section>

 {/* Testimonials */}
 <Testimonials />
 </div>
 );
}
