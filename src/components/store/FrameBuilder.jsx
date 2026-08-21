"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Frame, Plus, Upload, RotateCw, MonitorSmartphone } from "lucide-react";

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
  const [previewImage, setPreviewImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [orientation, setOrientation] = useState("Portrait");
  const fileInputRef = useRef(null);

  // Calculate final price based on base size price * material multiplier
  const finalPrice = Math.round(selectedSize.basePrice * selectedType.multiplier);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setRotation(0); // Reset rotation for new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: `frame_${selectedType.id}_${selectedSize.id}`,
      name: `Custom Frame (${selectedSize.name})`,
      category: "Frame",
      price: finalPrice,
      details: `Material: ${selectedType.name} | Orientation: ${orientation}${previewImage ? ' (Custom Photo)' : ''}`,
      image: previewImage || selectedType.image,
      hasCustomPhoto: !!previewImage
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
        <Frame className="text-amber-500" /> Build Your Custom Frame
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Preview */}
        <div className="bg-zinc-100 dark:bg-zinc-950 rounded-2xl p-6 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 min-h-[300px] md:sticky md:top-24 z-10">
          <div 
            className="relative shadow-2xl transition-all duration-500 flex items-center justify-center overflow-hidden"
            style={{
              width: orientation === "Portrait" 
                ? (selectedSize.id === '8x12' ? '90px' : selectedSize.id === '12x18' ? '120px' : selectedSize.id === '16x20' ? '140px' : selectedSize.id === '20x30' ? '160px' : '180px')
                : (selectedSize.id === '8x12' ? '135px' : selectedSize.id === '12x18' ? '180px' : selectedSize.id === '16x20' ? '175px' : selectedSize.id === '20x30' ? '240px' : '270px'),
              height: orientation === "Portrait"
                ? (selectedSize.id === '8x12' ? '135px' : selectedSize.id === '12x18' ? '180px' : selectedSize.id === '16x20' ? '175px' : selectedSize.id === '20x30' ? '240px' : '270px')
                : (selectedSize.id === '8x12' ? '90px' : selectedSize.id === '12x18' ? '120px' : selectedSize.id === '16x20' ? '140px' : selectedSize.id === '20x30' ? '160px' : '180px'),
              border: selectedType.id === 'premium_matte' ? '12px solid #18181b' : selectedType.id === 'classic_gold' ? '12px solid #d4af37' : '12px solid #8b5a2b',
              backgroundColor: previewImage ? '#fff' : '#fff',
            }}
          >
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Custom Preview" 
                className="w-full h-full object-cover transition-transform duration-300" 
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            ) : (
              <div className="absolute inset-2 border border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-medium text-center px-2">Your Photo Here</span>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-medium hover:text-amber-700 transition-colors bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg text-sm"
            >
              <Upload className="w-4 h-4" /> 
              {previewImage ? "Change Photo" : "Upload"}
            </button>
            {previewImage && (
              <button 
                onClick={handleRotate}
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-lg text-sm"
              >
                <RotateCw className="w-4 h-4" /> 
                Rotate
              </button>
            )}
            <button 
              onClick={() => setOrientation(prev => prev === "Portrait" ? "Landscape" : "Portrait")}
              className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-lg text-sm"
            >
              <MonitorSmartphone className="w-4 h-4" /> 
              {orientation}
            </button>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="space-y-6">
          
          {/* Frame Type Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">1. Select Frame Material</h3>
            <div className="grid grid-cols-3 gap-2">
              {FRAME_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                    selectedType.id === type.id
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-amber-400/50"
                  }`}
                >
                  <img src={type.image} alt={type.name} className="w-8 h-8 rounded-full object-cover mb-1.5 border border-zinc-200 dark:border-zinc-700" />
                  <span className="text-[10px] font-medium text-center text-zinc-700 dark:text-zinc-300 leading-tight">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">2. Select Dimensions</h3>
            <div className="space-y-2">
              {FRAME_SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`w-full flex justify-between items-center px-4 py-2.5 rounded-xl border-2 transition-all ${
                    selectedSize.id === size.id
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-amber-400/50"
                  }`}
                >
                  <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{size.name}</span>
                  <span className="text-amber-600 dark:text-amber-500 font-bold text-sm">
                    ₹{Math.round(size.basePrice * selectedType.multiplier)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Price</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">₹{finalPrice}</p>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-black px-5 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all text-sm"
            >
              <Plus className="w-4 h-4" /> Add to Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
