"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { saveGiftResult } from "@/lib/supabase/queries";
import { getAppUrl } from "@/lib/app-url";
import type { GiftInput, GiftResult } from "@/lib/gift/schema";

type PendingSave = {
  input: GiftInput;
  result: GiftResult;
};

type AuthMode = "signin" | "signup";

const copy = {
  signin: {
    eyebrow: "Private history",
    title: "Sign in to Gift Glimpse",
    description: "Open your private gift history and saved recommendations.",
    googleHint: "Use your Google account",
    emailLabel: "Email address",
    emailPlaceholder: "name@gmail.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Your password",
    primaryAction: "Sign in",
    footerPrompt: "New here?",
    footerAction: "Create an account",
    footerHref: "/auth/signup",
    accountNote: "Your gift history stays tied to your account.",
  },
  signup: {
    eyebrow: "Private history",
    title: "Create your account",
    description: "Save gift reads and return to them when you need them.",
    googleHint: "Use your Google account",
    emailLabel: "Email address",
    emailPlaceholder: "name@gmail.com",
    passwordLabel: "Create a password",
    passwordPlaceholder: "Create a secure password",
    primaryAction: "Create account",
    footerPrompt: "Already have an account?",
    footerAction: "Sign in",
    footerHref: "/auth/signin",
    accountNote: "We keep saved recommendations private to you.",
  },
} satisfies Record<
  AuthMode,
  {
    eyebrow: string;
    title: string;
    description: string;
    googleHint: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    primaryAction: string;
    footerPrompt: string;
    footerAction: string;
    footerHref: string;
    accountNote: string;
  }
>;

export default function AuthForm({
  mode,
  next = "/gift",
  message = "",
}: {
  mode: AuthMode;
  next?: string;
  message?: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(message);
  const [loading, setLoading] = useState(false);
  const googleAuthEnabled =
    process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  async function savePendingResult() {
    const raw = window.localStorage.getItem("gift-glimpse-pending-save");
    if (!raw) return;

    const pending = JSON.parse(raw) as PendingSave;
    const { error } = await saveGiftResult(pending.input, pending.result);

    if (!error) {
      window.localStorage.removeItem("gift-glimpse-pending-save");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const { data, error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    if (mode === "signup" && !data.session) {
      setStatus("Check your email to confirm your account, then come back to sign in.");
      setLoading(false);
      return;
    }

    await savePendingResult();
    router.push(next);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    if (!googleAuthEnabled) {
      setStatus(
        "Google sign-in is not enabled in Supabase yet. Use email sign-in for now, or enable Google in the Supabase Auth provider settings."
      );
      return;
    }

    setLoading(true);
    setStatus("");

    const redirectTo = `${getAppUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setStatus(error.message);
      setLoading(false);
    }
  }

  const content = copy[mode];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f7f7f5] px-4 py-5 text-stone-950 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-6.5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-2xl shadow-stone-950/8 lg:grid-cols-[0.82fr_1fr]">
          <aside className="hidden bg-stone-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-white/45">
                Gift Glimpse account
              </p>
              <h1 className="mt-4 max-w-xs text-3xl font-black leading-tight">
                Private reads for personal decisions.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/62">
                Keep emotional recommendations, notes, and recipient context scoped to your account.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {[
                "Account-scoped history",
                "Google or email access",
                "Saved recommendations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-sm">
              <p className="text-xs font-black uppercase text-stone-500">
                {content.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-stone-950 sm:text-3xl">
                {content.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {content.description}
              </p>

              <div className="mt-6 space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                aria-label={`${content.primaryAction} with Google`}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-black text-stone-900 shadow-sm shadow-black/5 transition duration-200 hover:border-stone-400 hover:bg-stone-50 focus:outline-none focus:ring-4 focus:ring-stone-200 disabled:cursor-default disabled:opacity-60"
              >
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-200 text-xs font-black text-stone-700"
                >
                  G
                </span>
                Continue with Google
              </button>
              {!googleAuthEnabled && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-800">
                  Google is not enabled for this Supabase project yet. Email sign-in is available.
                </p>
              )}

              <div className="flex items-center gap-3 text-[0.68rem] font-black uppercase text-stone-400">
                <span className="h-px flex-1 bg-stone-200" />
                Or use email
                <span className="h-px flex-1 bg-stone-200" />
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-stone-700">
                  {content.emailLabel}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={content.emailPlaceholder}
                  autoComplete="email"
                  className="input-shell"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-stone-700">
                  {content.passwordLabel}
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={content.passwordPlaceholder}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  minLength={6}
                  className="input-shell"
                  required
                />
              </label>
              </div>

              {status && (
                <p className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {status}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-stone-950 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-black/15 transition duration-200 hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300 disabled:cursor-default disabled:bg-stone-500"
              >
                {loading ? "One moment..." : content.primaryAction}
              </button>

              <p className="mt-4 text-center text-sm leading-6 text-stone-500">
                {content.footerPrompt}{" "}
                <Link
                  href={`${content.footerHref}?next=${encodeURIComponent(next)}`}
                  className="font-bold text-stone-950 underline decoration-stone-300 underline-offset-4 transition hover:decoration-stone-950"
                >
                  {content.footerAction}
                </Link>
              </p>

              <p className="mt-3 text-center text-xs leading-5 text-stone-400">
                {content.accountNote}
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
