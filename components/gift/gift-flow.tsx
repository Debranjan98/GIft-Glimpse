"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RelationshipCards from "./relationship-cards";
import {
  GiftInput,
  RelationshipType,
  getRelationshipProfile,
  personalityQuestions,
} from "@/lib/gift/schema";
import { saveGiftResult } from "@/lib/supabase/queries";

const personalityTraits = [
  "Keeps tiny details",
  "Laughs first",
  "Feels deeply",
  "Values usefulness",
  "Loves beauty",
  "Needs reassurance",
  "Protects traditions",
  "Craves novelty",
];

type Stage = "intro" | "relationship" | "personality" | "context" | "details";

const stages: Stage[] = ["intro", "relationship", "personality", "context", "details"];

export default function GiftFlow() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("intro");
  const [recipientName, setRecipientName] = useState("");
  const [relationship, setRelationship] = useState<RelationshipType>("partner");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [emotionalContext, setEmotionalContext] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [reward, setReward] = useState("Start with the person. The rest will get easier.");

  const profile = getRelationshipProfile(relationship);
  const stageIndex = stages.indexOf(stage);
  const progress = Math.round(((stageIndex + 1) / stages.length) * 100);
  const answeredMcqs = Object.values(answers).filter(Boolean).length;

  const canContinue = useMemo(() => {
    if (stage === "intro") return recipientName.trim().length > 1;
    if (stage === "personality") return selectedTraits.length > 0 && answeredMcqs >= 2;
    if (stage === "details") return occasion.trim().length > 0;
    return true;
  }, [answeredMcqs, occasion, recipientName, selectedTraits, stage]);

  function completeStep(message: string, nextStage: Stage) {
    setReward(message);
    setStage(nextStage);
  }

  function toggleTrait(trait: string) {
    setSelectedTraits((current) => {
      const next = current.includes(trait)
        ? current.filter((item) => item !== trait)
        : [...current, trait];

      if (next.length === 1) {
        setReward("Good signal. The recommendation is already getting less generic.");
      }

      if (next.length === 3) {
        setReward("That is a strong emotional sketch. Keep it selective.");
      }

      return next;
    });
  }

  function setAnswer(questionId: string, answer: string) {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    setReward("Captured. That choice will shape the emotional tone.");
  }

  async function handleGenerate() {
    setLoading(true);

    const input: GiftInput = {
      recipientName,
      relationship,
      occasion,
      budget,
      personalityTraits: selectedTraits,
      emotionalSignals: Object.values(answers),
      emotionalContext,
    };

    const response = await fetch("/api/gift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await response.json();

    if (data.result) {
      await saveGiftResult(input, data.result);
      window.localStorage.setItem(
        "gift-glimpse-result",
        JSON.stringify({ input, result: data.result })
      );
      router.push("/result");
    }

    setLoading(false);
  }

  return (
    <section className={`min-h-screen bg-gradient-to-br ${profile.softGradient} px-4 py-6 text-stone-950 sm:px-6 lg:px-8`}>
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <div className="mb-7 rounded-full border border-white/70 bg-white/55 p-2 shadow-xl shadow-black/5 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${profile.gradient}`}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>
            <span className="pr-2 text-xs font-bold text-stone-500">
              {progress}%
            </span>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-6">
            <div className={`inline-flex rounded-full bg-gradient-to-r ${profile.gradient} px-4 py-2 text-sm font-bold text-white shadow-lg ${profile.glow}`}>
              {profile.shortLabel} mode
            </div>
            <h1 className="max-w-lg text-[2.55rem] font-black leading-[1.06] tracking-tight text-stone-950 sm:text-5xl">
              Make the gift feel like you really noticed.
            </h1>
            <p className="max-w-md text-base leading-7 text-stone-600 sm:text-lg">
              Answer in fragments. Choose what feels true. The experience will turn the emotional pattern into a gift direction.
            </p>
            <motion.div
              key={reward}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/70 bg-white/60 p-4 text-sm font-semibold leading-6 text-stone-700 shadow-lg shadow-black/5"
            >
              {stage === "details" ? "Almost there. One practical detail, then the reveal." : reward}
            </motion.div>
          </aside>

          <div className="rounded-[2rem] border border-white/75 bg-white/70 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6">
            <AnimatePresence mode="wait">
              {stage === "intro" && (
                <MotionPanel key="intro">
                  <p className="eyebrow">First, who are we thinking about?</p>
                  <h2 className="panel-title">Name the person, not the gift.</h2>
                  <input
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                    placeholder="Adrija"
                    className="input-shell"
                  />
                  <p className="-mt-2 text-sm font-semibold text-stone-500">
                    Even a nickname works.
                  </p>
                  <PrimaryButton
                    disabled={!canContinue}
                    onClick={() =>
                      completeStep("Nice. Now we can make the relationship do some emotional work.", "relationship")
                    }
                  >
                    Continue
                  </PrimaryButton>
                </MotionPanel>
              )}

              {stage === "relationship" && (
                <MotionPanel key="relationship">
                  <p className="eyebrow">Relationship changes everything</p>
                  <h2 className="panel-title">What kind of closeness are we designing for?</h2>
                  <RelationshipCards
                    value={relationship}
                    onChange={(value) => {
                      setRelationship(value);
                      setReward(getRelationshipProfile(value).completionReward);
                    }}
                  />
                  <PrimaryButton
                    onClick={() => completeStep(profile.completionReward, "personality")}
                  >
                    This feels right
                  </PrimaryButton>
                </MotionPanel>
              )}

              {stage === "personality" && (
                <MotionPanel key="personality">
                  <p className="eyebrow">Build the emotional read</p>
                  <h2 className="panel-title">Pick what sounds like {recipientName || "them"}.</h2>
                  <div className="flex flex-wrap gap-2">
                    {personalityTraits.map((trait) => (
                      <ChoicePill
                        key={trait}
                        selected={selectedTraits.includes(trait)}
                        onClick={() => toggleTrait(trait)}
                      >
                        {trait}
                      </ChoicePill>
                    ))}
                  </div>
                  <div className="mt-6 space-y-5">
                    {personalityQuestions.map((question) => (
                      <div key={question.id}>
                        <p className="mb-1 text-sm font-bold text-stone-900">
                          {question.prompt}
                        </p>
                        <p className="mb-3 text-xs font-semibold text-stone-500">
                          {question.encouragement}
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {question.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setAnswer(question.id, option)}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                                answers[question.id] === option
                                  ? "border-stone-950 bg-stone-950 text-white"
                                  : "border-white bg-white/65 text-stone-700 hover:bg-white"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <PrimaryButton
                    disabled={!canContinue}
                    onClick={() =>
                      completeStep("Great. You have enough signal. The next note is optional, but powerful.", "context")
                    }
                  >
                    Keep going
                  </PrimaryButton>
                </MotionPanel>
              )}

              {stage === "context" && (
                <MotionPanel key="context">
                  <p className="eyebrow">Highly recommended</p>
                  <h2 className="panel-title">Add the detail only you would know.</h2>
                  <textarea
                    value={emotionalContext}
                    onChange={(event) => {
                      setEmotionalContext(event.target.value);
                      if (event.target.value.length > 40) {
                        setReward("That is the kind of detail that makes a gift feel impossible to copy.");
                      }
                    }}
                    placeholder={profile.placeholder}
                    className="input-shell min-h-[180px] resize-none leading-7"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <SecondaryButton onClick={() => completeStep("No problem. The choices still carry strong signal.", "details")}>
                      Skip for now
                    </SecondaryButton>
                    <PrimaryButton onClick={() => completeStep("Excellent. This should make the reveal feel more cinematic.", "details")}>
                      Use this context
                    </PrimaryButton>
                  </div>
                </MotionPanel>
              )}

              {stage === "details" && (
                <MotionPanel key="details">
                  <p className="eyebrow">Almost there</p>
                  <h2 className="panel-title">Give the idea a real-world shape.</h2>
                  <input
                    value={occasion}
                    onChange={(event) => setOccasion(event.target.value)}
                    placeholder="Birthday"
                    className="input-shell"
                  />
                  <input
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder="$80 or flexible"
                    className="input-shell"
                  />
                  <PrimaryButton disabled={!canContinue || loading} onClick={handleGenerate}>
                    {loading ? "Preparing the reveal..." : "Reveal the gift direction"}
                  </PrimaryButton>
                </MotionPanel>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function MotionPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="space-y-5"
    >
      {children}
    </motion.div>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-2 w-full rounded-2xl bg-stone-950 px-5 py-4 text-base font-bold text-white shadow-xl shadow-black/15 transition duration-200 hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-2xl hover:shadow-black/20 active:translate-y-0 active:scale-[0.99] disabled:translate-y-0 disabled:cursor-default disabled:bg-stone-400 disabled:text-white/90 disabled:shadow-lg disabled:shadow-black/10"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-stone-300 bg-white/60 px-5 py-4 text-base font-bold text-stone-700 transition hover:bg-white"
    >
      {children}
    </button>
  );
}

function ChoicePill({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
        selected
          ? "border-stone-950 bg-stone-950 text-white"
          : "border-white bg-white/65 text-stone-700 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}
