'use client';

import type { GameType } from '@/interfaces/user';
import type { GameResult } from '@/app/game/types';
import Chopping, { ChoppingSpectator, ChoppingSummary } from '@/app/puzzles/chopping/Chopping';
import Thermite, { ThermiteSpectator, ThermiteSummary } from '@/app/puzzles/thermite/Thermite';
import type { ThermiteInput } from '@/app/puzzles/thermite/engine';
import WordMemory, {
  WordMemorySpectator,
  WordMemorySummary,
} from '@/app/puzzles/word-memory/WordMemory';
import type { WordMemoryInput } from '@/app/puzzles/word-memory/engine';
import RoofRunning, {
  RoofRunningSpectator,
  RoofRunningSummary,
} from '@/app/puzzles/roof-running/RoofRunning';
import type { RoofRunningInput } from '@/app/puzzles/roof-running/engine';
import Pincracker, {
  PincrackerSpectator,
  PincrackerSummary,
} from '@/app/puzzles/pincracker/Pincracker';
import type { PincrackerInput } from '@/app/puzzles/pincracker/engine';
import Lockpick, { LockpickSpectator, LockpickSummary } from '@/app/puzzles/lockpick/Lockpick';
import Laundromat, {
  LaundromatSpectator,
  LaundromatSummary,
} from '@/app/puzzles/laundromat/Laundromat';
import type { LockpickInput } from '@/app/components/lockpickEngine';

interface MatchViewProps {
  game: GameType;
  seed: number;
  onMatchEnd: (result: GameResult) => void;
  // Streams my engine inputs out to the lobby (so the opponent can replay them).
  onInput: (input: unknown) => void;
  // Opponent's streamed inputs, accumulated by the lobby. Replayed in the
  // spectator view to mirror their game live.
  opponentInputs: unknown[];
  // Focus mode: render a compact opponent-progress summary instead of the
  // full mirrored board.
  focusMode: boolean;
}

// Renders the chosen game in 1v1 match mode as a splitscreen (mine + opponent
// view). RepairKit is excluded — real-time mechanic, not a 1v1 candidate.
export default function MatchView({
  game,
  seed,
  onMatchEnd,
  onInput,
  opponentInputs,
  focusMode,
}: MatchViewProps) {
  switch (game) {
    case 'chopping': {
      const inputs = opponentInputs as string[];
      return (
        <Splitscreen
          mine={
            <Chopping seed={seed} onMatchEnd={onMatchEnd} onInput={(input) => onInput(input)} />
          }
          theirs={
            focusMode ? (
              <ChoppingSummary seed={seed} inputs={inputs} />
            ) : (
              <ChoppingSpectator seed={seed} inputs={inputs} />
            )
          }
        />
      );
    }
    case 'thermite': {
      const inputs = opponentInputs as ThermiteInput[];
      return (
        <Splitscreen
          mine={
            <Thermite seed={seed} onMatchEnd={onMatchEnd} onInput={(input) => onInput(input)} />
          }
          theirs={
            focusMode ? (
              <ThermiteSummary seed={seed} inputs={inputs} />
            ) : (
              <ThermiteSpectator seed={seed} inputs={inputs} />
            )
          }
        />
      );
    }
    case 'lockpick': {
      const inputs = opponentInputs as LockpickInput[];
      return (
        <Splitscreen
          mine={
            <Lockpick seed={seed} onMatchEnd={onMatchEnd} onInput={(input) => onInput(input)} />
          }
          theirs={
            focusMode ? (
              <LockpickSummary seed={seed} inputs={inputs} />
            ) : (
              <LockpickSpectator seed={seed} inputs={inputs} />
            )
          }
        />
      );
    }
    case 'laundromat': {
      const inputs = opponentInputs as LockpickInput[];
      return (
        <Splitscreen
          mine={
            <Laundromat seed={seed} onMatchEnd={onMatchEnd} onInput={(input) => onInput(input)} />
          }
          theirs={
            focusMode ? (
              <LaundromatSummary seed={seed} inputs={inputs} />
            ) : (
              <LaundromatSpectator seed={seed} inputs={inputs} />
            )
          }
        />
      );
    }
    case 'pincracker': {
      const inputs = opponentInputs as PincrackerInput[];
      return (
        <Splitscreen
          mine={
            <Pincracker seed={seed} onMatchEnd={onMatchEnd} onInput={(input) => onInput(input)} />
          }
          theirs={
            focusMode ? (
              <PincrackerSummary seed={seed} inputs={inputs} />
            ) : (
              <PincrackerSpectator seed={seed} inputs={inputs} />
            )
          }
        />
      );
    }
    case 'roof-running': {
      const inputs = opponentInputs as RoofRunningInput[];
      return (
        <Splitscreen
          mine={
            <RoofRunning seed={seed} onMatchEnd={onMatchEnd} onInput={(input) => onInput(input)} />
          }
          theirs={
            focusMode ? (
              <RoofRunningSummary seed={seed} inputs={inputs} />
            ) : (
              <RoofRunningSpectator seed={seed} inputs={inputs} />
            )
          }
        />
      );
    }
    case 'word-memory': {
      const inputs = opponentInputs as WordMemoryInput[];
      return (
        <Splitscreen
          mine={
            <WordMemory seed={seed} onMatchEnd={onMatchEnd} onInput={(input) => onInput(input)} />
          }
          theirs={
            focusMode ? (
              <WordMemorySummary seed={seed} inputs={inputs} />
            ) : (
              <WordMemorySpectator seed={seed} inputs={inputs} />
            )
          }
        />
      );
    }
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
