import type { Metadata, Viewport } from "next";
import Chopping from "@/app/puzzles/chopping/Chopping";
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
  title: "Chopping Practice - NoPixel 4.0 Minigames",
  description: "Practice the Chopping minigame from NoPixel 4.0 GTA RP. Master vehicle chopping mechanics with authentic patterns. Free trainer for improving your chopping timing and accuracy.",
  keywords: ["chopping minigame", "NoPixel chopping", "GTA RP chopping", "vehicle chopping practice", "NoPixel 4.0 chopping", "chopping trainer"],
  openGraph: {
    title: "Chopping Practice - NoPixel 4.0",
    description: "Practice the Chopping minigame from NoPixel 4.0. Master vehicle chopping mechanics.",
    url: "https://nphacks.net/puzzles/chopping",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/chopping",
  },
};

export default function Page() {
  return (
    <PuzzlePageWrapper
      title="Chopping Minigame"
      gameName="Chopping"
      description="The Chopping minigame is a typing-speed challenge used when stealing vehicles for the chop shop in NoPixel 4.0. This fast-paced hack requires you to quickly type a sequence of letters (Q, W, E, R, A, S, D) in the correct order before time runs out. The pressure is intense as you race against the clock while potentially being pursued by police. Master this skill to become an efficient car thief and maximize your earnings from the chop shop."
      difficulty="Medium"
      avgTime="5-7 seconds"
      inGameUse="Vehicle Theft"
      howToPlay={[
        "A sequence of letters will appear on screen (Q, W, E, R, A, S, D)",
        "Type each letter in order as quickly as possible",
        "Only these specific keys work - other keys won't register",
        "Complete the entire sequence before the timer expires",
        "Mistakes don't reset progress but waste precious time"
      ]}
      tips={[
        "Position your fingers on the home row for fastest access",
        "Practice the specific key positions until they're muscle memory",
        "Stay calm - panicking leads to typos and wasted time",
        "Focus on accuracy first, then build up speed",
        "The letter pool is limited - learn the patterns"
      ]}
      guideUrl="/guides/chopping"
    >
      <PuzzleBackButton />
      <Chopping />
    </PuzzlePageWrapper>
  );
}