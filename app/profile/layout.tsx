import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The bare /profile page is a client component with no crawlable content — keep
// it out of the index (but follow links out). The /profile/[userId] route sets
// its own matching noindex.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
