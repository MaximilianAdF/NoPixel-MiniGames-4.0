import type { Metadata, Viewport } from "next";
import Chopping from "@/app/puzzles/chopping/Chopping";
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
  title: { absolute: "Chopping Minigame – NoPixel 4.0 & FiveM Practice" },
  description: "Practice the NoPixel 4.0 & FiveM chopping minigame free in your browser — type the on-screen letter sequence quickly and accurately. No download required.",
  keywords: ["chopping minigame", "NoPixel chopping", "GTA RP chopping", "vehicle chopping practice", "NoPixel 4.0 chopping", "chopping trainer"],
  openGraph: {
    title: "Chopping Minigame - NoPixel 4.0 Practice",
    description: "Practice the Chopping minigame from NoPixel 4.0 GTA RP. Type the on-screen letter sequence quickly and accurately. Free browser trainer, no download required.",
    url: "https://nphacks.net/puzzles/chopping",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/chopping",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Chopping Minigame", path: "/puzzles/chopping" },
        ])}
      />
      <PuzzlePageWrapper>
        <PuzzleBackButton />
        <Chopping />
      </PuzzlePageWrapper>
      <PuzzleInfo game="chopping" />
    </>
  );
}