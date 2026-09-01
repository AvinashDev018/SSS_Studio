"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Camera, LogOut, UserCircle, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Calculator", href: "/packages" },
    { name: "Store", href: "/store" },
    { name: "AI Stylist", href: "/visualizer" },
    { name: "Reviews", href: "/#testimonials" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#080c0b]/85 backdrop-blur-2xl border-b border-teal-500/20 transition-colors duration-500 shadow-2xl shadow-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-[0_0_20px_rgba(20,184,166,0.35)] group-hover:scale-105 transition-all duration-300">
              <Camera className="w-6 h-6 text-[#080c0b]" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-serif font-black text-2xl tracking-wider text-white leading-none drop-shadow-md">
                SSS
              </span>
              <span className="font-sans text-[10px] font-black tracking-[0.35em] text-teal-300 uppercase mt-1">
                Studio
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-5">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 rounded-full ${
                  pathname === link.href
                    ? "text-teal-300 bg-teal-500/10 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2">
              {session?.user && (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                    aria-label="Toggle user profile menu"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full border border-teal-400/40"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 flex items-center justify-center">
                        <span className="text-[#071f1b] font-bold text-xs">
                          {session.user.name?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0c3530] border border-teal-500/30 shadow-2xl overflow-hidden py-1">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{session.user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <UserCircle className="w-4 h-4 text-teal-400" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              <a
                href="https://wa.me/917871117875"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#071f1b] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
              >
                <MessageCircle size={14} /> Book Shoot
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="-mr-2 flex lg:hidden items-center gap-3">
            {session?.user && (
              <Link href="/profile">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full border border-teal-400/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 flex items-center justify-center">
                    <span className="text-[#071f1b] font-bold text-xs">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-teal-300 hover:text-white bg-white/5 border border-white/10 focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#080c0b]/98 backdrop-blur-2xl border-b border-teal-500/20 shadow-2xl">
          <div className="px-4 pt-3 pb-5 space-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wider ${
                  pathname === link.href
                    ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {session?.user && (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-white/5 cursor-pointer"
              >
                Sign Out
              </button>
            )}

            <div className="pt-2">
              <a
                href="https://wa.me/917871117875"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full bg-gradient-to-r from-teal-400 to-emerald-400 text-[#071f1b] px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-500/20 active:scale-95 transition-all mt-2"
              >
                Book a Shoot on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
