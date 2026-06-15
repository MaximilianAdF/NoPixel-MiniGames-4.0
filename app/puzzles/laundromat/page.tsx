import type { Metadata, Viewport } from "next";
import Laundromat from "@/app/puzzles/laundromat/Laundromat";
import PuzzleBackButton from "@/app/components/PuzzleBackButton";
import PuzzlePageWrapper from "@/app/puzzles/PuzzlePageWrapper";
import JsonLd from "@/app/components/JsonLd";
import { breadcrumbList } from "@/lib/structuredData";
import PuzzleInfo from "@/app/puzzles/PuzzleInfo";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: { absolute: "Laundromat Minigame – NoPixel 4.0 & FiveM Practice" },
  description: "Practice the NoPixel 4.0 & FiveM laundromat safe minigame free in your browser — crack the rotating locks against a tight timer. No download required.",
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
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Laundromat Minigame", path: "/puzzles/laundromat" },
        ])}
      />
      <PuzzlePageWrapper>
        <PuzzleBackButton />
        <Laundromat />
      </PuzzlePageWrapper>
      <PuzzleInfo game="laundromat" />
    </>
  );
}
