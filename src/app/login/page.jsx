"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import { 
  Camera, 
  Mail, 
  Lock, 
  User, 
  Phone,
  ArrowRight,
  Github, 
  Loader2
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlError = searchParams?.get("error");
    if (urlError === "OAuthSignin" || urlError === "OAuthCallback") {
      setError("Google Login is not configured yet or failed. Please contact the administrator.");
    } else if (urlError) {
      setError("An authentication error occurred. Please try again.");
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (res?.error) {
          setError(res.error);
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const res = await registerUser(formData);
        if (res.success) {
          // Registration successful, log them in
          const loginRes = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });
          
          if (!loginRes?.error) {
            router.push("/");
            router.refresh();
          } else {
            setError(loginRes.error);
          }
        } else {
          setError(res.error || "Registration failed");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl w-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Image/Branding */}
        <div className="md:w-1/2 relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop"
            alt="Studio photography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 p-12 z-20">
            <h2 className="text-4xl font-serif text-white mb-4">Capture the Moment</h2>
            <p className="text-zinc-300 text-lg">
              Join SSS Studio to book sessions, manage your gallery, and preserve your memories forever.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-5 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              SSS Studio
            </h1>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-semibold mb-1">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-sm text-zinc-400">
              {isLogin 
                ? "Enter your details to access your account." 
                : "Sign up to start booking your sessions."}
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2.5 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-sm text-zinc-400 font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all text-sm"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-zinc-400 font-medium">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all text-sm"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-sm text-zinc-400 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-zinc-400 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-sm"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({ name: "", email: "", password: "", phone: "" });
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
