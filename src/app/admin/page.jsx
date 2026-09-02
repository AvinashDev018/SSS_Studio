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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-teal-400">
              Shoot Inquiries & Calendar
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Client Bookings & Requests
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage inquiries, confirm dates, contact clients via WhatsApp, and track photoshoot schedules.
          </p>
        </div>
      </div>

      {/* Interactive Bookings Table & Controls */}
      <AdminBookingsView initialBookings={bookings} />
    </div>
  );
}
