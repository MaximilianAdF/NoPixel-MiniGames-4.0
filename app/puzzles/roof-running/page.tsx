import type { Metadata, Viewport } from "next";
import RoofRunning from "@/app/puzzles/roof-running/RoofRunning";
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
  title: "🏃 Roof Running Trainer - Perfect Your NoPixel 4.0 Timing (FREE)",
  description: "💨 Nail every AC-Unit jump! Practice NoPixel Roof Running with authentic mechanics. Used by pro criminals for house robberies. Global leaderboards • Expert guides • Mobile-friendly. Train your timing now!",
  keywords: ["roof running", "NoPixel roof running", "GTA RP roof running", "AC unit hack", "NoPixel 4.0 roof running", "parkour minigame", "house robbery", "roof running timing"],
  openGraph: {
    title: "🏃 Master NoPixel Roof Running - FREE Parkour Trainer",
    description: "💨 Nail every AC-Unit jump! Practice authentic NoPixel mechanics. Join criminals perfecting their house robbery timing.",
    url: "https://nphacks.net/puzzles/roof-running",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/roof-running",
  },
};

export default function Page() {
  return (
    <PuzzlePageWrapper
      title="Roof Running Puzzle"
      gameName="Roof Running"
      description="Roof Running is a unique color-matching puzzle used when stealing AC units from rooftops in NoPixel 4.0. This minigame features an 11x8 grid filled with colored cubes (red, green, blue) that you must clear by clicking groups of connected same-colored blocks. The physics-based mechanics cause remaining cubes to fall and shift left, creating new groupings. Clear the entire board before time runs out to successfully steal the AC unit and escape with your loot."
      difficulty="Medium"
      avgTime="30-45 seconds"
      inGameUse="AC Unit Theft"
      howToPlay={[
        "Survey the 11x8 grid of colored cubes (red, green, blue)",
        "Click on groups of 2+ connected same-colored cubes to remove them",
        "Watch as remaining cubes fall down and shift left",
        "Plan ahead - new groupings form after each move",
        "Clear all cubes from the board before time expires"
      ]}
      tips={[
        "Start from the bottom to create larger chain reactions",
        "Look for the largest connected groups first",
        "Single cubes cannot be removed - plan to avoid orphans",
        "Work from right to left as cubes shift leftward",
        "Take a moment to scan the board before making moves"
      ]}
      guideUrl="/guides/roof-running"
    >
      <PuzzleBackButton />
      <RoofRunning />
    </PuzzlePageWrapper>
  );
}
