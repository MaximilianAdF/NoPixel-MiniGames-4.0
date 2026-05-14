import type { GameEngine, GameOutcome } from '@/app/game/types';
import { getCluster, handleGravity, handleLeftShift, squareColors, type SquareValue } from './utils';

export interface RoofRunningState {
  board: SquareValue[];
  rows: number;
  columns: number;
}

export interface RoofRunningConfig {
  rows: number;
  columns: number;
}

export type RoofRunningInput = { type: 'click'; index: number };

// All tiles cleared -> won. A lone tile of any color, or no remaining cluster of 2+, is unsolvable -> lost.
function evaluate(board: SquareValue[], rows: number, columns: number): GameOutcome {
  if (board.every((value) => value === 'empty')) return 'won';
  for (const color of squareColors) {
    if (board.filter((value) => value === color).length === 1) return 'lost';
  }
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== 'empty' && getCluster(board, i, rows, columns).length > 1) {
      return 'playing';
    }
  }
  return 'lost';
}

export const roofRunningEngine: GameEngine<RoofRunningState, RoofRunningConfig, RoofRunningInput> = {
  init({ rows, columns }, rng) {
    const board: SquareValue[] = [];
    for (let i = 0; i < rows * columns; i++) {
      board.push(squareColors[Math.floor(rng() * squareColors.length)]);
    }
    return { board, rows, columns };
  },

  applyInput(state, input) {
    const cluster = getCluster(state.board, input.index, state.rows, state.columns);
    if (cluster.length <= 1) {
      return { state, outcome: 'playing' };
    }
    let board = [...state.board];
    cluster.forEach((i) => {
      board[i] = 'empty';
    });
    board = handleGravity(board, state.rows, state.columns);
    board = handleLeftShift(board, state.rows, state.columns);
    return { state: { ...state, board }, outcome: evaluate(board, state.rows, state.columns) };
  },

  getScore(state) {
    return state.board.filter((value) => value === 'empty').length;
  },
};
