"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#0F172A] border-b border-[#334155] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] bg-clip-text text-transparent">
            TutorTom
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/brain-games"
            className="text-[#CBD5E1] hover:text-white transition-colors text-sm md:text-base"
          >
            Brain Games
          </Link>
          <Link
            href="/brain-test"
            className="bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] text-white font-bold py-2 px-4 rounded-lg text-sm md:text-base hover:opacity-90 transition-all"
          >
            Play Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
