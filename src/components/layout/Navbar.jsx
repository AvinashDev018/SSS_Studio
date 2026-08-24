"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Camera, User, LogOut, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
 const [isOpen, setIsOpen] = useState(false);
 const [isProfileOpen, setIsProfileOpen] = useState(false);
 const pathname = usePathname();
 const { data: session, status } = useSession();

 const links = [
 { name: "Home", href: "/" },
 { name: "About", href: "/about" },
 { name: "Services", href: "/services" },
 { name: "Gallery", href: "/gallery" },
 { name: "Store", href: "/store" },
 { name: "AI Stylist", href: "/visualizer" },
 { name: "Track Order", href: "/track" },
 { name: "Contact", href: "/contact" },
 ];

 return (
 <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 transition-colors duration-500 shadow-2xl shadow-black/50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between items-center h-20">
 <Link href="/" className="flex items-center gap-3 group">
 <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-brand-gradient hover-glow-brand shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-all duration-300">
 <Camera className="w-6 h-6 text-black" strokeWidth={2.5} />
 <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
 </div>
 <div className="flex flex-col justify-center">
 <span className="font-serif font-black text-2xl tracking-wider text-white leading-none drop-shadow-md">SSS</span>
 <span className="font-sans text-[11px] font-black tracking-[0.4em] text-brand-gradient uppercase mt-0.5 ml-0.5">Studio</span>
 </div>
 </Link>
 <div className="hidden md:block">
 <div className="ml-10 flex items-center space-x-6">
 {links.map((link) => (
 <Link
 key={link.name}
 href={link.href}
 className={`relative px-3 py-2 text-sm transition-all duration-300 rounded-full ${
 pathname === link.href
 ? "text-brand-gradient font-semibold bg-brand-gradient hover-glow-brand/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
 : "text-zinc-400 hover:text-white hover:bg-white/5"
 }`}
 >
 {link.name}
 </Link>
 ))}

 <div className="flex items-center gap-4 pl-4 border-l border-white/10 ml-2">
  {status === "loading" ? (
    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
  ) : session?.user ? (
    <div className="relative">
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {session.user.image ? (
          <Image src={session.user.image} alt={session.user.name || "User"} width={32} height={32} className="rounded-full border border-white/20" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center">
            <span className="text-black font-bold text-sm">{session.user.name?.[0]?.toUpperCase() || 'U'}</span>
          </div>
        )}
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-zinc-900 border border-white/10 shadow-xl overflow-hidden py-1">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
            <p className="text-xs text-zinc-400 truncate">{session.user.email}</p>
          </div>
          <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setIsProfileOpen(false)}>
            <UserCircle className="w-4 h-4" />
            My Profile
          </Link>
          <button 
            onClick={() => {
              signOut();
              setIsProfileOpen(false);
            }} 
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link
      href="/login"
      className="text-sm font-medium text-white hover:text-cyan-400 transition-colors"
    >
      Sign In
    </Link>
  )}

  <Link
  href="/book"
  className="bg-brand-gradient hover-glow-brand text-black px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300"
  >
  Book Session
  </Link>
 </div>
 </div>
 </div>
 <div className="-mr-2 flex md:hidden items-center gap-4">
 {session?.user && (
   <Link href="/profile">
     {session.user.image ? (
        <Image src={session.user.image} alt="User" width={32} height={32} className="rounded-full border border-white/20" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center">
          <span className="text-black font-bold text-sm">{session.user.name?.[0]?.toUpperCase() || 'U'}</span>
        </div>
      )}
   </Link>
 )}
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="inline-flex items-center justify-center p-2 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white focus:outline-none"
 >
 <span className="sr-only">Open main menu</span>
 {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
 </button>
 </div>
 </div>
 </div>

 {/* Mobile menu */}
 {isOpen && (
 <div className="md:hidden bg-zinc-900/95 backdrop-blur-xl border-b border-white/10 transition-colors duration-500 shadow-2xl">
 <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
 {links.map((link) => (
 <Link
 key={link.name}
 href={link.href}
 onClick={() => setIsOpen(false)}
 className={`${
 pathname === link.href
 ? "bg-white/10 text-white font-bold"
 : "text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
 } block px-3 py-2 rounded-md text-base`}
 >
 {link.name}
 </Link>
 ))}
 
 {!session?.user ? (
   <Link
    href="/login"
    onClick={() => setIsOpen(false)}
    className="block px-3 py-2 rounded-md text-base text-cyan-400 hover:bg-white/5 transition-colors"
   >
     Sign In
   </Link>
 ) : (
   <button
    onClick={() => {
      signOut();
      setIsOpen(false);
    }}
    className="w-full text-left block px-3 py-2 rounded-md text-base text-red-400 hover:bg-white/5 transition-colors"
   >
     Sign Out
   </button>
 )}

 <div className="pt-4 pb-2">
 <Link
 href="/book"
 onClick={() => setIsOpen(false)}
 className="block text-center w-full bg-brand-gradient hover-glow-brand text-black px-5 py-3 rounded-xl text-base font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 transition-all duration-300 mt-2"
 >
 Book a Session
 </Link>
 </div>
 </div>
 </div>
 )}
 </nav>
 );
}
