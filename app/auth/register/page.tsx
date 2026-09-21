"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
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

          {/* Left */}
          <div className="hidden flex-col justify-between bg-[#0D1B2A] p-10 md:flex">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <ShieldAlert size={24} />
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-[0.18em]">
                    DISASTER RESPONSE
                  </p>

                  <p className="text-xs text-[#8291A3]">
                    Intelligent Emergency Platform
                  </p>
                </div>
              </div>

              <h1 className="max-w-md text-4xl font-bold leading-tight">
                Create your emergency response account.
              </h1>

              <p className="mt-5 max-w-md leading-7 text-[#9BAABA]">
                Join the platform to report disasters, request emergency
                assistance and stay connected during critical situations.
              </p>
            </div>

            <p className="text-sm text-[#617184]">
              Your account starts with Citizen access.
            </p>
          </div>

          {/* Form */}
          <div className="p-7 sm:p-10">
            <div className="mb-7">
              <p className="text-sm font-medium text-red-400">
                REGISTRATION
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Create account
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8F9EAF]">
                Register to access the disaster response platform.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-[#C6D0DB]"
                >
                  Full name
                </label>

                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-[#263B50] bg-[#07111F] px-4 py-3 text-white outline-none placeholder:text-[#536375] focus:border-red-400"
                />
              </div>

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
                  className="w-full rounded-xl border border-[#263B50] bg-[#07111F] px-4 py-3 text-white outline-none placeholder:text-[#536375] focus:border-red-400"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-[#C6D0DB]"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-[#263B50] bg-[#07111F] px-4 py-3 text-white outline-none placeholder:text-[#536375] focus:border-red-400"
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
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-[#263B50] bg-[#07111F] px-4 py-3 text-white outline-none placeholder:text-[#536375] focus:border-red-400"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#C6D0DB]"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-[#263B50] bg-[#07111F] px-4 py-3 text-white outline-none placeholder:text-[#536375] focus:border-red-400"
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
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#8291A3]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-red-400 hover:text-red-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}