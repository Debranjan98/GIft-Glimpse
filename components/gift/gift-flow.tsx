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
import { getCurrentUser } from "@/lib/supabase/auth";

type Stage = "intro" | "relationship" | "personality" | "context" | "details";

const stages: Stage[] = ["intro", "relationship", "personality", "context", "details"];

export default function GiftFlow() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("intro");
  const [recipientName, setRecipientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [relationship, setRelationship] = useState<RelationshipType>("partner");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [emotionalContext, setEmotionalContext] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reward, setReward] = useState("Start with the person. The rest will get easier.");

  const profile = getRelationshipProfile(relationship);
  const stageIndex = stages.indexOf(stage);
  const displayStep =
    stage === "personality" ? stageIndex + 1 + questionIndex * 0.25 : stageIndex + 1;
  const currentQuestion = personalityQuestions[questionIndex];

  const canContinue = useMemo(() => {
    if (stage === "intro") return recipientName.trim().length > 1;
    if (stage === "personality") return Boolean(answers[currentQuestion.id]);
    if (stage === "details") return occasion.trim().length > 0;
    return true;
  }, [answers, currentQuestion.id, occasion, recipientName, stage]);

  function completeStep(message: string, nextStage: Stage) {
    setReward(message);
    setStage(nextStage);
  }

  function goBack() {
    if (stage === "personality" && questionIndex > 0) {
      setQuestionIndex((current) => current - 1);
      return;
    }

    const previousStage = stages[Math.max(stageIndex - 1, 0)];
    setStage(previousStage);
  }

  function setAnswer(questionId: string, answer: string) {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    setReward("Captured. That choice will shape the emotional tone.");
  }

  function handlePersonalityContinue() {
    if (questionIndex < personalityQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setReward("Good. One small answer at a time is enough.");
      return;
    }

    completeStep(
      "Great. You have enough signal. The next note is optional, but powerful.",
      "context"
    );
  }

  async function handleGenerate() {
    setLoading(true);
    setError("");

    const input: GiftInput = {
      recipientName,
      age,
      gender,
      relationship,
      occasion,
      budget,
      personalityTraits: [],
      emotionalSignals: Object.values(answers),
      emotionalContext,
    };

    try {
      const response = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await response.json();

      if (!response.ok || !data.result) {
        throw new Error(data.error || "Gift generation failed. Please try again.");
      }

      window.localStorage.setItem(
        "gift-glimpse-result",
        JSON.stringify({ input, result: data.result })
      );
      const user = await getCurrentUser();

      if (user) {
        const { error: saveError } = await saveGiftResult(input, data.result);
        if (saveError) {
          setReward("Your result is ready, but saving failed. You can still view it now.");
        }
      } else {
        window.localStorage.setItem(
          "gift-glimpse-pending-save",
          JSON.stringify({ input, result: data.result })
        );
      }

      router.push("/result");
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <section className={`min-h-screen bg-gradient-to-br ${profile.softGradient} px-4 py-6 text-stone-950 sm:px-6 lg:px-8`}>
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <div className="mb-7 rounded-2xl border border-white/70 bg-white/55 p-3 shadow-xl shadow-black/5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-stone-600">
              Step {Math.ceil(displayStep)} of {stages.length}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${profile.gradient}`}
                animate={{ width: `${(displayStep / stages.length) * 100}%` }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[0.82fr_1.08fr]">
          <aside className="space-y-6">
            <div className={`inline-flex rounded-full bg-gradient-to-r ${profile.gradient} px-4 py-2 text-sm font-bold text-white shadow-lg ${profile.glow}`}>
              {profile.shortLabel} mode
            </div>
            <h1 className="max-w-lg text-[2.35rem] font-black leading-[1.08] tracking-tight text-stone-950 sm:text-[3.6rem]">
              Just answer the next small question.
            </h1>
            <p className="max-w-md text-base leading-7 text-stone-600 sm:text-lg">
              Gift Glimpse builds the emotional read progressively, so you never have to fill a long form.
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

          <div className="rounded-[2rem] border border-white/75 bg-white/76 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6">
            {stage !== "intro" && (
              <button
                type="button"
                onClick={goBack}
                className="mb-5 inline-flex items-center rounded-full border border-stone-200 bg-white/85 px-4 py-2 text-sm font-black text-stone-800 shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
              >
                Back
              </button>
            )}
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
                  <div className="grid gap-3 sm:grid-cols-[0.55fr_1fr]">
                    <div>
                      <label className="mb-2 block text-sm font-black text-stone-700">
                        Age
                      </label>
                      <input
                        inputMode="numeric"
                        value={age}
                        onChange={(event) =>
                          setAge(event.target.value.replace(/[^0-9]/g, "").slice(0, 3))
                        }
                        placeholder="28"
                        className="input-shell"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-black text-stone-700">
                        Gender
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {["Woman", "Man", "Skip"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setGender(option === "Skip" ? "Prefer not to say" : option)
                            }
                            className={`rounded-2xl px-3 py-3 text-sm font-bold transition ${
                              gender === option ||
                              (option === "Skip" && gender === "Prefer not to say")
                                ? "bg-stone-950 text-white shadow-lg shadow-black/15"
                                : "bg-white/75 text-stone-600 hover:bg-white"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="-mt-1 text-sm leading-6 text-stone-500">
                    Optional, but helpful for age-appropriate and more realistic recommendations.
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
                  <p className="eyebrow">Relationship</p>
                  <h2 className="panel-title">Who are they to you?</h2>
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
                  <p className="eyebrow">
                    Feeling {questionIndex + 1} of {personalityQuestions.length}
                  </p>
                  <h2 className="panel-title">{currentQuestion.prompt}</h2>
                  <p className="-mt-2 text-sm font-semibold text-stone-500">
                    {currentQuestion.encouragement}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswer(currentQuestion.id, option)}
                        className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                          answers[currentQuestion.id] === option
                            ? "border-stone-950 bg-stone-950 text-white shadow-xl shadow-black/15"
                            : "border-white bg-white/65 text-stone-700 hover:-translate-y-0.5 hover:bg-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <PrimaryButton
                    disabled={!canContinue}
                    onClick={handlePersonalityContinue}
                  >
                    {questionIndex < personalityQuestions.length - 1
                      ? "Next"
                      : "Continue"}
                  </PrimaryButton>
                </MotionPanel>
              )}

              {stage === "context" && (
                <MotionPanel key="context">
                  <div className="rounded-[1.5rem] border border-amber-200/70 bg-amber-50/80 p-4">
                    <p className="text-xs font-black uppercase text-amber-700">
                      Optional, but most recommended
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-stone-700">
                      One real detail usually improves the gift idea more than any other answer.
                    </p>
                  </div>
                  <h2 className="panel-title">What would make this unmistakably for them?</h2>
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
                  <p className="-mt-2 text-sm leading-6 text-stone-500">
                    You can skip this, but the best recommendations come from a memory,
                    habit, private joke, or emotional detail only you would know.
                  </p>
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
                    placeholder="Birthday, apology, just because"
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
                  {error && (
                    <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                      {error}
                    </p>
                  )}
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
