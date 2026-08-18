import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logoutAdmin } from "@/app/actions/auth";
import { LogOut, Calendar, User, Phone, MapPin, AlignLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "true") {
    redirect("/admin/login");
  }

  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-zinc-400 mt-2">Manage your booking requests here.</p>
        </div>
        
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex items-center gap-2 bg-zinc-900 hover:bg-red-900/30 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-900/50 px-4 py-2 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </form>
      </div>

      <div className="backdrop-blur-xl bg-white/5 dark:bg-black/20 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="p-4 text-zinc-400 font-medium whitespace-nowrap"><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#D4AF37]" /> Date</div></th>
                <th className="p-4 text-zinc-400 font-medium whitespace-nowrap"><div className="flex items-center gap-2"><User className="w-4 h-4 text-[#D4AF37]" /> Client Details</div></th>
                <th className="p-4 text-zinc-400 font-medium whitespace-nowrap"><div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4AF37]" /> Event / Location</div></th>
                <th className="p-4 text-zinc-400 font-medium"><div className="flex items-center gap-2"><AlignLeft className="w-4 h-4 text-[#D4AF37]" /> Requirements</div></th>
                <th className="p-4 text-zinc-400 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-zinc-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 align-top">
                      <div className="font-medium text-white">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-xs text-zinc-500 mt-1">Requested: {new Date(booking.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-semibold text-zinc-200">{booking.name}</div>
                      <div className="text-sm text-zinc-400 font-mono mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {booking.phone}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <span className="inline-block px-2.5 py-1 bg-zinc-800 text-[#D4AF37] text-xs rounded-full font-medium mb-2 border border-zinc-700/50">
                        {booking.eventType}
                      </span>
                      <div className="text-sm text-zinc-300 line-clamp-2">{booking.location}</div>
                    </td>
                    <td className="p-4 align-top max-w-xs">
                      <p className="text-sm text-zinc-400 line-clamp-3">
                        {booking.requirements || <span className="italic text-zinc-600">None specified</span>}
                      </p>
                    </td>
                    <td className="p-4 align-top text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'PENDING' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : booking.status === 'CONFIRMED'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
