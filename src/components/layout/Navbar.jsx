"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Camera, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50 supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-zinc-950/40 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="font-serif font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
            SSS STUDIO
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? "text-zinc-900 dark:text-white font-semibold"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  } px-3 py-2 text-sm`}
                >
                  {link.name}
                </Link>
              ))}
              
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}

              <Link
                href="/book"
                className="bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Book Session
              </Link>


            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
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
        <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`${
                  pathname === link.href
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                {link.name}
              </Link>
            ))}
            {mounted && (
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                {theme === "dark" ? <><Sun className="w-5 h-5" /> Light Mode</> : <><Moon className="w-5 h-5" /> Dark Mode</>}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
