import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTestimonials, addTestimonial, deleteTestimonial } from "@/app/actions/testimonials";
import AdminNav from "@/components/admin/AdminNav";
import { Trash2, Plus, Star } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminReviews() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    redirect("/admin/login");
  }

  const reviews = await getTestimonials();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <AdminNav currentPath="/admin/reviews" />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Reviews CMS
          </h1>
          <p className="text-zinc-400 mt-2">Manage client testimonials shown on your homepage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add New Review Form */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-xl bg-white/5 border border-zinc-800 rounded-3xl p-6 sticky top-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="text-[#D4AF37]" /> Add New Review
            </h2>
            <form action={addTestimonial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Client Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. Priya & Karthik" 
                  required 
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Event Type</label>
                <input 
                  type="text" 
                  name="event" 
                  placeholder="e.g. Wedding" 
                  required 
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Review Text</label>
                <textarea 
                  name="text" 
                  placeholder="They did an amazing job..." 
                  required 
                  rows={4}
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Rating (1-5)</label>
                <input 
                  type="number" 
                  name="rating" 
                  defaultValue={5} 
                  min={1} 
                  max={5} 
                  required 
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all"
              >
                Save Review
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {reviews.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <p className="text-zinc-500 mb-2">No reviews found.</p>
              <p className="text-zinc-600 text-sm">Add some client testimonials using the form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="relative group rounded-2xl p-6 bg-zinc-900/50 border border-zinc-800 flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-zinc-300 italic mb-6 flex-grow text-sm">"{review.text}"</p>
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <h4 className="font-bold text-white">{review.name}</h4>
                      <p className="text-xs text-amber-500 uppercase">{review.event}</p>
                    </div>
                    <form action={deleteTestimonial.bind(null, review.id)}>
                      <button 
                        className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
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
