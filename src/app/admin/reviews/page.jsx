import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTestimonials, addTestimonial, deleteTestimonial } from "@/app/actions/testimonials";
import AdminNav from "@/components/admin/AdminNav";
import { Trash2, Plus, Star, Quote, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReviews() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    redirect("/admin/login");
  }

  const reviews = await getTestimonials();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/reviews" />

      {/* Friendly Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-gradient-to-r from-[#0c221e]/80 via-[#0a1815]/60 to-transparent p-6 rounded-3xl border border-teal-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <Star className="w-4 h-4 text-amber-400" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-teal-400">
              Reputation & Social Proof
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Customer Reviews & Testimonials CMS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-light max-w-2xl">
            Publish verified bride, groom, and family testimonials directly onto your public homepage to build trust with new prospective clients.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-2xl bg-teal-500/10 border border-teal-500/30 shrink-0">
          <span className="text-xs text-zinc-400">Total Reviews:</span>
          <span className="text-base font-black text-amber-300">{reviews.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#0a1310] border border-white/10 rounded-3xl p-6 shadow-xl sticky top-8">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
                <Plus className="w-4 h-4" />
              </span>
              Add Client Testimonial
            </h2>
            <form action={addTestimonial} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Client / Couple Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Anand & Divya"
                  required
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Shoot / Event Type
                </label>
                <input
                  type="text"
                  name="event"
                  placeholder="e.g. Traditional Wedding Shoot"
                  required
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Client Review & Feedback
                </label>
                <textarea
                  name="text"
                  placeholder="SSS Studio team did an exceptional job capturing our rituals and delivered our album within 20 days..."
                  required
                  rows={4}
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Rating Stars (1 - 5)
                </label>
                <input
                  type="number"
                  name="rating"
                  defaultValue={5}
                  min={1}
                  max={5}
                  required
                  className="w-full bg-[#070e0c] border border-white/10 rounded-xl px-4 py-2.5 text-amber-400 font-bold text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all text-xs uppercase tracking-wider mt-2 cursor-pointer"
              >
                Publish Testimonial
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {reviews.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] bg-[#0a1310]">
              <MessageSquare className="w-10 h-10 text-zinc-600 mb-2" />
              <p className="text-white font-bold mb-1">No reviews published yet</p>
              <p className="text-zinc-400 text-xs font-light">Add customer testimonials using the form to display them on your website.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="relative group rounded-3xl p-6 bg-[#0a1310] border border-white/10 hover:border-teal-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-1">
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Quote className="w-5 h-5 text-teal-500/20" />
                    </div>

                    <p className="text-zinc-300 italic mb-6 text-xs sm:text-sm font-light leading-relaxed">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-white/5 mt-auto">
                    <div>
                      <h4 className="font-bold text-white text-sm">{review.name}</h4>
                      <p className="text-[11px] text-teal-400 font-medium">{review.event}</p>
                    </div>

                    <form action={deleteTestimonial.bind(null, review.id)}>
                      <button
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl transition-colors cursor-pointer"
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
