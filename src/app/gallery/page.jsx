"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const photos = [
  { id: 1, category: "Wedding", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" },
  { id: 2, category: "Portrait", url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, category: "Event", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, category: "Wedding", url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop" },
  { id: 5, category: "Birthday", url: "https://images.unsplash.com/photo-1530103862676-de8892bc952f?q=80&w=1000&auto=format&fit=crop" },
  { id: 6, category: "Portrait", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop" },
];

const categories = ["All", "Wedding", "Portrait", "Event", "Birthday"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredPhotos = activeCategory === "All" 
    ? photos 
    : photos.filter(p => p.category === activeCategory);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const showPrev = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };
  
  const showNext = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex < filteredPhotos.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-amber-100 to-yellow-600 drop-shadow-sm">Our Portfolio</h1>
        <p className="text-zinc-300 text-xl max-w-2xl mx-auto font-light leading-relaxed">
          A collection of our finest moments captured through the lens.
        </p>
      </div>
      
      {/* Filter Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? "bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20"
                : "bg-zinc-900/50 backdrop-blur-sm text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredPhotos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="break-inside-avoid cursor-pointer overflow-hidden rounded-2xl group"
            onClick={() => openLightbox(index)}
          >
            <img 
              src={photo.url} 
              alt={photo.category} 
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={closeLightbox}>
            <X className="w-8 h-8" />
          </button>
          
          <button 
            className="absolute left-6 text-white/70 hover:text-white disabled:opacity-30"
            onClick={showPrev}
            disabled={lightboxIndex === 0}
          >
            <ChevronLeft className="w-12 h-12" />
          </button>
          
          <img 
            src={filteredPhotos[lightboxIndex].url} 
            alt="Lightbox view" 
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          
          <button 
            className="absolute right-6 text-white/70 hover:text-white disabled:opacity-30"
            onClick={showNext}
            disabled={lightboxIndex === filteredPhotos.length - 1}
          >
            <ChevronRight className="w-12 h-12" />
          </button>
        </div>
      )}
    </div>
  );
}
