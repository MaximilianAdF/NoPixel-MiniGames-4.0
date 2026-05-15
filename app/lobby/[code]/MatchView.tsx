'use client';

import type { GameType } from '@/interfaces/user';
import type { GameResult } from '@/app/game/types';
import Chopping from '@/app/puzzles/chopping/Chopping';
import Thermite from '@/app/puzzles/thermite/Thermite';
import Lockpick from '@/app/puzzles/lockpick/Lockpick';
import Laundromat from '@/app/puzzles/laundromat/Laundromat';
import Pincracker from '@/app/puzzles/pincracker/Pincracker';
import RoofRunning from '@/app/puzzles/roof-running/RoofRunning';
import WordMemory from '@/app/puzzles/word-memory/WordMemory';

interface MatchViewProps {
  game: GameType;
  seed: number;
  onMatchEnd: (result: GameResult) => void;
}

// Renders the chosen game in 1v1 match mode with a shared seed.
// RepairKit is excluded — real-time mechanic, not a 1v1 candidate.
export default function MatchView({ game, seed, onMatchEnd }: MatchViewProps) {
  switch (game) {
    case 'chopping':
      return <Chopping seed={seed} onMatchEnd={onMatchEnd} />;
    case 'thermite':
      return <Thermite seed={seed} onMatchEnd={onMatchEnd} />;
    case 'lockpick':
      return <Lockpick seed={seed} onMatchEnd={onMatchEnd} />;
    case 'laundromat':
      return <Laundromat seed={seed} onMatchEnd={onMatchEnd} />;
    case 'pincracker':
      return <Pincracker seed={seed} onMatchEnd={onMatchEnd} />;
    case 'roof-running':
      return <RoofRunning seed={seed} onMatchEnd={onMatchEnd} />;
    case 'word-memory':
      return <WordMemory seed={seed} onMatchEnd={onMatchEnd} />;
    default:
      return (
        <p className="text-white/60 text-center text-sm">
          {game} isn&apos;t available for 1v1.
        </p>
      );
  }
}
