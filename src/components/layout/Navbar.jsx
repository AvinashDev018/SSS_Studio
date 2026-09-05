"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Globe, Check, ChevronDown, Sparkles, ArrowRight, Package } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import StudioLogo from "@/components/ui/StudioLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const pathname = usePathname();
  const { currentLang, changeLanguage, t, translations } = useLanguage();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  
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
    { name: currentLang === "ta" ? "ஸ்டோர்" : currentLang === "hi" ? "स्टोर" : "Store", href: "/store" },
    { name: t.nav.pricing, href: "/packages" },
    { name: t.nav.track || "Track", href: "/track", highlight: true },
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
    { name: t.nav.track || "Track", href: "/track", highlight: true },
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
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-black/10 transition-all duration-300 shadow-md w-full max-w-full overflow-x-clip">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1.5 sm:gap-4">
          
          {/* Left: Brand Logo */}
          <div className="shrink-0 flex items-center">
            <StudioLogo size="sm" href="/" variant="dark" className="sm:hidden" />
            <StudioLogo size="md" href="/" variant="dark" className="hidden sm:flex" />
          </div>

          {/* Center: Desktop Nav Links (Clean, Centered, Perfectly Spaced) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 px-2.5 py-1.5 rounded-full bg-black/[0.04] border border-black/10 backdrop-blur-md shrink-0">
            {desktopLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-xs font-medium uppercase tracking-[0.08em] transition-all duration-300 rounded-full whitespace-nowrap flex items-center gap-1 ${
                    isActive
                      ? "text-[#8b6508] bg-[#d4af37]/25 font-bold border border-[#d4af37]/60 shadow-sm"
                      : link.highlight
                      ? "text-amber-700 font-bold hover:text-amber-900 hover:bg-amber-100/60"
                      : "text-zinc-700 hover:text-black hover:bg-black/5"
                  }`}
                >
                  {link.highlight && <Package size={13} className="text-[#b8860b] inline-block animate-pulse" />}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Streamlined Action CTAs (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            
            {/* Interactive Language Selector Dropdown */}
            <div className="relative" ref={desktopLangRef}>
              <button
                type="button"
                suppressHydrationWarning
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDesktopLangOpen((prev) => !prev);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-zinc-800 hover:text-black bg-black/5 hover:bg-black/10 border border-black/15 transition-all cursor-pointer whitespace-nowrap"
                title="Change Language"
              >
                <Globe size={13} className="text-[#b8860b]" />
                <span className="font-bold text-[11px]" suppressHydrationWarning>{translations[currentLang]?.langLabel || "EN"}</span>
                <ChevronDown size={11} className={`text-zinc-500 transition-transform duration-200 ${isDesktopLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isDesktopLangOpen && (
                <div 
                  className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-black/15 shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 text-zinc-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#b8860b] font-bold border-b border-black/10">
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
                      className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                        currentLang === lang.code
                          ? "bg-[#d4af37]/20 text-[#8b6508] font-bold"
                          : "text-zinc-700 hover:bg-black/5 hover:text-black"
                      }`}
                    >
                      <span>{lang.label}</span>
                      {currentLang === lang.code && <Check size={12} className="text-[#b8860b]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Offer / Quote Action Button */}
            <button
              suppressHydrationWarning
              onClick={() => triggerModal("offer", "Exclusive Wedding Season Gift Box")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#8b6508] bg-[#d4af37]/15 border border-[#d4af37]/40 hover:bg-[#d4af37]/30 transition-all duration-300 cursor-pointer uppercase tracking-wider whitespace-nowrap shrink-0"
            >
              <Sparkles size={12} className="text-[#8b6508]" />
              <span suppressHydrationWarning>{t.nav.offer}</span>
            </button>

            {/* Book Now (Solid Metallic Gold Button) */}
            <button
              suppressHydrationWarning
              onClick={() => triggerModal("booking", "Wedding & Event Photo Shoot")}
              className="px-4 py-2 rounded-full text-xs font-bold text-black bg-metallic-gold shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shrink-0 min-w-fit"
            >
              <span suppressHydrationWarning>{t.nav.bookNow}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile / Tablet View Controls (Zero Overflow, Fits perfectly on 320px-400px screens) */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Language Pill */}
            <div className="relative" ref={mobileLangRef}>
              <button
                type="button"
                suppressHydrationWarning
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileLangOpen((prev) => !prev);
                }}
                className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold text-zinc-900 bg-black/5 border border-black/15 cursor-pointer hover:bg-black/10 transition-colors whitespace-nowrap"
              >
                <Globe size={12} className="text-[#b8860b]" />
                <span suppressHydrationWarning>{translations[currentLang]?.langLabel || "EN"}</span>
              </button>

              {isMobileLangOpen && (
                <div 
                  className="absolute right-0 mt-2 w-40 rounded-2xl bg-white border border-black/15 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
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
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        currentLang === lang.code
                          ? "bg-[#d4af37]/25 text-[#8b6508] font-bold border border-[#d4af37]/40"
                          : "text-zinc-700 hover:bg-black/5 hover:text-black"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Mobile Offer Button (Visible on sm+, hidden on ultra-small screens to prevent wrap) */}
            <button
              onClick={() => triggerModal("offer", "Exclusive Wedding Season Gift Box")}
              className="hidden xs:flex px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#d4af37]/20 text-[#8b6508] border border-[#d4af37]/50 items-center gap-1 cursor-pointer shadow-sm whitespace-nowrap"
            >
              <Sparkles size={11} className="text-[#8b6508]" /> {t.nav.offer}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-900 bg-black/5 border border-black/15 hover:bg-black/10 focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              {isOpen ? <X className="block h-5 w-5 text-[#8b6508]" /> : <Menu className="block h-5 w-5 text-zinc-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Pure Luxury Light Theme, Zero Overflow) */}
      {isOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-black/15 shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <div className="px-4 sm:px-5 pt-4 pb-6 space-y-3">
            {/* Language Selector in Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-[#b8860b]" />
                <span className="text-xs text-zinc-800 font-bold">Language / மொழி:</span>
              </div>
              <div className="flex gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      currentLang === lang.code
                        ? "bg-[#d4af37] text-black font-black shadow-sm"
                        : "bg-black/5 text-zinc-700 hover:bg-black/10 border border-black/10"
                    }`}
                  >
                    {lang.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Nav Links Grid */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {mobileLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider ${
                    pathname === link.href
                      ? "bg-[#d4af37]/25 text-[#8b6508] border border-[#d4af37]/50"
                      : link.highlight
                      ? "bg-[#d4af37]/15 text-[#8b6508] border border-[#d4af37]/30"
                      : "text-zinc-800 hover:bg-black/5 hover:text-black"
                  }`}
                >
                  {link.highlight && <Package size={14} className="text-[#b8860b]" />}
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
                className="w-full py-3 rounded-xl text-xs font-bold text-zinc-900 bg-black/5 border border-black/15 text-center cursor-pointer hover:bg-black/10"
              >
                {t.nav.getQuote}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  triggerModal("offer", "Exclusive Wedding Season Gift Box");
                }}
                className="w-full py-3 rounded-xl text-xs font-bold text-[#8b6508] bg-[#d4af37]/25 border border-[#d4af37]/50 text-center cursor-pointer shadow-sm"
              >
                {t.nav.offer}
              </button>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                triggerModal("booking", "Wedding & Event Photo Shoot");
              }}
              className="block text-center w-full bg-metallic-gold text-black px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all mt-2 cursor-pointer"
            >
              {t.nav.bookNow}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
