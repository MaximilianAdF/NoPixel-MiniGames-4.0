import type { Metadata, Viewport } from "next";
import Lockpick from "@/app/puzzles/lockpick/Lockpick";
import GameInstructions from "@/app/components/GameInstructions";
import LockpickInstructions from "./instructions";

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
    url: "https://no-px.vercel.app/puzzles/lockpick",
  },
  alternates: {
    canonical: "https://no-px.vercel.app/puzzles/lockpick",
  },
};

export default function Page() {
    return (
        <>
            <Lockpick />
            <GameInstructions gameId="lockpick" title="How to Play Lockpick">
                <LockpickInstructions />
            </GameInstructions>
        </>
    );
}
