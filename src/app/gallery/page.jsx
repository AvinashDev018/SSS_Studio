"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Weddings", "Portraits", "Birthdays", "Events"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("studioGallery");
    if (saved) {
      setGalleryItems(JSON.parse(saved));
    } else {
      // Fallback demo data
      setGalleryItems([
        { id: 1, category: "Weddings", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop", aspect: "aspect-[3/4]" },
        { id: 2, category: "Portraits", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop", aspect: "aspect-square" },
        { id: 3, category: "Events", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop", aspect: "aspect-video" },
        { id: 4, category: "Weddings", src: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop", aspect: "aspect-square" },
        { id: 5, category: "Birthdays", src: "https://images.unsplash.com/photo-1530103862676-de88b394145b?w=800&auto=format&fit=crop", aspect: "aspect-[4/3]" },
        { id: 6, category: "Portraits", src: "https://images.unsplash.com/photo-1506863530036-1efed7e9fa59?w=800&auto=format&fit=crop", aspect: "aspect-[3/4]" },
      ]);
    }
  }, []);

  const filteredItems = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredItems.length]);

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
                    ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]"
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
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/10 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] transition-all duration-500"
                onClick={() => setSelectedIndex(idx)}
              >
                <img 
                  src={item.src} 
                  alt={item.category} 
                  className={`w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110`}
                  loading="lazy"
                />
                
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div>
                      <p className="text-amber-500 font-bold text-xs tracking-widest uppercase mb-1">{item.category}</p>
                      <h3 className="text-white text-xl font-serif font-bold drop-shadow-md">Studio Capture</h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300 shadow-xl">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all z-50 hover:scale-110"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button 
              className="absolute left-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded-full transition-all z-50 hover:scale-110 hidden md:block"
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
              alt="Fullscreen view" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />

            {/* Next Button */}
            <button 
              className="absolute right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded-full transition-all z-50 hover:scale-110 hidden md:block"
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
