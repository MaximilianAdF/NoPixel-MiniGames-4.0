'use client';

import type { GameType } from '@/interfaces/user';
import type { GameResult } from '@/app/game/types';
import Chopping from '@/app/puzzles/chopping/Chopping';

interface MatchViewProps {
  game: GameType;
  seed: number;
  onMatchEnd: (result: GameResult) => void;
}

// Renders the chosen game in 1v1 match mode with a shared seed. New games
// land here as they get their match-mode seed prop wired up.
export default function MatchView({ game, seed, onMatchEnd }: MatchViewProps) {
  switch (game) {
    case 'chopping':
      return <Chopping seed={seed} onMatchEnd={onMatchEnd} />;
    default:
      return (
        <p className="text-white/60 text-center text-sm">
          {game} isn&apos;t available for 1v1 yet.
        </p>
      );
  }
}
