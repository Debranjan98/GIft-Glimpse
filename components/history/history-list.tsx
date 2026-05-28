"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteGiftResult,
  fetchGiftHistory,
  GiftHistoryItem,
} from "@/lib/supabase/queries";
import { GiftResult } from "@/lib/gift/schema";
import { getCurrentUser } from "@/lib/supabase/auth";

function parseResult(value: string): Partial<GiftResult> {
  try {
    return JSON.parse(value);
  } catch {
    return { giftDirection: value };
  }
}

export default function HistoryList() {
  const [items, setItems] = useState<GiftHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      setSignedIn(Boolean(user));

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: historyError } = await fetchGiftHistory();
      if (historyError) {
        setError(historyError.message);
      }
      setItems((data || []) as GiftHistoryItem[]);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#fff7ed_48%,#fdf2f8_100%)] px-4 py-8 text-stone-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Gift memory archive</p>
            <h1 className="mt-2 max-w-3xl text-[2.35rem] font-black leading-[1.06] tracking-tight sm:text-[4rem]">
              Your private gift history.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
              Revisit saved reads, gift notes, and the emotional reasoning behind each idea.
            </p>
          </div>
          <Link
            href="/gift"
            className="rounded-2xl bg-stone-950 px-5 py-4 text-center font-bold text-white shadow-xl shadow-black/15"
          >
            New gift read
          </Link>
        </div>

        {signedIn === false && (
          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-8 text-center shadow-xl shadow-black/5">
            <h2 className="text-2xl font-black">Sign in to view history</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-stone-600">
              Gift history is private and only visible to the account that created it.
            </p>
            <Link
              href="/auth?next=/history"
              className="mt-6 inline-flex rounded-2xl bg-stone-950 px-5 py-4 font-bold text-white"
            >
              Sign in
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-[1.5rem] bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {loading && signedIn !== false && (
          <div className="rounded-[2rem] bg-white/70 p-8 text-stone-600 shadow-xl shadow-black/5">
            Loading your gift history...
          </div>
        )}

        {!loading && signedIn && items.length === 0 && (
          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-8 text-center shadow-xl shadow-black/5">
            <h2 className="text-2xl font-black">No gift reads yet</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-stone-600">
              Start with one person and Gift Glimpse will save the emotional direction here.
            </p>
          </div>
        )}

        <div className="grid gap-4">
          {signedIn && items.map((item, index) => {
            const parsed = parseResult(item.result);
            const primaryIdea = item.primary_idea || parsed.primaryIdea;
            const direction = parsed.giftDirection || item.result;
            const giftNote = parsed.giftNote;

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.28 }}
                className="grid gap-5 rounded-[1.75rem] border border-white/75 bg-white/75 p-5 shadow-xl shadow-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-2xl sm:p-6 lg:grid-cols-[0.85fr_1.15fr]"
              >
                <div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-bold text-white">
                      {item.relationship}
                    </span>
                    {item.emotional_tone && (
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
                        {item.emotional_tone}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-stone-950">
                    {item.recipient_name}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-stone-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                  {(item.occasion || item.budget) && (
                    <p className="mt-4 text-sm leading-6 text-stone-600">
                      {[item.occasion, item.budget].filter(Boolean).join(" | ")}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      const { error: deleteError } = await deleteGiftResult(item.id);
                      if (deleteError) {
                        setError(deleteError.message);
                        return;
                      }

                      setItems((current) =>
                        current.filter((historyItem) => historyItem.id !== item.id)
                      );
                    }}
                    className="mt-5 rounded-full border border-stone-200 bg-white/70 px-4 py-2 text-sm font-bold text-stone-500 transition hover:bg-white hover:text-rose-700"
                  >
                    Delete
                  </button>
                </div>

                <div className="space-y-4">
                  {primaryIdea && (
                    <div className="rounded-2xl bg-stone-950 p-4 text-white">
                      <p className="text-xs font-bold uppercase text-white/50">
                        Primary idea
                      </p>
                      <p className="mt-2 font-semibold leading-7">{primaryIdea}</p>
                    </div>
                  )}
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-bold uppercase text-stone-400">
                      Emotional direction
                    </p>
                    <p className="mt-2 line-clamp-4 leading-7 text-stone-600">
                      {direction}
                    </p>
                  </div>
                  {giftNote && (
                    <div className="rounded-2xl bg-amber-50 p-4">
                      <p className="text-xs font-bold uppercase text-amber-700/60">
                        Note idea
                      </p>
                      <p className="mt-2 leading-7 text-stone-700">{giftNote}</p>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
