import type { Metadata } from 'next';
import LobbyLanding from './LobbyLanding';

export const metadata: Metadata = {
  title: 'Play 1v1 - NoPixel 4.0 Minigames',
  description: 'Race a friend on the same NoPixel 4.0 minigame. Create a lobby and share the code, or join an existing one.',
  openGraph: {
    title: 'Play 1v1 - NoPixel 4.0 Minigames',
    description: 'Race a friend on the same NoPixel 4.0 minigame.',
    url: 'https://nphacks.net/lobby',
  },
  alternates: {
    canonical: 'https://nphacks.net/lobby',
  },
};

export default function LobbyPage() {
  return <LobbyLanding />;
}
