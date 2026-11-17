import GhostRaceClient from './GhostRaceClient';
import type { Metadata } from 'next';
import { shareCards } from '@/lib/share-cards';

// Ghost races are transient, per-run pages — keep them out of the index so
// crawl budget goes to the minigame + guide pages.
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const url = `/lobby/ghost/${encodeURIComponent(params.id)}`;
  const title = 'One More Run. Race a NoPixel Ghost';
  const description = 'Replay the same puzzle and try to beat a recorded run.';
  return {
    title, description,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: { url, title, description, images: [shareCards.oneMoreRun] },
  };
}

export default function GhostRacePage({ params }: { params: { id: string } }) {
  return <GhostRaceClient ghostId={params.id} />;
}
