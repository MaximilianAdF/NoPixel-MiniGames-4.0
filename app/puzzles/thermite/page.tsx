import type { Metadata, Viewport } from "next";
import Thermite from "@/app/puzzles/thermite/Thermite";
import PuzzleBackButton from "@/app/components/PuzzleBackButton";

// Force dynamic rendering for daily challenges
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "🔥 Thermite Hack Trainer - Master NoPixel 4.0 Maze Bank Heist (FREE)",
  description: "⚡ Never fail Thermite again! Practice the hardest NoPixel 4.0 hack FREE. Used by top criminals for Maze Bank heists. Real-time leaderboards • Expert tips • 100% authentic mechanics. Start training now!",
  keywords: ["thermite hack", "NoPixel thermite", "maze bank hack", "GTA RP thermite", "thermite practice", "NoPixel 4.0 thermite", "laser disable minigame", "how to do thermite", "thermite tutorial"],
  openGraph: {
    title: "🔥 Master NoPixel Thermite - FREE Maze Bank Hack Trainer",
    description: "⚡ Never fail Thermite again! Practice the hardest NoPixel hack with real mechanics. Join 1000+ criminals training daily.",
    url: "https://nphacks.net/puzzles/thermite",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/thermite",
  },
};

export default function Page() {
  return (
    <>
      <PuzzleBackButton />
      <Thermite />
    </>
  );
}
