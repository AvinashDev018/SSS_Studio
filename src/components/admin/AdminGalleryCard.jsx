"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, ExternalLink, Eye, X, MessageSquare, Download, CheckCircle2, Trash2 } from "lucide-react";
import { deleteClientGallery } from "@/app/actions/gallery";

export default function AdminGalleryCard({ gal }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [origin, setOrigin] = useState("");

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to PERMANENTLY delete "${gal.clientName}" gallery?\n\nThis will delete the gallery and all ${
        gal._count?.photos || 0
      } photos from your PostgreSQL Database!`
    );

    if (!confirmDelete) return;

    setDeleting(true);
    const res = await deleteClientGallery(gal.id);
    setDeleting(false);

    if (res.success) {
      window.location.reload();
    } else {
      alert("Failed to delete gallery from database.");
    }
  };

  const selectedPhotos = gal.photos?.filter((p) => p.isSelected) || [];

  return (
    <>
      <div className="rounded-3xl p-6 bg-[#0e0e0a] border border-amber-500/40 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between shadow-2xl relative">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                gal.status === "SUBMITTED"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
              }`}
            >
              {gal.status === "SUBMITTED" ? "✓ Client Choices Submitted" : "Open for Client Selection"}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" /> PIN: <strong>{gal.passcode}</strong>
              </span>

              {/* Permanent Database Delete Button */}
              <button
                onClick={handleDelete}
                disabled={deleting}
                title="Permanently Delete Gallery & Photos from DB"
                className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 transition-all cursor-pointer disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-serif font-extrabold text-white mb-1">{gal.clientName}</h3>
          <p className="text-xs text-amber-300 font-mono mb-4">/client-gallery/{gal.slug}</p>

          <div className="bg-black/50 p-3 rounded-xl border border-zinc-800 space-y-1 mb-4 text-xs">
            <p className="text-zinc-300">
              Total Uploaded: <strong className="text-white">{gal._count?.photos || 0}</strong>
            </p>
            <p className="text-zinc-300">
              Selected by Client:{" "}
              <strong className="text-amber-300 font-mono">
                {selectedPhotos.length} / {gal.maxSelections}
              </strong>
            </p>
            <p className="text-zinc-400 text-[11px]">Phone: {gal.clientPhone}</p>
          </div>

          {/* Selected Photos & Clickable Preview */}
          {selectedPhotos.length > 0 ? (
            <div
              onClick={() => setIsModalOpen(true)}
              className="mb-4 p-3 bg-amber-500/10 border border-amber-500/40 hover:border-amber-400 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] group"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-black uppercase text-amber-300 flex items-center gap-1.5">
                  <span>Chosen Album Photos ({selectedPhotos.length}):</span>
                </p>
                <span className="text-[10px] font-bold text-amber-400 underline group-hover:text-amber-200 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Click to View All
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {selectedPhotos.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-amber-400/60 shadow-md group-hover:border-amber-300"
                  >
                    <img src={p.url} alt={p.filename} className="w-full h-full object-cover" />
                    {p.comment && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-400 text-black text-[9px] font-black rounded-tl-md flex items-center justify-center">
                        💬
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center">
              <p className="text-[11px] text-zinc-400">No photos selected by client yet.</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-amber-500/25 flex items-center justify-between gap-2">
          {selectedPhotos.length > 0 ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-amber-400 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Selections ({selectedPhotos.length})</span>
            </button>
          ) : (
            <Link
              href={`/client-gallery/${gal.slug}`}
              target="_blank"
              className="px-4 py-2 bg-amber-400 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md"
            >
              <span>Open Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <a
            suppressHydrationWarning
            href={`https://wa.me/${gal.clientPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hello ${gal.clientName}! Your private album proofing link from SSS Studio is ready:\n${origin}/client-gallery/${gal.slug}\nPIN Passcode: ${gal.passcode}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-bold rounded-xl text-xs flex items-center gap-1"
          >
            Send via WhatsApp
          </a>
        </div>
      </div>

      {/* Full-screen Admin Inspection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#0f1210] border border-amber-500/40 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/30 mb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-black">
                    Photobook Selection ({selectedPhotos.length} / {gal.maxSelections})
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">PIN: {gal.passcode}</span>
                </div>
                <h2 className="text-xl font-serif font-extrabold text-white">{gal.clientName} - Chosen Photos</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photos Grid */}
            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              {selectedPhotos.map((photo, index) => (
                <div
                  key={photo.id || index}
                  className="flex flex-col sm:flex-row items-center gap-4 bg-[#161a18] border border-zinc-800 p-4 rounded-2xl"
                >
                  <div className="relative w-full sm:w-48 aspect-[4/3] shrink-0 rounded-xl overflow-hidden border border-amber-400/40 bg-black">
                    <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-md">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-300 font-bold">{photo.filename}</span>
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-amber-400 hover:text-black transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Open Full Res
                      </a>
                    </div>

                    {photo.comment ? (
                      <div className="p-3 bg-black/60 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[10px] uppercase tracking-wider text-amber-400 mb-0.5">
                            Client Editing Note:
                          </strong>
                          <span>"{photo.comment}"</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic">No custom edit notes added for this photo.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-zinc-800 mt-4 flex justify-between items-center shrink-0">
              <span className="text-xs text-zinc-400">Total {selectedPhotos.length} photos ready for printing lab.</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
