import type { Metadata, Viewport } from "next";
import Laundromat from "@/app/puzzles/laundromat/Laundromat";
import PuzzleBackButton from "@/app/components/PuzzleBackButton";

//Force dynamic rendering for daily challenges
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Laundromat Hack Practice - NoPixel 4.0 Minigames",
  description: "Master the Laundromat safe hack from NoPixel 4.0 GTA RP. Practice the south-side Laundromat robbery minigame. Free training with authentic puzzle mechanics and leaderboards.",
  keywords: ["laundromat hack", "NoPixel laundromat", "GTA RP laundromat", "safe hack practice", "NoPixel 4.0 laundromat", "laundromat puzzle"],
  openGraph: {
    title: "Laundromat Hack Practice - NoPixel 4.0",
    description: "Master the Laundromat safe hack from NoPixel 4.0. Practice the robbery minigame for free.",
    url: "https://no-px.vercel.app/puzzles/laundromat",
  },
  alternates: {
    canonical: "https://no-px.vercel.app/puzzles/laundromat",
  },
};

export default function Page() {
    return (
        <>
            <PuzzleBackButton />
            <Laundromat />
        </>
    );
}
