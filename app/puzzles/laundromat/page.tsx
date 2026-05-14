import type { Metadata, Viewport } from "next";
import Laundromat from "@/app/puzzles/laundromat/Laundromat";
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
  title: "Laundromat Minigame",
  description: "Practice the Laundromat minigame from NoPixel 4.0 GTA RP. Crack all five rotating locks against a tight timer. Free browser trainer, no download required.",
  keywords: ["laundromat hack", "NoPixel laundromat", "GTA RP laundromat", "safe hack practice", "NoPixel 4.0 laundromat", "laundromat puzzle"],
  openGraph: {
    title: "Laundromat Minigame - NoPixel 4.0 Practice",
    description: "Practice the Laundromat minigame from NoPixel 4.0 GTA RP. Crack all five rotating locks against a tight timer. Free browser trainer, no download required.",
    url: "https://nphacks.net/puzzles/laundromat",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/laundromat",
  },
};

export default function Page() {
  return (
    <PuzzlePageWrapper>
      <PuzzleBackButton />
      <Laundromat />
    </PuzzlePageWrapper>
  );
}
