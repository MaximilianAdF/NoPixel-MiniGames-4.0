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

// Compact opponent-progress widget for focus mode. Renders in place of the
// full spectator view so the player isn't distracted by the opponent's board
// but still sees how they're doing.
export default function OpponentSummary({
  title,
  metricLabel,
  metricValue,
  progress,
  outcome,
}: OpponentSummaryProps) {
  const percent = progress && progress.total > 0
    ? Math.min(100, (progress.current / progress.total) * 100)
    : null;

  const barColor =
    outcome === 'won'
      ? 'bg-emerald-400'
      : outcome === 'lost'
        ? 'bg-red-400'
        : 'bg-[#54FFA4]';

  return (
    <div className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white/90 text-base font-medium">{title}</h3>
        {outcome !== 'playing' && (
          <span
            className={`text-xs uppercase tracking-wider font-semibold ${
              outcome === 'won' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {outcome === 'won' ? 'Finished' : 'Failed'}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mb-4">
        <span className="text-white/50 text-sm uppercase tracking-wider">{metricLabel}</span>
        <span className="text-white text-3xl font-mono tabular-nums">{metricValue}</span>
      </div>

      {percent !== null && (
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
