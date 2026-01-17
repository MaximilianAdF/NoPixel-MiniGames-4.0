import type { Metadata, Viewport } from "next";
import RepairKit from "./RepairKit";
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
  title: "RepairKit Practice - NoPixel 4.0 Minigames",
  description: "Practice the RepairKit minigame from NoPixel 4.0 GTA RP. Master vehicle repair mechanics with authentic timing and patterns. Free trainer for perfecting your repair skills.",
  keywords: ["repair kit", "NoPixel repair kit", "GTA RP repair", "vehicle repair minigame", "NoPixel 4.0 repair kit", "repair practice"],
  openGraph: {
    title: "RepairKit Practice - NoPixel 4.0",
    description: "Practice the RepairKit minigame from NoPixel 4.0. Master vehicle repair mechanics.",
    url: "https://nphacks.net/puzzles/repair-kit",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/repair-kit",
  },
};

export default function Page() {
  return (
    <PuzzlePageWrapper
      title="RepairKit Minigame"
      gameName="RepairKit"
      description="The RepairKit minigame is used to repair damaged vehicles in NoPixel 4.0. This timing-based puzzle requires you to stop a moving indicator within a target zone as it sweeps across a bar. While simpler than other hacks, consistency is key - you'll need to complete multiple successful stops to fully repair a vehicle. Master this essential mechanic to keep your getaway cars in working condition and avoid being stranded after a chase."
      difficulty="Easy"
      avgTime="5-10 seconds"
      inGameUse="Vehicle Repair"
      howToPlay={[
        "Watch the indicator as it moves across the repair bar",
        "Press the action key when the indicator enters the green target zone",
        "Successful stops repair a portion of the vehicle's health",
        "Complete multiple rounds to fully repair the vehicle",
        "Missing the zone wastes repair kit durability"
      ]}
      tips={[
        "The timing is forgiving - don't overthink it",
        "Watch for one full sweep to gauge the speed before acting",
        "Aim for the center of the target zone for maximum margin",
        "Stay relaxed - this is the easiest minigame to master",
        "Practice to build consistency for when you need quick repairs"
      ]}
      guideUrl="/guides/repair-kit"
    >
      <PuzzleBackButton />
      <RepairKit />
    </PuzzlePageWrapper>
  );
}
