import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPackages, addPackage, deletePackage } from "@/app/actions/packages";
import AdminNav from "@/components/admin/AdminNav";
import { Trash2, Plus, Check } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminPackages() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    redirect("/admin/login");
  }

  const packages = await getPackages();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <AdminNav currentPath="/admin/packages" />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Packages CMS
          </h1>
          <p className="text-zinc-400 mt-2">Manage your pricing plans and services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add New Package Form */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-xl bg-white/5 border border-zinc-800 rounded-3xl p-6 sticky top-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="text-[#D4AF37]" /> Add New Package
            </h2>
            <form action={addPackage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Package Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. Premium Wedding" 
                  required 
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Price</label>
                <input 
                  type="text" 
                  name="price" 
                  placeholder="e.g. ₹75,000" 
                  required 
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Short Description</label>
                <textarea 
                  name="description" 
                  placeholder="Comprehensive coverage for 2-day events." 
                  required 
                  rows={2}
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Features (comma separated)</label>
                <textarea 
                  name="features" 
                  placeholder="Traditional Photography, Drone Coverage, 2 Albums" 
                  required 
                  rows={3}
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="popular" name="popular" value="true" className="w-4 h-4 accent-[#D4AF37]" />
                <label htmlFor="popular" className="text-sm font-medium text-zinc-300">Mark as "Most Popular"</label>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all mt-4"
              >
                Save Package
              </button>
            </form>
          </div>
        </div>

        {/* Packages List */}
        <div className="lg:col-span-2">
          {packages.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <p className="text-zinc-500 mb-2">No packages found.</p>
              <p className="text-zinc-600 text-sm">Add some pricing packages using the form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="relative group rounded-2xl p-6 bg-zinc-900/50 border border-zinc-800 flex flex-col">
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg rounded-tr-2xl">
                      Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                  <div className="text-2xl font-bold text-[#D4AF37] mb-4">{pkg.price}</div>
                  <p className="text-zinc-400 text-sm mb-6 flex-grow">{pkg.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-zinc-300 text-xs">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <form action={deletePackage.bind(null, pkg.id)} className="mt-auto">
                    <button 
                      className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
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
