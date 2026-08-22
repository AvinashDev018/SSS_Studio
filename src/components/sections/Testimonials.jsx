"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getTestimonials } from "@/app/actions/testimonials";

export default function Testimonials() {
 const [testimonials, setTestimonials] = useState([]);

 useEffect(() => {
 async function fetchTestimonials() {
 const data = await getTestimonials();
 setTestimonials(data);
 }
 fetchTestimonials();
 }, []);

 
 // Fallback to default testimonials if none in DB yet
 const displayTestimonials = testimonials.length > 0 ? testimonials : [
 {
 id: "1",
 name: "Priya & Karthik",
 event: "Wedding",
 text: "SSS Studio made our wedding day unforgettable! The photos are absolutely stunning and they captured every single candid moment perfectly. Highly recommended!",
 rating: 5
 },
 {
 id: "2",
 name: "Ramesh Family",
 event: "Birthday Function",
 text: "We hired them for our daughter's 1st birthday. The team was so patient and friendly, and the album output was extremely premium. Thank you!",
 rating: 5
 },
 {
 id: "3",
 name: "Suresh Kumar",
 event: "Corporate Event",
 text: "Very professional team in Madurai. They arrived on time, delivered the edited videos quickly, and the quality was top-notch. Will book again.",
 rating: 5
 }
 ];
 return (
 <div className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900/50 relative">
 <AnimatedSection className="text-center mb-20">
 <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-cyan-400 dark:to-violet-500 drop-shadow-sm">Client Love</h2>
 <p className="text-zinc-600 dark:text-zinc-400 text-xl max-w-2xl mx-auto font-light">
 Don't just take our word for it. Here is what our happy clients have to say about their experience with us.
 </p>
 </AnimatedSection>

 {/* Marquee Container */}
 <div className="relative w-full overflow-hidden mt-10">
 
 {/* Fade Masks */}
 <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none"></div>
 <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none"></div>

 {/* Scrolling Content */}
 <div className="flex w-max animate-marquee gap-8 py-4">
 {[...displayTestimonials, ...displayTestimonials].map((t, idx) => (
 <div key={`${t.id}-${idx}`} className="w-[300px] md:w-[450px] shrink-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800/50 p-10 rounded-3xl flex flex-col hover:border-cyan-500/50 dark:hover:border-cyan-500/30 transition-colors shadow-xl">
 <div className="flex gap-1 mb-8">
 {[...Array(t.rating || 5)].map((_, i) => (
 <Star key={i} className="w-5 h-5 fill-cyan-400 text-brand-gradient" />
 ))}
 </div>
 <p className="text-zinc-700 dark:text-zinc-300 flex-grow mb-10 text-lg italic leading-relaxed">"{t.text}"</p>
 <div>
 <h4 className="font-serif font-bold text-zinc-900 dark:text-white text-xl mb-1">{t.name}</h4>
 <p className="text-brand-gradient dark:text-brand-gradient/80 text-sm font-medium tracking-wide uppercase">{t.event}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}
