import GhostRaceClient from './GhostRaceClient';

export const metadata = {
  title: 'Ghost Race - NoPixel 4.0 Minigames',
  description: 'Race a recorded run head-to-head.',
};

export default function GhostRacePage({ params }: { params: { id: string } }) {
  return <GhostRaceClient ghostId={params.id} />;
}
