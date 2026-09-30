"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Percent, Copy, Check, Gift, Sparkles } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import {
  getPromos,
  addPromo,
  togglePromo,
  deletePromo,
  createOrRestoreLaunchOffer,
  getLaunchOfferStatus,
} from "@/app/actions/promos";
import { LAUNCH_OFFER } from "@/lib/launchOffer";

export default function PromoDashboard() {
  const [promos, setPromos] = useState([]);
  const [launchStatus, setLaunchStatus] = useState(null);
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
      const [list, launch] = await Promise.all([getPromos(), getLaunchOfferStatus()]);
      setPromos(list || []);
      setLaunchStatus(launch);
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

  const handleCreateLaunchOffer = async () => {
    setSaving(true);
    setError("");
    const res = await createOrRestoreLaunchOffer();
    setSaving(false);
    if (!res.success) {
      setError(res.error || "Failed to create launch offer");
      return;
    }
    await loadPromos();
  };

  const handleDelete = async (id, code) => {
    const isLaunch = String(code).toUpperCase() === LAUNCH_OFFER.code;
    const msg = isLaunch
      ? `Delete ${code}? The website Offer popup will show "No offer is currently available" until you restore it.`
      : "Delete this promo code?";
    if (!window.confirm(msg)) return;
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

  const hasLaunchInList = promos.some((p) => p.code === LAUNCH_OFFER.code);

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
            Live database vouchers — redeem at Frame / Birthday Gift checkout. Delete or deactivate to expire the Offer popup.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-2xl bg-amber-400 text-black border border-amber-300 shrink-0 font-extrabold shadow-lg">
          <span className="text-xs font-bold text-black uppercase tracking-wider">Active Vouchers:</span>
          <span className="text-lg font-black text-black">{promos.filter((p) => p.active).length}</span>
        </div>
      </div>

      {/* Launch offer card */}
      <div
        className={`mb-8 rounded-3xl border p-5 sm:p-6 ${
          launchStatus?.active
            ? "border-teal-400/40 bg-teal-950/40"
            : "border-rose-500/30 bg-rose-950/20"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" /> Website Offer · {LAUNCH_OFFER.code}
                </h2>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    launchStatus?.active
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-400/40"
                  }`}
                >
                  {launchStatus?.active ? "Live" : "Expired / Off"}
                </span>
              </div>
              <p className="text-sm text-zinc-300 mt-1">
                ₹{LAUNCH_OFFER.discountInr} OFF · Frames &amp; Birthday Gifts · First {LAUNCH_OFFER.maxUses} customers
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {launchStatus?.exists
                  ? `Used ${launchStatus.uses || 0} / ${LAUNCH_OFFER.maxUses} · ${launchStatus.remaining || 0} left`
                  : "Not in database — create to enable the Offer popup"}
              </p>
              {!launchStatus?.active && (
                <p className="text-xs text-rose-300 mt-2 font-semibold">
                  Visitors who tap Offer will see: “No offer is currently available.”
                </p>
              )}
            </div>
          </div>
          {!hasLaunchInList && (
            <button
              type="button"
              disabled={saving}
              onClick={handleCreateLaunchOffer}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-black text-xs font-black uppercase tracking-wider disabled:opacity-60 shrink-0"
            >
              {saving ? "Creating…" : `Create ${LAUNCH_OFFER.code} voucher`}
            </button>
          )}
          {hasLaunchInList && !launchStatus?.active && launchStatus?.exists && (
            <button
              type="button"
              disabled={saving}
              onClick={handleCreateLaunchOffer}
              className="px-4 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-black uppercase tracking-wider disabled:opacity-60 shrink-0"
            >
              Reactivate {LAUNCH_OFFER.code}
            </button>
          )}
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
                  placeholder={newType === "percentage" ? "e.g. 10" : "e.g. 100"}
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
              <p className="text-zinc-400 text-xs mb-4">Create SSS100 launch offer or add a custom voucher.</p>
              <button
                type="button"
                onClick={handleCreateLaunchOffer}
                className="px-4 py-2 rounded-xl bg-teal-500 text-black text-xs font-bold"
              >
                Create {LAUNCH_OFFER.code} (₹100 / first 20)
              </button>
            </div>
          ) : (
            promos.map((promo) => {
              const isLaunch = promo.code === LAUNCH_OFFER.code;
              return (
                <div
                  key={promo.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 ${
                    isLaunch ? "border-teal-400/40 bg-teal-950/30" : "border-amber-500/25 bg-[#0b0c07]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        promo.active ? "bg-amber-500/15 border-amber-400/40 text-amber-300" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                      }`}
                    >
                      {isLaunch ? <Gift className="w-5 h-5" /> : promo.type === "percentage" ? <Percent className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-lg font-mono font-bold ${promo.active ? "text-white" : "text-zinc-500 line-through"}`}>
                          {promo.code}
                        </h3>
                        {isLaunch && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
                            Website Offer
                          </span>
                        )}
                        <button type="button" onClick={() => handleCopyCode(promo.id, promo.code)} className="text-zinc-400 hover:text-amber-300">
                          {copiedId === promo.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-sm text-amber-300 font-semibold mt-0.5">
                        {promo.type === "percentage" ? `${promo.discount}% DISCOUNT` : `₹${promo.discount} OFF`}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Uses: {promo.uses || 0}
                        {isLaunch ? ` / ${LAUNCH_OFFER.maxUses} max` : ""}
                      </p>
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
                      onClick={() => handleDelete(promo.id, promo.code)}
                      className="px-3 py-2 rounded-xl text-xs font-bold border border-rose-500/40 text-rose-300 bg-rose-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
