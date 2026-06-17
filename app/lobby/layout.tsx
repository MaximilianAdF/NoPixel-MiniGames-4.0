import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// /lobby is a client component (LobbyLanding) and can't export metadata itself,
// so the 1v1 landing's SEO lives here. Child routes (/lobby/[code],
// /lobby/ghost/[id]) override this with their own noindex metadata.
export const metadata: Metadata = {
  title: { absolute: '1v1 NoPixel 4.0 Minigames — Race a Friend Head-to-Head' },
  description:
    'Challenge a friend to a 1v1 on any NoPixel 4.0 / FiveM hacking minigame — same puzzle, fastest finish wins. Free in your browser, or race the ghost of a past run.',
  keywords: [
    'nopixel 1v1',
    'fivem 1v1 minigame',
    'nopixel minigame 1v1',
    'nopixel lockpick 1v1',
    '1v1 hacking minigame',
    'nopixel versus',
  ],
  openGraph: {
    title: '1v1 NoPixel 4.0 Minigames — Race a Friend Head-to-Head',
    description:
      'Challenge a friend to a 1v1 on any NoPixel 4.0 / FiveM hacking minigame — same puzzle, fastest finish wins.',
    url: 'https://nphacks.net/lobby',
  },
};

export default function LobbyLayout({ children }: { children: ReactNode }) {
  return children;
}
