import type { Metadata } from "next";
import WordMemory from "@/app/puzzles/word-memory/WordMemory";

export const metadata: Metadata = {
  title: "Word Memory",
};

export default function Page() {
    return <WordMemory />;
}
