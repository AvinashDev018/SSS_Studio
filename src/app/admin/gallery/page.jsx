"use client";

import { useState, useEffect, useRef } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

const CATEGORIES = ["Weddings", "Portraits", "Birthdays", "Events"];

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Weddings");
  const fileInputRef = useRef(null);

  // Load on mount
  useEffect(() => {
    const saved = localStorage.getItem("studioGallery");
    if (saved) {
      setGallery(JSON.parse(saved));
    } else {
      // Initialize with demo data if empty
      const demoData = [
        { id: "demo-1", category: "Weddings", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop", aspect: "aspect-[3/4]" },
        { id: "demo-2", category: "Portraits", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop", aspect: "aspect-square" },
        { id: "demo-3", category: "Events", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop", aspect: "aspect-video" },
        { id: "demo-4", category: "Weddings", src: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop", aspect: "aspect-square" },
        { id: "demo-5", category: "Birthdays", src: "https://images.unsplash.com/photo-1530103862676-de88b394145b?w=800&auto=format&fit=crop", aspect: "aspect-[4/3]" },
        { id: "demo-6", category: "Portraits", src: "https://images.unsplash.com/photo-1506863530036-1efed7e9fa59?w=800&auto=format&fit=crop", aspect: "aspect-[3/4]" },
        { id: "demo-7", category: "Weddings", src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop", aspect: "aspect-video" },
        { id: "demo-8", category: "Events", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop", aspect: "aspect-square" },
        { id: "demo-9", category: "Portraits", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop", aspect: "aspect-[3/4]" },
      ];
      setGallery(demoData);
      localStorage.setItem("studioGallery", JSON.stringify(demoData));
    }
  }, []);

  const saveGallery = (newGallery) => {
    setGallery(newGallery);
    localStorage.setItem("studioGallery", JSON.stringify(newGallery));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      // Guess aspect ratio roughly
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        let aspect = "aspect-square";
        if (ratio > 1.2) aspect = "aspect-video";
        else if (ratio < 0.8) aspect = "aspect-[3/4]";
        else if (ratio > 1.05) aspect = "aspect-[4/3]";

        const newItem = {
          id: `img-${Date.now()}`,
          category: selectedCategory,
          src: reader.result,
          aspect
        };

        saveGallery([newItem, ...gallery]);
        setIsUploading(false);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this image from the gallery?")) {
      saveGallery(gallery.filter(item => item.id !== id));
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <AdminNav currentPath="/admin/gallery" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Gallery Management
          </h1>
          <p className="text-zinc-500 mt-2">Manage portfolio images shown to customers.</p>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:ring-0 cursor-pointer pl-2"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : <><Upload className="w-4 h-4" /> Upload</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <ImageIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">No images in your gallery.</p>
          </div>
        ) : (
          gallery.map((item) => (
            <div key={item.id} className="relative group bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden aspect-square border border-zinc-200 dark:border-zinc-700">
              <img 
                src={item.src} 
                alt={item.category} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
