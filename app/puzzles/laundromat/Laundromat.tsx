'use client';

import NPLockpick, { NPLockpickSpectator } from '@/app/components/NPLockpick';
import { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GameResult } from '@/app/game/types';
import type { LockpickInput } from '@/app/components/lockpickEngine';

const COUNTDOWN_DURATION = 12;
const MAX_LEVELS = 5;
const TITLE = 'Laundromat';

interface LaundromatProps {
  seed?: number;
  onMatchEnd?: (result: GameResult) => void;
  onInput?: (input: LockpickInput) => void;
}

const Laundromat: FC<LaundromatProps> = ({ seed, onMatchEnd, onInput }) => {
  const searchParams = useSearchParams();
  const isCompetitive = searchParams?.get('competitive') === 'true';

  return (
    <NPLockpick
      countdownDuration={COUNTDOWN_DURATION}
      maxLevels={MAX_LEVELS}
      title={TITLE}
      gameId="laundromat"
      isCompetitive={isCompetitive}
      seed={seed}
      onMatchEnd={onMatchEnd}
      onInput={onInput}
    />
  );
};

export const LaundromatSpectator: FC<{ seed: number; inputs: LockpickInput[] }> = ({
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

export default Laundromat;
