import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export async function saveGiftResult(
  recipient_name: string,
  relationship: string,
  result: string
) {
  return await supabase.from("gift_results").insert([
    {
      recipient_name,
      relationship,
      result,
    },
  ]);
}