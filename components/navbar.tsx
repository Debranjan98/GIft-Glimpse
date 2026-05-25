import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-800 bg-black text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        <h1 className="text-2xl font-bold">
          Gift Glimpse
        </h1>

        <div className="flex gap-6 text-lg">

          <Link
            href="/"
            className="hover:text-zinc-400 transition"
          >
            Home
          </Link>

          <Link
            href="/test-ai"
            className="hover:text-zinc-400 transition"
          >
            Generate
          </Link>

          <Link
            href="/history"
            className="hover:text-zinc-400 transition"
          >
            History
          </Link>

        </div>
      </div>
    </nav>
  );
}