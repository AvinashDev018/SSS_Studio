import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllClientGalleries, createClientGallery } from "@/app/actions/gallery";
import AdminNav from "@/components/admin/AdminNav";
import AdminGalleryCard from "@/components/admin/AdminGalleryCard";
import CreateGalleryForm from "@/components/admin/CreateGalleryForm";
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
          <CreateGalleryForm />
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
                <AdminGalleryCard key={gal.id} gal={gal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
