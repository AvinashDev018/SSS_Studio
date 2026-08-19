import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPhotos, addPhoto, deletePhoto } from "@/app/actions/gallery";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = 'force-dynamic';

export default async function AdminGallery() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    redirect("/admin/login");
  }

  const photos = await getPhotos();
  const categories = ["Wedding", "Portrait", "Event", "Birthday", "Commercial"];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <AdminNav currentPath="/admin/gallery" />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Gallery CMS
          </h1>
          <p className="text-zinc-400 mt-2">Manage your public portfolio images.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add New Photo Form */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-xl bg-white/5 border border-zinc-800 rounded-3xl p-6 sticky top-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="text-[#D4AF37]" /> Add New Photo
            </h2>
            <form action={addPhoto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Image URL</label>
                <input 
                  type="url" 
                  name="url" 
                  placeholder="https://example.com/photo.jpg" 
                  required 
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                <select 
                  name="category" 
                  required
                  defaultValue=""
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] appearance-none"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all"
              >
                Save Photo
              </button>
            </form>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="lg:col-span-2">
          {photos.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <p className="text-zinc-500 mb-2">Your gallery is empty.</p>
              <p className="text-zinc-600 text-sm">Add some photo URLs using the form to build your portfolio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-square">
                  <img 
                    src={photo.url} 
                    alt={photo.category} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">{photo.category}</span>
                    <form action={deletePhoto.bind(null, photo.id)}>
                      <button 
                        className="flex items-center justify-center w-full bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white py-2 rounded-lg transition-colors text-sm font-medium gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
