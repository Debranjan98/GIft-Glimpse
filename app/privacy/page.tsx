import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fff7ed_0%,#fdf2f8_52%,#e0f2fe_100%)] px-4 py-10 text-stone-950">
      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white/75 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-10">
        <p className="eyebrow">Privacy</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Your gift reads are private.
        </h1>
        <div className="mt-6 space-y-5 leading-8 text-stone-600">
          <p>
            Gift Glimpse may ask for personal relationship context to create a better
            recommendation. Saved gift history is tied to your signed-in account.
          </p>
          <p>
            We use Supabase authentication and row-level security so users can only
            access their own saved gift results.
          </p>
          <p>
            You can delete saved gift reads from history. Avoid entering sensitive
            information you do not want stored.
          </p>
        </div>
        <Link
          href="/gift"
          className="mt-8 inline-flex rounded-2xl bg-stone-950 px-5 py-4 font-bold text-white"
        >
          Start a gift read
        </Link>
      </section>
    </main>
  );
}
