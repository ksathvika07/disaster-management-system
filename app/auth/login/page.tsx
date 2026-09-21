"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#203449] bg-[#0B1828] shadow-2xl md:grid-cols-2">

          {/* Left side */}
          <div className="hidden flex-col justify-between bg-[#0D1B2A] p-10 md:flex">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <ShieldAlert size={24} />
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-white">
                    DISASTER RESPONSE
                  </p>

                  <p className="text-xs text-[#8291A3]">
                    Intelligent Emergency Platform
                  </p>
                </div>
              </div>

              <h1 className="max-w-md text-4xl font-bold leading-tight">
                One platform for faster disaster response.
              </h1>

              <p className="mt-5 max-w-md leading-7 text-[#9BAABA]">
                Report emergencies, request assistance, track response
                operations and coordinate disaster management from one
                connected platform.
              </p>
            </div>

            <p className="text-sm text-[#617184]">
              Cloud-powered • AI-assisted • Location-aware
            </p>
          </div>

          {/* Form */}
          <div className="p-7 sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-medium text-red-400">
                SECURE ACCESS
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8F9EAF]">
                Sign in to access your disaster response dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#C6D0DB]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#263B50] bg-[#07111F] px-4 py-3 text-white outline-none transition placeholder:text-[#536375] focus:border-red-400"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#C6D0DB]"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#263B50] bg-[#07111F] px-4 py-3 text-white outline-none transition placeholder:text-[#536375] focus:border-red-400"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3.5 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#8291A3]">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-red-400 hover:text-red-300"
              >
                Create account
              </Link>
            </p>

            <div className="mt-6 border-t border-[#203449] pt-5 text-center">
              <Link
                href="/"
                className="text-sm text-[#718195] transition hover:text-white"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}