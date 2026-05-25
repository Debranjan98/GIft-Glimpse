"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function RecipientForm() {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("recipients").insert([
      {
        name,
        relationship,
      },
    ]);

    if (error) {
      alert("Error saving recipient");
      console.error(error);
    } else {
      alert("Recipient saved successfully!");

      setName("");
      setRelationship("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md"
    >
      <input
        type="text"
        placeholder="Recipient Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-3 rounded bg-zinc-900 border border-zinc-700"
      />

      <input
        type="text"
        placeholder="Relationship"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        className="p-3 rounded bg-zinc-900 border border-zinc-700"
      />

      <button
        type="submit"
        className="bg-white text-black p-3 rounded font-semibold"
      >
        Save Recipient
      </button>
    </form>
  );
}