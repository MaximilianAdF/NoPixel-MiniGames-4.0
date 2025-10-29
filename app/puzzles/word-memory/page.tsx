import type { Metadata } from "next";
import WordMemory from "@/app/puzzles/word-memory/WordMemory";

export const metadata: Metadata = {
  title: "Word Memory Practice - NoPixel 4.0 Minigames",
  description: "Master the Word Memory hack from NoPixel 4.0 GTA RP. Practice the Maze Bank heist memory minigame. Free training tool with authentic word patterns and difficulty levels.",
  keywords: ["word memory", "NoPixel word memory", "maze bank word memory", "GTA RP memory game", "NoPixel 4.0 word memory", "memory hack practice"],
  openGraph: {
    title: "Word Memory Practice - NoPixel 4.0",
    description: "Master the Word Memory hack from NoPixel 4.0. Practice the Maze Bank memory minigame.",
    url: "https://nopixel-minigames.vercel.app/puzzles/word-memory",
  },
  alternates: {
    canonical: "https://nopixel-minigames.vercel.app/puzzles/word-memory",
  },
};

export default function Page() {
    return <WordMemory />;
}
