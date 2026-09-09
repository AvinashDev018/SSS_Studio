"use client";

import { useState } from "react";
import { Trash2, Check, Pencil, X, Save } from "lucide-react";
import { updatePackage, deletePackage } from "@/app/actions/packages";
import { useRouter } from "next/navigation";

export default function PackageAdminCard({ pkg }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(pkg.name);
  const [price, setPrice] = useState(pkg.price);
  const [description, setDescription] = useState(pkg.description);
  const [features, setFeatures] = useState(
    Array.isArray(pkg.features) ? pkg.features.join(", ") : String(pkg.features || "")
  );
  const [popular, setPopular] = useState(!!pkg.popular);

  const featureList = Array.isArray(pkg.features)
    ? pkg.features
    : typeof pkg.features === "string"
      ? pkg.features.split(",")
      : [];

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.set("id", pkg.id);
    fd.set("name", name);
    fd.set("price", price);
    fd.set("description", description);
    fd.set("features", features);
    if (popular) fd.set("popular", "true");
    const res = await updatePackage(fd);
    setSaving(false);
    if (res.success) {
      setEditing(false);
      router.refresh();
    } else {
      alert(res.error || "Failed to update package");
    }
  };

  if (editing) {
    return (
      <form
        onSubmit={handleSave}
        className="relative rounded-3xl p-6 bg-[#0e0e0a] border border-amber-400 flex flex-col gap-3 shadow-2xl"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm font-bold"
          required
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-amber-300 text-sm font-bold"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 text-xs"
          required
        />
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={3}
          className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 text-xs"
          required
        />
        <label className="flex items-center gap-2 text-xs text-zinc-200">
          <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} className="accent-amber-400" />
          Mark as popular
        </label>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-amber-400 text-black rounded-xl font-extrabold text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-3 py-2.5 border border-zinc-600 text-zinc-300 rounded-xl text-xs font-bold"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="relative group rounded-3xl p-6 bg-[#0e0e0a] border border-amber-500/40 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between shadow-2xl">
      {pkg.popular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl rounded-tr-2xl shadow-md z-10">
          ★ Popular Choice
        </div>
      )}

      <div>
        <h3 className="text-xl font-serif font-extrabold text-white mb-2 leading-tight pr-12">{pkg.name}</h3>
        <div className="text-3xl font-black text-amber-400 mb-3 font-mono tracking-tight drop-shadow-sm">
          {typeof pkg.price === "number" ? `₹${pkg.price}` : pkg.price}
        </div>
        <p className="text-zinc-200 text-xs mb-4 font-normal leading-relaxed bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
          {pkg.description}
        </p>

        <ul className="space-y-2 mb-6">
          {featureList.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-zinc-100 text-xs font-semibold">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{typeof feature === "string" ? feature.trim() : feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-4 border-t border-amber-500/25 flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 rounded-xl transition-colors font-extrabold text-xs cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
        <form action={deletePackage.bind(null, pkg.id)} className="flex-1">
          <button className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-red-500/15 hover:bg-red-500/25 text-red-200 border border-red-500/30 rounded-xl transition-colors font-extrabold text-xs cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
