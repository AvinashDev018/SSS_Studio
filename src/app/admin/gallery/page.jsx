"use client";

import { useState, useEffect, useRef } from "react";
import AdminNav from "@/components/admin/AdminNav";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Filter,
  FileText,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Star
} from "lucide-react";
import { getPhotos, addPhoto, deletePhoto, togglePhotoFeatured } from "@/app/actions/gallery";
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
  const [uploadFeedback, setUploadFeedback] = useState(null);
  const fileInputRef = useRef(null);

  // Wedding Album PDF state
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [pdfFeedback, setPdfFeedback] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("/docs/sample-wedding-album.pdf");
  const pdfInputRef = useRef(null);

  useEffect(() => {
    loadGallery();
    fetch("/api/upload-pdf")
      .then((r) => r.json())
      .then((data) => {
        if (data?.url) setPdfUrl(data.url);
      })
      .catch(() => {});
  }, []);

  const loadGallery = async () => {
    try {
      const photos = await getPhotos();
      setGallery(photos || []);
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
    setUploadFeedback(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        const uploadResult = await uploadImageToCloud(base64Data);

        if (!uploadResult.success) {
          setUploadFeedback({ type: "error", message: uploadResult.error || "Failed to upload image." });
          setIsUploading(false);
          return;
        }

        const addResult = await addPhoto(uploadResult.url, selectedCategory);
        if (addResult.success) {
          setUploadFeedback({ type: "success", message: `Photo saved to "${selectedCategory}" successfully!` });
          await loadGallery();
        } else {
          setUploadFeedback({ type: "error", message: addResult.error || "Failed to save image to database." });
        }
      } catch (err) {
        console.error("Upload error:", err);
        setUploadFeedback({ type: "error", message: "Upload failed: " + (err.message || "Unknown error") });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setUploadFeedback(null), 6000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setPdfFeedback({ type: "error", message: "Please select a valid PDF file (.pdf)" });
      return;
    }

    setIsPdfUploading(true);
    setPdfFeedback(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload PDF");
      }

      setPdfUrl(data.url);
      setPdfFeedback({
        type: "success",
        message: `Wedding Album PDF updated! (${file.name} - ${data.fileSize})`,
      });
    } catch (err) {
      console.error("PDF upload error:", err);
      setPdfFeedback({ type: "error", message: err.message || "Failed to update PDF." });
    } finally {
      setIsPdfUploading(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      setTimeout(() => setPdfFeedback(null), 8000);
    }
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

  const handleToggleFeatured = async (item) => {
    const result = await togglePhotoFeatured(item.id, !item.featured);
    if (result.success) {
      await loadGallery();
    } else {
      alert(result.error || "Failed to update featured status.");
    }
  };

  const displayedPhotos = filterCategory === "All" 
    ? gallery 
    : gallery.filter((item) => item.category === filterCategory);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/gallery" />

      {/* Main Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-[#14120c] p-6 rounded-3xl border border-amber-500/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <ImageIcon className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-black text-amber-400">
              Portfolio &amp; Visual Assets CMS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
            Master Gallery &amp; Showcase Manager
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-normal max-w-2xl leading-relaxed">
            Upload high-resolution photoshoot masterworks and publish wedding photobook albums for the public portfolio.
          </p>
        </div>

        {/* Upload Image Control Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#0b0c07] border border-amber-500/30">
            <span className="text-xs text-zinc-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-xs text-amber-300 focus:ring-0 cursor-pointer font-bold"
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
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:from-amber-300 hover:to-yellow-400 disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Upload Notification Banner */}
      {uploadFeedback && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold ${
            uploadFeedback.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/80 border-red-500/40 text-red-300"
          }`}
        >
          {uploadFeedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span>{uploadFeedback.message}</span>
        </div>
      )}

      {/* DEDICATED ADMIN WEDDING ALBUM PDF MANAGER */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#141008] via-[#1a150c] to-[#141008] border border-amber-500/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shrink-0 shadow-lg">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest font-black text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <FileText className="w-3 h-3" /> Wedding Photobook E-Album (PDF)
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                • 41 Pages Active (Zero-Lag 60fps Viewer)
              </span>
            </div>
            <h3 className="text-lg font-serif font-bold text-white">
              The Wedding of Srijitha + Sreeraj — Master Photobook PDF
            </h3>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl leading-relaxed">
              All 41 pages from your uploaded wedding album are live. Visitors can flip through all 40 spreads with buttery-smooth 60fps transitions and download the complete master PDF design.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          {/* Hidden PDF file input */}
          <input
            type="file"
            ref={pdfInputRef}
            onChange={handlePdfUpload}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          <button
            onClick={() => pdfInputRef.current?.click()}
            disabled={isPdfUploading}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isPdfUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading PDF...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload / Replace PDF</span>
              </>
            )}
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            title="Preview current wedding album PDF in new tab"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Preview PDF</span>
          </a>
        </div>
      </div>

      {/* PDF Upload Feedback Alert */}
      {pdfFeedback && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold ${
            pdfFeedback.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/80 border-red-500/40 text-red-300"
          }`}
        >
          {pdfFeedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span>{pdfFeedback.message}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-zinc-400 mr-2 flex items-center gap-1 font-medium">
          <Filter className="w-3 h-3 text-amber-400" /> Filter:
        </span>
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterCategory === cat
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
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
              className="relative group bg-[#070e0c] rounded-2xl overflow-hidden aspect-square border border-white/10 shadow-lg hover:border-amber-400/40 transition-all duration-300"
            >
              <img
                src={item.url}
                alt={item.category}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="self-start px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="px-2 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase">Home</span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`p-2 rounded-xl shadow-lg transition-transform hover:scale-110 cursor-pointer ${
                      item.featured
                        ? "bg-amber-400 text-black"
                        : "bg-black/70 text-amber-300 border border-amber-500/40"
                    }`}
                    title={item.featured ? "Remove from homepage" : "Feature on homepage"}
                  >
                    <Star className="w-4 h-4" fill={item.featured ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-xl shadow-lg transition-transform hover:scale-110 cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
