import type { GameEngine } from '@/app/game/types';

export type RingColor = 'red' | 'yellow' | 'blue';

export interface Ring {
  color: RingColor[];
  balls: number[];
  slots: number[];
  rotation: number;
}

export interface LockpickState {
  rings: Ring[];
  level: number;
  failedUnlock: boolean;
}

export interface LockpickConfig {
  levels: number;
}

export type LockpickInput = { type: 'rotate'; direction: -1 | 1 } | { type: 'unlock' };

export const degInterval = 30;
export const positions = 360 / degInterval;
const colors: RingColor[] = ['red', 'yellow', 'blue'];

function shuffle<T>(rng: () => number, array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getRandomN<T>(rng: () => number, array: T[], n: number): T[] {
  const result = shuffle(rng, array);
  result.length = n;
  return result;
}

const unsigned = (n: number, size: number = positions): number => {
  let value = n;
  while (value < 0) value += size;
  return value % size;
};

function generateRing(rng: () => number, difficulty: 'normal' | 'hard' = 'normal'): Ring {
  const initialPositions: number[] = [];
  const resultColors: RingColor[] = [];
  for (let i = 0; i < positions; i++) {
    initialPositions.push(i);
    resultColors.push(colors[Math.floor(rng() * colors.length)]);
  }

  const amountBalls = Math.floor(rng() * (positions + 1 - 5) + 5);
  const amountSlots = Math.floor(rng() * (positions - 4 - 4) + 4);

  let resultBalls: number[];
  let resultSlots: number[];
  if (difficulty === 'hard') {
    // Balls and slots shuffled separately -- kept as a "hard" variant.
    resultBalls = getRandomN(rng, initialPositions, amountBalls);
    resultSlots = getRandomN(rng, initialPositions, amountSlots);
  } else {
    const shuffled = shuffle(rng, initialPositions);
    resultBalls = shuffled.slice(0, amountBalls);
    resultSlots = shuffled.slice(0, amountSlots);
  }

  return {
    color: resultColors,
    balls: resultBalls,
    slots: resultSlots,
    rotation: Math.floor(rng() * positions),
  };
}

export const lockpickEngine: GameEngine<LockpickState, LockpickConfig, LockpickInput> = {
  init({ levels }, rng) {
    const rings: Ring[] = [];
    for (let i = 0; i < levels; i++) {
      rings.push(generateRing(rng));
    }
    return { rings, level: 0, failedUnlock: false };
  },

  applyInput(state, input) {
    if (input.type === 'rotate') {
      const rings = state.rings.map((ring, i) =>
        i === state.level ? { ...ring, rotation: ring.rotation + input.direction } : ring,
      );
      return { state: { ...state, rings }, outcome: 'playing' };
    }

    // unlock -- every slot must have either no ball under it or a colour-matched ball.
    const ring = state.rings[state.level];
    for (const slot of ring.slots) {
      const ballPosition = unsigned(slot - unsigned(ring.rotation));
      if (ring.balls.includes(ballPosition) && ring.color[ballPosition] !== ring.color[slot]) {
        return { state: { ...state, failedUnlock: true }, outcome: 'lost' };
      }
    }
    if (state.level >= state.rings.length - 1) {
      return { state, outcome: 'won' };
    }
    return { state: { ...state, level: state.level + 1 }, outcome: 'playing' };
  },

  getScore(state) {
    return state.level;
  },
};
