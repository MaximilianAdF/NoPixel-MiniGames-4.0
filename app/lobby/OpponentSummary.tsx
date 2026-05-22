'use client';

import type { GameOutcome } from '@/app/game/types';

interface OpponentSummaryProps {
  title: string;
  // Short metric label, e.g. "Letters", "Level", "Bytes".
  metricLabel: string;
  // Either a "12 / 15" style ratio (when there's a clear target) or a single
  // value like "3 attempts" for open-ended progress.
  metricValue: string;
  // Optional progress bar — pass when there's a meaningful target.
  progress?: { current: number; total: number };
  outcome: GameOutcome;
}

// Compact, minimalistic opponent-progress widget for focus mode. Sized to
// tuck discreetly into a screen corner — small enough not to compete with
// the player's own game for attention, big enough to glance at.
export default function OpponentSummary({
  title,
  metricLabel,
  metricValue,
  progress,
  outcome,
}: OpponentSummaryProps) {
  const percent =
    progress && progress.total > 0
      ? Math.min(100, (progress.current / progress.total) * 100)
      : null;

  const barColor =
    outcome === 'won' ? 'bg-emerald-400' : outcome === 'lost' ? 'bg-red-400' : 'bg-[#54FFA4]';

  return (
    <div className="w-56 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 px-3.5 py-2.5 shadow-lg shadow-black/40">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/40 text-[10px] uppercase tracking-[0.15em] font-semibold">
          Opponent
        </span>
        {outcome === 'won' && (
          <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
            Finished
          </span>
        )}
        {outcome === 'lost' && (
          <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">
            Failed
          </span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <span className="text-white/80 text-xs truncate">
          {title} <span className="text-white/30">·</span> {metricLabel}
        </span>
        <span className="text-white text-sm font-mono tabular-nums">{metricValue}</span>
      </div>
      {percent !== null && (
        <div className="h-0.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-300`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
