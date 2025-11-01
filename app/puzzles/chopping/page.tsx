import type { Metadata, Viewport } from "next";
import Chopping from "@/app/puzzles/chopping/Chopping";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Chopping Practice - NoPixel 4.0 Minigames",
  description: "Practice the Chopping minigame from NoPixel 4.0 GTA RP. Master vehicle chopping mechanics with authentic patterns. Free trainer for improving your chopping timing and accuracy.",
  keywords: ["chopping minigame", "NoPixel chopping", "GTA RP chopping", "vehicle chopping practice", "NoPixel 4.0 chopping", "chopping trainer"],
  openGraph: {
    title: "Chopping Practice - NoPixel 4.0",
    description: "Practice the Chopping minigame from NoPixel 4.0. Master vehicle chopping mechanics.",
    url: "https://no-px.vercel.app/puzzles/chopping",
  },
  alternates: {
    canonical: "https://no-px.vercel.app/puzzles/chopping",
  },
};

export default function Page() {
    return <Chopping />;
}