import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LobbyClient from './LobbyClient';
import { isValidLobbyCode } from '@/lib/lobby/code';
import { shareCards } from '@/lib/share-cards';

// Lobby rooms are transient + invite-only — don't index.
export function generateMetadata({ params }: { params: { code: string } }): Metadata {
  const url = `/lobby/${encodeURIComponent(params.code.toUpperCase())}`;
  const title = 'Your Move. Join a NoPixel 1v1';
  const description = 'Play the same puzzle as your friend and race to finish first.';
  return {
    title, description,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: { url, title, description, images: [shareCards.yourMove] },
  };
}

export default function LobbyRoomPage({ params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  if (!isValidLobbyCode(code)) {
    notFound();
  }
  return <LobbyClient code={code} />;
}
