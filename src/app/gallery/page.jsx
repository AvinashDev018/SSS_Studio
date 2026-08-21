"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { X, ZoomIn } from "lucide-react";

// Demo gallery data
const GALLERY_ITEMS = [
  { id: 1, category: "Weddings", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop", aspect: "aspect-[3/4]" },
  { id: 2, category: "Portraits", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop", aspect: "aspect-square" },
  { id: 3, category: "Events", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop", aspect: "aspect-video" },
  { id: 4, category: "Weddings", src: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop", aspect: "aspect-square" },
  { id: 5, category: "Birthdays", src: "https://images.unsplash.com/photo-1530103862676-de88b394145b?w=800&auto=format&fit=crop", aspect: "aspect-[4/3]" },
  { id: 6, category: "Portraits", src: "https://images.unsplash.com/photo-1506863530036-1efed7e9fa59?w=800&auto=format&fit=crop", aspect: "aspect-[3/4]" },
  { id: 7, category: "Weddings", src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop", aspect: "aspect-video" },
  { id: 8, category: "Events", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop", aspect: "aspect-square" },
  { id: 9, category: "Portraits", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop", aspect: "aspect-[3/4]" },
];

const CATEGORIES = ["All", "Weddings", "Portraits", "Birthdays", "Events"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems = activeCategory === "All" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-zinc-900 dark:text-white">
            Our Portfolio
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            A curated collection of our finest moments captured through the lens.
          </p>
        </AnimatedSection>

        {/* Categories */}
        <AnimatedSection delay={0.1} className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-amber-400/50 hover:text-amber-500"
              }`}
            >
              {category}
            </button>
          ))}
        </AnimatedSection>

        {/* Masonry Grid (Using CSS columns) */}
        <AnimatedSection delay={0.2}>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-zinc-200 dark:bg-zinc-800"
                onClick={() => setSelectedImage(item.src)}
              >
                <img 
                  src={item.src} 
                  alt={item.category} 
                  className={`w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105`}
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                  <p className="text-white font-medium mt-4 tracking-wider uppercase text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.category}
                  </p>
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

      {/* Fullscreen Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-white/10 p-2 rounded-full transition-all"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Fullscreen view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
