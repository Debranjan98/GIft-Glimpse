"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GiftInput,
  GiftResult,
  getRelationshipProfile,
} from "@/lib/gift/schema";

type StoredResult = {
  input: GiftInput;
  result: GiftResult;
};

const revealSteps = [
  "Reading the relationship signal",
  "Finding the emotional center",
  "Matching tone, budget, and occasion",
  "Composing the reveal",
];

export default function ResultReveal() {
  const [stored] = useState<StoredResult | null>(() => {
    if (typeof window === "undefined") return null;

    const raw = window.localStorage.getItem("gift-glimpse-result");
    return raw ? JSON.parse(raw) : null;
  });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phase >= revealSteps.length) return;

    const timer = window.setTimeout(() => setPhase((current) => current + 1), 700);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!stored) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-rose-50 px-4 text-center">
        <div className="max-w-md rounded-[2rem] bg-white p-8 shadow-2xl shadow-black/10">
          <h1 className="text-3xl font-black text-stone-950">No reveal yet</h1>
          <p className="mt-3 text-stone-600">
            Start a gift read and the cinematic result will appear here.
          </p>
          <Link
            href="/gift"
            className="mt-6 inline-flex rounded-2xl bg-stone-950 px-5 py-3 font-bold text-white"
          >
            Start now
          </Link>
        </div>
      </main>
    );
  }

  const { input, result } = stored;
  const profile = getRelationshipProfile(input.relationship);
  const revealComplete = phase >= revealSteps.length;

  return (
    <main className={`min-h-screen bg-gradient-to-br ${profile.softGradient} px-4 py-8 text-stone-950 sm:px-6 lg:px-8`}>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <div className="w-full">
          {!revealComplete ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto max-w-2xl text-center"
            >
              <div className={`mx-auto mb-8 h-28 w-28 rounded-full bg-gradient-to-br ${profile.gradient} shadow-2xl ${profile.glow}`} />
              <motion.h1
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black tracking-tight sm:text-6xl"
              >
                {revealSteps[Math.min(phase, revealSteps.length - 1)]}
              </motion.h1>
              <p className="mt-5 text-lg font-semibold text-stone-600">
                This is tuned for {profile.label.toLowerCase()} energy: {profile.tone}.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-[2rem] border border-white/75 bg-white/75 shadow-2xl shadow-black/10 backdrop-blur-xl"
            >
              <div className={`bg-gradient-to-r ${profile.gradient} p-6 text-white sm:p-8`}>
                <p className="text-sm font-bold uppercase text-white/75">
                  Gift Glimpse reveal
                </p>
                <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">
                  {result.emotionalHeadline}
                </h1>
              </div>

              <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  <ResultBlock title="Gift Direction" body={result.giftDirection} />
                  <ResultBlock title="Primary Idea" body={result.primaryIdea} featured />
                  <ResultBlock title="Why This Fits" body={result.whyItFits} />
                </div>
                <div className="space-y-5">
                  <ResultBlock title="Emotional Strategy" body={result.emotionalStrategy} />
                  <ResultBlock title="How To Give It" body={result.deliveryNote} />
                  <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
                    <h2 className="text-lg font-black text-stone-950">
                      Backup Ideas
                    </h2>
                    <div className="mt-4 space-y-3">
                      {result.backupIdeas.map((idea) => (
                        <div
                          key={idea}
                          className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-700"
                        >
                          {idea}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-stone-200 p-5 sm:flex-row sm:p-8">
                <Link
                  href="/gift"
                  className="rounded-2xl bg-stone-950 px-5 py-4 text-center font-bold text-white"
                >
                  Create another
                </Link>
                <Link
                  href="/history"
                  className="rounded-2xl border border-stone-300 bg-white px-5 py-4 text-center font-bold text-stone-800"
                >
                  View history
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

function ResultBlock({
  title,
  body,
  featured,
}: {
  title: string;
  body: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border p-5 ${
        featured
          ? "border-stone-950 bg-stone-950 text-white"
          : "border-stone-200 bg-white text-stone-800"
      }`}
    >
      <h2 className={`text-lg font-black ${featured ? "text-white" : "text-stone-950"}`}>
        {title}
      </h2>
      <p className={`mt-3 leading-7 ${featured ? "text-white/80" : "text-stone-600"}`}>
        {body}
      </p>
    </div>
  );
}
