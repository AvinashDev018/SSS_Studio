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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-[#14120c] p-6 rounded-3xl border border-amber-500/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-black text-amber-400">
              Studio Operations Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
            Client Bookings &amp; Shoot Requests
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-normal max-w-2xl leading-relaxed">
            Quickly review incoming shoot inquiries, confirm calendar dates, and contact clients directly via WhatsApp in one click.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-2xl bg-amber-400 text-black border border-amber-300 shrink-0 font-extrabold shadow-lg">
          <span className="text-xs font-bold text-black uppercase tracking-wider">Total Bookings:</span>
          <span className="text-lg font-black text-black">{bookings.length}</span>
        </div>
      </div>

      {/* Interactive Bookings Table & Controls */}
      <AdminBookingsView initialBookings={bookings} />
    </div>
  );
}
