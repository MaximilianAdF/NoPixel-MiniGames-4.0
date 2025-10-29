import type { Metadata } from "next";
import Laundromat from "@/app/puzzles/laundromat/Laundromat";

export const metadata: Metadata = {
  title: "Laundromat Hack Practice - NoPixel 4.0 Minigames",
  description: "Master the Laundromat safe hack from NoPixel 4.0 GTA RP. Practice the south-side Laundromat robbery minigame. Free training with authentic puzzle mechanics and leaderboards.",
  keywords: ["laundromat hack", "NoPixel laundromat", "GTA RP laundromat", "safe hack practice", "NoPixel 4.0 laundromat", "laundromat puzzle"],
  openGraph: {
    title: "Laundromat Hack Practice - NoPixel 4.0",
    description: "Master the Laundromat safe hack from NoPixel 4.0. Practice the robbery minigame for free.",
    url: "https://nopixel-minigames.vercel.app/puzzles/laundromat",
  },
  alternates: {
    canonical: "https://nopixel-minigames.vercel.app/puzzles/laundromat",
  },
};

export default function Page() {
    return <Laundromat />;
}
