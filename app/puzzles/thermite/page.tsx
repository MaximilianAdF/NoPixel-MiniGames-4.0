import type { Metadata, Viewport } from "next";
import Thermite from "@/app/puzzles/thermite/Thermite";
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
  title: { absolute: "Thermite Minigame – NoPixel 4.0 & FiveM Hack Practice" },
  description: "Practice the NoPixel 4.0 & FiveM thermite hack free in your browser — clear the 6×6 chain-reaction grid, keeping the chain alive until you hit the target score. No download required.",
  keywords: ["thermite hack", "NoPixel thermite", "maze bank hack", "GTA RP thermite", "thermite practice", "NoPixel 4.0 thermite", "laser disable minigame", "how to do thermite", "thermite tutorial"],
  openGraph: {
    title: "Thermite Minigame - NoPixel 4.0 Practice",
    description: "Practice the Thermite minigame from NoPixel 4.0 GTA RP. Clear the 6×6 chain-reaction grid, keeping the chain alive until you hit the target score. Free browser trainer, no download required.",
    url: "https://nphacks.net/puzzles/thermite",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/thermite",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Thermite Minigame", path: "/puzzles/thermite" },
        ])}
      />
      <PuzzlePageWrapper>
        <PuzzleBackButton />
        <Thermite />
      </PuzzlePageWrapper>
      <PuzzleInfo game="thermite" />
    </>
  );
}
