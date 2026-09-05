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
      <div className="absolute w-72 h-72 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-2xl bg-[#0b0c07]/90 border border-amber-500/30 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/90 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 opacity-90" />

          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 bg-amber-500/15 rounded-2xl flex items-center justify-center mb-4 border border-amber-400/30 text-amber-300 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
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
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm font-semibold"
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
              className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span suppressHydrationWarning>{loading ? "Authenticating..." : "Unlock Studio Dashboard"}</span>
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-zinc-400 hover:text-amber-400 font-semibold transition-colors">
                ← Return to Client Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
