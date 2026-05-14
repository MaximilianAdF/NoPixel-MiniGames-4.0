'use client';

import { memo } from 'react';
import classNames from 'classnames';
import type { Digit } from './utils';
import type { Feedback } from './engine';

interface PinColumnProps {
  digit: Digit | '';
  feedback: Feedback | null;
  isRevealed: boolean;
  isFlashing: boolean;
}

const markerColor = (feedback: Feedback | null, isRevealed: boolean): string => {
  if (!isRevealed || !feedback) return 'bg-slate-400';
  if (feedback === 'green') return 'bg-green-400';
  if (feedback === 'yellow') return 'bg-yellow-400';
  return 'bg-red-400';
};

// One PIN slot — the typed digit and its feedback marker. Memoized so only changed slots re-render.
export const PinColumn = memo<PinColumnProps>(({ digit, feedback, isRevealed, isFlashing }) => (
  <div
    className={classNames(
      'flex flex-col items-center justify-center flex-1 h-full gap-5 sm:gap-6 md:gap-7 rounded-md',
      isFlashing && 'bg-gradient-radial from-spring-green-300 to-turquoise-900/50',
    )}
  >
    <div className="h-20 sm:h-24 md:h-28">{digit}</div>
    <div className={classNames('px-4 sm:px-6 md:px-7 h-1.5', markerColor(feedback, isRevealed))} />
  </div>
));

PinColumn.displayName = 'PinColumn';
