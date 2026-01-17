import type { Metadata, Viewport } from "next";
import RoofRunning from "@/app/puzzles/roof-running/RoofRunning";
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
  title: "🏃 Roof Running Trainer - Perfect Your NoPixel 4.0 Timing (FREE)",
  description: "💨 Nail every AC-Unit jump! Practice NoPixel Roof Running with authentic mechanics. Used by pro criminals for house robberies. Global leaderboards • Expert guides • Mobile-friendly. Train your timing now!",
  keywords: ["roof running", "NoPixel roof running", "GTA RP roof running", "AC unit hack", "NoPixel 4.0 roof running", "parkour minigame", "house robbery", "roof running timing"],
  openGraph: {
    title: "🏃 Master NoPixel Roof Running - FREE Parkour Trainer",
    description: "💨 Nail every AC-Unit jump! Practice authentic NoPixel mechanics. Join criminals perfecting their house robbery timing.",
    url: "https://nphacks.net/puzzles/roof-running",
  },
  alternates: {
    canonical: "https://nphacks.net/puzzles/roof-running",
  },
};

export default function Page() {
    return (
        <>
            <PuzzleBackButton />
            <RoofRunning />
        </>
    );
}
