import type { Metadata, Viewport } from "next";
import Thermite from "@/app/puzzles/thermite/Thermite";
import GameInstructions from "@/app/components/GameInstructions";
import ThermiteInstructions from "./instructions";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Thermite Hack Practice - NoPixel 4.0 Minigames",
  description: "Master the Thermite hack from NoPixel 4.0 GTA RP. Practice the laser disable minigame used in Maze Bank heists. Free training tool with authentic mechanics and leaderboards.",
  keywords: ["thermite hack", "NoPixel thermite", "maze bank hack", "GTA RP thermite", "thermite practice", "NoPixel 4.0 thermite", "laser disable minigame"],
  openGraph: {
    title: "Thermite Hack Practice - NoPixel 4.0",
    description: "Master the Thermite hack from NoPixel 4.0. Practice the Maze Bank laser disable minigame for free.",
    url: "https://no-px.vercel.app/puzzles/thermite",
  },
  alternates: {
    canonical: "https://no-px.vercel.app/puzzles/thermite",
  },
};

export default function Page() {
  return (
    <>
      <Thermite />
      <GameInstructions gameId="thermite" title="How to Play Thermite">
        <ThermiteInstructions />
      </GameInstructions>
    </>
  );
}
