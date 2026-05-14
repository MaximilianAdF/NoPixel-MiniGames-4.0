import type { GameEngine } from '@/app/game/types';
import { squarePieces, type GridRow, type Square, type SquareCoord, type SquarePiece } from './utils';

export interface ThermiteState {
  board: GridRow[];
  rows: number;
  columns: number;
  score: number;
  targetScore: number;
  comboCounter: number;
  lastKillTimestamp: number;
  totalCombos: number;
  clickHistory: number[];
  outOfMoves: boolean;
  pieceQueue: SquarePiece[];
  pieceCursor: number;
}

export interface ThermiteConfig {
  rows: number;
  columns: number;
  targetScore: number;
}

export type ThermiteInput = { type: 'click'; coord: SquareCoord; timestamp: number };

const COMBO_WINDOW_MS = 1000;
const COMBO_LENGTH = 3;

// Whether `target` falls on the attacker piece's stride and within its range.
function isTargetAttacked(
  [targetRow, targetCol]: SquareCoord,
  [attackerRow, attackerCol]: SquareCoord,
  piece: SquarePiece,
): boolean {
  return (
    targetCol % piece.distance === attackerCol % piece.distance &&
    targetRow % piece.distance === attackerRow % piece.distance &&
    Math.abs(targetCol - attackerCol) <= piece.distance &&
    Math.abs(targetRow - attackerRow) <= piece.distance
  );
}

// A combo is the last three kills forming 111/222/333, 123 or 321 by piece distance.
function isValidCombo(clickHistory: number[]): boolean {
  const combo = clickHistory.slice(-COMBO_LENGTH);
  if (combo.length < COMBO_LENGTH) return false;
  const sameKind = combo.every((v) => v === combo[0]);
  const ascending = combo.every((v, i, arr) => i === 0 || v === arr[i - 1] + 1);
  const descending = combo.every((v, i, arr) => i === 0 || v === arr[i - 1] - 1);
  return sameKind || ascending || descending;
}

export const thermiteEngine: GameEngine<ThermiteState, ThermiteConfig, ThermiteInput> = {
  init({ rows, columns, targetScore }, rng) {
    const pickPiece = () => squarePieces[Math.floor(rng() * squarePieces.length)];
    const board: GridRow[] = [];
    for (let r = 0; r < rows; r++) {
      const row: Square[] = [];
      for (let c = 0; c < columns; c++) {
        row.push({ piece: pickPiece(), status: 'full', highlighted: true });
      }
      board.push(row);
    }
    const pieceQueue: SquarePiece[] = [];
    for (let i = 0; i < 2 * rows * columns; i++) {
      pieceQueue.push(pickPiece());
    }
    return {
      board,
      rows,
      columns,
      score: 0,
      targetScore,
      comboCounter: 0,
      lastKillTimestamp: -1,
      totalCombos: 0,
      clickHistory: [],
      outOfMoves: false,
      pieceQueue,
      pieceCursor: 0,
    };
  },

  applyInput(state, input) {
    const [row, col] = input.coord;
    const clicked = state.board[row]?.[col];
    if (!clicked || !clicked.highlighted || clicked.status === 'empty') {
      return { state, outcome: 'playing' };
    }

    // Recompute highlights from the clicked piece's attack pattern; the clicked
    // square takes its new state directly.
    const nextPiece = state.pieceQueue[state.pieceCursor % state.pieceQueue.length];
    let attackingSquares = 0;
    const board: GridRow[] = state.board.map((boardRow, r) =>
      boardRow.map((square, c): Square => {
        if (r === row && c === col) {
          return {
            piece: nextPiece,
            status: clicked.status === 'full' ? 'half' : 'empty',
            highlighted: false,
          };
        }
        if (square.status === 'empty') return square;
        const attacked = isTargetAttacked([r, c], input.coord, clicked.piece);
        if (attacked) attackingSquares += 1;
        return square.highlighted === attacked ? square : { ...square, highlighted: attacked };
      }),
    );

    const base: ThermiteState = { ...state, board, pieceCursor: state.pieceCursor + 1 };

    // No square left to attack -> unsolvable.
    if (attackingSquares === 0) {
      return { state: { ...base, outOfMoves: true }, outcome: 'lost' };
    }

    // Clicking a half square eliminates it -- a "kill" that scores and feeds combos.
    if (clicked.status === 'half') {
      let score = state.score + 1;
      const clickHistory = [...state.clickHistory, clicked.piece.distance];
      const inWindow =
        state.comboCounter === 0 ||
        input.timestamp - state.lastKillTimestamp <= COMBO_WINDOW_MS;
      let comboCounter = inWindow ? state.comboCounter + 1 : 0;
      let totalCombos = state.totalCombos;
      // A combo needs both the timing streak and a valid 111/222/333 / 123 / 321 pattern.
      if (comboCounter >= COMBO_LENGTH && isValidCombo(clickHistory)) {
        score += Math.pow(2, totalCombos);
        totalCombos += 1;
        comboCounter = 0;
      }
      const next: ThermiteState = {
        ...base,
        score,
        clickHistory,
        comboCounter,
        totalCombos,
        lastKillTimestamp: input.timestamp,
      };
      return { state: next, outcome: score >= state.targetScore ? 'won' : 'playing' };
    }

    // Clicked a full square -- no kill, the combo streak resets.
    return { state: { ...base, comboCounter: 0 }, outcome: 'playing' };
  },

  getScore(state) {
    return state.score;
  },
};
