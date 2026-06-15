import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Public profiles are thin, dynamic, and low-value for search. Keep them out of
// the index (but follow links out) so crawl budget goes to the minigame + guide
// pages. The page itself is a client component, so the directive lives here.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function PublicProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
