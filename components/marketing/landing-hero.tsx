import Link from "next/link";

export default function LandingHero() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#fdf2f8_42%,#e0f2fe_100%)] px-4 py-10 text-stone-950 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-16 lg:grid-cols-[1fr_0.62fr]">
        <div className="max-w-xl space-y-9">
          <div className="inline-flex rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-bold text-stone-700 shadow-lg shadow-black/5 backdrop-blur">
            Private emotional gift reads
          </div>
          <div className="space-y-6">
            <h1 className="max-w-xl text-[2.5rem] font-black leading-[1.06] tracking-tight sm:text-[4.1rem]">
              Find a gift that feels personal.
            </h1>
            <p className="max-w-lg text-base leading-8 text-stone-600 sm:text-lg">
              Answer a few simple prompts. Gift Glimpse turns emotional context into a clear, thoughtful gift direction.
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/gift"
              className="inline-flex w-full justify-center rounded-2xl bg-stone-950 px-6 py-4 text-center text-base font-bold text-white shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-stone-800 sm:w-auto"
            >
              Start a gift read
            </Link>
            <p className="text-sm font-semibold text-stone-500">
              Your saved history stays private after sign-in.{" "}
              <Link href="/privacy" className="text-stone-800 underline decoration-stone-300 underline-offset-4">
                Privacy
              </Link>
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:mr-0">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-rose-300/25 via-amber-200/25 to-sky-300/25 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] bg-white/58 p-4 shadow-xl shadow-black/5 backdrop-blur-xl">
            <div className="rounded-[1.35rem] bg-stone-900/85 p-5 text-white shadow-lg shadow-black/10">
              <p className="text-xs font-semibold text-rose-100/85">
                Example insight
              </p>
              <h2 className="mt-4 max-w-sm text-xl font-black leading-[1.18]">
                The gift should prove you noticed the quiet thing they never ask for.
              </h2>
              <div className="mt-7 rounded-2xl bg-white/[0.08] p-4">
                <p className="text-xs font-bold uppercase text-white/45">
                  Signal
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Someone who remembers tiny details
                </p>
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
