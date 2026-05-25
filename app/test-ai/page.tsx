"use client";

import { saveGiftResult } from "@/services/supabase";
import { useState } from "react";

export default function TestAIPage() {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [personality, setPersonality] = useState("");
  const [memory, setMemory] = useState("");
  const [budget, setBudget] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const personalityOptions = [
    "Emotional",
    "Funny",
    "Romantic",
    "Creative",
    "Introvert",
    "Soft-hearted",
    "Chaotic",
    "Ambitious",
  ];
 

  async function handleGenerate() {
    setLoading(true);

    const prompt = `
Recipient Name: ${name}
Relationship: ${relationship}
Personality: ${personality}
Special Memory: ${memory}
Budget: ${budget}
`;

    const res = await fetch("/api/gift", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await res.json();

    setResponse(data.result);

    await saveGiftResult(
      name,
      relationship,
      data.result
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">

        <div className="space-y-3 mb-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Gift Glimpse
          </h1>

          <p className="text-zinc-400 text-lg">
            Emotion-first gifting intelligence.
          </p>
        </div>

        <input
          placeholder="Recipient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 p-4 rounded-2xl outline-none focus:border-white/30 transition"
        />

        <input
          placeholder="Relationship"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 p-4 rounded-2xl outline-none focus:border-white/30 transition"
        />

<div className="space-y-4">

<div className="space-y-1">
  <p className="text-zinc-200 text-sm font-medium">
    Choose their personality
  </p>

  <p className="text-zinc-500 text-sm">
    Highly recommended for more emotionally accurate gift directions.
  </p>
</div>

<div className="flex flex-wrap gap-3">

  {personalityOptions.map((option) => (
    <button
      key={option}
      type="button"
      onClick={() => setPersonality(option)}
      className={`px-4 py-2 rounded-full border transition duration-300 ${
        personality === option
          ? "bg-white text-black border-white"
          : "bg-white/5 border-white/10 text-white hover:border-white/30"
      }`}
    >
      {option}
    </button>
  ))}

</div>

<textarea
  placeholder="Optional: describe them in your own words..."
  value={memory}
  onChange={(e) => setMemory(e.target.value)}
  className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 p-4 rounded-2xl min-h-[100px] outline-none focus:border-white/30 transition"
/>

<p className="text-zinc-500 text-sm leading-6">
  Example: “She remembers tiny details, loves handwritten things, and gets emotional over memories.”
</p>

</div>
        <input
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 p-4 rounded-2xl outline-none focus:border-white/30 transition"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-white text-black p-4 rounded-2xl text-lg font-semibold hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10 transition duration-300 disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "Generate Emotional Gift Direction"}
        </button>

        {response && (
          <div className="grid gap-5 mt-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                <p className="text-zinc-400 text-sm mb-2">
                  Emotional Depth
                </p>

                <h3 className="text-3xl font-bold">
                  92%
                </h3>
              </div>

              <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                <p className="text-zinc-400 text-sm mb-2">
                  Personalization
                </p>

                <h3 className="text-3xl font-bold">
                  High
                </h3>
              </div>

              <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                <p className="text-zinc-400 text-sm mb-2">
                  Budget Match
                </p>

                <h3 className="text-3xl font-bold">
                  Excellent
                </h3>
              </div>

            </div>

            <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/20 hover:border-white/50 hover:shadow-2xl hover:shadow-white/10 transition duration-300 rounded-2xl p-6 space-y-6">

              <div>
                <h2 className="text-2xl font-bold mb-3">
                  Gift Direction
                </h2>

                <p className="text-zinc-200 leading-8">
                  Emotionally meaningful gifting with nostalgic value.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">
                  Why This Fits
                </h2>

                <p className="text-zinc-200 leading-8">
                  This recipient values emotional effort and meaningful memories more than luxury.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">
                  Recommended Gift Ideas
                </h2>

                <ul className="list-disc pl-6 space-y-3 text-zinc-200">
                  <li>Handwritten memory scrapbook</li>
                  <li>Personalized voice-note keepsake</li>
                  <li>Printed photo timeline</li>
                  <li>Custom memory box</li>
                  <li>Letter bundle for future moments</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">
                  Emotional Strategy
                </h2>

                <p className="text-zinc-200 leading-8">
                  Prioritize intimacy, nostalgia, and emotional personalization over price.
                </p>
              </div>

            </div>

          </div>
        )}
      </div>
    </main>
  );
}