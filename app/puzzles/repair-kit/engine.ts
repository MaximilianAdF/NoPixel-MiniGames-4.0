import type { GameEngine } from '@/app/game/types';

export interface RepairKitState {
  target: number;
  losePoint: number;
}

export type RepairKitConfig = Record<string, never>;

export type RepairKitInput = { type: 'stop'; deviation: number } | { type: 'timeout' };

const minSlot = 15;
const maxSlot = 90;
const winDeviation = 5;
const loseOffset = 7;
const maxLosePoint = 94;

export const repairKitEngine: GameEngine<RepairKitState, RepairKitConfig, RepairKitInput> = {
  init(_config, rng) {
    const target = Math.floor(rng() * (maxSlot - minSlot) + minSlot);
    return { target, losePoint: Math.min(target + loseOffset, maxLosePoint) };
  },

  applyInput(state, input) {
    if (input.type === 'stop') {
      return { state, outcome: input.deviation <= winDeviation ? 'won' : 'lost' };
    }
    return { state, outcome: 'lost' };
  },

  getScore(_state, outcome) {
    return outcome === 'won' ? 1 : 0;
  },
};
