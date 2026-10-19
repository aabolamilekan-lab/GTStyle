"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2, Sparkles, Shield } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const [email, setEmail] = useState("admin@gtstyle.com");
  const [password, setPassword] = useState("Admin123!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === "UnauthorizedAccess"
      ? "Administrative access required. Please authenticate with executive credentials."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Invalid login credentials. Access denied.");
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrorMessage("An unexpected authentication error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-champagne/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8 bg-neutral-950/80 border border-neutral-800/90 p-8 sm:p-10 rounded-sm shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-champagne/30 bg-champagne/10 text-champagne text-[10px] uppercase tracking-[0.25em] font-sans">
            <Shield className="w-3 h-3" />
            <span>Admin Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-light tracking-widest text-champagne pt-1">
            GTSTYLE ADMIN
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-sans">
            Management Console
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 bg-red-950/40 border border-red-800/80 text-red-200 text-xs rounded-sm flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne pl-10"
                placeholder="admin@gtstyle.com"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne pl-10"
                placeholder="••••••••••••"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-champagne hover:bg-champagne-light text-obsidian font-semibold text-xs uppercase tracking-widest transition-all rounded-sm shadow-xl flex items-center justify-center space-x-2 disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Seed Credentials Hint Box */}
        <div className="p-3.5 bg-neutral-900/60 border border-neutral-800/80 rounded-sm space-y-1 text-[11px] text-neutral-400">
          <span className="text-champagne font-semibold block uppercase tracking-wider text-[10px]">
            Default Seed Credentials:
          </span>
          <p className="font-mono text-neutral-300">Email: admin@gtstyle.com</p>
          <p className="font-mono text-neutral-300">Password: Admin123!</p>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-champagne transition-colors uppercase tracking-widest"
          >
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian" />}>
      <LoginForm />
    </Suspense>
  );
}
