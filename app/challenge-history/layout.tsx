import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// /challenge-history is a client component with no crawlable content — keep it
// out of the index (but follow links out).
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function ChallengeHistoryLayout({ children }: { children: ReactNode }) {
  return children;
}
