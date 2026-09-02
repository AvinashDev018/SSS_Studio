"use client";

import { useState, useEffect, useRef } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { Upload, Trash2, Image as ImageIcon, Sparkles, Filter } from "lucide-react";
import { getPhotos, addPhoto, deletePhoto } from "@/app/actions/gallery";
import { uploadImageToCloud } from "@/app/actions/upload";

const CATEGORIES = [
  "Weddings",
  "Pre-Wedding & Post Wedding",
  "Baby Photo Shoot",
  "Maternity Shoot",
  "Birthday Shoot",
  "School & College Events",
];

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Weddings");
  const [filterCategory, setFilterCategory] = useState("All");
  const fileInputRef = useRef(null);

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
        const uploadResult = await uploadImageToCloud(base64Data);

        if (!uploadResult.success) {
          alert("Failed to upload image: " + uploadResult.error);
          setIsUploading(false);
          return;
        }

        const addResult = await addPhoto(uploadResult.url, selectedCategory);
        if (addResult.success) {
          await loadGallery();
        } else {
          alert("Failed to save image: " + addResult.error);
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed. Please check your image size and connection.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this photo from the public studio portfolio?")) {
      const result = await deletePhoto(id);
      if (result.success) {
        await loadGallery();
      } else {
        alert("Failed to delete photo.");
      }
    }
  };

  const displayedPhotos = filterCategory === "All" 
    ? gallery 
    : gallery.filter((item) => item.category === filterCategory);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/gallery" />

      {/* Friendly Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-gradient-to-r from-[#0c221e]/80 via-[#0a1815]/60 to-transparent p-6 rounded-3xl border border-teal-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <ImageIcon className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-teal-400">
              Portfolio & Visual Assets
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Master Gallery CMS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-light max-w-2xl">
            Upload and organize high-resolution photoshoot masterworks displayed across your homepage and public portfolio.
          </p>
        </div>

        {/* Upload Control Button Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#080e0c] border border-white/10">
            <span className="text-xs text-zinc-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-xs text-white focus:ring-0 cursor-pointer font-semibold"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0b1412]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

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
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <span>Uploading to Cloud...</span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-zinc-400 mr-2 flex items-center gap-1 font-medium">
          <Filter className="w-3 h-3 text-teal-400" /> Filter:
        </span>
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterCategory === cat
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayedPhotos.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-[#0a1310] rounded-3xl border border-white/10">
            <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Photos in this Category</h3>
            <p className="text-xs text-zinc-400 font-light">Upload a new master shot using the button above.</p>
          </div>
        ) : (
          displayedPhotos.map((item) => (
            <div
              key={item.id}
              className="relative group bg-[#070e0c] rounded-2xl overflow-hidden aspect-square border border-white/10 shadow-lg hover:border-teal-400/40 transition-all duration-300"
            >
              <img
                src={item.url}
                alt={item.category}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <span className="self-start px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-teal-300 text-[10px] font-bold uppercase tracking-wider border border-teal-500/30">
                  {item.category}
                </span>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="self-end bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-xl shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Delete Photo"
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
