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
 const [zoom, setZoom] = useState(1);
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
 setZoom(1); // Reset zoom
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
 <Frame className="text-brand-gradient" /> Build Your Custom Frame
 </h2>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
 {/* Left: Preview */}
 <div className="bg-zinc-100 dark:bg-zinc-950 rounded-2xl p-6 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 min-h-[300px] md:sticky md:top-24 z-10">
 <div className="relative group z-10">
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
 backgroundColor: '#fff',
 boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.3)',
 }}
 >
 {/* Inner Photo Container (creates the sunken look) */}
 <div className="relative w-full h-full shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] overflow-hidden bg-zinc-100 flex items-center justify-center">
 {previewImage ? (
 <img 
 src={previewImage} 
 alt="Custom Preview" 
 className="w-full h-full object-cover transition-all duration-300" 
 style={{ 
 transform: `scale(${zoom}) rotate(${rotation}deg)`
 }}
 />
 ) : (
 <div className="absolute inset-2 border border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-400">
 <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
 <span className="text-xs font-medium text-center px-2">Your Photo Here</span>
 </div>
 )}
 
 {/* Glass Glare Overlay */}
 <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none opacity-60 mix-blend-overlay"></div>
 <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none transform -skew-x-12 translate-x-4 opacity-50"></div>
 </div>
 </div>
 
 {/* Wall Shadow cast by Frame */}
 <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 blur-xl rounded-[100%] -z-10 group-hover:bg-black/30 transition-all duration-500"></div>
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
 className="flex items-center gap-2 text-brand-gradient dark:text-brand-gradient font-medium hover:text-brand-gradient transition-colors bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1.5 rounded-lg text-sm"
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
 className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors bg-white/80 backdrop-blur dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-lg text-sm"
 >
 <MonitorSmartphone className="w-4 h-4" /> 
 {orientation}
 </button>
 </div>
 
 {/* Zoom / Crop Controls */}
 {previewImage && (
 <div className="mt-4 w-full px-6 flex items-center gap-4">
 <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider shrink-0">Scale</span>
 <input 
 type="range" 
 min="1" max="3" step="0.1" 
 value={zoom} 
 onChange={(e) => setZoom(parseFloat(e.target.value))}
 className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
 />
 </div>
 )}
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
 ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
 : "border-zinc-200 dark:border-zinc-800 hover:border-cyan-400/50"
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
 <div className="relative">
 <select
 value={selectedSize.id}
 onChange={(e) => {
 const newSize = FRAME_SIZES.find(s => s.id === e.target.value);
 if (newSize) setSelectedSize(newSize);
 }}
 className="w-full appearance-none bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-medium text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer shadow-sm"
 >
 {FRAME_SIZES.map(size => (
 <option key={size.id} value={size.id} className="bg-white dark:bg-zinc-900">
 {size.name} — ₹{Math.round(size.basePrice * selectedType.multiplier)}
 </option>
 ))}
 </select>
 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
 </svg>
 </div>
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
 className="flex items-center gap-2 bg-brand-gradient hover-glow-brand text-black px-5 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-sm"
 >
 <Plus className="w-4 h-4" /> Add to Order
 </button>
 </div>

 </div>
 </div>
 </div>
 );
}
