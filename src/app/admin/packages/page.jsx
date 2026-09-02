import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPackages, addPackage, deletePackage } from "@/app/actions/packages";
import AdminNav from "@/components/admin/AdminNav";
import { Trash2, Plus, Check, Package, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPackages() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    redirect("/admin/login");
  }

  const packages = await getPackages();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/packages" />

      {/* Friendly Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-gradient-to-r from-[#0c221e]/80 via-[#0a1815]/60 to-transparent p-6 rounded-3xl border border-teal-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <Package className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-teal-400">
              Pricing & Tier Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Photography Packages CMS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-light max-w-2xl">
            Configure photography packages, inclusions, pricing tiers, and highlight popular packages for clients.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-2xl bg-teal-500/10 border border-teal-500/30 shrink-0">
          <span className="text-xs text-zinc-400">Active Plans:</span>
          <span className="text-base font-black text-teal-300">{packages.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Package Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#0a1310] border border-white/10 rounded-3xl p-6 shadow-xl sticky top-8">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
                <Plus className="w-4 h-4" />
              </span>
              Add New Package
            </h2>
            <form action={addPackage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">Package Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Traditional Wedding Cinema"
                  required
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">Price / Pricing Tag</label>
                <input
                  type="text"
                  name="price"
                  placeholder="e.g. ₹65,000 or Custom Quote"
                  required
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">Short Description</label>
                <textarea
                  name="description"
                  placeholder="Comprehensive coverage with fine-art album delivery."
                  required
                  rows={2}
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">Features (comma separated)</label>
                <textarea
                  name="features"
                  placeholder="Candid Photography, 4K Cinema Teaser, 1-Month Delivery Guarantee"
                  required
                  rows={3}
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="popular" name="popular" value="true" className="w-4 h-4 accent-teal-400 rounded cursor-pointer" />
                <label htmlFor="popular" className="text-xs font-medium text-zinc-300 cursor-pointer">Mark as "Client Favorite / Most Popular"</label>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all text-xs uppercase tracking-wider mt-2 cursor-pointer"
              >
                Save & Publish Package
              </button>
            </form>
          </div>
        </div>

        {/* Packages List */}
        <div className="lg:col-span-2">
          {packages.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] bg-[#0a1310]">
              <Package className="w-10 h-10 text-zinc-600 mb-2" />
              <p className="text-white font-bold mb-1">No packages published yet</p>
              <p className="text-zinc-400 text-xs font-light">Create your first photography package using the form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="relative group rounded-3xl p-6 bg-[#0a1310] border border-white/10 hover:border-teal-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-[#071f1b] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-sm">
                      ★ Popular Choice
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-serif font-bold text-white mb-1">{pkg.name}</h3>
                    <div className="text-2xl font-black text-teal-300 mb-3">{pkg.price}</div>
                    <p className="text-zinc-300 text-xs mb-4 font-light leading-relaxed">{pkg.description}</p>

                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-zinc-300 text-xs">
                          <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <form action={deletePackage.bind(null, pkg.id)} className="mt-auto pt-4 border-t border-white/5">
                    <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl transition-colors font-semibold text-xs cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Package
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
