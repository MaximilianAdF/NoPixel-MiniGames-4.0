import type { Metadata, Viewport } from "next";
import Pincracker from "@/app/puzzles/pincracker/Pincracker";
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
  title: { absolute: "PinCracker Minigame – NoPixel 4.0 & FiveM Practice" },
  description: "Practice the NoPixel 4.0 & FiveM PinCracker minigame free in your browser — deduce the PIN from colour feedback, Mastermind-style. No download required.",
  keywords: ["pin cracker", "NoPixel pin cracker", "maze bank pin cracker", "GTA RP pin hack", "NoPixel 4.0 pin cracker", "security hack practice"],
  openGraph: {
    title: "PinCracker Minigame - NoPixel 4.0 Practice",
    description: "Practice the PinCracker minigame from NoPixel 4.0 GTA RP. Deduce the PIN from colour feedback, Mastermind-style. Free browser trainer, no download required.",
    url: "https://nphacks.net/puzzles/pincracker",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/pincracker",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "PinCracker Minigame", path: "/puzzles/pincracker" },
        ])}
      />
      <PuzzlePageWrapper>
        <PuzzleBackButton />
        <Pincracker />
      </PuzzlePageWrapper>
      <PuzzleInfo game="pincracker" />
    </>
  );
}