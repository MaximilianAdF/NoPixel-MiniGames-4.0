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
  // Focus mode: render the player's game centered and full-width with a
  // small floating opponent-progress widget tucked in the corner.
  focusMode: boolean;
}

// Renders the chosen game in 1v1 match mode. In normal mode, it's a
// splitscreen (mine + spectator mirror). In focus mode, it's a single
// centered game with a small floating opponent summary in the corner.
// RepairKit is excluded — real-time mechanic, not a 1v1 candidate.
export default function MatchView({
  game,
  seed,
  onMatchEnd,
  onInput,
  opponentInputs,
  focusMode,
}: MatchViewProps) {
  const trio = renderTrio(game, seed, onMatchEnd, onInput, opponentInputs);
  if (!trio) {
    return (
      <p className="text-white/60 text-center text-sm">{game} isn&apos;t available for 1v1.</p>
    );
  }
  if (focusMode) {
    return <FocusLayout interactive={trio.interactive} summary={trio.summary} />;
  }
  return <Splitscreen mine={trio.interactive} theirs={trio.spectator} />;
}

// Picks the interactive / spectator / summary triplet for a given game. Each
// game owns its own type-safe casts; here we just pick the right components.
function renderTrio(
  game: GameType,
  seed: number,
  onMatchEnd: (result: GameResult) => void,
  onInput: (input: unknown) => void,
  opponentInputs: unknown[],
): { interactive: React.ReactNode; spectator: React.ReactNode; summary: React.ReactNode } | null {
  const send = (input: unknown) => onInput(input);
  switch (game) {
    case 'chopping': {
      const inputs = opponentInputs as string[];
      return {
        interactive: <Chopping seed={seed} onMatchEnd={onMatchEnd} onInput={send} />,
        spectator: <ChoppingSpectator seed={seed} inputs={inputs} />,
        summary: <ChoppingSummary seed={seed} inputs={inputs} />,
      };
    }
    case 'thermite': {
      const inputs = opponentInputs as ThermiteInput[];
      return {
        interactive: <Thermite seed={seed} onMatchEnd={onMatchEnd} onInput={send} />,
        spectator: <ThermiteSpectator seed={seed} inputs={inputs} />,
        summary: <ThermiteSummary seed={seed} inputs={inputs} />,
      };
    }
    case 'lockpick': {
      const inputs = opponentInputs as LockpickInput[];
      return {
        interactive: <Lockpick seed={seed} onMatchEnd={onMatchEnd} onInput={send} />,
        spectator: <LockpickSpectator seed={seed} inputs={inputs} />,
        summary: <LockpickSummary seed={seed} inputs={inputs} />,
      };
    }
    case 'laundromat': {
      const inputs = opponentInputs as LockpickInput[];
      return {
        interactive: <Laundromat seed={seed} onMatchEnd={onMatchEnd} onInput={send} />,
        spectator: <LaundromatSpectator seed={seed} inputs={inputs} />,
        summary: <LaundromatSummary seed={seed} inputs={inputs} />,
      };
    }
    case 'pincracker': {
      const inputs = opponentInputs as PincrackerInput[];
      return {
        interactive: <Pincracker seed={seed} onMatchEnd={onMatchEnd} onInput={send} />,
        spectator: <PincrackerSpectator seed={seed} inputs={inputs} />,
        summary: <PincrackerSummary seed={seed} inputs={inputs} />,
      };
    }
    case 'roof-running': {
      const inputs = opponentInputs as RoofRunningInput[];
      return {
        interactive: <RoofRunning seed={seed} onMatchEnd={onMatchEnd} onInput={send} />,
        spectator: <RoofRunningSpectator seed={seed} inputs={inputs} />,
        summary: <RoofRunningSummary seed={seed} inputs={inputs} />,
      };
    }
    case 'word-memory': {
      const inputs = opponentInputs as WordMemoryInput[];
      return {
        interactive: <WordMemory seed={seed} onMatchEnd={onMatchEnd} onInput={send} />,
        spectator: <WordMemorySpectator seed={seed} inputs={inputs} />,
        summary: <WordMemorySummary seed={seed} inputs={inputs} />,
      };
    }
    default:
      return null;
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
    <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14 xl:p-20 min-h-screen xl:min-h-0">
      {/* No max-width — each half takes ~50vw on splitscreen so the games
          actually grow on larger displays. Padding gives them breathing room
          against the viewport edges and the centre divider. */}
      <div className="w-full flex flex-col">
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

// Focus mode: the player's game gets the full viewport (centered), and the
// opponent's progress floats in the top-left corner — small enough to ignore,
// readable enough to glance at.
function FocusLayout({
  interactive,
  summary,
}: {
  interactive: React.ReactNode;
  summary: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-3 left-4 z-40">{summary}</div>
      <div className="min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-14 xl:p-20">
        {/* Single-pane focus mode: cap at 3xl so the lone game has visible
            whitespace around it instead of consuming the whole viewport. */}
        <div className="w-full max-w-3xl">{interactive}</div>
      </div>
    </>
  );
}
