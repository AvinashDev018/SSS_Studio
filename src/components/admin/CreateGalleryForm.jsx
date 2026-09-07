"use client";

import React, { useState, useRef } from "react";
import { Plus, UploadCloud, FolderPlus, X, Link as LinkIcon, Image as ImageIcon, Sparkles, Folder } from "lucide-react";
import { createClientGallery, addPhotosToGallery } from "@/app/actions/gallery";

export default function CreateGalleryForm() {
  const [activeTab, setActiveTab] = useState("folder"); // "folder", "file", "url"
  const [localFiles, setLocalFiles] = useState([]);
  const [urlText, setUrlText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleFilesAdded = (rawFiles) => {
    const validFiles = Array.from(rawFiles).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic)$/i.test(f.name));
    if (!validFiles.length) return;

    const newFileObjs = validFiles.map((file) => ({
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));

    setLocalFiles((prev) => [...prev, ...newFileObjs]);
  };

  const handleRemoveFile = (index) => {
    setLocalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Canvas Image Compressor: converts heavy DSLR photos (e.g. 20MB) to crisp 250KB web images
  const compressFileToBlob = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxWidth = 1600;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => resolve(blob || file),
            "image/jpeg",
            0.8
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  // Upload single compressed file to Cloud Storage
  const uploadSingleFileToCloud = async (fileObj, index) => {
    const compressedBlob = await compressFileToBlob(fileObj.file);
    const uploadData = new FormData();
    uploadData.append("file", compressedBlob, fileObj.name);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to upload ${fileObj.name}`);
    }

    const data = await res.json();
    return {
      url: data.url,
      filename: fileObj.name || `Photo_${index + 1}.jpg`,
      isSelected: false,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData(e.target);
      const slug = formData.get("slug");
      const clientName = formData.get("clientName");
      const clientPhone = formData.get("clientPhone");
      const passcode = formData.get("passcode");
      const eventDate = formData.get("eventDate");
      const maxSelections = formData.get("maxSelections");

      if (activeTab === "folder" || activeTab === "file") {
        if (localFiles.length === 0) {
          setError("Please select a folder or files from your computer.");
          setUploading(false);
          return;
        }

        const totalFiles = localFiles.length;
        const uploadedPhotos = [];
        const concurrencyLimit = 2; // Smooth parallel batching

        for (let i = 0; i < totalFiles; i += concurrencyLimit) {
          const chunk = localFiles.slice(i, i + concurrencyLimit);
          setProgressStatus(`Uploading photo ${Math.min(i + concurrencyLimit, totalFiles)} of ${totalFiles} to Cloud Storage...`);

          const chunkResults = await Promise.all(
            chunk.map((fileObj, idx) => uploadSingleFileToCloud(fileObj, i + idx))
          );

          uploadedPhotos.push(...chunkResults);
          const percent = Math.round(((i + chunk.length) / totalFiles) * 85);
          setUploadProgress(percent);
        }

        setProgressStatus("Saving gallery to database...");
        setUploadProgress(90);

        const firstBatch = uploadedPhotos.slice(0, 50);
        const remainingPhotos = uploadedPhotos.slice(50);

        const res = await createClientGallery({
          slug,
          clientName,
          clientPhone,
          passcode,
          eventDate,
          maxSelections,
          photos: firstBatch,
        });

        if (!res.success || !res.gallery) {
          setError(res.error || "Failed to create proofing portal.");
          setUploading(false);
          return;
        }

        if (remainingPhotos.length > 0) {
          await addPhotosToGallery(res.gallery.id, remainingPhotos);
        }

        setUploadProgress(100);
        setProgressStatus("Done!");
        setUploading(false);
        window.location.reload();
      } else {
        const sampleUrls = urlText
          .split("\n")
          .map((u) => u.trim())
          .filter(Boolean);

        if (sampleUrls.length === 0) {
          setError("Please enter at least 1 image URL.");
          setUploading(false);
          return;
        }

        const photoObjects = sampleUrls.map((url, idx) => ({
          url,
          filename: `Photo_${idx + 1}.jpg`,
          isSelected: false,
        }));

        const res = await createClientGallery({
          slug,
          clientName,
          clientPhone,
          passcode,
          eventDate,
          maxSelections,
          photos: photoObjects,
        });

        setUploading(false);

        if (res.success) {
          window.location.reload();
        } else {
          setError(res.error || "Failed to create proofing portal.");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error uploading images to Cloud Storage. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#0b0c07] border border-amber-500/40 rounded-3xl p-6 shadow-2xl sticky top-8">
      <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
          <Plus className="w-4 h-4" />
        </span>
        Create Client Proofing Portal
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">
            Client / Couple Name
          </label>
          <input
            type="text"
            name="clientName"
            placeholder="e.g. Anand & Divya Wedding"
            required
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">
            Custom Link Slug
          </label>
          <input
            type="text"
            name="slug"
            placeholder="e.g. anand-divya-wedding"
            required
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-amber-300 font-mono text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">
              Client PIN Passcode
            </label>
            <input
              type="text"
              name="passcode"
              placeholder="4829"
              maxLength={6}
              required
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-mono text-center font-bold text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">
              Max Photos
            </label>
            <input
              type="number"
              name="maxSelections"
              defaultValue={40}
              required
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">
              Client Phone
            </label>
            <input
              type="text"
              name="clientPhone"
              placeholder="+91 98765 43210"
              required
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">
              Event Date
            </label>
            <input
              type="date"
              name="eventDate"
              required
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Upload Mode Selector Tabs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-black uppercase tracking-wider text-amber-300">
              Upload Source
            </label>
            <div className="flex items-center bg-black p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab("folder")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === "folder" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                <FolderPlus className="w-3 h-3" /> Pick Folder
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("file")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === "file" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3 h-3" /> Select Files
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === "url" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                <LinkIcon className="w-3 h-3" /> Web URLs
              </button>
            </div>
          </div>

          {activeTab === "folder" && (
            <div>
              <input
                type="file"
                ref={folderInputRef}
                webkitdirectory=""
                directory=""
                multiple
                onChange={(e) => handleFilesAdded(e.target.files)}
                className="hidden"
              />
              <div
                onClick={() => folderInputRef.current?.click()}
                className="border-2 border-dashed border-amber-500/50 hover:border-amber-300 bg-amber-500/10 hover:bg-amber-500/15 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center group"
              >
                <FolderPlus className="w-10 h-10 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-extrabold text-white mb-0.5">
                  Click to Select Entire Photo Folder
                </span>
                <span className="text-[11px] text-amber-300 font-medium">
                  Auto-compresses camera RAW/JPG photos &amp; uploads to Cloud Storage!
                </span>
              </div>
            </div>
          )}

          {activeTab === "file" && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={(e) => handleFilesAdded(e.target.files)}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-black/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-black/90 text-center group"
              >
                <UploadCloud className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white mb-1">
                  Click to Select Individual Photo Files
                </span>
                <span className="text-[10px] text-zinc-400">Select multiple JPG, PNG, or WebP files</span>
              </div>
            </div>
          )}

          {activeTab === "url" && (
            <div>
              <textarea
                name="sampleUrls"
                rows={4}
                value={urlText}
                onChange={(e) => setUrlText(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1519741497674-611481863552&#10;https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          )}

          {/* Local Files / Folder Preview */}
          {(activeTab === "folder" || activeTab === "file") && localFiles.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold mb-1.5">
                <span className="flex items-center gap-1">
                  <Folder className="w-3.5 h-3.5 text-amber-400" /> Loaded Photos ({localFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => setLocalFiles([])}
                  className="text-[10px] text-red-400 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1.5 bg-black/50 rounded-xl border border-amber-500/30">
                {localFiles.map((fileObj, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-700 bg-black">
                    <img src={fileObj.previewUrl} alt={fileObj.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="absolute top-1 right-1 bg-black/80 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Progress Bar when Uploading */}
        {uploading && (
          <div className="space-y-1 bg-black/80 p-3 rounded-2xl border border-amber-500/40">
            <div className="flex justify-between text-[11px] font-bold text-amber-300">
              <span>{progressStatus}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-extrabold rounded-xl shadow-xl hover:brightness-110 transition-all text-xs uppercase tracking-wider cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-black" />
              <span>Uploading Photos to Cloud Storage...</span>
            </div>
          ) : (
            <span>Generate Proofing Portal Link</span>
          )}
        </button>
      </form>
    </div>
  );
}
