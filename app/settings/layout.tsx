import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// /settings is a client component and renders no crawlable content — keep it out
// of the index (but follow links out) so crawl budget goes to the games + guides.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
