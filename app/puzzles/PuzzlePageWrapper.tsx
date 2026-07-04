import { Suspense } from 'react';
import GameAdRail from '@/app/components/GameAdRail';

interface PuzzlePageWrapperProps {
  children: React.ReactNode;
}

export default function PuzzlePageWrapper({ children }: PuzzlePageWrapperProps) {
  return (
    // Three columns: equal flexible gutters keep the game centered; the right
    // gutter hosts the Journey sticky-sidebar container when it fits.
    <div
      className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center p-5"
      style={{
        minHeight: 'calc(100vh - 4rem)',
        // +104px reserves clearance for the Journey adhesion (sticky bottom)
        // ad so it never overlaps the game board.
        paddingBottom: 'calc(env(keyboard-inset-height, 0px) + env(safe-area-inset-bottom, 0px) + 104px)',
      }}
    >
      <div className="min-w-0" />
      <div className="flex items-center justify-center min-w-0">
        <Suspense>{children}</Suspense>
      </div>
      <GameAdRail />
    </div>
  );
}
