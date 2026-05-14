'use client';

import { memo, useMemo } from 'react';
import classNames from 'classnames';
import type { Letter, LetterState } from './utils';

export const defaultGridCols = 6;

interface LetterCellProps {
  letter: Letter;
  isActive: boolean;
  isDone: boolean;
  isFail: boolean;
}

// Memoized so an unchanged letter cell never re-renders.
const LetterCell = memo<LetterCellProps>(
  ({ letter, isActive, isDone, isFail }) => {
    const classes = classNames('letter', {
      'letter-active': isActive,
      done: isDone,
      fail: isFail,
    });

    return <div className={classes}>{letter}</div>;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.letter === nextProps.letter &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.isDone === nextProps.isDone &&
      prevProps.isFail === nextProps.isFail
    );
  },
);

LetterCell.displayName = 'LetterCell';

interface GridRowProps {
  rowIndex: number;
  board: Letter[];
  stateBoard: LetterState[];
  activeIndex: number;
  numLetters: number;
  gridCols: number;
}

// Memoized per row; the comparator re-renders a row only when its own cells or the active cell change.
export const GridRow = memo<GridRowProps>(
  ({ rowIndex, board, stateBoard, activeIndex, numLetters, gridCols }) => {
    const cells = useMemo(() => {
      const cellsArray = [];
      for (let colIndex = 0; colIndex < gridCols; colIndex++) {
        const letterIndex = rowIndex * gridCols + colIndex;
        if (letterIndex < numLetters) {
          cellsArray.push({
            key: colIndex,
            letter: board[letterIndex],
            isActive: letterIndex === activeIndex,
            isDone: stateBoard[letterIndex] === 'done',
            isFail: stateBoard[letterIndex] === 'fail',
          });
        }
      }
      return cellsArray;
    }, [board, stateBoard, activeIndex, numLetters, gridCols, rowIndex]);

    return (
      <div className="game-grid-row">
        {cells.map((cell) => (
          <LetterCell
            key={cell.key}
            letter={cell.letter}
            isActive={cell.isActive}
            isDone={cell.isDone}
            isFail={cell.isFail}
          />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    const prevRowStart = prevProps.rowIndex * prevProps.gridCols;
    const prevRowEnd = prevRowStart + prevProps.gridCols;
    const nextRowStart = nextProps.rowIndex * nextProps.gridCols;
    const nextRowEnd = nextRowStart + nextProps.gridCols;

    const prevHasActive = prevProps.activeIndex >= prevRowStart && prevProps.activeIndex < prevRowEnd;
    const nextHasActive = nextProps.activeIndex >= nextRowStart && nextProps.activeIndex < nextRowEnd;

    if (prevHasActive !== nextHasActive) return false;

    for (let i = 0; i < prevProps.gridCols; i++) {
      const idx = prevProps.rowIndex * prevProps.gridCols + i;
      if (idx >= prevProps.numLetters) break;
      if (prevProps.board[idx] !== nextProps.board[idx]) return false;
      if (prevProps.stateBoard[idx] !== nextProps.stateBoard[idx]) return false;
    }

    return true;
  },
);

GridRow.displayName = 'GridRow';
