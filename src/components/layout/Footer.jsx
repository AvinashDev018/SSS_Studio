"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Mail, MapPin, Phone, Clock, Sparkles, ShieldCheck } from "lucide-react";
import StudioLogo from "@/components/ui/StudioLogo";

export default function Footer() {
  const pathname = usePathname();

  // Hide public website footer on admin, store, and pricing/packages pages
  if (pathname?.startsWith("/admin") || pathname === "/store" || pathname === "/packages") {
    return null;
  }
  return (
    <footer className="bg-[#FFFFFF] text-zinc-900 border-t border-black/10 pt-16 pb-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <StudioLogo size="lg" href="/" />
            </div>

            <p className="text-zinc-900 text-sm max-w-md mb-6 font-medium leading-relaxed">
              Premium South Indian wedding storytelling, candid cinematography, fine-art portraiture, and milestone event photography. Preserving memories with our signature 1-Month Delivery Promise.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-[#d4af37]/50 text-[#8b6508] text-xs font-black uppercase tracking-wider mb-6">
              <ShieldCheck size={14} className="text-[#8b6508]" /> 1-Month Album Delivery Guaranteed
            </div>

            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-black/5 hover:bg-[#d4af37]/20 border border-black/15 hover:border-[#d4af37] flex items-center justify-center text-zinc-900 hover:text-[#8b6508] transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-black/5 hover:bg-[#d4af37]/20 border border-black/15 hover:border-[#d4af37] flex items-center justify-center text-zinc-900 hover:text-[#8b6508] transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black text-[#8b6508] tracking-widest uppercase mb-5">
              Explore
            </h3>
            <ul className="space-y-3 text-sm font-bold">
              <li>
                <Link href="/" className="text-zinc-900 hover:text-[#8b6508] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#portfolio" className="text-zinc-900 hover:text-[#8b6508] transition-colors">
                  Recent Shoots &amp; Portfolio
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-zinc-900 hover:text-[#8b6508] transition-colors">
                  Wedding &amp; Event Services
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-zinc-900 hover:text-[#8b6508] transition-colors">
                  Build-Your-Story Calculator
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-zinc-900 hover:text-[#8b6508] transition-colors">
                  Photo Frames &amp; Gifts Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-black text-[#8b6508] tracking-widest uppercase mb-5">
              Studio Location
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 text-zinc-900 font-bold">
                <MapPin className="w-4 h-4 shrink-0 mt-1 text-[#8b6508]" />
                <span className="font-semibold">34, Prasanna New Colony, Avaniyapuram, Madurai, TN 625012</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-900 font-bold">
                <Phone className="w-4 h-4 shrink-0 text-[#8b6508]" />
                <span className="font-bold">+91 63835 65425</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-900 font-bold">
                <Mail className="w-4 h-4 shrink-0 text-[#8b6508]" />
                <span className="font-bold">ajayavinashsss@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-900 font-bold">
                <Clock className="w-4 h-4 shrink-0 text-[#8b6508]" />
                <span className="font-bold">9:00 AM – 9:30 PM (All 7 Days)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-800 font-bold gap-3">
          <p>&copy; {new Date().getFullYear()} SSS Studio Photography. All rights reserved.</p>
          <p className="text-zinc-900 font-bold">
            Crafted with Timeless Elegance &bull; Guaranteed 1-Month Album Delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
