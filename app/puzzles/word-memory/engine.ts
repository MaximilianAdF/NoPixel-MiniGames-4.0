import type { GameEngine } from '@/app/game/types';
import { WORD_BANK } from './wordBank';

export interface WordMemoryState {
  sequence: string[];
  numWords: number;
  round: number;
}

export interface WordMemoryConfig {
  numWords: number;
}

export type WordMemoryInput = { type: 'seen' } | { type: 'new' };

// Fisher–Yates over a copy, driven by the injected rng so the draw is reproducible.
function shuffle<T>(rng: () => number, array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const wordMemoryEngine: GameEngine<WordMemoryState, WordMemoryConfig, WordMemoryInput> = {
  init({ numWords }, rng) {
    const pool = shuffle(rng, WORD_BANK).slice(0, Math.floor(numWords / 2));
    const sequence: string[] = [];
    for (let i = 0; i <= numWords; i++) {
      sequence.push(pool[Math.floor(rng() * pool.length)]);
    }
    return { sequence, numWords, round: 0 };
  },

  applyInput(state, input) {
    const currentWord = state.sequence[state.round];
    const seenBefore = state.sequence.slice(0, state.round).includes(currentWord);
    const correct = input.type === 'seen' ? seenBefore : !seenBefore;
    if (!correct) {
      return { state, outcome: 'lost' };
    }
    if (state.round >= state.numWords) {
      return { state, outcome: 'won' };
    }
    return { state: { ...state, round: state.round + 1 }, outcome: 'playing' };
  },

  getScore(state) {
    return state.round;
  },
};
