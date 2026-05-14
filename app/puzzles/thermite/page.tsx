import type { Metadata, Viewport } from "next";
import Thermite from "@/app/puzzles/thermite/Thermite";
import PuzzleBackButton from "@/app/components/PuzzleBackButton";
import PuzzlePageWrapper from "@/app/puzzles/PuzzlePageWrapper";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Thermite Minigame",
  description: "Practice the Thermite minigame from NoPixel 4.0 GTA RP. Memorize and recreate the highlighted tile pattern under a timer. Free browser trainer, no download required.",
  keywords: ["thermite hack", "NoPixel thermite", "maze bank hack", "GTA RP thermite", "thermite practice", "NoPixel 4.0 thermite", "laser disable minigame", "how to do thermite", "thermite tutorial"],
  openGraph: {
    title: "Thermite Minigame - NoPixel 4.0 Practice",
    description: "Practice the Thermite minigame from NoPixel 4.0 GTA RP. Memorize and recreate the highlighted tile pattern under a timer. Free browser trainer, no download required.",
    url: "https://nphacks.net/puzzles/thermite",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/thermite",
  },
};

export default function Page() {
  return (
    <PuzzlePageWrapper>
      <PuzzleBackButton />
      <Thermite />
    </PuzzlePageWrapper>
  );
}
