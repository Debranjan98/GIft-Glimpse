import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/auth-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNext(value: string | undefined) {
  if (!value) return "/gift";
  return value.startsWith("/") ? value : "/gift";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; message?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const next = safeNext(params.next);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(next);
  }

  return <AuthForm mode="signin" next={next} message={params.message || ""} />;
}
