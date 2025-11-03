import type { Metadata, Viewport } from "next";
import RoofRunning from "@/app/puzzles/roof-running/RoofRunning";
import GameInstructions from "@/app/components/GameInstructions";
import RoofRunningInstructions from "./instructions";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Roof Running Practice - NoPixel 4.0 Minigames",
  description: "Practice the Roof Running minigame from NoPixel 4.0 GTA RP. Master the AC-Unit robbery challenge with authentic mechanics. Free trainer with timing practice and leaderboards.",
  keywords: ["roof running", "NoPixel roof running", "GTA RP roof running", "AC unit hack", "NoPixel 4.0 roof running", "parkour minigame"],
  openGraph: {
    title: "Roof Running Practice - NoPixel 4.0",
    description: "Practice the Roof Running minigame from NoPixel 4.0. Master the AC-Unit robbery challenge.",
    url: "https://no-px.vercel.app/puzzles/roof-running",
  },
  alternates: {
    canonical: "https://no-px.vercel.app/puzzles/roof-running",
  },
};

export default function Page() {
    return (
        <>
            <RoofRunning />
            <GameInstructions gameId="roof-running" title="How to Play Roof Running">
                <RoofRunningInstructions />
            </GameInstructions>
        </>
    );
}
