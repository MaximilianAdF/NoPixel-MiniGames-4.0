import type { Metadata, Viewport } from "next";
import Laundromat from "@/app/puzzles/laundromat/Laundromat";
import PuzzleBackButton from "@/app/components/PuzzleBackButton";
import PuzzlePageWrapper from "@/app/puzzles/PuzzlePageWrapper";

//Force dynamic rendering for daily challenges
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Laundromat Hack Practice - NoPixel 4.0 Minigames",
  description: "Master the Laundromat safe hack from NoPixel 4.0 GTA RP. Practice the south-side Laundromat robbery minigame. Free training with authentic puzzle mechanics and leaderboards.",
  keywords: ["laundromat hack", "NoPixel laundromat", "GTA RP laundromat", "safe hack practice", "NoPixel 4.0 laundromat", "laundromat puzzle"],
  openGraph: {
    title: "Laundromat Hack Practice - NoPixel 4.0",
    description: "Master the Laundromat safe hack from NoPixel 4.0. Practice the robbery minigame for free.",
    url: "https://nphacks.net/puzzles/laundromat",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/laundromat",
  },
};

export default function Page() {
  return (
    <PuzzlePageWrapper
      title="Laundromat Safe Hack"
      gameName="Laundromat"
      description="The Laundromat hack is an advanced version of the lockpick mechanic, used to crack the safe in the south-side Laundromat during robberies. This minigame features five rotating lock circles instead of four, with a significantly shorter time limit. The increased difficulty and tighter timing make it one of the more challenging heists for new players. Master this hack to successfully rob the Laundromat and earn your criminal reputation."
      difficulty="Hard"
      avgTime="8-10 seconds"
      inGameUse="Laundromat Safe"
      howToPlay={[
        "Five lock circles will appear, each with a rotating ball",
        "Watch each ball's rotation speed - they may vary",
        "Stop each ball at the highlighted target position",
        "Complete all five locks before the 10-second timer expires",
        "Mistiming resets that lock - you have limited margin for error"
      ]}
      tips={[
        "The fifth lock adds significant pressure - practice the 4-lock version first",
        "Develop a consistent rhythm for each lock circle",
        "Don't rush the first locks - save time buffer for the harder ones",
        "Focus on smooth, deliberate timing rather than speed",
        "Practice until the timing becomes muscle memory"
      ]}
      guideUrl="/guides/laundromat"
    >
      <PuzzleBackButton />
      <Laundromat />
    </PuzzlePageWrapper>
  );
}
