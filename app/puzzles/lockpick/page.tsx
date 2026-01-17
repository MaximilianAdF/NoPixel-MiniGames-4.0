import type { Metadata, Viewport } from "next";
import Lockpick from "@/app/puzzles/lockpick/Lockpick";
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
  title: "Lockpick Practice - NoPixel 4.0 Minigames",
  description: "Practice the Lockpick minigame from NoPixel 4.0 GTA RP. Master vehicle lockpicking mechanics used throughout the server. Free trainer with authentic timing and difficulty.",
  keywords: ["lockpick minigame", "NoPixel lockpick", "GTA RP lockpick", "vehicle lockpick practice", "NoPixel 4.0 lockpick", "lockpicking trainer"],
  openGraph: {
    title: "Lockpick Practice - NoPixel 4.0",
    description: "Practice the Lockpick minigame from NoPixel 4.0. Master vehicle lockpicking mechanics.",
    url: "https://nphacks.net/puzzles/lockpick",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/lockpick",
  },
};

export default function Page() {
  return (
    <PuzzlePageWrapper
      title="Lockpick Minigame"
      gameName="Lockpick"
      description="The Lockpick minigame is one of the most versatile hacks in NoPixel 4.0, used for everything from stealing vehicles to breaking into buildings. This timing-based puzzle features four rotating lock circles that you must align by stopping each ball at the correct position. The mechanic requires precise timing and steady hands - rush it and you'll fail, hesitate too long and time runs out. Master this fundamental skill to unlock countless opportunities in GTA RP."
      difficulty="Medium"
      avgTime="15-20 seconds"
      inGameUse="Vehicles"
      howToPlay={[
        "Each lock circle has a rotating ball that moves around the ring",
        "Wait for the ball to approach the highlighted target zone",
        "Press the action key at the exact moment the ball aligns with the marker",
        "Successfully align all four locks before the timer expires",
        "Mistiming a lock will reset that circle - you get limited attempts"
      ]}
      tips={[
        "Watch the ball's speed for one full rotation before attempting to stop it",
        "Focus on the approach angle rather than the exact position",
        "Practice the rhythm - each lock has a consistent timing pattern",
        "Stay relaxed and breathe - tension causes mistimed clicks",
        "Start with easier difficulties to learn the base mechanics"
      ]}
      guideUrl="/guides/lockpick"
    >
      <PuzzleBackButton />
      <Lockpick />
    </PuzzlePageWrapper>
  );
}
