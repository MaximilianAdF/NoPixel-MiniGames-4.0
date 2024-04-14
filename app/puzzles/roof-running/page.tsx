import type { Metadata } from "next";
import RoofRunning from "@/app/puzzles/roof-running/RoofRunning";

export const metadata: Metadata = {
  title: "Roof Running - NP MiniGames 4.0",
};

export default function Page() {
    return <RoofRunning />;
}
