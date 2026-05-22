'use client';

import NPLockpick, { NPLockpickSpectator, NPLockpickSummary } from '@/app/components/NPLockpick';
import { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GameResult } from '@/app/game/types';
import type { LockpickInput } from '@/app/components/lockpickEngine';

const COUNTDOWN_DURATION = 20;
const MAX_LEVELS = 4;
const TITLE = 'Lockpick';

interface LockpickProps {
  seed?: number;
  onMatchEnd?: (result: GameResult) => void;
  onInput?: (input: LockpickInput) => void;
}

const Lockpick: FC<LockpickProps> = ({ seed, onMatchEnd, onInput }) => {
  const searchParams = useSearchParams();
  const isCompetitive = searchParams?.get('competitive') === 'true';

  return (
    <NPLockpick
      countdownDuration={COUNTDOWN_DURATION}
      maxLevels={MAX_LEVELS}
      title={TITLE}
      gameId="lockpick"
      isCompetitive={isCompetitive}
      seed={seed}
      onMatchEnd={onMatchEnd}
      onInput={onInput}
    />
  );
};

export const LockpickSpectator: FC<{ seed: number; inputs: LockpickInput[] }> = ({
  seed,
  inputs,
}) => (
  <NPLockpickSpectator
    seed={seed}
    inputs={inputs}
    levels={MAX_LEVELS}
    title={TITLE}
    countdownDuration={COUNTDOWN_DURATION}
  />
);

export const LockpickSummary: FC<{ seed: number; inputs: LockpickInput[] }> = ({
  seed,
  inputs,
}) => (
  <NPLockpickSummary seed={seed} inputs={inputs} levels={MAX_LEVELS} title={TITLE} />
);

export default Lockpick;
