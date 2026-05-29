'use client';

import Link from 'next/link';
import { Swords, ArrowRight } from 'lucide-react';

// Compact 1v1 CTA — slim two-row card to match the daily challenge:
//   1. game icon + title
//   2. short tagline
// A floating "thought cloud" NEW badge sits outside the top-right corner
// for a flashy attention pull without crowding the layout.
export default function OneVOneHero() {
  return (
    <Link
      href="/lobby"
      className="group relative rounded-lg bg-gradient-to-br from-mirage-900/60 via-mirage-900/40 to-mirage-800/60 border border-spring-green-500/30 hover:border-spring-green-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-spring-green-500/10 flex items-center gap-4 p-4 sm:p-5 h-full"
    >
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors" />

      {/* NEW badge — floats above-and-right of the card corner; bubble
          tail dots descend down-and-left from the badge, landing at the
          card's top-right corner so the badge reads as the card itself
          "speaking". */}
      <div className="absolute -top-8 -right-12 z-20 pointer-events-none">
        <div className="relative">
          <div className="bg-spring-green-500 text-mirage-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg shadow-spring-green-500/40 group-hover:bg-spring-green-400 transition-colors">
            NEW
          </div>
          {/* Bubble tail — dots descending and trailing left, spanning
              the longer gap back to the card's top-right corner. */}
          <div className="absolute -bottom-2.5 -left-1 w-2 h-2 rounded-full bg-spring-green-500 group-hover:bg-spring-green-400 transition-colors shadow-md shadow-spring-green-500/30" />
          <div className="absolute -bottom-5 -left-5 w-1.5 h-1.5 rounded-full bg-spring-green-500 group-hover:bg-spring-green-400 transition-colors" />
        </div>
      </div>

      {/* Icon */}
      <div className="relative shrink-0 w-12 h-12 flex items-center justify-center bg-mirage-950/50 rounded-lg border border-spring-green-500/20 text-spring-green-400 group-hover:scale-105 transition-transform">
        <div className="absolute inset-0 bg-spring-green-500/5 blur-md rounded-full group-hover:bg-spring-green-500/10 transition-colors" />
        <Swords className="w-6 h-6 relative" strokeWidth={1.75} />
      </div>

      {/* Two info rows — live chip moved out to the border chip above. */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <h3 className="text-base sm:text-lg font-black text-white leading-none tracking-tight truncate group-hover:text-spring-green-300 transition-colors">
          Play 1v1
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm leading-snug line-clamp-2">
          Race a friend or random opponent.
        </p>
      </div>

      {/* CTA — same shape as daily challenge LAUNCH button */}
      <div className="shrink-0 hidden sm:inline-flex items-center gap-2 h-9 px-4 bg-spring-green-500 text-mirage-950 rounded font-bold text-xs group-hover:bg-spring-green-400 transition-colors shadow-[0_0_16px_rgba(9,222,110,0.25)]">
        ENTER
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
      <div className="sm:hidden shrink-0 w-9 h-9 rounded bg-spring-green-500 inline-flex items-center justify-center text-mirage-950">
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
