"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { 
  Package, 
  Gift, 
  Frame, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  ArrowUpRight, 
  Sparkles, 
  DollarSign, 
  Tag, 
  Eye, 
  EyeOff, 
  X,
  Layers,
  Save,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function AdminFramesGifts() {
  const [activeTab, setActiveTab] = useState("frames"); // "frames" | "gifts"
  
  // Frame states
  const [frames, setFrames] = useState([]);
  const [loadingFrames, setLoadingFrames] = useState(true);
  const [frameSearch, setFrameSearch] = useState("");
  const [editingFrame, setEditingFrame] = useState(null);
  const [isAddFrameOpen, setIsAddFrameOpen] = useState(false);
  const [inlinePrices, setInlinePrices] = useState({});
  const [savingFrameId, setSavingFrameId] = useState(null);

  // Gift states
  const [gifts, setGifts] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(true);
  const [giftSearch, setGiftSearch] = useState("");
  const [editingGift, setEditingGift] = useState(null);
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false);
  const [inlineGiftPrices, setInlineGiftPrices] = useState({});
  const [savingGiftId, setSavingGiftId] = useState(null);

  // Notification Banner
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchFrames();
    fetchGifts();
  }, []);

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // --- Frames API handlers ---
  const fetchFrames = async () => {
    setLoadingFrames(true);
    try {
      const res = await fetch("/api/frames");
      if (res.ok) {
        const data = await res.json();
        setFrames(data);
      }
    } catch (err) {
      console.error("Failed to load frames:", err);
    } finally {
      setLoadingFrames(false);
    }
  };

  const handleSaveInlineFramePrice = async (frame) => {
    const newPriceVal = inlinePrices[frame.id];
    if (!newPriceVal) return;

    setSavingFrameId(frame.id);
    const numericPrice = parseInt(String(newPriceVal).replace(/[^\d]/g, ""), 10);
    const formattedPrice = `₹${numericPrice.toLocaleString("en-IN")}`;

    try {
      const res = await fetch("/api/frames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...frame,
          price: formattedPrice,
          numericPrice,
        }),
      });

      if (res.ok) {
        setFrames((prev) =>
          prev.map((f) =>
            f.id === frame.id ? { ...f, price: formattedPrice, numericPrice } : f
          )
        );
        showFeedback(`Updated ${frame.size} price to ${formattedPrice}`);
        setInlinePrices((prev) => {
          const next = { ...prev };
          delete next[frame.id];
          return next;
        });
      } else {
        showFeedback("Failed to update frame price", "error");
      }
    } catch (err) {
      showFeedback("Network error updating frame", "error");
    } finally {
      setSavingFrameId(null);
    }
  };

  const handleUpdateFrame = async (e) => {
    e.preventDefault();
    if (!editingFrame) return;

    const numericPrice = parseInt(String(editingFrame.numericPrice || editingFrame.price).replace(/[^\d]/g, ""), 10);
    const formattedPrice = `₹${numericPrice.toLocaleString("en-IN")}`;

    try {
      const res = await fetch("/api/frames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingFrame,
          price: formattedPrice,
          numericPrice,
        }),
      });

      if (res.ok) {
        setFrames((prev) =>
          prev.map((f) =>
            f.id === editingFrame.id ? { ...editingFrame, price: formattedPrice, numericPrice } : f
          )
        );
        showFeedback(`Successfully updated ${editingFrame.size} frame!`);
        setEditingFrame(null);
      }
    } catch (err) {
      showFeedback("Failed to save changes", "error");
    }
  };

  const handleAddFrame = async (e) => {
    e.preventDefault();
    const form = e.target;
    const size = form.size.value.trim();
    const rawPrice = form.price.value.trim();
    const bestFor = form.bestFor.value.trim();
    const tag = form.tag.value.trim() || null;
    const popular = form.popular.checked;

    const numericPrice = parseInt(rawPrice.replace(/[^\d]/g, ""), 10) || 499;
    const formattedPrice = `₹${numericPrice.toLocaleString("en-IN")}`;

    const newFrame = {
      id: size.toLowerCase().replace(/\s+/g, ""),
      size,
      price: formattedPrice,
      numericPrice,
      bestFor: bestFor || "Interior Feature Wall",
      tag,
      popular,
      active: true,
    };

    try {
      const res = await fetch("/api/frames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFrame),
      });

      if (res.ok) {
        setFrames((prev) => [...prev, newFrame]);
        showFeedback(`Added new frame size: ${size} (${formattedPrice})`);
        setIsAddFrameOpen(false);
        form.reset();
      }
    } catch (err) {
      showFeedback("Failed to add frame size", "error");
    }
  };

  const handleDeleteFrame = async (id, size) => {
    if (!confirm(`Are you sure you want to remove the ${size} frame size?`)) return;

    try {
      const res = await fetch(`/api/frames?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFrames((prev) => prev.filter((f) => f.id !== id));
        showFeedback(`Removed frame size ${size}`);
      }
    } catch (err) {
      showFeedback("Failed to delete frame", "error");
    }
  };

  const handleResetFramesToDefault = async () => {
    if (!confirm("Reset all 13 frame prices back to Sheela Photography standard rates?")) return;

    try {
      const res = await fetch("/api/frames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        const data = await res.json();
        setFrames(data.frames);
        showFeedback("Reset all frame sizes and prices to standard!");
      }
    } catch (err) {
      showFeedback("Failed to reset frames", "error");
    }
  };

  // --- Gifts API handlers ---
  const fetchGifts = async () => {
    setLoadingGifts(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setGifts(data.filter((p) => p.category === "Gift"));
      }
    } catch (err) {
      console.error("Failed to load gifts:", err);
    } finally {
      setLoadingGifts(false);
    }
  };

  const handleSaveInlineGiftPrice = async (gift) => {
    const newPrice = inlineGiftPrices[gift.id];
    if (!newPrice) return;

    setSavingGiftId(gift.id);
    const numericPrice = parseFloat(newPrice);

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: gift.id,
          price: numericPrice,
        }),
      });

      if (res.ok) {
        setGifts((prev) =>
          prev.map((g) => (g.id === gift.id ? { ...g, price: numericPrice } : g))
        );
        showFeedback(`Updated ${gift.name} price to ₹${numericPrice}`);
        setInlineGiftPrices((prev) => {
          const next = { ...prev };
          delete next[gift.id];
          return next;
        });
      } else {
        showFeedback("Failed to update gift price", "error");
      }
    } catch (err) {
      showFeedback("Network error updating gift", "error");
    } finally {
      setSavingGiftId(null);
    }
  };

  const handleUpdateGift = async (e) => {
    e.preventDefault();
    if (!editingGift) return;

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingGift.id,
          name: editingGift.name,
          price: parseFloat(editingGift.price),
          image: editingGift.image,
        }),
      });

      if (res.ok) {
        setGifts((prev) =>
          prev.map((g) => (g.id === editingGift.id ? { ...editingGift } : g))
        );
        showFeedback(`Saved changes for ${editingGift.name}!`);
        setEditingGift(null);
      }
    } catch (err) {
      showFeedback("Failed to update gift", "error");
    }
  };

  const handleAddGift = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const price = parseFloat(form.price.value.trim()) || 499;
    const image = form.image.value.trim() || "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849570/pwdvbfzdu1vktn0s4d9z.jpg";

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          category: "Gift",
          image,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGifts((prev) => [...prev, data.product]);
        showFeedback(`Added new birthday gift: ${name} (₹${price})`);
        setIsAddGiftOpen(false);
        form.reset();
      }
    } catch (err) {
      showFeedback("Failed to add gift", "error");
    }
  };

  const handleDeleteGift = async (id, name) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGifts((prev) => prev.filter((g) => g.id !== id));
        showFeedback(`Deleted gift ${name}`);
      }
    } catch (err) {
      showFeedback("Failed to delete gift", "error");
    }
  };

  // Filtered lists
  const filteredFrames = frames.filter((f) =>
    f.size.toLowerCase().includes(frameSearch.toLowerCase()) ||
    (f.bestFor && f.bestFor.toLowerCase().includes(frameSearch.toLowerCase())) ||
    (f.tag && f.tag.toLowerCase().includes(frameSearch.toLowerCase()))
  );

  const filteredGifts = gifts.filter((g) =>
    g.name.toLowerCase().includes(giftSearch.toLowerCase())
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/frames-gifts" />

      {/* Floating Feedback Alert */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-sm font-semibold transition-all ${
            feedback.type === "error"
              ? "bg-red-950/90 border-red-500/40 text-red-200"
              : "bg-amber-950/90 border-amber-500/40 text-amber-200"
          }`}
        >
          <Check size={16} className={feedback.type === "error" ? "text-red-400" : "text-amber-400"} />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-[#14120c] p-6 rounded-3xl border border-amber-500/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Frame className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-black text-amber-400">
              Live Store Catalog CMS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
            Frames &amp; Gifts Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-normal max-w-2xl leading-relaxed">
            Update Photo Frame sizes &amp; prices, manage Birthday Gift products, and control what clients see on the live studio website in real-time.
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/#frames"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-black text-xs font-black border border-amber-400/40 transition-all cursor-pointer shadow-lg"
          >
            <span>Live Frame Price List</span>
            <ArrowUpRight size={14} className="text-amber-400 group-hover:text-black" />
          </a>
          <a
            href="/store"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black border border-amber-300 transition-all cursor-pointer shadow-lg"
          >
            <span>Live Store Page</span>
            <ArrowUpRight size={14} className="text-black" />
          </a>
        </div>
      </div>

      {/* Main Switcher Tabs (Frames vs Gifts) */}
      <div className="flex items-center gap-3 mb-8 bg-[#121008] p-1.5 rounded-2xl border border-amber-500/30 w-fit">
        <button
          onClick={() => setActiveTab("frames")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "frames"
              ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-extrabold shadow-md scale-[1.02]"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Frame size={15} />
          <span>Photo Frame Price List ({frames.length} Sizes)</span>
        </button>

        <button
          onClick={() => setActiveTab("gifts")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "gifts"
              ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-extrabold shadow-md scale-[1.02]"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Gift size={15} />
          <span>Birthday Gifts &amp; Keepsakes ({gifts.length} Items)</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 1. PHOTO FRAMES MANAGEMENT TAB */}
      {/* ============================================================ */}
      {activeTab === "frames" && (
        <div className="space-y-6">
          {/* Frame Top Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0a1512] border border-teal-500/20">
              <span className="text-[11px] uppercase font-bold text-zinc-400 block">Total Frame Sizes</span>
              <span className="text-2xl font-serif font-extrabold text-white">{frames.length}</span>
              <span className="text-[10px] text-teal-400 block mt-0.5">8x10 to 36x24</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0a1512] border border-teal-500/20">
              <span className="text-[11px] uppercase font-bold text-zinc-400 block">Starting Price</span>
              <span className="text-2xl font-serif font-extrabold text-teal-300">₹349</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Compact Desk Frame</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0a1512] border border-teal-500/20">
              <span className="text-[11px] uppercase font-bold text-zinc-400 block">Max Size Price</span>
              <span className="text-2xl font-serif font-extrabold text-emerald-400">₹4,999</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">36x24 Royal Ballroom</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0a1512] border border-teal-500/20">
              <span className="text-[11px] uppercase font-bold text-zinc-400 block">Delivery SLA</span>
              <span className="text-2xl font-serif font-extrabold text-amber-300">30 Days</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">1-Month Guarantee</span>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#081210] p-4 rounded-2xl border border-white/10">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search size (e.g. 12x18, 20x30)..."
                value={frameSearch}
                onChange={(e) => setFrameSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleResetFramesToDefault}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset all prices to Sheela Photography standards"
              >
                <RefreshCw size={13} />
                <span>Reset to Standard</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddFrameOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Plus size={14} />
                <span>Add Frame Size</span>
              </button>
            </div>
          </div>

          {/* Frame List Table */}
          {loadingFrames ? (
            <div className="p-16 flex items-center justify-center text-teal-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="bg-[#091512] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-teal-500/20 text-[11px] font-extrabold uppercase tracking-wider text-teal-300 bg-black/30">
                      <th className="py-3.5 px-4">Size (Inches)</th>
                      <th className="py-3.5 px-4">Recommended Placement</th>
                      <th className="py-3.5 px-4">Badge / Tag</th>
                      <th className="py-3.5 px-4">Current Price</th>
                      <th className="py-3.5 px-4">Quick Price Edit</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredFrames.map((frame) => {
                      const hasInlineVal = inlinePrices[frame.id] !== undefined;
                      const isSaving = savingFrameId === frame.id;

                      return (
                        <tr key={frame.id} className="hover:bg-white/[0.02] transition-colors">
                          {/* Size */}
                          <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                            <div className="flex items-center gap-2">
                              <span>{frame.size}</span>
                              <span className="text-[10px] text-zinc-400 font-sans font-normal">Inch</span>
                              {frame.popular && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold">
                                  ★ Popular
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Recommended Room */}
                          <td className="py-3.5 px-4 text-zinc-300 font-light max-w-xs truncate">
                            {frame.bestFor}
                          </td>

                          {/* Tag */}
                          <td className="py-3.5 px-4">
                            {frame.tag ? (
                              <span className="px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-semibold">
                                {frame.tag}
                              </span>
                            ) : (
                              <span className="text-zinc-600 text-[11px]">—</span>
                            )}
                          </td>

                          {/* Current Price */}
                          <td className="py-3.5 px-4 font-serif font-extrabold text-sm text-teal-300">
                            {frame.price}
                          </td>

                          {/* Quick Inline Edit */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder={frame.price}
                                value={inlinePrices[frame.id] ?? ""}
                                onChange={(e) =>
                                  setInlinePrices((prev) => ({
                                    ...prev,
                                    [frame.id]: e.target.value,
                                  }))
                                }
                                className="w-24 bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400"
                              />
                              {hasInlineVal && (
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() => handleSaveInlineFramePrice(frame)}
                                  className="p-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-[#071f1b] font-bold cursor-pointer disabled:opacity-50 transition-colors"
                                  title="Save this price"
                                >
                                  {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingFrame(frame)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                title="Full Edit"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFrame(frame.id, frame.size)}
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                                title="Delete Size"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. BIRTHDAY GIFTS MANAGEMENT TAB */}
      {/* ============================================================ */}
      {activeTab === "gifts" && (
        <div className="space-y-6">
          {/* Gifts Top Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0a1512] border border-teal-500/20">
              <span className="text-[11px] uppercase font-bold text-zinc-400 block">Total Birthday Gifts</span>
              <span className="text-2xl font-serif font-extrabold text-white">{gifts.length}</span>
              <span className="text-[10px] text-teal-400 block mt-0.5">Active Products</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0a1512] border border-teal-500/20">
              <span className="text-[11px] uppercase font-bold text-zinc-400 block">Starting Gift Price</span>
              <span className="text-2xl font-serif font-extrabold text-teal-300">₹499</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Personalized Magic Mug</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0a1512] border border-teal-500/20">
              <span className="text-[11px] uppercase font-bold text-zinc-400 block">Premium Keepsake</span>
              <span className="text-2xl font-serif font-extrabold text-emerald-400">₹1,499</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">3D Crystal Photo Cube</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0a1512] border border-teal-500/20">
              <span className="text-[11px] uppercase font-bold text-zinc-400 block">Custom Features</span>
              <span className="text-2xl font-serif font-extrabold text-amber-300">Included</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Photo + Wish Card</span>
            </div>
          </div>

          {/* Search & Add Gift Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#081210] p-4 rounded-2xl border border-white/10">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search birthday gifts (e.g. Mug, Cube)..."
                value={giftSearch}
                onChange={(e) => setGiftSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAddGiftOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md w-full sm:w-auto justify-center"
            >
              <Plus size={14} />
              <span>Add New Birthday Gift</span>
            </button>
          </div>

          {/* Gifts Grid */}
          {loadingGifts ? (
            <div className="p-16 flex items-center justify-center text-teal-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGifts.map((gift) => {
                const hasInlineVal = inlineGiftPrices[gift.id] !== undefined;
                const isSaving = savingGiftId === gift.id;

                return (
                  <div
                    key={gift.id}
                    className="bg-[#091512] rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-teal-500/40 transition-all flex flex-col group"
                  >
                    {/* Image Preview */}
                    <div className="h-44 overflow-hidden relative bg-[#060c0a]">
                      <img
                        src={gift.image}
                        alt={gift.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-teal-300 border border-teal-500/30">
                        ₹{gift.price}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        <h3 className="font-serif font-bold text-base text-white">{gift.name}</h3>
                        <p className="text-xs text-teal-300 font-serif font-bold mt-1">Price: ₹{gift.price}</p>
                      </div>

                      {/* Quick Inline Price Change */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                          Change Price (₹)
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder={String(gift.price)}
                            value={inlineGiftPrices[gift.id] ?? ""}
                            onChange={(e) =>
                              setInlineGiftPrices((prev) => ({
                                ...prev,
                                [gift.id]: e.target.value,
                              }))
                            }
                            className="flex-1 bg-white/5 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400"
                          />
                          {hasInlineVal && (
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => handleSaveInlineGiftPrice(gift)}
                              className="px-3 py-1 rounded-lg bg-teal-400 hover:bg-teal-300 text-[#071f1b] font-bold text-xs cursor-pointer disabled:opacity-50 transition-colors flex items-center gap-1"
                            >
                              {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                              <span>Save</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setEditingGift(gift)}
                          className="text-xs font-semibold text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 size={13} /> Edit Details &amp; Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGift(gift.id, gift.name)}
                          className="text-xs text-red-400 hover:text-red-300 cursor-pointer p-1"
                          title="Delete Gift"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT FRAME */}
      {/* ============================================================ */}
      {editingFrame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b1c18] border border-teal-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <Edit3 size={16} className="text-teal-400" />
                Edit {editingFrame.size} Frame
              </h3>
              <button
                onClick={() => setEditingFrame(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateFrame} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Size Label</label>
                <input
                  type="text"
                  value={editingFrame.size}
                  onChange={(e) => setEditingFrame({ ...editingFrame, size: e.target.value })}
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Price (₹)</label>
                <input
                  type="text"
                  value={editingFrame.numericPrice || editingFrame.price}
                  onChange={(e) => setEditingFrame({ ...editingFrame, numericPrice: e.target.value })}
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Recommended Placement</label>
                <input
                  type="text"
                  value={editingFrame.bestFor || ""}
                  onChange={(e) => setEditingFrame({ ...editingFrame, bestFor: e.target.value })}
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Badge / Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Wedding Top Pick"
                  value={editingFrame.tag || ""}
                  onChange={(e) => setEditingFrame({ ...editingFrame, tag: e.target.value })}
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="frame-popular"
                  checked={editingFrame.popular || false}
                  onChange={(e) => setEditingFrame({ ...editingFrame, popular: e.target.checked })}
                  className="w-4 h-4 accent-teal-400 rounded"
                />
                <label htmlFor="frame-popular" className="text-zinc-300 cursor-pointer">
                  Feature in &quot;Most Popular Picks&quot; tab
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFrame(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD NEW FRAME */}
      {/* ============================================================ */}
      {isAddFrameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b1c18] border border-teal-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <Plus size={16} className="text-teal-400" />
                Add New Photo Frame Size
              </h3>
              <button
                onClick={() => setIsAddFrameOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddFrame} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Size (e.g. 24x36)</label>
                <input
                  type="text"
                  name="size"
                  placeholder="24x36"
                  required
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="2999"
                  required
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Recommended Placement</label>
                <input
                  type="text"
                  name="bestFor"
                  placeholder="e.g. Living Room Centerpiece"
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Badge / Tag (Optional)</label>
                <input
                  type="text"
                  name="tag"
                  placeholder="e.g. Masterpiece"
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="new-frame-popular"
                  name="popular"
                  className="w-4 h-4 accent-teal-400 rounded"
                />
                <label htmlFor="new-frame-popular" className="text-zinc-300 cursor-pointer">
                  Mark as Popular Pick
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFrameOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] font-bold"
                >
                  Add Frame Size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT GIFT */}
      {/* ============================================================ */}
      {editingGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b1c18] border border-teal-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <Edit3 size={16} className="text-teal-400" />
                Edit Birthday Gift
              </h3>
              <button
                onClick={() => setEditingGift(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateGift} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Product Title</label>
                <input
                  type="text"
                  value={editingGift.name}
                  onChange={(e) => setEditingGift({ ...editingGift, name: e.target.value })}
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Price (₹)</label>
                <input
                  type="number"
                  value={editingGift.price}
                  onChange={(e) => setEditingGift({ ...editingGift, price: e.target.value })}
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Mockup Image URL</label>
                <input
                  type="url"
                  value={editingGift.image}
                  onChange={(e) => setEditingGift({ ...editingGift, image: e.target.value })}
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
                {editingGift.image && (
                  <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                    <img src={editingGift.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingGift(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] font-bold"
                >
                  Save Gift Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD NEW GIFT */}
      {/* ============================================================ */}
      {isAddGiftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b1c18] border border-teal-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <Plus size={16} className="text-teal-400" />
                Add New Birthday Gift
              </h3>
              <button
                onClick={() => setIsAddGiftOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddGift} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rotating Photo Crystal Lamp"
                  required
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="899"
                  required
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold uppercase">Image URL (Cloudinary / Direct)</label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGiftOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] font-bold"
                >
                  Create Gift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
