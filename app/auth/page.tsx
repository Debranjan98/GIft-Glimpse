import { redirect } from "next/navigation";

function safeNext(value: string | undefined) {
  if (!value) return "/gift";
  return value.startsWith("/") ? value : "/gift";
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const next = safeNext(params.next);
  redirect(`/auth/signin?next=${encodeURIComponent(next)}`);
}
