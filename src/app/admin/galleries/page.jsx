import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllClientGalleries, createClientGallery } from "@/app/actions/gallery";
import AdminNav from "@/components/admin/AdminNav";
import { Frame, Plus, ExternalLink, Lock, CheckCircle2, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminGalleriesPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    redirect("/admin/login");
  }

  const galleries = await getAllClientGalleries();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-zinc-100 font-sans">
      <AdminNav currentPath="/admin/galleries" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-[#14120c] p-6 rounded-3xl border border-amber-500/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Frame className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-black text-amber-400">
              Client Proofing Portal Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
            Client Album Proofing Galleries
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-normal max-w-2xl leading-relaxed">
            Create private, password-protected photo selection links for brides, grooms, and clients to choose photos for photobook printing.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-2xl bg-amber-400 text-black border border-amber-300 shrink-0 font-extrabold shadow-lg">
          <span className="text-xs font-bold text-black uppercase tracking-wider">Active Proofing Portals:</span>
          <span className="text-lg font-black text-black">{galleries.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Gallery Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#0b0c07] border border-amber-500/40 rounded-3xl p-6 shadow-2xl sticky top-8">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
                <Plus className="w-4 h-4" />
              </span>
              Create Client Proofing Portal
            </h2>

            <form action={async (formData) => {
              "use server";
              const sampleUrls = (formData.get("sampleUrls") || "")
                .split("\n")
                .map((u) => u.trim())
                .filter(Boolean);

              const photoObjects = sampleUrls.map((url, idx) => ({
                url,
                filename: `Photo_${idx + 1}.jpg`,
                isSelected: false
              }));

              await createClientGallery({
                slug: formData.get("slug"),
                clientName: formData.get("clientName"),
                clientPhone: formData.get("clientPhone"),
                passcode: formData.get("passcode"),
                eventDate: formData.get("eventDate"),
                maxSelections: formData.get("maxSelections"),
                photos: photoObjects
              });
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Client / Couple Name</label>
                <input
                  type="text"
                  name="clientName"
                  placeholder="e.g. Anand & Divya Wedding"
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Custom Link Slug</label>
                <input
                  type="text"
                  name="slug"
                  placeholder="e.g. anand-divya-wedding"
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-amber-300 font-mono text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Client PIN Passcode</label>
                  <input
                    type="text"
                    name="passcode"
                    placeholder="4829"
                    maxLength={6}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-mono text-center font-bold text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Max Photos</label>
                  <input
                    type="number"
                    name="maxSelections"
                    defaultValue={40}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Client Phone</label>
                  <input
                    type="text"
                    name="clientPhone"
                    placeholder="+91 98765 43210"
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">Sample Photo Web URLs (1 per line)</label>
                <textarea
                  name="sampleUrls"
                  rows={4}
                  placeholder="https://images.unsplash.com/photo-1519741497674-611481863552&#10;https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-extrabold rounded-xl shadow-xl hover:brightness-110 transition-all text-xs uppercase tracking-wider cursor-pointer mt-2"
              >
                Generate Proofing Portal Link
              </button>
            </form>
          </div>
        </div>

        {/* Existing Galleries List */}
        <div className="lg:col-span-2">
          {galleries.length === 0 ? (
            <div className="border border-dashed border-amber-500/40 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] bg-[#0e0e0a]">
              <Frame className="w-12 h-12 text-amber-400 mb-3" />
              <p className="text-white font-extrabold text-base mb-1">No client proofing portals created yet</p>
              <p className="text-zinc-400 text-xs font-medium">Use the form on the left to create a private photo choice link for your clients.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {galleries.map((gal) => (
                <div
                  key={gal.id}
                  className="rounded-3xl p-6 bg-[#0e0e0a] border border-amber-500/40 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between shadow-2xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        gal.status === "SUBMITTED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                      }`}>
                        {gal.status === "SUBMITTED" ? "✓ Client Choices Submitted" : "Open for Client Selection"}
                      </span>
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" /> PIN: <strong>{gal.passcode}</strong>
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-extrabold text-white mb-1">{gal.clientName}</h3>
                    <p className="text-xs text-amber-300 font-mono mb-4">/client-gallery/{gal.slug}</p>

                    <div className="bg-black/50 p-3 rounded-xl border border-zinc-800 space-y-1 mb-4 text-xs">
                      <p className="text-zinc-300">Total Photos Uploaded: <strong className="text-white">{gal._count?.photos || 0}</strong></p>
                      <p className="text-zinc-300">Max Album Selections: <strong className="text-amber-300">{gal.maxSelections}</strong></p>
                      <p className="text-zinc-400 text-[11px]">Client Phone: {gal.clientPhone}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-500/25 flex items-center justify-between">
                    <Link
                      href={`/client-gallery/${gal.slug}`}
                      target="_blank"
                      className="px-4 py-2 bg-amber-400 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md"
                    >
                      <span>Open Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href={`https://wa.me/${gal.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hello ${gal.clientName}! Your private album proofing link from SSS Studio is ready:\nhttps://sssstudiomadurai.com/client-gallery/${gal.slug}\nPIN Passcode: ${gal.passcode}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      Send via WhatsApp
                    </a>
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
