"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GiftInput,
  GiftResult,
  getRelationshipProfile,
} from "@/lib/gift/schema";
import { getCurrentUser } from "@/lib/supabase/auth";

type StoredResult = {
  input: GiftInput;
  result: GiftResult;
};

type Refinement = "emotional" | "practical" | "cheaper" | "safer";

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
  const [refinement, setRefinement] = useState<Refinement | null>(null);
  const [hasUser, setHasUser] = useState<boolean | null>(null);
  const [hasPendingSave] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem("gift-glimpse-pending-save"));
  });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    getCurrentUser().then((user) => setHasUser(Boolean(user)));
  }, []);

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

  const { input } = stored;
  const result = normalizeResult(stored.result);
  const profile = getRelationshipProfile(input.relationship);
  const revealComplete = phase >= revealSteps.length;
  const refinedResult = refineResult(result, refinement);

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
                  {refinedResult.emotionalHeadline}
                </h1>
              </div>

              <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  <ResultBlock title="Emotional Read" body={refinedResult.giftDirection} />
                  <ResultBlock title="Best Gift Direction" body={refinedResult.primaryIdea} featured />
                  <ResultBlock title="Why This Works" body={refinedResult.whyItFits} />
                </div>
                <div className="space-y-5">
                  <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
                    <h2 className="text-lg font-black text-stone-950">
                      Adjust The Direction
                    </h2>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <RefineButton active={refinement === "emotional"} onClick={() => setRefinement("emotional")}>
                        More emotional
                      </RefineButton>
                      <RefineButton active={refinement === "practical"} onClick={() => setRefinement("practical")}>
                        More practical
                      </RefineButton>
                      <RefineButton active={refinement === "cheaper"} onClick={() => setRefinement("cheaper")}>
                        Lower cost
                      </RefineButton>
                      <RefineButton active={refinement === "safer"} onClick={() => setRefinement("safer")}>
                        Safer option
                      </RefineButton>
                    </div>
                  </div>
                  <ResultBlock title="How To Give It" body={refinedResult.deliveryNote} />
                  <ResultBlock title="Gift Note" body={refinedResult.giftNote} featured />
                  <ResultBlock title="Emotional Strategy" body={refinedResult.emotionalStrategy} />
                  <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
                    <h2 className="text-lg font-black text-stone-950">
                      Safer Alternatives
                    </h2>
                    <div className="mt-4 space-y-3">
                      {refinedResult.backupIdeas.map((idea) => (
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
                {hasUser ? (
                  <Link
                    href="/history"
                    className="rounded-2xl border border-stone-300 bg-white px-5 py-4 text-center font-bold text-stone-800"
                  >
                    View history
                  </Link>
                ) : (
                  <Link
                    href="/auth?next=/result"
                    className="rounded-2xl border border-stone-300 bg-white px-5 py-4 text-center font-bold text-stone-800"
                  >
                    {hasPendingSave ? "Sign in to save" : "Sign in"}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

function normalizeResult(result: GiftResult): GiftResult {
  return {
    ...result,
    giftNote:
      result.giftNote ||
      "I chose this because I wanted it to feel specific to you, not just appropriate for the occasion.",
    backupIdeas: result.backupIdeas || [],
  };
}

function refineResult(result: GiftResult, refinement: Refinement | null): GiftResult {
  if (!refinement) return result;

  const copy = { ...result, backupIdeas: [...result.backupIdeas] };

  if (refinement === "emotional") {
    return {
      ...copy,
      primaryIdea: `${result.primaryIdea} Add a handwritten note as the emotional centerpiece, and make the object feel secondary to the recognition.`,
      deliveryNote: `${result.deliveryNote} Pause before explaining it; let them discover the personal detail first.`,
      giftNote: `${result.giftNote} I chose this because I wanted you to feel seen, not simply celebrated.`,
    };
  }

  if (refinement === "practical") {
    return {
      ...copy,
      primaryIdea: `${result.primaryIdea} Choose the most usable version of this idea so it becomes part of their real routine.`,
      whyItFits: `${result.whyItFits} The practical version works because usefulness can still carry emotional care when the reason is specific.`,
      backupIdeas: result.backupIdeas.map((idea) => `${idea}, but choose the version they would actually use weekly`),
    };
  }

  if (refinement === "cheaper") {
    return {
      ...copy,
      primaryIdea: `Make a lower-cost version: ${result.primaryIdea} Keep the spend modest and put the effort into specificity, packaging, and the note.`,
      whyItFits: `${result.whyItFits} A smaller gift can feel more intimate when it proves attention instead of budget.`,
      backupIdeas: [
        "a handwritten letter paired with one symbolic object",
        "a printed photo or memory card set",
        "a planned hour together built around something they love",
      ],
    };
  }

  return {
    ...copy,
    primaryIdea: `Choose the safest version: a personal note plus one useful, tasteful item connected to the emotional read.`,
    whyItFits: `${result.whyItFits} This lowers the risk of feeling too intense while preserving the sense of being understood.`,
    deliveryNote: "Keep the handoff simple. Say why you chose it in one sentence, then let the note carry the rest.",
    backupIdeas: [
      "a premium consumable matched to their taste",
      "a simple keepsake with one private reference",
      "a low-pressure experience they can use when ready",
    ],
  };
}

function RefineButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-3 py-3 text-sm font-bold transition ${
        active
          ? "bg-stone-950 text-white shadow-lg shadow-black/15"
          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
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
