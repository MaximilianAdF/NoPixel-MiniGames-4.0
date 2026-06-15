import GhostRaceClient from './GhostRaceClient';

// Ghost races are transient, per-run pages — keep them out of the index so
// crawl budget goes to the minigame + guide pages.
export const metadata = {
  title: 'Ghost Race - NoPixel 4.0 Minigames',
  description: 'Race a recorded run head-to-head.',
  robots: { index: false, follow: false },
};

export default function GhostRacePage({ params }: { params: { id: string } }) {
  return <GhostRaceClient ghostId={params.id} />;
}
