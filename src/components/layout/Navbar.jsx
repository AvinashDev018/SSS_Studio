"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Camera, Globe, Tag, Check, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const pathname = usePathname();
  const { currentLang, changeLanguage, t, translations } = useLanguage();
  
  const desktopLangRef = useRef(null);
  const mobileLangRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target)) {
        setIsDesktopLangOpen(false);
      }
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target)) {
        setIsMobileLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerModal = (mode = "booking", shootType = "Wedding & Event Photo Shoot") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-sss-modal", {
          detail: { mode, shootType },
        })
      );
    }
  };

  const links = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.services, href: "/#services" },
    { name: t.nav.portfolio, href: "/#portfolio" },
    { name: t.nav.about, href: "/#about" },
    { name: t.nav.pricing, href: "/packages" },
    { name: t.nav.gifts, href: "/store" },
    { name: t.nav.testimonials, href: "/#testimonials" },
    { name: t.nav.contact, href: "/#contact" },
  ];

  const languages = [
    { code: "en", label: "English", short: "EN" },
    { code: "ta", label: "தமிழ் (Tamil)", short: "தமிழ்" },
    { code: "hi", label: "हिंदी (Hindi)", short: "हिंदी" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#080c0b]/92 backdrop-blur-2xl border-b border-teal-500/20 transition-all duration-300 shadow-2xl shadow-black/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-6">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-[0_0_15px_rgba(20,184,166,0.35)] group-hover:scale-105 transition-all duration-300">
              <Camera className="w-4 h-4 text-[#080c0b]" strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-serif font-bold text-xl tracking-tight text-white">
                SSS
              </span>
              <span className="font-serif italic text-lg text-teal-300">
                Photography
              </span>
            </div>
          </Link>

          {/* Center: Desktop Nav Links */}
          <div className="hidden 2xl:flex items-center space-x-1 lg:space-x-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 rounded-full whitespace-nowrap ${
                  pathname === link.href
                    ? "text-teal-300 bg-teal-500/10 font-bold shadow-[0_0_12px_rgba(20,184,166,0.2)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Divider & Action CTAs */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 ml-auto 2xl:ml-6 pl-4 border-l border-white/10">
            {/* Interactive 3-Language Selector Dropdown */}
            <div className="relative" ref={desktopLangRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDesktopLangOpen((prev) => !prev);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all cursor-pointer whitespace-nowrap"
                title="Change Website Language"
              >
                <Globe size={13} className="text-teal-400" />
                <span className="font-bold">{translations[currentLang]?.langLabel || "EN"}</span>
                <ChevronDown size={12} className={`text-zinc-400 transition-transform ${isDesktopLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isDesktopLangOpen && (
                <div 
                  className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0c3530] border border-teal-500/30 shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-teal-300 font-bold border-b border-white/10">
                    Select Language / மொழி
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        changeLanguage(lang.code);
                        setIsDesktopLangOpen(false);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeLanguage(lang.code);
                        setIsDesktopLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        currentLang === lang.code
                          ? "bg-teal-500/20 text-teal-300 font-bold"
                          : "text-zinc-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{lang.label}</span>
                      {currentLang === lang.code && <Check size={14} className="text-teal-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Offer Here Button (Golden Pill) */}
            <button
              onClick={() => triggerModal("booking", "Complimentary Pre-Wedding Shoot Offer")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-[#071f1b] shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer uppercase tracking-wider whitespace-nowrap"
            >
              <Tag size={13} className="fill-current" />
              <span>{t.nav.offer}</span>
            </button>

            {/* Get Quote (White/Glass Pill) */}
            <button
              onClick={() => triggerModal("quote", "Wedding & Event Photo Shoot")}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              {t.nav.getQuote}
            </button>

            {/* Book Makeup (Mint Pill) */}
            <button
              onClick={() => triggerModal("booking", "Makeup Artist Available")}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#071f1b] bg-gradient-to-r from-teal-300 to-emerald-300 hover:from-teal-400 hover:to-emerald-400 shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              {t.nav.bookMakeup}
            </button>

            {/* Book Now (Deep Forest Teal Solid Pill) */}
            <button
              onClick={() => triggerModal("booking", "Wedding & Event Photo Shoot")}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-teal-700 via-teal-800 to-[#0c3530] hover:from-teal-600 hover:to-teal-700 border border-teal-500/40 shadow-lg shadow-teal-950/60 hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              {t.nav.bookNow}
            </button>
          </div>

          {/* Mobile / Tablet View Hamburger Controls */}
          <div className="-mr-1 flex xl:hidden items-center gap-2">
            {/* Mobile Language Switcher Quick Pill */}
            <div className="relative" ref={mobileLangRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileLangOpen((prev) => !prev);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-zinc-200 bg-white/5 border border-white/15 cursor-pointer"
              >
                <Globe size={12} className="text-teal-400" />
                <span>{translations[currentLang]?.langLabel || "EN"}</span>
              </button>

              {isMobileLangOpen && (
                <div 
                  className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#0c3530] border border-teal-500/30 shadow-2xl p-1 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        changeLanguage(lang.code);
                        setIsMobileLangOpen(false);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeLanguage(lang.code);
                        setIsMobileLangOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold ${
                        currentLang === lang.code
                          ? "bg-teal-500/20 text-teal-300 font-bold"
                          : "text-zinc-300 hover:text-white"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => triggerModal("booking", "Complimentary Pre-Wedding Shoot Offer")}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-[#071f1b] flex items-center gap-1 cursor-pointer"
            >
              <Tag size={11} /> {t.nav.offer}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-teal-300 hover:text-white bg-white/5 border border-white/10 focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              {isOpen ? <X className="block h-5 w-5" /> : <Menu className="block h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="2xl:hidden bg-[#080c0b]/98 backdrop-blur-2xl border-b border-teal-500/20 shadow-2xl">
          <div className="px-4 pt-3 pb-5 space-y-2">
            {/* Language Selector Mobile in Drawer */}
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Globe size={14} className="text-teal-400" />
              <span className="text-xs text-zinc-400">Language / மொழி:</span>
              <div className="flex gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      currentLang === lang.code
                        ? "bg-teal-400 text-[#071f1b] shadow-md shadow-teal-500/30 font-bold"
                        : "bg-white/10 text-zinc-300 hover:text-white"
                    }`}
                  >
                    {lang.short}
                  </button>
                ))}
              </div>
            </div>

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

            <div className="pt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  triggerModal("quote", "Wedding & Event Photo Shoot");
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 border border-white/15 text-center cursor-pointer"
              >
                {t.nav.getQuote}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  triggerModal("booking", "Makeup Artist Available");
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-[#071f1b] bg-gradient-to-r from-teal-300 to-emerald-300 text-center cursor-pointer"
              >
                {t.nav.bookMakeup}
              </button>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                triggerModal("booking", "Wedding & Event Photo Shoot");
              }}
              className="block text-center w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-500/20 active:scale-95 transition-all mt-2 cursor-pointer"
            >
              {t.nav.bookNow}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
