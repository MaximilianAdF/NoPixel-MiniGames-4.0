import type { Metadata, Viewport } from "next";
import Pincracker from "@/app/puzzles/pincracker/Pincracker";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "PinCracker Practice - NoPixel 4.0 Minigames",
  description: "Master the PinCracker hack from NoPixel 4.0 GTA RP. Practice the Maze Bank security minigame with authentic mechanics. Free trainer for perfecting your pin cracking skills.",
  keywords: ["pin cracker", "NoPixel pin cracker", "maze bank pin cracker", "GTA RP pin hack", "NoPixel 4.0 pin cracker", "security hack practice"],
  openGraph: {
    title: "PinCracker Practice - NoPixel 4.0",
    description: "Master the PinCracker hack from NoPixel 4.0. Practice the Maze Bank security minigame.",
    url: "https://no-px.vercel.app/puzzles/pincracker",
  },
  alternates: {
    canonical: "https://no-px.vercel.app/puzzles/pincracker",
  },
};

export default function Page() {
    return <Pincracker />;
}