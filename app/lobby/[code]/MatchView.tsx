'use client';

import type { GameType } from '@/interfaces/user';
import type { GameResult } from '@/app/game/types';
import Chopping, { ChoppingSpectator } from '@/app/puzzles/chopping/Chopping';
import Thermite, { ThermiteSpectator } from '@/app/puzzles/thermite/Thermite';
import type { ThermiteInput } from '@/app/puzzles/thermite/engine';
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
            <Chopping seed={seed} onMatchEnd={onMatchEnd} onInput={(input) => onInput(input)} />
          }
          theirs={<ChoppingSpectator seed={seed} inputs={opponentInputs as string[]} />}
        />
      );
    case 'thermite':
      return (
        <Splitscreen
          mine={
            <Thermite seed={seed} onMatchEnd={onMatchEnd} onInput={(input) => onInput(input)} />
          }
          theirs={<ThermiteSpectator seed={seed} inputs={opponentInputs as ThermiteInput[]} />}
        />
      );
    case 'lockpick':
      return (
        <SingleGame>
          <Lockpick seed={seed} onMatchEnd={onMatchEnd} />
        </SingleGame>
      );
    case 'laundromat':
      return (
        <SingleGame>
          <Laundromat seed={seed} onMatchEnd={onMatchEnd} />
        </SingleGame>
      );
    case 'pincracker':
      return (
        <SingleGame>
          <Pincracker seed={seed} onMatchEnd={onMatchEnd} />
        </SingleGame>
      );
    case 'roof-running':
      return (
        <SingleGame>
          <RoofRunning seed={seed} onMatchEnd={onMatchEnd} />
        </SingleGame>
      );
    case 'word-memory':
      return (
        <SingleGame>
          <WordMemory seed={seed} onMatchEnd={onMatchEnd} />
        </SingleGame>
      );
    default:
      return (
        <p className="text-white/60 text-center text-sm">
          {game} isn&apos;t available for 1v1.
        </p>
      );
  }
}

// Splitscreen: full viewport, stacked on small screens, side-by-side at xl+ with
// a vertical divider. Each half centers its game both horizontally and vertically
// so the two boards sit cleanly inside their own half of the screen.
function Splitscreen({ mine, theirs }: { mine: React.ReactNode; theirs: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-white/10">
      <Half label="You" accent>
        {mine}
      </Half>
      <Half label="Opponent">{theirs}</Half>
    </div>
  );
}

function Half({
  label,
  accent,
  children,
}: {
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center p-4 sm:p-6 xl:p-10 min-h-screen xl:min-h-0">
      <div className="w-full max-w-2xl flex flex-col">
        <div
          className={`text-xs uppercase tracking-[0.2em] mb-3 font-semibold ${
            accent ? 'text-[#54FFA4]' : 'text-white/40'
          }`}
        >
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}

function SingleGame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 xl:p-10">
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
}
