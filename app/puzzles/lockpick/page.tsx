import type { Metadata } from "next";
import Lockpick from "@/app/puzzles/lockpick/Lockpick";

export const metadata: Metadata = {
  title: "Lockpick Practice - NoPixel 4.0 Minigames",
  description: "Practice the Lockpick minigame from NoPixel 4.0 GTA RP. Master vehicle lockpicking mechanics used throughout the server. Free trainer with authentic timing and difficulty.",
  keywords: ["lockpick minigame", "NoPixel lockpick", "GTA RP lockpick", "vehicle lockpick practice", "NoPixel 4.0 lockpick", "lockpicking trainer"],
  openGraph: {
    title: "Lockpick Practice - NoPixel 4.0",
    description: "Practice the Lockpick minigame from NoPixel 4.0. Master vehicle lockpicking mechanics.",
    url: "https://nopixel-minigames.vercel.app/puzzles/lockpick",
  },
  alternates: {
    canonical: "https://nopixel-minigames.vercel.app/puzzles/lockpick",
  },
};

export default function Page() {
    return <Lockpick />;
}
