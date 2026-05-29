'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getGameIcon, getGameName } from '../utils/gameIcons';
import type { DailyChallenge } from '../hooks/useDailyChallenge';

interface Props {
  challenge: DailyChallenge;
}

// Compact daily challenge card — two-row layout so it doesn't feel
// cluttered:
//   1. game icon + title + countdown chip
//   2. activity stat chips (USERS · TRIES · WINS) — the social signal
//      ("people are playing this right now") which is more interesting
//      on the home page than the dry game specs.
// Game-specific details (grid size, target time, etc.) live inside the
// game page itself; surfacing them all up here was visual noise.
export default function DailyChallengeHero({ challenge }: Props) {
  const [countdown, setCountdown] = useState('00:00:00');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / 3_600_000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3_600_000) / 60_000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60_000) / 1000).toString().padStart(2, '0');
      setCountdown(`${h}:${m}:${s}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const activity = challenge.stats ?? { uniquePlayers: 0, totalAttempts: 0, totalCompletions: 0 };

  return (
    <Link
      href={`/puzzles/${challenge.game}?challengeId=${challenge.id}&from=hero`}
      className="group relative rounded-lg bg-gradient-to-br from-mirage-900/60 via-mirage-900/40 to-mirage-800/60 border border-spring-green-500/30 hover:border-spring-green-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-spring-green-500/10 flex items-center gap-4 p-4 sm:p-5 h-full"
    >
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors" />

      {/* Countdown chip — straddles the top border (half above, half
          inside) and aligns horizontally with the left edge of the game
          icon. Solid mirage bg so it masks the card border behind it. */}
      <span className="absolute -top-2.5 left-4 sm:left-5 z-10 inline-flex items-center text-[10px] font-mono font-bold text-spring-green-300 bg-mirage-900 border border-spring-green-500/40 px-2 py-0.5 rounded uppercase tracking-tighter tabular-nums shadow-sm">
        {countdown}
      </span>

      {/* Game icon */}
      <div className="relative shrink-0 w-12 h-12 flex items-center justify-center bg-mirage-950/50 rounded-lg border border-spring-green-500/20 text-spring-green-400 group-hover:scale-105 transition-transform">
        <div className="absolute inset-0 bg-spring-green-500/5 blur-md rounded-full group-hover:bg-spring-green-500/10 transition-colors" />
        <span className="relative">{getGameIcon(challenge.game, 'md')}</span>
      </div>

      {/* Two info rows — countdown moved out to the border chip above. */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <h3 className="text-base sm:text-lg font-black text-white leading-none tracking-tight truncate group-hover:text-spring-green-300 transition-colors">
          {getGameName(challenge.game)}
        </h3>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <StatChip label="Users" value={activity.uniquePlayers} />
          <StatChip label="Tries" value={activity.totalAttempts} />
          <StatChip label="Wins" value={activity.totalCompletions} accent />
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 hidden sm:inline-flex items-center gap-2 h-9 px-4 bg-spring-green-500 text-mirage-950 rounded font-bold text-xs group-hover:bg-spring-green-400 transition-colors shadow-[0_0_16px_rgba(9,222,110,0.25)]">
        LAUNCH
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
      <div className="sm:hidden shrink-0 w-9 h-9 rounded bg-spring-green-500 inline-flex items-center justify-center text-mirage-950">
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

function StatChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1 text-[10px]">
      <span className="text-gray-500 font-mono font-bold uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`font-mono font-bold tabular-nums px-1.5 py-0.5 rounded border ${accent
          ? 'bg-spring-green-500/12 border-spring-green-500/30 text-spring-green-300'
          : 'bg-white/[0.05] border-white/10 text-white'}`}
      >
        {value}
      </span>
    </div>
  );
}
