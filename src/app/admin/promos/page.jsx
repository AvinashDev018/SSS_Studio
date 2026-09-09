"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Percent, Copy, Check } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { getPromos, addPromo, togglePromo, deletePromo } from "@/app/actions/promos";

export default function PromoDashboard() {
  const [promos, setPromos] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newType, setNewType] = useState("percentage");
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPromos = async () => {
    setLoading(true);
    try {
      const list = await getPromos();
      setPromos(list || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load promos from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return;
    setSaving(true);
    setError("");
    const fd = new FormData();
    fd.set("code", newCode);
    fd.set("discount", newDiscount);
    fd.set("type", newType);
    const res = await addPromo(fd);
    setSaving(false);
    if (!res.success) {
      setError(res.error || "Failed to create promo");
      return;
    }
    setNewCode("");
    setNewDiscount("");
    await loadPromos();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promo code?")) return;
    await deletePromo(id);
    await loadPromos();
  };

  const handleToggle = async (id, active) => {
    await togglePromo(id, !active);
    await loadPromos();
  };

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/promos" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-[#14120c] p-6 rounded-3xl border border-amber-500/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Tag className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-black text-amber-400">
              Discounts &amp; Campaign Offers
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
            Promotions &amp; Gift Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-normal max-w-2xl leading-relaxed">
            Live database vouchers — customers can redeem these at store checkout on any device.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-2xl bg-amber-400 text-black border border-amber-300 shrink-0 font-extrabold shadow-lg">
          <span className="text-xs font-bold text-black uppercase tracking-wider">Active Vouchers:</span>
          <span className="text-lg font-black text-black">{promos.filter((p) => p.active).length}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">Coupon Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WEDDING2026"
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm uppercase placeholder-zinc-500 font-mono tracking-wider focus:outline-none focus:border-teal-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">Discount</label>
                <input
                  type="number"
                  min="1"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  placeholder={newType === "percentage" ? "e.g. 10" : "e.g. 500"}
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-400"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed amount (₹)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black rounded-xl text-xs uppercase tracking-wider disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save to Database"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <p className="text-zinc-400 text-sm">Loading promos…</p>
          ) : promos.length === 0 ? (
            <div className="border border-dashed border-amber-500/40 rounded-3xl p-12 text-center bg-[#0e0e0a]">
              <p className="text-white font-bold mb-1">No promo vouchers yet</p>
              <p className="text-zinc-400 text-xs">Create your first live coupon on the left.</p>
            </div>
          ) : (
            promos.map((promo) => (
              <div
                key={promo.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/25 bg-[#0b0c07] p-5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      promo.active ? "bg-amber-500/15 border-amber-400/40 text-amber-300" : "bg-zinc-800 border-zinc-700 text-zinc-500"
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
                        type="button"
                        onClick={() => handleCopyCode(promo.id, promo.code)}
                        className="text-zinc-400 hover:text-amber-300"
                      >
                        {copiedId === promo.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-sm text-amber-300 font-semibold mt-0.5">
                      {promo.type === "percentage" ? `${promo.discount}% DISCOUNT` : `₹${promo.discount} OFF`}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">Uses: {promo.uses || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggle(promo.id, promo.active)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                      promo.active
                        ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                        : "border-zinc-600 text-zinc-400 bg-zinc-800"
                    }`}
                  >
                    {promo.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(promo.id)}
                    className="px-3 py-2 rounded-xl text-xs font-bold border border-rose-500/40 text-rose-300 bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
