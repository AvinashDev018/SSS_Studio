"use client";

import { useState } from "react";
import { Image as ImageIcon, Frame, Plus } from "lucide-react";

const FRAME_TYPES = [
  { id: "synthetic_wood", name: "Synthetic Wood", multiplier: 1.2, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&auto=format&fit=crop" },
  { id: "premium_matte", name: "Premium Matte Black", multiplier: 1.5, image: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=200&auto=format&fit=crop" },
  { id: "classic_gold", name: "Classic Gold", multiplier: 1.8, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&auto=format&fit=crop" },
];

const FRAME_SIZES = [
  { id: "8x12", name: "8 x 12 inches (A4)", basePrice: 400 },
  { id: "12x18", name: "12 x 18 inches", basePrice: 800 },
  { id: "16x20", name: "16 x 20 inches", basePrice: 1200 },
  { id: "20x30", name: "20 x 30 inches", basePrice: 1800 },
  { id: "24x36", name: "24 x 36 inches", basePrice: 2500 },
];

export default function FrameBuilder({ onAddToCart }) {
  const [selectedType, setSelectedType] = useState(FRAME_TYPES[0]);
  const [selectedSize, setSelectedSize] = useState(FRAME_SIZES[0]);

  // Calculate final price based on base size price * material multiplier
  const finalPrice = Math.round(selectedSize.basePrice * selectedType.multiplier);

  const handleAddToCart = () => {
    onAddToCart({
      id: `frame_${selectedType.id}_${selectedSize.id}`,
      name: `Custom Frame (${selectedSize.name})`,
      category: "Frame",
      price: finalPrice,
      details: `Material: ${selectedType.name}`,
      image: selectedType.image
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
        <Frame className="text-amber-500" /> Build Your Custom Frame
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Preview */}
        <div className="bg-zinc-100 dark:bg-zinc-950 rounded-2xl p-8 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 min-h-[300px]">
          <div 
            className="relative bg-white shadow-2xl transition-all duration-500 flex items-center justify-center"
            style={{
              width: selectedSize.id === '8x12' ? '120px' : selectedSize.id === '12x18' ? '180px' : selectedSize.id === '16x20' ? '200px' : selectedSize.id === '20x30' ? '240px' : '280px',
              height: selectedSize.id === '8x12' ? '180px' : selectedSize.id === '12x18' ? '270px' : selectedSize.id === '16x20' ? '250px' : selectedSize.id === '20x30' ? '360px' : '420px',
              border: selectedType.id === 'premium_matte' ? '12px solid #18181b' : selectedType.id === 'classic_gold' ? '12px solid #d4af37' : '12px solid #8b5a2b',
            }}
          >
            <div className="absolute inset-2 border border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs font-medium text-center px-2">Your Photo Here</span>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="space-y-8">
          
          {/* Frame Type Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-900 dark:text-white">1. Select Frame Material</h3>
            <div className="grid grid-cols-3 gap-3">
              {FRAME_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                    selectedType.id === type.id
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-amber-400/50"
                  }`}
                >
                  <img src={type.image} alt={type.name} className="w-12 h-12 rounded-full object-cover mb-2 border border-zinc-200 dark:border-zinc-700" />
                  <span className="text-xs font-medium text-center text-zinc-700 dark:text-zinc-300">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-900 dark:text-white">2. Select Dimensions</h3>
            <div className="space-y-2">
              {FRAME_SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition-all ${
                    selectedSize.id === size.id
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-amber-400/50"
                  }`}
                >
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{size.name}</span>
                  <span className="text-amber-600 dark:text-amber-500 font-bold">
                    ₹{Math.round(size.basePrice * selectedType.multiplier)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Price</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">₹{finalPrice}</p>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-black px-6 py-3 rounded-full font-bold hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all"
            >
              <Plus className="w-5 h-5" /> Add to Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
