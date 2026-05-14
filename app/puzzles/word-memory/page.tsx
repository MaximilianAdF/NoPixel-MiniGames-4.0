import type { Metadata, Viewport } from "next";
import WordMemory from "@/app/puzzles/word-memory/WordMemory";
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
  title: "Word Memory Minigame",
  description: "Practice the Word Memory minigame from NoPixel 4.0 GTA RP. Recall which words you've already seen as the sequence grows. Free browser trainer, no download required.",
  keywords: ["word memory", "NoPixel word memory", "maze bank word memory", "GTA RP memory game", "NoPixel 4.0 word memory", "memory hack practice"],
  openGraph: {
    title: "Word Memory Minigame - NoPixel 4.0 Practice",
    description: "Practice the Word Memory minigame from NoPixel 4.0 GTA RP. Recall which words you've already seen as the sequence grows. Free browser trainer, no download required.",
    url: "https://nphacks.net/puzzles/word-memory",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/word-memory",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Word Memory Minigame", path: "/puzzles/word-memory" },
        ])}
      />
      <PuzzlePageWrapper>
        <PuzzleBackButton />
        <WordMemory />
      </PuzzlePageWrapper>
    </>
  );
}
