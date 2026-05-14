import type { Metadata, Viewport } from "next";
import RoofRunning from "@/app/puzzles/roof-running/RoofRunning";
import PuzzleBackButton from "@/app/components/PuzzleBackButton";
import PuzzlePageWrapper from "@/app/puzzles/PuzzlePageWrapper";
import JsonLd from "@/app/components/JsonLd";
import { breadcrumbList } from "@/lib/structuredData";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Roof Running Minigame",
  description: "Practice the Roof Running minigame from NoPixel 4.0 GTA RP. Clear the board by removing groups of matching coloured blocks. Free browser trainer, no download required.",
  keywords: ["roof running", "NoPixel roof running", "GTA RP roof running", "AC unit hack", "NoPixel 4.0 roof running", "parkour minigame", "house robbery", "roof running timing"],
  openGraph: {
    title: "Roof Running Minigame - NoPixel 4.0 Practice",
    description: "Practice the Roof Running minigame from NoPixel 4.0 GTA RP. Clear the board by removing groups of matching coloured blocks. Free browser trainer, no download required.",
    url: "https://nphacks.net/puzzles/roof-running",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/roof-running",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Roof Running Minigame", path: "/puzzles/roof-running" },
        ])}
      />
      <PuzzlePageWrapper>
        <PuzzleBackButton />
        <RoofRunning />
      </PuzzlePageWrapper>
    </>
  );
}
