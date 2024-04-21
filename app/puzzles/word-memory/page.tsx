import type { Metadata } from "next";
import WordMemory from "@/app/puzzles/word-memory/WordMemory";

export const metadata: Metadata = {
  title: "Word Memory - NP MiniGames 4.0",
};

export default function Page() {
    return <WordMemory />;
}
