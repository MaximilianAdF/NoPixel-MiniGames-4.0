import type { Metadata, Viewport } from "next";
import Thermite from "@/app/puzzles/thermite/Thermite";
import PuzzleBackButton from "@/app/components/PuzzleBackButton";
import PuzzlePageWrapper from "@/app/puzzles/PuzzlePageWrapper";

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
    <PuzzlePageWrapper
      title="Thermite Hack"
      gameName="Thermite"
      description="The Thermite hack is NoPixel 4.0's most challenging memory puzzle, used to disable laser security systems during high-stakes Maze Bank heists. This minigame tests your pattern recognition and short-term memory under extreme time pressure. You'll need to memorize a grid of highlighted tiles and recreate the pattern from memory before the timer runs out. One wrong click means instant failure. Master this hack to become an elite virtual criminal in GTA RP and successfully complete the most lucrative heists on the server."
      difficulty="Hard"
      avgTime="3-5 seconds"
      inGameUse="Maze Bank"
      howToPlay={[
        "Watch carefully as tiles light up in a specific pattern on the grid",
        "Memorize which tiles were highlighted - focus on shapes, not individual squares",
        "Once the pattern disappears, quickly click the same tiles before time runs out",
        "Complete all required rounds to successfully disable the security lasers",
        "One wrong click results in instant failure - precision is key"
      ]}
      tips={[
        "Focus on recognizing shapes and patterns rather than memorizing individual tiles",
        "Use the 'quadrant method' - mentally divide the grid into four sections",
        "Start with lower difficulty settings to build muscle memory",
        "Stay calm under pressure - panicking leads to misclicks",
        "Practice regularly to improve your short-term visual memory"
      ]}
      guideUrl="/guides/thermite"
    >
      <PuzzleBackButton />
      <Thermite />
    </PuzzlePageWrapper>
  );
}
