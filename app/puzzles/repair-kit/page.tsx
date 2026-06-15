import type { Metadata, Viewport } from "next";
import RepairKit from "./RepairKit";
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
  title: { absolute: "Repair Kit Minigame – NoPixel 4.0 & FiveM Practice" },
  description: "Practice the NoPixel 4.0 & FiveM repair kit minigame free in your browser — stop the moving indicator inside the target zone. No download required.",
  keywords: ["repair kit", "NoPixel repair kit", "GTA RP repair", "vehicle repair minigame", "NoPixel 4.0 repair kit", "repair practice"],
  openGraph: {
    title: "Repair Kit Minigame - NoPixel 4.0 Practice",
    description: "Practice the Repair Kit minigame from NoPixel 4.0 GTA RP. Stop the moving indicator inside the target zone. Free browser trainer, no download required.",
    url: "https://nphacks.net/puzzles/repair-kit",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/repair-kit",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Repair Kit Minigame", path: "/puzzles/repair-kit" },
        ])}
      />
      <PuzzlePageWrapper>
        <PuzzleBackButton />
        <RepairKit />
      </PuzzlePageWrapper>
      <PuzzleInfo game="repair-kit" />
    </>
  );
}
