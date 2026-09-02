"use client";

import { loginAdmin } from "@/app/actions/auth";
import { Lock, Shield, Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    setError("");
    const result = await loginAdmin(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Background ambient glow */}
      <div className="absolute w-72 h-72 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-2xl bg-[#0a110f]/90 border border-teal-500/20 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/90 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 opacity-80" />

          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-4 border border-teal-500/30 text-teal-400 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> SSS Photography Studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Studio Admin Portal
            </h2>
            <p className="text-zinc-400 mt-2 text-xs sm:text-sm">
              Enter your master administrative key to manage bookings, CRM orders, and gallery.
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Admin Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoFocus
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-[#080c0b] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm"
                  placeholder="Enter admin password..."
                />
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs sm:text-sm text-center bg-red-500/10 py-2.5 px-3 rounded-xl border border-red-500/20 flex items-center justify-center gap-2">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400 hover:opacity-95 shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span suppressHydrationWarning>{loading ? "Authenticating..." : "Unlock Studio Dashboard"}</span>
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-zinc-500 hover:text-teal-400 transition-colors">
                ← Return to Client Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
