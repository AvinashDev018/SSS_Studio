"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Globe, Check, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import StudioLogo from "@/components/ui/StudioLogo";

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

  // Curated primary links for desktop to ensure comfortable spacing without edge crowding
  const desktopLinks = [
    { name: t.nav.services, href: "/#services" },
    { name: t.nav.portfolio, href: "/#portfolio" },
    { name: currentLang === "ta" ? "பிரேம்கள்" : currentLang === "hi" ? "फोटो फ्रेम" : "Frames", href: "/#frames" },
    { name: t.nav.pricing, href: "/packages" },
    { name: t.nav.about, href: "/#about" },
    { name: t.nav.contact, href: "/#contact" },
  ];

  // Full set of links available in mobile drawer
  const mobileLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.services, href: "/#services" },
    { name: t.nav.portfolio, href: "/#portfolio" },
    { name: currentLang === "ta" ? "பிரேம்கள்" : currentLang === "hi" ? "फोटो फ्रेम" : "Frames", href: "/#frames" },
    { name: t.nav.pricing, href: "/packages" },
    { name: currentLang === "ta" ? "ஸ்டோர்" : currentLang === "hi" ? "स्टोर" : "Store", href: "/store" },
    { name: t.nav.about, href: "/#about" },
    { name: t.nav.testimonials, href: "/#testimonials" },
    { name: t.nav.contact, href: "/#contact" },
  ];

  const languages = [
    { code: "en", label: "English", short: "EN" },
    { code: "ta", label: "தமிழ் (Tamil)", short: "தமிழ்" },
    { code: "hi", label: "हिंदी (Hindi)", short: "हिंदी" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#0a0a0a]/92 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 shadow-2xl shadow-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
          
          {/* Left: Brand Logo */}
          <div className="shrink-0">
            <StudioLogo size="md" href="/" />
          </div>

          {/* Center: Desktop Nav Links (Clean, Uncluttered, Never Touching Edges) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            {desktopLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-all duration-300 rounded-full whitespace-nowrap ${
                    isActive
                      ? "text-[#c5a880] bg-[#c5a880]/15 font-semibold shadow-[0_0_12px_rgba(197,168,128,0.2)] border border-[#c5a880]/30"
                      : "text-zinc-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Streamlined Action CTAs */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            
            {/* Interactive Language Selector Dropdown */}
            <div className="relative" ref={desktopLangRef}>
              <button
                type="button"
                suppressHydrationWarning
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDesktopLangOpen((prev) => !prev);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all cursor-pointer whitespace-nowrap"
                title="Change Language"
              >
                <Globe size={14} className="text-[#c5a880]" />
                <span className="font-bold" suppressHydrationWarning>{translations[currentLang]?.langLabel || "EN"}</span>
                <ChevronDown size={12} className={`text-zinc-400 transition-transform duration-200 ${isDesktopLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isDesktopLangOpen && (
                <div 
                  className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#141414] border border-white/15 shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#c5a880] font-bold border-b border-white/10">
                    Select Language / மொழி
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      suppressHydrationWarning
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
                          ? "bg-[#c5a880]/20 text-[#c5a880] font-bold"
                          : "text-zinc-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{lang.label}</span>
                      {currentLang === lang.code && <Check size={14} className="text-[#c5a880]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Offer / Quote Action Button */}
            <button
              suppressHydrationWarning
              onClick={() => triggerModal("offer", "Exclusive Wedding Season Gift Box")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-[#c5a880] bg-[#c5a880]/10 border border-[#c5a880]/30 hover:bg-[#c5a880]/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer uppercase tracking-wider whitespace-nowrap"
            >
              <Sparkles size={13} className="text-[#c5a880]" />
              <span suppressHydrationWarning>{t.nav.offer}</span>
            </button>

            {/* Book Now (Solid Champagne Gold Luxury Button) */}
            <button
              suppressHydrationWarning
              onClick={() => triggerModal("booking", "Wedding & Event Photo Shoot")}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-black bg-[#c5a880] hover:bg-[#d4af37] shadow-lg hover:shadow-[0_0_20px_rgba(197,168,128,0.35)] hover:scale-[1.02] transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap"
            >
              <span suppressHydrationWarning>{t.nav.bookNow}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile / Tablet View Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick Language Pill */}
            <div className="relative" ref={mobileLangRef}>
              <button
                type="button"
                suppressHydrationWarning
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileLangOpen((prev) => !prev);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold text-zinc-200 bg-white/5 border border-white/15 cursor-pointer"
              >
                <Globe size={13} className="text-[#c5a880]" />
                <span suppressHydrationWarning>{translations[currentLang]?.langLabel || "EN"}</span>
              </button>

              {isMobileLangOpen && (
                <div 
                  className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#141414] border border-white/15 shadow-2xl p-1 z-50"
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
                          ? "bg-[#c5a880]/20 text-[#c5a880] font-bold"
                          : "text-zinc-300 hover:text-white"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Mobile Offer Button */}
            <button
              onClick={() => triggerModal("offer", "Exclusive Wedding Season Gift Box")}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#c5a880] text-black flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Sparkles size={12} /> {t.nav.offer}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-300 hover:text-white bg-white/5 border border-white/10 focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              {isOpen ? <X className="block h-5 w-5 text-[#c5a880]" /> : <Menu className="block h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0a0a0a]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <div className="px-5 pt-4 pb-6 space-y-3">
            {/* Language Selector in Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-[#c5a880]" />
                <span className="text-xs text-zinc-300 font-medium">Language / மொழி:</span>
              </div>
              <div className="flex gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      currentLang === lang.code
                        ? "bg-[#c5a880] text-black font-bold shadow-md"
                        : "bg-white/5 text-zinc-300 hover:text-white border border-white/10"
                    }`}
                  >
                    {lang.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Nav Links */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {mobileLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wider ${
                    pathname === link.href
                      ? "bg-[#c5a880]/15 text-[#c5a880] font-semibold border border-[#c5a880]/30"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Quick Actions in Drawer */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  triggerModal("quote", "Wedding & Event Photo Shoot");
                }}
                className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 text-center cursor-pointer hover:bg-white/10"
              >
                {t.nav.getQuote}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  triggerModal("offer", "Exclusive Wedding Season Gift Box");
                }}
                className="w-full py-3 rounded-xl text-xs font-bold text-black bg-[#c5a880] text-center cursor-pointer shadow-md"
              >
                {t.nav.offer}
              </button>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                triggerModal("booking", "Wedding & Event Photo Shoot");
              }}
              className="block text-center w-full bg-[#c5a880] hover:bg-[#d4af37] text-black px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all mt-2 cursor-pointer"
            >
              {t.nav.bookNow}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
