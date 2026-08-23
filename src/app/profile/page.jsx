import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Package, Calendar, Settings, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Profile | SSS Studio",
  description: "Manage your SSS Studio account, orders, and bookings.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch user details with relations
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' }
      },
      bookings: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-28 shadow-xl">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-800 mb-4 bg-zinc-800 relative">
                {session.user.image ? (
                  <Image src={session.user.image} alt={user.name || "User"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-gradient flex items-center justify-center text-3xl font-bold text-black">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-zinc-400 text-sm">{user.email}</p>
              {user.phone && <p className="text-zinc-500 text-xs mt-1">{user.phone}</p>}
            </div>

            <nav className="space-y-2">
              <a href="#orders" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
                <Package className="w-5 h-5 text-cyan-400" />
                My Orders
              </a>
              <a href="#bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                <Calendar className="w-5 h-5 text-violet-400" />
                My Bookings
              </a>
              <a href="#settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                <Settings className="w-5 h-5 text-zinc-500" />
                Account Settings
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 space-y-8">
          
          {/* Orders Section */}
          <section id="orders" className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-white">Order History</h3>
              <span className="text-sm px-3 py-1 bg-white/5 rounded-full text-zinc-400">{user.orders.length} Orders</span>
            </div>

            {user.orders.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">You haven't placed any orders yet.</p>
                <Link href="/store" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">Browse Store &rarr;</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-medium mb-1">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-zinc-400">{new Date(order.createdAt).toLocaleDateString()} &middot; {order.items.length} items</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">₹{order.totalAmount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                          order.status === 'PAID' ? 'bg-green-500/10 text-green-500' :
                          order.status === 'SHIPPED' ? 'bg-cyan-500/10 text-cyan-500' :
                          'bg-zinc-500/10 text-zinc-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Bookings Section */}
          <section id="bookings" className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-white">My Bookings</h3>
              <span className="text-sm px-3 py-1 bg-white/5 rounded-full text-zinc-400">{user.bookings.length} Bookings</span>
            </div>

            {user.bookings.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">You don't have any upcoming bookings.</p>
                <Link href="/book" className="mt-4 inline-block text-violet-400 hover:text-violet-300">Book a Session &rarr;</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.bookings.map((booking) => (
                  <div key={booking.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-medium mb-1">{booking.serviceType}</p>
                      <p className="text-sm text-zinc-400">Date: {new Date(booking.date).toLocaleDateString()} {booking.time}</p>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                        booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500' :
                        'bg-zinc-500/10 text-zinc-500'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
