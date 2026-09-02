import Link from "next/link";
import { Instagram, Facebook, Mail, MapPin, Phone, Clock, Sparkles, ShieldCheck } from "lucide-react";
import StudioLogo from "@/components/ui/StudioLogo";

export default function Footer() {
  return (
    <footer className="bg-[#050807] text-white border-t border-teal-500/20 pt-16 pb-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <StudioLogo size="lg" href="/" />
            </div>

            <p className="text-zinc-400 text-sm max-w-md mb-6 font-light leading-relaxed">
              Premium South Indian wedding storytelling, candid cinematography, newborn portraiture, and milestone event photography. Preserving memories with our signature 1-Month Delivery Promise.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck size={14} className="text-teal-400" /> 1-Month Album Delivery Guaranteed
            </div>

            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-400/40 flex items-center justify-center text-zinc-300 hover:text-teal-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-400/40 flex items-center justify-center text-zinc-300 hover:text-teal-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-teal-300 tracking-widest uppercase mb-5">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#portfolio" className="text-zinc-400 hover:text-white transition-colors">
                  Recent Shoots &amp; Portfolio
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-zinc-400 hover:text-white transition-colors">
                  Wedding &amp; Event Services
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-zinc-400 hover:text-white transition-colors">
                  Build-Your-Story Calculator
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-zinc-400 hover:text-white transition-colors">
                  Photo Frames &amp; Gifts Store
                </Link>
              </li>
              <li>
                <Link href="/visualizer" className="text-zinc-400 hover:text-white transition-colors">
                  AI Outfit &amp; Pose Stylist
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold text-teal-300 tracking-widest uppercase mb-5">
              Studio Location
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 text-zinc-400">
                <MapPin className="w-4 h-4 shrink-0 mt-1 text-teal-400" />
                <span className="font-light">34, Prasanna New Colony, Avaniyapuram, Madurai, TN 625012</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                <Phone className="w-4 h-4 shrink-0 text-teal-400" />
                <span className="font-light">+91 63835 65425</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                <Mail className="w-4 h-4 shrink-0 text-teal-400" />
                <span className="font-light">ajayavinashsss@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                <Clock className="w-4 h-4 shrink-0 text-teal-400" />
                <span className="font-light">9:00 AM – 9:30 PM (All 7 Days)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 gap-3">
          <p>&copy; {new Date().getFullYear()} SSS Studio Photography. All rights reserved.</p>
          <p className="text-zinc-400">
            Crafted with Timeless Elegance &bull; Guaranteed 1-Month Album Delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
