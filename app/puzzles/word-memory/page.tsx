import type { Metadata, Viewport } from "next";
import WordMemory from "@/app/puzzles/word-memory/WordMemory";
import PuzzleBackButton from "@/app/components/PuzzleBackButton";
import PuzzlePageWrapper from "@/app/puzzles/PuzzlePageWrapper";

// Force dynamic rendering for daily challenges
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Word Memory Practice - NoPixel 4.0 Minigames",
  description: "Master the Word Memory hack from NoPixel 4.0 GTA RP. Practice the Maze Bank heist memory minigame. Free training tool with authentic word patterns and difficulty levels.",
  keywords: ["word memory", "NoPixel word memory", "maze bank word memory", "GTA RP memory game", "NoPixel 4.0 word memory", "memory hack practice"],
  openGraph: {
    title: "Word Memory Practice - NoPixel 4.0",
    description: "Master the Word Memory hack from NoPixel 4.0. Practice the Maze Bank memory minigame.",
    url: "https://nphacks.net/puzzles/word-memory",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/word-memory",
  },
};

export default function Page() {
  return (
    <PuzzlePageWrapper
      title="Word Memory Hack"
      gameName="Word Memory"
      description="Word Memory is a cognitive challenge used during Maze Bank heists in NoPixel 4.0. This minigame tests your ability to quickly memorize and recall a sequence of words. You'll be shown a series of words one at a time, then must identify which words you've seen before as they appear mixed with new ones. The challenge increases as more words are added and the pace quickens. Sharp memory and quick decision-making are essential for success."
      difficulty="Medium"
      avgTime="45-60 seconds"
      inGameUse="Maze Bank"
      howToPlay={[
        "Words will flash on screen one at a time - memorize each one",
        "After the memorization phase, words will appear again mixed with new ones",
        "Click 'SEEN' if you recognize the word from before",
        "Click 'NEW' if the word wasn't shown in the memorization phase",
        "Reach the required score before making too many mistakes"
      ]}
      tips={[
        "Create mental associations or stories with the words you see",
        "Focus on unusual or distinctive words - they're easier to remember",
        "Don't second-guess yourself - trust your first instinct",
        "Stay calm and maintain a steady rhythm when answering",
        "Practice improves your working memory capacity over time"
      ]}
      guideUrl="/guides/word-memory"
    >
      <PuzzleBackButton />
      <WordMemory />
    </PuzzlePageWrapper>
  );
}
