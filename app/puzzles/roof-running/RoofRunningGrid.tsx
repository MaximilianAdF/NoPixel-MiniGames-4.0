'use client';

import { memo } from 'react';
import type { SquareValue } from './utils';

interface RoofTileProps {
  index: number;
  color: SquareValue;
  onTileClick: (index: number) => void;
}

// One board tile; the cube styling comes from the grid container's data-[color] selectors.
export const RoofTile = memo<RoofTileProps>(({ index, color, onTileClick }) => (
  <div data-color={color} onClick={() => onTileClick(index)}>
    <svg viewBox="0 0 100 100" style={{ padding: '0.5px' }}>
      <rect width={100} height={100} style={{ fill: 'none', stroke: 'white', strokeWidth: '2' }} />
      <path
        d="M5 25 V5 H25 M75 5 H95 V25 M95 75 V95 H75 M25 95 H5 V75"
        style={{ fill: 'none', stroke: 'white', strokeWidth: '1.5' }}
      />
    </svg>
  </div>
));

RoofTile.displayName = 'RoofTile';
