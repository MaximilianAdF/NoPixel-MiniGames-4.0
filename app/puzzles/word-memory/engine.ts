import type { GameEngine } from '@/app/game/types';
import { generate } from 'random-words';

export interface WordMemoryState {
  sequence: string[];
  numWords: number;
  round: number;
}

export interface WordMemoryConfig {
  numWords: number;
}

export type WordMemoryInput = { type: 'seen' } | { type: 'new' };

export const wordMemoryEngine: GameEngine<WordMemoryState, WordMemoryConfig, WordMemoryInput> = {
  init({ numWords }, rng) {
    const pool = generate(Math.floor(numWords / 2)) as string[];
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
