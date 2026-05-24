'use client';

import { memo } from 'react';
import Image from 'next/image';
import crossImg from '@/public/images/thermite/cross.svg';
import type { Square } from './pieces';
import { pieceImages } from './utils';

interface ThermiteSquareProps {
  square: Square;
  row: number;
  col: number;
  outOfMoves: boolean;
  animateHighlight: boolean;
  onSquareClick: (row: number, col: number) => void;
}

// One board tile; status/highlight visuals come from style.css's data-attribute selectors.
export const ThermiteSquare = memo<ThermiteSquareProps>(
  ({ square, row, col, outOfMoves, animateHighlight, onSquareClick }) => (
    <div
      className="square"
      data-status={outOfMoves && square.status !== 'empty' ? 'fail' : square.status}
      data-highlighted={square.highlighted}
      onClick={() => onSquareClick(row, col)}
    >
      <span className="piece">
        <Image src={pieceImages[square.piece.type]} alt={`${square.piece.type} range piece`} width={75} height={75} />
      </span>
      <div className="crosses">
        <Image src={crossImg} alt="" width={16} height={16} />
        <Image src={crossImg} alt="" width={16} height={16} />
        <Image src={crossImg} alt="" width={16} height={16} />
        <Image src={crossImg} alt="" width={16} height={16} />
      </div>
      <div
        className="highlight"
        style={{ animationName: animateHighlight ? 'highlight' : 'none' }}
      />
    </div>
  ),
);

ThermiteSquare.displayName = 'ThermiteSquare';
