import type { Metadata, Viewport } from "next";
import RepairKit from "./RepairKit";
import GameInstructions from "@/app/components/GameInstructions";
import RepairKitInstructions from "./instructions";
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
  title: "RepairKit Practice - NoPixel 4.0 Minigames",
  description: "Practice the RepairKit minigame from NoPixel 4.0 GTA RP. Master vehicle repair mechanics with authentic timing and patterns. Free trainer for perfecting your repair skills.",
  keywords: ["repair kit", "NoPixel repair kit", "GTA RP repair", "vehicle repair minigame", "NoPixel 4.0 repair kit", "repair practice"],
  openGraph: {
    title: "RepairKit Practice - NoPixel 4.0",
    description: "Practice the RepairKit minigame from NoPixel 4.0. Master vehicle repair mechanics.",
    url: "https://no-px.vercel.app/puzzles/repair-kit",
  },
  alternates: {
    canonical: "https://no-px.vercel.app/puzzles/repair-kit",
  },
};

export default function Page() {
    return (
        <>
            <PuzzleBackButton />
            <RepairKit/>
            <GameInstructions gameId="repair-kit" title="How to Play Repair Kit">
                <RepairKitInstructions />
            </GameInstructions>
        </>
    );
}
