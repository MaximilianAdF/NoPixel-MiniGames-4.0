import type { GameEngine, GameOutcome } from '@/app/game/types';
import { Letter, LetterState, Letters } from './utils';

export interface ChoppingState {
  board: Letter[];
  stateBoard: LetterState[];
  activeIndex: number;
}

export interface ChoppingConfig {
  numLetters: number;
}

export const choppingEngine: GameEngine<ChoppingState, ChoppingConfig, string> = {
  init({ numLetters }, rng) {
    const board: Letter[] = [];
    for (let i = 0; i < numLetters; i++) {
      board.push(Letters[Math.floor(rng() * Letters.length)]);
    }
    return { board, stateBoard: new Array(numLetters).fill(''), activeIndex: 0 };
  },

  applyInput(state, key) {
    const correct = key.toUpperCase() === state.board[state.activeIndex];
    const stateBoard = [...state.stateBoard];
    stateBoard[state.activeIndex] = correct ? 'done' : 'fail';
    const activeIndex = correct ? state.activeIndex + 1 : state.activeIndex;
    const next: ChoppingState = { board: state.board, stateBoard, activeIndex };

    let outcome: GameOutcome = 'playing';
    if (stateBoard[stateBoard.length - 1] === 'done') outcome = 'won';
    else if (!correct) outcome = 'lost';
    return { state: next, outcome };
  },

  getScore(state) {
    return state.activeIndex;
  },
};
