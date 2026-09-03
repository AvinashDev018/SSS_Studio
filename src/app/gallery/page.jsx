"use client";

import { useState, useEffect, useRef } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPhotos } from "@/app/actions/gallery";

const CATEGORIES = ["All", "Weddings", "Portraits", "Birthdays", "Events"];

export default function GalleryPage() {
 const [activeCategory, setActiveCategory] = useState("All");
 const [selectedIndex, setSelectedIndex] = useState(null);
 const [galleryItems, setGalleryItems] = useState([]);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
   const loadPhotos = async () => {
     try {
       const photos = await getPhotos();
       // map url to src for the UI
       setGalleryItems(photos.map(p => ({ ...p, src: p.url })));
     } catch (error) {
       console.error("Failed to load photos", error);
     } finally {
       setIsLoading(false);
     }
   };
   loadPhotos();
 }, []);

 const filteredItems = activeCategory === "All" 
 ? galleryItems 
 : galleryItems.filter(item => item.category === activeCategory);

 const lightboxRef = useRef(null);

 // Keyboard navigation for Lightbox focus management
 useEffect(() => {
   if (selectedIndex !== null && lightboxRef.current) {
     lightboxRef.current.focus();
   }
 }, [selectedIndex]);

 const handleLightboxKeyDown = (e) => {
   if (e.key === "Escape") {
     e.stopPropagation();
     setSelectedIndex(null);
   } else if (e.key === "ArrowRight") {
     e.stopPropagation();
     setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
   } else if (e.key === "ArrowLeft") {
     e.stopPropagation();
     setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
   }
 };

 return (
 <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-20">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 {/* Header */}
 <AnimatedSection className="text-center mb-16 relative z-10">
 <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
 Our Portfolio
 </h1>
 <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
 A curated collection of our finest moments captured through the lens.
 </p>
 </AnimatedSection>

 {/* Categories */}
 <AnimatedSection delay={0.1} className="flex flex-wrap items-center justify-center gap-3 mb-12 relative z-10">
 <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-full inline-flex border border-white/10 shadow-2xl flex-wrap justify-center">
 {CATEGORIES.map(category => (
 <button
 key={category}
 onClick={() => setActiveCategory(category)}
 className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
 activeCategory === category
 ? "bg-brand-gradient hover-glow-brand text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]"
 : "text-zinc-400 hover:text-white hover:bg-white/5"
 }`}
 >
 {category}
 </button>
 ))}
 </div>
 </AnimatedSection>

 {/* Masonry Grid (Using CSS columns) */}
 <AnimatedSection delay={0.2}>
 {isLoading ? (
 <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="break-inside-avoid relative rounded-2xl overflow-hidden bg-zinc-800/50 animate-pulse h-64 w-full border border-white/5" />
 ))}
 </div>
 ) : (
 <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
 {filteredItems.map((item, idx) => (
 <div 
 key={`${item.id}-${idx}`} 
 role="button"
 tabIndex={0}
 className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-500 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none"
 onClick={() => setSelectedIndex(idx)}
 onKeyDown={(e) => {
   if (e.key === "Enter" || e.key === " ") {
     e.preventDefault();
     setSelectedIndex(idx);
   }
 }}
 >
 <img 
 src={item.src} 
 alt={`${item.category} portfolio photo`}
 className={`w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110`}
 loading="lazy"
 />
 
 {/* Premium Overlay */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
 <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
 <div>
 <p className="text-brand-gradient font-bold text-xs tracking-widest uppercase mb-1">{item.category}</p>
 <h3 className="text-white text-xl font-serif font-bold drop-shadow-md">Studio Capture</h3>
 </div>
 <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white group-hover:bg-brand-gradient hover-glow-brand group-hover:text-black transition-colors duration-300 shadow-xl">
 <ZoomIn className="w-5 h-5" />
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}

 {!isLoading && filteredItems.length === 0 && (
 <div className="text-center py-20">
 <p className="text-zinc-500 dark:text-zinc-400 text-lg">No images found in this category.</p>
 </div>
 )}
 </AnimatedSection>
 </div>

 {/* Premium Fullscreen Lightbox */}
 <AnimatePresence>
 {selectedIndex !== null && (
 <motion.div 
 ref={lightboxRef}
 tabIndex={0}
 onKeyDown={handleLightboxKeyDown}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.3 }}
 className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500 focus:outline-none"
 onClick={() => setSelectedIndex(null)}
 >
 {/* Close Button */}
 <button 
 aria-label="Close lightbox"
 className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all z-50 hover:scale-110 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none"
 onClick={() => setSelectedIndex(null)}
 >
 <X className="w-6 h-6" />
 </button>

 {/* Prev Button */}
 <button 
 aria-label="Previous image"
 className="absolute left-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded-full transition-all z-50 hover:scale-110 hidden md:block focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none"
 onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length); }}
 >
 <ChevronLeft className="w-8 h-8" />
 </button>
 
 <motion.img 
 key={selectedIndex}
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.9 }}
 transition={{ type: "spring", damping: 25, stiffness: 300 }}
 src={filteredItems[selectedIndex]?.src} 
 alt={`Fullscreen view of ${filteredItems[selectedIndex]?.category || 'portfolio'} photo`}
 className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
 onClick={(e) => e.stopPropagation()} 
 />

 {/* Next Button */}
 <button 
 aria-label="Next image"
 className="absolute right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded-full transition-all z-50 hover:scale-110 hidden md:block focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none"
 onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev + 1) % filteredItems.length); }}
 >
 <ChevronRight className="w-8 h-8" />
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
