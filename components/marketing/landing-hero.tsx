import Link from "next/link";

const moments = [
  "A partner who saves tiny memories",
  "A parent who deserves specific gratitude",
  "A friend who needs the joke and the truth",
];

export default function LandingHero() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#fdf2f8_42%,#e0f2fe_100%)] px-4 py-10 text-stone-950 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-14 lg:grid-cols-[1fr_0.78fr]">
        <div className="max-w-2xl space-y-9">
          <div className="inline-flex rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-bold text-stone-700 shadow-lg shadow-black/5 backdrop-blur">
            Emotion-first gifting intelligence
          </div>
          <div className="space-y-6">
            <h1 className="max-w-2xl text-[2.65rem] font-black leading-[1.04] tracking-tight sm:text-[4.65rem]">
              Gift ideas that feel like they came from knowing them.
            </h1>
            <p className="max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
              Gift Glimpse turns relationship type, emotional tone, and personal context into a reveal-worthy gift direction.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/gift"
              className="rounded-2xl bg-stone-950 px-6 py-4 text-center text-base font-bold text-white shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              Start the emotional read
            </Link>
            <Link
              href="/history"
              className="rounded-2xl border border-white/80 bg-white/55 px-6 py-4 text-center text-base font-bold text-stone-800 shadow-xl shadow-black/5 backdrop-blur transition hover:bg-white"
            >
              View history
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mr-0">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-rose-300/25 via-amber-200/25 to-sky-300/25 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/55 bg-white/62 p-4 shadow-xl shadow-black/8 backdrop-blur-xl">
            <div className="rounded-[1.35rem] bg-stone-900/90 p-5 text-white shadow-xl shadow-black/15">
              <p className="text-xs font-semibold text-rose-100/85">
                Cinematic reveal preview
              </p>
              <h2 className="mt-4 max-w-sm text-2xl font-black leading-[1.12]">
                The gift should say: I noticed what you never ask for.
              </h2>
              <div className="mt-7 space-y-3">
                {moments.map((moment, index) => (
                  <div
                    key={moment}
                    className="rounded-2xl bg-white/[0.08] p-4"
                  >
                    <p className="text-xs font-bold uppercase text-white/45">
                      Signal {index + 1}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {moment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="rounded-2xl bg-rose-100/80 p-3 text-center text-xs font-bold text-rose-900">
                Tender
              </div>
              <div className="rounded-2xl bg-cyan-100/80 p-3 text-center text-xs font-bold text-cyan-900">
                Playful
              </div>
              <div className="rounded-2xl bg-amber-100/80 p-3 text-center text-xs font-bold text-amber-900">
                Grateful
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
