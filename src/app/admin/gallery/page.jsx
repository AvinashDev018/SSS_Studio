"use client";

import { useState, useEffect, useRef } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { getPhotos, addPhoto, deletePhoto } from "@/app/actions/gallery";
import { uploadImageToCloud } from "@/app/actions/upload";

const CATEGORIES = ["Weddings", "Portraits", "Birthdays", "Events"];

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Weddings");
  const fileInputRef = useRef(null);

  // Load on mount
  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const photos = await getPhotos();
      setGallery(photos);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        
        // Upload to ImgBB
        const uploadResult = await uploadImageToCloud(base64Data);
        
        if (!uploadResult.success) {
          alert("Failed to upload image to cloud: " + uploadResult.error);
          setIsUploading(false);
          return;
        }

        // Save to Database
        const formData = new FormData();
        formData.append("url", uploadResult.url);
        formData.append("category", selectedCategory);
        
        const saveResult = await addPhoto(formData);
        
        if (saveResult.success) {
          // Refresh gallery list
          await loadGallery();
        } else {
          alert("Failed to save to database: " + saveResult.error);
        }
      } catch (error) {
        console.error("Upload process error:", error);
        alert("An error occurred during upload.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this image from the gallery?")) {
      const result = await deletePhoto(id);
      if (result.success) {
        await loadGallery();
      } else {
        alert("Failed to delete photo.");
      }
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
            className="flex items-center gap-2 bg-brand-gradient hover-glow-brand hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
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
                src={item.url} 
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
