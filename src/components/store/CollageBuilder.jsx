"use client";
import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Plus, LayoutGrid } from "lucide-react";

const COLLAGE_LAYOUTS = [
  { 
    id: 'c1', 
    name: 'Classic 2x2 Grid', 
    slots: 4, 
    price: 600, 
    gridClass: 'grid-cols-2 grid-rows-2',
    slotClasses: ['', '', '', '']
  },
  { 
    id: 'c2', 
    name: '3-Photo Feature', 
    slots: 3, 
    price: 500, 
    gridClass: 'grid-cols-2 grid-rows-2',
    slotClasses: ['row-span-2 h-full', 'h-full', 'h-full']
  },
  { 
    id: 'c3', 
    name: 'Wide Strip', 
    slots: 3, 
    price: 450, 
    gridClass: 'grid-cols-3 grid-rows-1',
    slotClasses: ['', '', '']
  }
];

export default function CollageBuilder({ onAddToCart }) {
  const [selectedLayoutId, setSelectedLayoutId] = useState(COLLAGE_LAYOUTS[0].id);
  const [images, setImages] = useState({});
  const fileInputRef = useRef(null);
  const [activeSlot, setActiveSlot] = useState(null);

  const selectedLayout = COLLAGE_LAYOUTS.find(l => l.id === selectedLayoutId);

  const handleLayoutChange = (layoutId) => {
    setSelectedLayoutId(layoutId);
    // Optional: Clear images if slots are reduced, or just keep them in state.
    // For now, keeping them in state is fine; they just won't render if the slot doesn't exist.
  };

  const openFilePicker = (index) => {
    setActiveSlot(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && activeSlot !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => ({
          ...prev,
          [activeSlot]: reader.result
        }));
        setActiveSlot(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index, e) => {
    e.stopPropagation();
    setImages(prev => {
      const newImages = { ...prev };
      delete newImages[index];
      return newImages;
    });
  };

  const handleAddToCart = () => {
    const uploadedImagesCount = Object.keys(images).length;
    if (uploadedImagesCount < selectedLayout.slots) {
      alert(`Please fill all ${selectedLayout.slots} slots before adding to order.`);
      return;
    }

    onAddToCart({
      id: `collage-${selectedLayout.id}-${Date.now()}`,
      name: `Custom Collage (${selectedLayout.name})`,
      price: selectedLayout.price,
      category: "Collage",
      image: Object.values(images)[0], // Use first image as thumbnail
      collageConfig: {
        layout: selectedLayout.name,
        images: images
      }
    });

    // Reset after adding
    setImages({});
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Left Column: Preview Canvas */}
      <div className="lg:col-span-8 bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-4 sm:p-8 flex items-center justify-center min-h-[400px] lg:min-h-[600px] lg:sticky lg:top-24">
        <div className="w-full max-w-2xl aspect-[4/3] bg-white dark:bg-zinc-950 shadow-2xl p-4 rounded-xl">
          <div className={`grid gap-2 w-full h-full ${selectedLayout.gridClass}`}>
            {Array.from({ length: selectedLayout.slots }).map((_, i) => (
              <div 
                key={i}
                onClick={() => openFilePicker(i)}
                className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors group ${selectedLayout.slotClasses[i]}`}
              >
                {images[i] ? (
                  <>
                    <img 
                      src={images[i]} 
                      alt={`Slot ${i+1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <p className="text-white font-medium text-sm">Change Photo</p>
                    </div>
                    <button 
                      onClick={(e) => removeImage(i, e)}
                      className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-zinc-400 dark:text-zinc-500 flex flex-col items-center">
                    <div className="bg-white dark:bg-zinc-900 p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className="text-sm font-medium">Add Photo</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Design Your Collage</h2>
          
          {/* Layout Selection */}
          <div className="mb-8">
            <label className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3 block">
              1. Choose Layout
            </label>
            <div className="grid grid-cols-1 gap-3">
              {COLLAGE_LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => handleLayoutChange(layout.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedLayoutId === layout.id
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-400/10"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-amber-400/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className={`w-5 h-5 ${selectedLayoutId === layout.id ? 'text-amber-500' : 'text-zinc-500'}`} />
                    <span className={`font-medium ${selectedLayoutId === layout.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                      {layout.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">₹{layout.price}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800 mb-8" />

          {/* Pricing & Add to Cart */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Price</p>
                <p className="text-4xl font-bold text-zinc-900 dark:text-white">₹{selectedLayout.price}</p>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-500 font-medium">
                {Object.keys(images).length} / {selectedLayout.slots} photos
              </p>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-full bg-amber-400 hover:bg-amber-500 text-black py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Collage to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
