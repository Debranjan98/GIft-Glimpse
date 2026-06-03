"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/70 text-stone-950 shadow-sm shadow-black/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        <Link href="/" className="text-xl font-black tracking-tight">
          Gift Glimpse
        </Link>

        <div className="flex items-center gap-2 text-sm font-bold">

          <Link
            href="/gift"
            className="rounded-full bg-stone-950 px-4 py-2 text-white shadow-lg shadow-black/10 transition hover:bg-stone-800"
          >
            Create
          </Link>

          {user ? (
            <>
              <Link
                href="/history"
                className="rounded-full px-3 py-2 text-stone-600 transition hover:bg-white hover:text-stone-950"
              >
                History
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full px-3 py-2 text-stone-500 transition hover:bg-white hover:text-stone-950"
              >
                Sign out
              </button>
            </>
          ) : (
          <Link
              href="/auth/signin?next=/history"
              className="rounded-full px-3 py-2 text-stone-600 transition hover:bg-white hover:text-stone-950"
            >
              Sign in
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}
