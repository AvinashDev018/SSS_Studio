import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPackages, addPackage } from "@/app/actions/packages";
import AdminNav from "@/components/admin/AdminNav";
import PackageAdminCard from "@/components/admin/PackageAdminCard";
import { Plus, Package } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-[#14120c] p-6 rounded-3xl border border-amber-500/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Package className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-black text-amber-400">
              Pricing &amp; Tier Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
            Photography Packages CMS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-normal max-w-2xl leading-relaxed">
            Configure photography packages, inclusions, pricing tiers, and highlight popular packages for clients.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-2xl bg-amber-400 text-black border border-amber-300 shrink-0 font-extrabold shadow-lg">
          <span className="text-xs font-bold text-black uppercase tracking-wider">Active Plans:</span>
          <span className="text-lg font-black text-black">{packages.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Package Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#0e0e0a] border border-amber-500/40 rounded-3xl p-6 shadow-2xl sticky top-8">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
                <Plus className="w-4 h-4" />
              </span>
              Add New Package
            </h2>
            <form action={addPackage} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Package Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Traditional Wedding Cinema"
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white font-bold text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Price / Pricing Tag</label>
                <input
                  type="text"
                  name="price"
                  placeholder="e.g. ₹65,000 or Custom Quote"
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white font-bold text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Short Description</label>
                <textarea
                  name="description"
                  placeholder="Comprehensive coverage with fine-art album delivery."
                  required
                  rows={2}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white font-medium text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Features (comma separated)</label>
                <textarea
                  name="features"
                  placeholder="Candid Photography, 4K Cinema Teaser, 1-Month Delivery Guarantee"
                  required
                  rows={3}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white font-medium text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
                />
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <input type="checkbox" id="popular" name="popular" value="true" className="w-4 h-4 accent-amber-400 rounded cursor-pointer" />
                <label htmlFor="popular" className="text-xs font-extrabold text-zinc-100 cursor-pointer select-none">Mark as "Client Favorite / Most Popular"</label>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-black rounded-xl shadow-xl hover:from-amber-300 hover:to-yellow-400 transition-all text-xs uppercase tracking-wider mt-2 cursor-pointer"
              >
                Save &amp; Publish Package
              </button>
            </form>
          </div>
        </div>

        {/* Packages List */}
        <div className="lg:col-span-2">
          {packages.length === 0 ? (
            <div className="border border-dashed border-amber-500/40 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] bg-[#0e0e0a]">
              <Package className="w-12 h-12 text-amber-400 mb-3" />
              <p className="text-white font-extrabold text-base mb-1">No custom packages published yet</p>
              <p className="text-zinc-300 text-xs font-medium">Create your first photography package using the form on the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <PackageAdminCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
