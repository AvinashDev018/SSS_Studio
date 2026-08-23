"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { Camera, Heart, Star, MapPin } from "lucide-react";

export default function About() {
 return (
 <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
 <AnimatedSection className="text-center mb-20">
 <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-cyan-400 dark:to-violet-500 drop-shadow-sm">Our Story</h1>
 <p className="text-zinc-600 dark:text-zinc-300 text-xl max-w-2xl mx-auto font-light leading-relaxed">
 Capturing life's most precious moments with passion, creativity, and a touch of magic.
 </p>
 </AnimatedSection>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
 <AnimatedSection>
 <img 
 src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504718/r4r0skhi4uc1pkoinj9a.jpg" 
 alt="Photographer at work" 
 className="rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800/50 object-cover h-[500px] w-full"
 />
 </AnimatedSection>
 <AnimatedSection delay={0.2} className="space-y-6">
 <h2 className="font-serif text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">The Vision Behind the Lens</h2>
 <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed">
 Welcome to SSS Studio, based in the heart of Avaniyapuram, Madurai. We believe that photography is more than just taking pictures; it's about freezing a moment in time so you can cherish it forever.
 </p>
 <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed">
 Founded with a passion for visual storytelling, our studio has grown into a premier destination for weddings, portraits, and special events. We combine top-tier professional equipment with a keen artistic eye to deliver stunning, high-resolution memories.
 </p>
 
 <div className="grid grid-cols-2 gap-6 pt-6">
 <div className="flex flex-col gap-2">
 <Camera className="w-8 h-8 text-brand-gradient" />
 <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">Premium Quality</h3>
 <p className="text-zinc-500 dark:text-zinc-400">High-end equipment and expert retouching.</p>
 </div>
 <div className="flex flex-col gap-2">
 <Heart className="w-8 h-8 text-brand-gradient" />
 <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">Passion Driven</h3>
 <p className="text-zinc-500 dark:text-zinc-400">We love what we do, and it shows in our work.</p>
 </div>
 </div>
 </AnimatedSection>
 </div>

 <AnimatedSection className="text-center mb-16">
 <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">Behind The Scenes</h2>
 <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
 A glimpse into how we create the magic.
 </p>
 </AnimatedSection>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
 <AnimatedSection delay={0.1}>
 <img src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504511/uihydxccixt0qki0udgt.jpg" alt="Studio Lighting" className="rounded-3xl h-64 w-full object-cover shadow-lg border border-zinc-200 dark:border-zinc-800/50" />
 </AnimatedSection>
 <AnimatedSection delay={0.2}>
 <img src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504512/whmygefmhfnmghgezcwv.jpg" alt="Camera Details" className="rounded-3xl h-64 w-full object-cover shadow-lg border border-zinc-200 dark:border-zinc-800/50" />
 </AnimatedSection>
 <AnimatedSection delay={0.3}>
 <img src="https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504514/e59l6lbsaio6zhrhwnkb.jpg" alt="Editing Process" className="rounded-3xl h-64 w-full object-cover shadow-lg border border-zinc-200 dark:border-zinc-800/50" />
 </AnimatedSection>
 </div>
 </div>
 );
}
