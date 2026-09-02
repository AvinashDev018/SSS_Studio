import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import AdminBookingsView from "@/components/admin/AdminBookingsView";
import { Calendar } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    redirect("/admin/login");
  }

  let bookings = [];
  try {
    const rawBookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serialize dates for Client Component safety
    bookings = rawBookings.map((b) => ({
      ...b,
      date: b.date instanceof Date ? b.date.toISOString() : b.date,
      createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
      updatedAt: b.updatedAt instanceof Date ? b.updatedAt.toISOString() : b.updatedAt,
    }));
  } catch (error) {
    console.error("Failed to load bookings from database:", error);
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <AdminNav currentPath="/admin" />

      {/* Friendly Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-gradient-to-r from-[#0c221e]/80 via-[#0a1815]/60 to-transparent p-6 rounded-3xl border border-teal-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-teal-400">
              Studio Operations Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Client Bookings & Shoot Requests
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-light max-w-2xl">
            Quickly review incoming shoot inquiries, confirm calendar dates, and contact clients directly via WhatsApp in one click.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-2xl bg-teal-500/10 border border-teal-500/30 shrink-0">
          <span className="text-xs text-zinc-400">Total Bookings:</span>
          <span className="text-base font-black text-teal-300">{bookings.length}</span>
        </div>
      </div>

      {/* Interactive Bookings Table & Controls */}
      <AdminBookingsView initialBookings={bookings} />
    </div>
  );
}
