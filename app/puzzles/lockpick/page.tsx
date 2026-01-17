import type { Metadata, Viewport } from "next";
import Lockpick from "@/app/puzzles/lockpick/Lockpick";
import PuzzleBackButton from "@/app/components/PuzzleBackButton";

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
  title: "Lockpick Practice - NoPixel 4.0 Minigames",
  description: "Practice the Lockpick minigame from NoPixel 4.0 GTA RP. Master vehicle lockpicking mechanics used throughout the server. Free trainer with authentic timing and difficulty.",
  keywords: ["lockpick minigame", "NoPixel lockpick", "GTA RP lockpick", "vehicle lockpick practice", "NoPixel 4.0 lockpick", "lockpicking trainer"],
  openGraph: {
    title: "Lockpick Practice - NoPixel 4.0",
    description: "Practice the Lockpick minigame from NoPixel 4.0. Master vehicle lockpicking mechanics.",
    url: "https://nphacks.net/puzzles/lockpick",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/lockpick",
  },
};

export default function Page() {
    return (
        <>
            <PuzzleBackButton />
            <Lockpick />
        </>
    );
}
