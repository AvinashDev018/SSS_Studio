import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";

export default function AdminNav({ currentPath }) {
  const links = [
    { name: "Bookings", href: "/admin" },
    { name: "Gallery", href: "/admin/gallery" },
    { name: "Reviews", href: "/admin/reviews" },
    { name: "Packages", href: "/admin/packages" },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap items-center gap-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              currentPath === link.href
                ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      
      <form action={logoutAdmin}>
        <button
          type="submit"
          className="flex items-center gap-2 bg-zinc-900 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-900/50 px-4 py-2 rounded-xl transition-all w-full md:w-auto justify-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </form>
    </div>
  );
}
