"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  ShoppingBag, 
  Image as ImageIcon, 
  Tag, 
  BarChart3, 
  Star, 
  Package, 
  ExternalLink, 
  LogOut,
  Sparkles
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";

export default function AdminNav({ currentPath: propPath }) {
  const pathname = usePathname();
  const currentPath = propPath || pathname;

  const links = [
    { name: "Bookings", href: "/admin", icon: Calendar },
    { name: "CRM / Orders", href: "/admin/crm", icon: ShoppingBag },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Promos & Vouchers", href: "/admin/promos", icon: Tag },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Reviews CMS", href: "/admin/reviews", icon: Star },
    { name: "Packages", href: "/admin/packages", icon: Package },
  ];

  return (
    <header className="mb-8 bg-[#0a110f]/90 backdrop-blur-xl border border-teal-500/20 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Brand & Live Site Link */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold shadow-inner">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-wide">SSS Studio</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/10 border border-teal-500/30 text-teal-400">
                  Admin Panel
                </span>
              </div>
              <p className="text-xs text-zinc-400">Studio Management Suite</p>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-teal-300 text-xs font-medium border border-white/10 transition-colors"
            title="Open Live Website in New Tab"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/40 border border-teal-400/40 scale-[1.02]"
                    : "bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/5 hover:border-white/10"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <form action={logoutAdmin} className="self-end lg:self-center">
          <button
            type="submit"
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all"
            title="Sign out of Admin Panel"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </header>
  );
}
