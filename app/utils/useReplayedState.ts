'use client';

import { useMemo } from 'react';
import type { GameEngine, GameOutcome } from '@/app/game/types';
import { seededRandom } from '@/lib/lobby/seededRandom';

interface ReplayedState<State> {
  state: State;
  outcome: GameOutcome;
}

// Replays a deterministic engine from (seed, inputs) and returns the current
// state + outcome. Stops applying inputs at the first non-'playing' outcome.
// Used by 1v1 spectator views to reconstruct the opponent's game from their
// streamed inputs.
export function useReplayedState<State, Config, Input>(
  engine: GameEngine<State, Config, Input>,
  config: Config,
  seed: number,
  inputs: Input[],
): ReplayedState<State> {
  // Same trick useGameHost uses: stringify the config so a referentially-fresh
  // object literal each render doesn't force a needless replay.
  const configKey = JSON.stringify(config);
  return useMemo(() => {
    let state = engine.init(config, seededRandom(seed));
    let outcome: GameOutcome = 'playing';
    for (const input of inputs) {
      if (outcome !== 'playing') break;
      const result = engine.applyInput(state, input);
      state = result.state;
      outcome = result.outcome;
    }
    return { state, outcome };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, configKey, seed, inputs]);
}
