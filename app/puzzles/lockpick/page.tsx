import type { Metadata } from "next";
import Lockpick from "@/app/puzzles/lockpick/Lockpick";

export const metadata: Metadata = {
  title: "Lockpick - NP MiniGames 4.0",
};

export default function Page() {
    return <Lockpick />;
}
