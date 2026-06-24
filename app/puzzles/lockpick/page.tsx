import type { Metadata, Viewport } from "next";
import Lockpick from "@/app/puzzles/lockpick/Lockpick";
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
  title: { absolute: "Lockpick Minigame Trainer – NoPixel 4.0 & FiveM Practice" },
  description: "Practice the NoPixel 4.0 & FiveM lockpick minigame free in your browser — stop each rotating lock at its target marker before the timer ends. No download required.",
  keywords: ["lockpick minigame", "NoPixel lockpick", "GTA RP lockpick", "vehicle lockpick practice", "NoPixel 4.0 lockpick", "lockpicking trainer"],
  openGraph: {
    title: "Lockpick Minigame - NoPixel 4.0 Practice",
    description: "Practice the Lockpick minigame from NoPixel 4.0 GTA RP. Stop each rotating lock at its target marker before the timer ends. Free browser trainer, no download required.",
    url: "https://nphacks.net/puzzles/lockpick",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/lockpick",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Lockpick Minigame", path: "/puzzles/lockpick" },
        ])}
      />
      <PuzzlePageWrapper>
        <PuzzleBackButton />
        <Lockpick />
      </PuzzlePageWrapper>
      <PuzzleInfo game="lockpick" />
    </>
  );
}
