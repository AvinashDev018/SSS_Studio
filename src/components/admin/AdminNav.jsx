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
  Gift,
  Frame,
  ExternalLink, 
  LogOut,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";
import StudioLogo from "@/components/ui/StudioLogo";

export default function AdminNav({ currentPath: propPath }) {
  const pathname = usePathname();
  const currentPath = propPath || pathname;

  const links = [
    { name: "Bookings", href: "/admin", icon: Calendar, badge: null },
    { name: "CRM / Orders", href: "/admin/crm", icon: ShoppingBag, badge: null },
    { name: "Frames & Gifts", href: "/admin/frames-gifts", icon: Gift, badge: null },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon, badge: null },
    { name: "Packages", href: "/admin/packages", icon: Package, badge: null },
    { name: "Promos & Vouchers", href: "/admin/promos", icon: Tag, badge: null },
    { name: "Reviews CMS", href: "/admin/reviews", icon: Star, badge: null },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, badge: null },
  ];

  return (
    <header className="mb-8 space-y-3">
      {/* 1. Top Brand & Action Bar */}
      <div className="bg-[#0b0c07]/90 backdrop-blur-xl border border-amber-500/25 rounded-2xl px-5 py-3.5 shadow-2xl flex items-center justify-between gap-4">
        {/* Left: Studio Identity */}
        <div className="flex items-center gap-3">
          <StudioLogo size="sm" variant="light" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-wide">SSS Studio</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-400/30 text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                ADMIN CRM PORTAL
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-light hidden sm:block">
              Madurai Studio &amp; Order Management Suite
            </p>
          </div>
        </div>

        {/* Right: Friendly Actions (Live Site + Logout) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-white/5 hover:bg-amber-500/15 text-zinc-300 hover:text-amber-300 text-xs font-semibold border border-amber-500/20 hover:border-amber-400/40 transition-all duration-200"
            title="Open Live Website in New Tab"
          >
            <span>Live Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 text-xs font-semibold border border-red-500/20 hover:border-red-500/30 transition-all duration-200 cursor-pointer"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>
      </div>

      {/* 2. Clean Dedicated Navigation Rail (Single Row with Horizontal Scroll on Mobile) */}
      <nav className="bg-[#060805]/90 backdrop-blur-md border border-amber-500/20 rounded-2xl p-1.5 shadow-lg overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold shadow-lg shadow-amber-500/25 scale-[1.02]"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-zinc-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
