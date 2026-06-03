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
  age?: string | null;
  gender?: string | null;
};

export async function saveGiftResult(input: GiftInput, result: GiftResult) {
  const supabase = createSupabaseBrowserClient();
  const profile = getRelationshipProfile(input.relationship);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: null,
      error: new Error("Sign in required to save gift history."),
    };
  }

  const richPayload = {
    user_id: user.id,
    recipient_name: input.recipientName,
    relationship: profile.label,
    result: JSON.stringify(result),
    age: input.age,
    gender: input.gender,
    occasion: input.occasion,
    budget: input.budget,
    emotional_tone: profile.tone,
    primary_idea: result.primaryIdea,
  };

  const response = await supabase.from("gift_results").insert([richPayload]);

  if (!response.error) return response;

  return supabase.from("gift_results").insert([
    {
      user_id: user.id,
      recipient_name: input.recipientName,
      relationship: profile.label,
      result: JSON.stringify(result),
    },
  ]);
}

export async function fetchGiftHistory() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: [],
      error: new Error("Sign in required to view gift history."),
    };
  }

  const response = await supabase
    .from("gift_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (
    response.error?.message.includes("user_id") ||
    response.error?.message.includes("does not exist")
  ) {
    return {
      data: [],
      error: new Error(
        "Private history setup is incomplete. Apply the Supabase RLS migration before using history in production."
      ),
    };
  }

  return response;
}

export async function deleteGiftResult(id: string) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: null,
      error: new Error("Sign in required to delete gift history."),
    };
  }

  return supabase.from("gift_results").delete().eq("id", id).eq("user_id", user.id);
}
