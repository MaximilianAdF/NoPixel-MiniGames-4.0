import { Suspense } from 'react';

interface PuzzlePageWrapperProps {
  children: React.ReactNode;
}

export default function PuzzlePageWrapper({ children }: PuzzlePageWrapperProps) {
  return (
    <div
      className="flex items-center justify-center p-5"
      style={{
        minHeight: 'calc(100vh - 4rem)',
        paddingBottom: 'calc(env(keyboard-inset-height, 0px) + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Suspense>{children}</Suspense>
    </div>
  );
}
