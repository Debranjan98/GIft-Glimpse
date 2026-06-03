import { redirect } from "next/navigation";
import HistoryList from "@/components/history/history-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin?next=/history");
  }

  return <HistoryList />;
}
