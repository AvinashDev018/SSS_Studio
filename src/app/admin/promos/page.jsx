"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Percent, Copy, Check, Sparkles } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

export default function PromoDashboard() {
  const [promos, setPromos] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newType, setNewType] = useState("percentage");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("studioPromos");
    if (saved) {
      try {
        setPromos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse promos", e);
      }
    }
  }, []);

  const savePromos = (newPromos) => {
    setPromos(newPromos);
    localStorage.setItem("studioPromos", JSON.stringify(newPromos));
  };

  const handleAddPromo = (e) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return;

    const promo = {
      id: Date.now().toString(),
      code: newCode.toUpperCase(),
      discount: Number(newDiscount),
      type: newType,
      active: true,
      uses: 0,
    };

    savePromos([...promos, promo]);
    setNewCode("");
    setNewDiscount("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this promo code?")) {
      savePromos(promos.filter((p) => p.id !== id));
    }
  };

  const toggleActive = (id) => {
    savePromos(
      promos.map((p) => {
        if (p.id === id) return { ...p, active: !p.active };
        return p;
      })
    );
  };

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/promos" />

      {/* Friendly Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-[#14120c] p-6 rounded-3xl border border-amber-500/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Tag className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-black text-amber-400">
              Discounts &amp; Campaign Offers
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
            Promotions &amp; Gift Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-normal max-w-2xl leading-relaxed">
            Create custom coupon vouchers, festival promo codes, and referral discounts applied directly at photoshoot booking checkout.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-2xl bg-amber-400 text-black border border-amber-300 shrink-0 font-extrabold shadow-lg">
          <span className="text-xs font-bold text-black uppercase tracking-wider">Active Vouchers:</span>
          <span className="text-lg font-black text-black">{promos.filter((p) => p.active).length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Promo Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#0b0c07] border border-amber-500/30 rounded-3xl p-6 shadow-xl sticky top-8">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-400/30">
                <Plus className="w-4 h-4" />
              </span>
              Create Promo Voucher
            </h2>
            <form onSubmit={handleAddPromo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WEDDING2026"
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm uppercase placeholder-zinc-500 font-mono tracking-wider focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-400 cursor-pointer font-medium"
                  >
                    <option value="percentage" className="bg-[#0b1412]">Percentage (%)</option>
                    <option value="fixed" className="bg-[#0b1412]">Fixed Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    placeholder={newType === "percentage" ? "15" : "3000"}
                    className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-bold"
                    required
                    min="1"
                    max={newType === "percentage" ? "100" : "100000"}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all text-xs uppercase tracking-wider mt-2 cursor-pointer"
              >
                Generate & Activate Code
              </button>
            </form>
          </div>
        </div>

        {/* Active Promos List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white mb-4">Active & Saved Promo Codes</h2>

          {promos.length === 0 ? (
            <div className="bg-[#0a1310] border border-dashed border-white/10 rounded-3xl p-12 text-center text-zinc-500">
              <Tag className="w-10 h-10 mx-auto mb-3 opacity-30 text-teal-400" />
              <p className="text-white font-bold mb-1">No promo vouchers active</p>
              <p className="text-zinc-400 text-xs font-light">Create a coupon code using the form to offer wedding seasonal perks.</p>
            </div>
          ) : (
            promos.map((promo) => (
              <div
                key={promo.id}
                className="bg-[#0a1310] border border-white/10 hover:border-teal-400/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between group transition-all shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                      promo.active
                        ? "bg-teal-500/15 border border-teal-500/30 text-teal-300 shadow-inner"
                        : "bg-white/5 border border-white/10 text-zinc-500"
                    }`}
                  >
                    {promo.type === "percentage" ? <Percent className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-mono font-bold ${promo.active ? "text-white" : "text-zinc-500 line-through"}`}>
                        {promo.code}
                      </h3>
                      <button
                        onClick={() => handleCopyCode(promo.id, promo.code)}
                        className="text-zinc-400 hover:text-teal-300 p-1 transition-colors"
                        title="Copy Promo Code"
                      >
                        {copiedId === promo.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-teal-300/90 font-semibold mt-0.5">
                      {promo.type === "percentage" ? `${promo.discount}% DISCOUNT` : `₹${promo.discount} OFF`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => toggleActive(promo.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      promo.active
                        ? "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30"
                        : "bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30"
                    }`}
                  >
                    {promo.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl transition-colors cursor-pointer"
                    title="Delete Voucher"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
