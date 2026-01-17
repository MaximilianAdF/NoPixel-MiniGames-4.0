import type { Metadata, Viewport } from "next";
import Pincracker from "@/app/puzzles/pincracker/Pincracker";
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
  title: "PinCracker Practice - NoPixel 4.0 Minigames",
  description: "Master the PinCracker hack from NoPixel 4.0 GTA RP. Practice the Maze Bank security minigame with authentic mechanics. Free trainer for perfecting your pin cracking skills.",
  keywords: ["pin cracker", "NoPixel pin cracker", "maze bank pin cracker", "GTA RP pin hack", "NoPixel 4.0 pin cracker", "security hack practice"],
  openGraph: {
    title: "PinCracker Practice - NoPixel 4.0",
    description: "Master the PinCracker hack from NoPixel 4.0. Practice the Maze Bank security minigame.",
    url: "https://nphacks.net/puzzles/pincracker",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/pincracker",
  },
};

export default function Page() {
  return (
    <PuzzlePageWrapper
      title="PinCracker Hack"
      gameName="PinCracker"
      description="PinCracker is a logic-based deduction puzzle used to bypass security systems during Maze Bank heists in NoPixel 4.0. Similar to the classic Mastermind game, you must guess a numeric PIN code using feedback from previous attempts. Each guess reveals how many digits are correct and in the right position versus correct but misplaced. Use logical deduction to crack the code before running out of attempts. This hack rewards methodical thinking over raw speed."
      difficulty="Hard"
      avgTime="30-60 seconds"
      inGameUse="Maze Bank"
      howToPlay={[
        "Enter a 4-digit PIN guess using the number pad",
        "Green indicators show digits that are correct AND in the right position",
        "Yellow indicators show digits that exist but are in the wrong position",
        "Use the feedback to narrow down the correct combination",
        "Crack the code within the limited number of attempts"
      ]}
      tips={[
        "Start with digits that cover a wide range (e.g., 1234, then 5678)",
        "Track which digits have been confirmed or eliminated",
        "Pay close attention to position feedback - it's crucial",
        "Use process of elimination systematically",
        "Practice logical deduction puzzles to improve your skills"
      ]}
      guideUrl="/guides/pincracker"
    >
      <PuzzleBackButton />
      <Pincracker />
    </PuzzlePageWrapper>
  );
}