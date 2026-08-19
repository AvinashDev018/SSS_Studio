"use client";

import { loginAdmin } from "@/app/actions/auth";
import { Lock } from "lucide-react";
import { useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 dark:bg-black/20 border border-zinc-800 dark:border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          {/* Subtle gradient effect in the background */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
          
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <Lock className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Admin Access</h2>
            <p className="text-zinc-400 mt-2 text-sm">Please enter the secret password to view bookings.</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                name="password"
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                placeholder="Password"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full bg-[#D4AF37] hover:bg-[#c5a028] text-black font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
