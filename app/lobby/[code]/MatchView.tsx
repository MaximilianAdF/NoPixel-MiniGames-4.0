'use client';

import type { GameType } from '@/interfaces/user';
import type { GameResult } from '@/app/game/types';
import Chopping, { ChoppingSpectator } from '@/app/puzzles/chopping/Chopping';
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
  // Streams my engine inputs out to the lobby (so the opponent can replay them).
  onInput: (input: unknown) => void;
  // Opponent's streamed inputs, accumulated by the lobby. Replayed in the
  // spectator view to mirror their game live.
  opponentInputs: unknown[];
}

// Renders the chosen game in 1v1 match mode. Chopping is the splitscreen vertical
// slice; the other six games are still single-screen until they get the same
// view/spectator split. RepairKit is excluded — real-time mechanic.
export default function MatchView({
  game,
  seed,
  onMatchEnd,
  onInput,
  opponentInputs,
}: MatchViewProps) {
  switch (game) {
    case 'chopping':
      return (
        <Splitscreen
          mine={
            <Chopping
              seed={seed}
              onMatchEnd={onMatchEnd}
              onInput={(input) => onInput(input)}
            />
          }
          theirs={<ChoppingSpectator seed={seed} inputs={opponentInputs as string[]} />}
        />
      );
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

// Stacks vertically below xl, side-by-side at xl+ where there's room for two
// chopping boards without the inner grid shrinking past usability.
function Splitscreen({ mine, theirs }: { mine: React.ReactNode; theirs: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div>
        <div className="text-white/40 text-xs uppercase tracking-wider mb-2">You</div>
        {mine}
      </div>
      <div>
        <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Opponent</div>
        {theirs}
      </div>
    </div>
  );
}
