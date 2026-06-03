import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/")) return "/gift";
  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));

  if (!code) {
    const authUrl = new URL("/auth/signin", requestUrl.origin);
    authUrl.searchParams.set("message", "Missing authentication code.");
    return NextResponse.redirect(authUrl);
  }

  const response = NextResponse.redirect(new URL(next, requestUrl.origin));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          response.headers.set("Cache-Control", "private, no-store");
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const authUrl = new URL("/auth/signin", requestUrl.origin);
    authUrl.searchParams.set("message", error.message);
    return NextResponse.redirect(authUrl);
  }

  return response;
}
