import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fff7ed_0%,#fdf2f8_52%,#e0f2fe_100%)] px-4 py-10 text-stone-950">
      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white/75 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-10">
        <p className="eyebrow">Terms</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Gift Glimpse is a recommendation tool.
        </h1>
        <div className="mt-6 space-y-5 leading-8 text-stone-600">
          <p>
            Gift recommendations are generated from the information you provide and
            should be treated as suggestions, not guarantees.
          </p>
          <p>
            You are responsible for deciding whether a gift is appropriate for the
            recipient and occasion.
          </p>
          <p>
            Do not use the product to store private information about someone without
            care or permission.
          </p>
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-stone-950 px-5 py-4 font-bold text-white"
        >
          Back home
        </Link>
      </section>
    </main>
  );
}
