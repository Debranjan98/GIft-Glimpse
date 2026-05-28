"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { saveGiftResult } from "@/lib/supabase/queries";
import { GiftInput, GiftResult } from "@/lib/gift/schema";

type PendingSave = {
  input: GiftInput;
  result: GiftResult;
};

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const next = searchParams.get("next") || "/gift";

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
    setMessage("");

    const action =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await action;

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    await savePendingResult();
    router.push(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fff7ed_0%,#fdf2f8_52%,#e0f2fe_100%)] px-4 py-8 text-stone-950">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl"
        >
          <p className="eyebrow">Private history</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">
            {mode === "signin" ? "Sign in to continue." : "Create your account."}
          </h1>
          <p className="mt-3 leading-7 text-stone-600">
            Your gift history is private and tied to your account.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="input-shell"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="input-shell"
              minLength={6}
              required
            />
          </div>

          {message && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-2xl bg-stone-950 px-5 py-4 font-bold text-white shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:bg-stone-800 disabled:cursor-default disabled:bg-stone-400"
          >
            {loading
              ? "One moment..."
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full rounded-2xl px-5 py-3 text-sm font-bold text-stone-600 transition hover:bg-white"
          >
            {mode === "signin"
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
