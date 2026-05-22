import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LobbyClient from './LobbyClient';
import { isValidLobbyCode } from '@/lib/lobby/code';

// Lobby rooms are transient + invite-only — don't index.
export const metadata: Metadata = {
  title: '1v1 Lobby - NoPixel 4.0 Minigames',
  description: '1v1 lobby room.',
  robots: { index: false, follow: false },
};

export default function LobbyRoomPage({ params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  if (!isValidLobbyCode(code)) {
    notFound();
  }
  return <LobbyClient code={code} />;
}
