import { createSupabaseBrowserClient } from "./client";
import { GiftInput, GiftResult, getRelationshipProfile } from "@/lib/gift/schema";

export type GiftHistoryItem = {
  id: string;
  recipient_name: string;
  relationship: string;
  result: string;
  created_at: string;
  occasion?: string | null;
  budget?: string | null;
  emotional_tone?: string | null;
  primary_idea?: string | null;
};

export async function saveGiftResult(input: GiftInput, result: GiftResult) {
  const supabase = createSupabaseBrowserClient();
  const profile = getRelationshipProfile(input.relationship);

  const richPayload = {
    recipient_name: input.recipientName,
    relationship: profile.label,
    result: JSON.stringify(result),
    occasion: input.occasion,
    budget: input.budget,
    emotional_tone: profile.tone,
    primary_idea: result.primaryIdea,
  };

  const response = await supabase.from("gift_results").insert([richPayload]);

  if (!response.error) return response;

  return supabase.from("gift_results").insert([
    {
      recipient_name: input.recipientName,
      relationship: profile.label,
      result: JSON.stringify(result),
    },
  ]);
}

export async function fetchGiftHistory() {
  const supabase = createSupabaseBrowserClient();

  return supabase
    .from("gift_results")
    .select("*")
    .order("created_at", { ascending: false });
}
