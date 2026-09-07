import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTestimonials, addTestimonial, updateTestimonialStatus, deleteTestimonial } from "@/app/actions/testimonials";
import AdminNav from "@/components/admin/AdminNav";
import { Trash2, Plus, Star, Quote, MessageSquare, CheckCircle, XCircle, Clock, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReviews() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    redirect("/admin/login");
  }

  const allReviews = await getTestimonials();
  const pendingReviews = allReviews.filter((r) => r.status === "PENDING");
  const approvedReviews = allReviews.filter((r) => r.status === "APPROVED" || !r.status);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/reviews" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-[#14120c] p-6 rounded-3xl border border-amber-500/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </span>
            <span className="text-xs uppercase tracking-wider font-black text-amber-400">
              Client Review Moderation CMS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
            Customer Reviews &amp; Moderation
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-normal max-w-2xl leading-relaxed">
            Review user-submitted client testimonials. Approved reviews will immediately display live on the website homepage!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-400/30 font-bold shadow-lg">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase">Pending Review:</span>
            <span className="text-lg font-black text-amber-300">{pendingReviews.length}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 font-bold shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase">Approved Live:</span>
            <span className="text-lg font-black text-emerald-300">{approvedReviews.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Manual Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#0b0c07] border border-amber-500/30 rounded-3xl p-6 shadow-xl sticky top-8">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-400/30">
                <Plus className="w-4 h-4" />
              </span>
              Add &amp; Auto-Approve Review
            </h2>
            <form action={async (formData) => {
              "use server";
              await addTestimonial({
                name: formData.get("name"),
                event: formData.get("event"),
                text: formData.get("text"),
                rating: formData.get("rating"),
                status: "APPROVED"
              });
            }} className="space-y-4">
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
                  Client Review &amp; Feedback
                </label>
                <textarea
                  name="text"
                  placeholder="SSS Studio team did an exceptional job..."
                  required
                  rows={3}
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
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-black font-extrabold rounded-xl shadow-lg hover:brightness-110 transition-all text-xs uppercase tracking-wider mt-2 cursor-pointer"
              >
                Publish Directly to Website
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List & Moderation */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Submissions Section */}
          <div>
            <h2 className="text-lg font-extrabold text-amber-300 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Pending User Submissions ({pendingReviews.length})
            </h2>

            {pendingReviews.length === 0 ? (
              <div className="border border-dashed border-amber-500/30 rounded-2xl p-6 text-center bg-[#0d0c07]">
                <p className="text-zinc-400 text-xs font-medium">No pending customer reviews awaiting approval right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-3xl p-5 bg-[#121008] border-2 border-amber-400/70 shadow-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                          Awaiting Review
                        </span>
                      </div>

                      <p className="text-white text-xs sm:text-sm font-medium italic mb-4 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                        &ldquo;{review.text}&rdquo;
                      </p>

                      <div className="mb-4">
                        <h4 className="font-bold text-amber-300 text-sm">{review.name}</h4>
                        <p className="text-[11px] text-zinc-400 font-medium">{review.event}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-amber-500/20">
                      <form action={updateTestimonialStatus.bind(null, review.id, "APPROVED")} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 rounded-xl font-bold text-xs cursor-pointer transition-all">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve &amp; Show
                        </button>
                      </form>

                      <form action={deleteTestimonial.bind(null, review.id)}>
                        <button className="p-2 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 rounded-xl cursor-pointer transition-all" title="Reject & Delete">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Reviews Section */}
          <div>
            <h2 className="text-lg font-extrabold text-emerald-300 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Approved Live Website Reviews ({approvedReviews.length})
            </h2>

            {approvedReviews.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center bg-[#0a1310]">
                <p className="text-zinc-400 text-xs font-medium">No approved reviews yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {approvedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-3xl p-5 bg-[#0a1310] border border-emerald-500/30 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <Quote className="w-4 h-4 text-emerald-400/40" />
                      </div>

                      <p className="text-zinc-300 italic mb-4 text-xs sm:text-sm font-light leading-relaxed">
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-end justify-between pt-3 border-t border-white/5 mt-auto">
                      <div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">{review.name}</h4>
                        <p className="text-[11px] text-teal-400 font-medium">{review.event}</p>
                      </div>

                      <form action={deleteTestimonial.bind(null, review.id)}>
                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl transition-colors cursor-pointer" title="Delete Review">
                          <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
}
